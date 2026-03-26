"""
Convert jpg/jpeg/png images in images/ to WebP format,
update references in _vehicules/*.md, and delete the originals.
"""

import os
import re
import sys
from pathlib import Path
from PIL import Image

IMAGES_DIR = Path("images")
VEHICULES_DIR = Path("_vehicules")
CONVERT_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def convert_image(src: Path) -> Path | None:
    """Convert a single image to WebP. Returns the new path or None if skipped."""
    dest = src.with_suffix(".webp")

    # Already a webp file — skip
    if src.suffix.lower() == ".webp":
        return None

    # Destination already exists — skip conversion but still update refs
    if dest.exists():
        print(f"  [skip] {src.name} → already has {dest.name}")
        return dest

    try:
        with Image.open(src) as img:
            # Preserve transparency for PNG
            if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")
            img.save(dest, "WEBP", quality=82, method=6)
        print(f"  [ok]   {src.name} → {dest.name}")
        return dest
    except Exception as exc:
        print(f"  [err]  {src.name}: {exc}", file=sys.stderr)
        return None


def update_md_references(old_name: str, new_name: str) -> None:
    """Replace every occurrence of old_name with new_name in _vehicules/*.md files."""
    if not VEHICULES_DIR.exists():
        return
    for md_file in VEHICULES_DIR.glob("*.md"):
        text = md_file.read_text(encoding="utf-8")
        # Match the bare filename anywhere in the YAML front matter value
        pattern = re.escape(old_name)
        if re.search(pattern, text):
            updated = re.sub(pattern, new_name, text)
            md_file.write_text(updated, encoding="utf-8")
            print(f"  [ref]  updated {md_file.name}: {old_name} → {new_name}")


def main() -> None:
    if not IMAGES_DIR.exists():
        print("images/ folder not found — nothing to do.")
        return

    converted = 0
    skipped = 0

    for src in sorted(IMAGES_DIR.iterdir()):
        # Handle double-extension filenames like img.jpg.jpeg
        # Normalise: find the last recognised extension
        name_lower = src.name.lower()
        matched_ext = None
        for ext in CONVERT_EXTENSIONS:
            if name_lower.endswith(ext):
                matched_ext = ext
                break

        if matched_ext is None:
            continue

        dest = convert_image(src)

        if dest is None:
            skipped += 1
            continue

        # Update .md references before deleting the original
        update_md_references(src.name, dest.name)

        # Delete original only when conversion succeeded and dest exists
        if dest.exists() and dest != src:
            src.unlink()
            print(f"  [del]  {src.name}")

        converted += 1

    print(f"\nDone: {converted} converted, {skipped} skipped.")


if __name__ == "__main__":
    main()
