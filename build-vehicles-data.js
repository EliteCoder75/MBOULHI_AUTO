/**
 * Script pour générer data.js depuis les fichiers markdown du CMS
 * Exécuter avec: node build-vehicles-data.js
 */

const fs = require('fs');
const path = require('path');

const VEHICULES_DIR = path.join(__dirname, '_vehicules');
const OUTPUT_FILE = path.join(__dirname, 'js', 'data.js');

/**
 * Parse le front matter d'un fichier markdown
 */
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/;
    const match = content.match(frontMatterRegex);

    if (!match) return null;

    const frontMatter = match[1];
    const data = {};

    let currentKey = null;
    let currentList = [];
    let isInList = false;

    frontMatter.split('\n').forEach(line => {
        // Liste item (commence par "  - ")
        if (line.startsWith('  - ')) {
            if (isInList) {
                currentList.push(line.substring(4).trim());
            }
        }
        // Key: value
        else if (line.includes(':')) {
            // Sauvegarder la liste précédente si on en avait une
            if (isInList && currentKey) {
                data[currentKey] = currentList;
                currentList = [];
                isInList = false;
            }

            const colonIndex = line.indexOf(':');
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();

            currentKey = key;

            if (value === '') {
                // C'est probablement le début d'une liste
                isInList = true;
                currentList = [];
            } else {
                // Convertir les types
                if (!isNaN(value) && value !== '') {
                    data[key] = Number(value);
                } else if (value === 'true') {
                    data[key] = true;
                } else if (value === 'false') {
                    data[key] = false;
                } else {
                    data[key] = value;
                }
            }
        }
    });

    // Sauvegarder la dernière liste si on était dans une liste
    if (isInList && currentKey) {
        data[currentKey] = currentList;
    }

    return data;
}

/**
 * Lit tous les fichiers markdown et génère data.js
 */
function buildVehiclesData() {
    console.log('🚗 Génération du fichier data.js depuis les fichiers CMS...\n');

    // Lire tous les fichiers .md dans _vehicules
    const files = fs.readdirSync(VEHICULES_DIR)
        .filter(file => file.endsWith('.md'));

    console.log(`📂 ${files.length} fichiers markdown trouvés\n`);

    const vehicles = [];

    files.forEach(file => {
        const filePath = path.join(VEHICULES_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const data = parseFrontMatter(content);

        if (data) {
            // Normaliser les données pour correspondre au format attendu
            const vehicle = {
                id: data.id || 0,
                brand: (data.brand || '').toUpperCase(),
                model: data.model || '',
                year: data.year || new Date().getFullYear(),
                price: data.price || 0,
                mileage: data.mileage || 0,
                fuel: data.fuel || '',
                transmission: data.transmission || '',
                motor: data.motor || data.power || '',
                exterior_color: data.exterior_color || '',
                interior_color: data.interior_color || '',
                condition: data.condition || '',
                types: data.types || [],
                destination: data.destination || '',
                image: data.image || '',
                gallery: data.gallery || [],
                description: data.description || data.desc || '',
                features: data.features || []
            };

            vehicles.push(vehicle);
            console.log(`✅ ${vehicle.brand} ${vehicle.model} (ID: ${vehicle.id})`);
        } else {
            console.log(`❌ Erreur de parsing: ${file}`);
        }
    });

    // Trier par ID
    vehicles.sort((a, b) => a.id - b.id);

    // Générer le contenu du fichier
    const fileContent = `/**
 * MBOULHI AUTO - Données des véhicules
 * Généré automatiquement depuis les fichiers CMS
 * Dernière génération: ${new Date().toLocaleString('fr-FR')}
 *
 * SYSTÈME DE TAGS:
 * - "neuf" : Véhicule neuf 2025-2026 avec 0 km (tous carburants)
 * - "recent" : Véhicule de moins de 3 ans (2023-2025, km > 0, Essence/Électrique/Hybride uniquement)
 * - "occasion" : Véhicule d'occasion (kilométrage > 0, tous carburants)
 *
 * Une voiture peut avoir PLUSIEURS tags:
 * - Neuf : ["neuf"] uniquement (2025-2026, 0 km, tous carburants)
 * - Moins de 3 ans : ["recent", "occasion"] (2023-2025, km > 0, Essence/Électrique/Hybride UNIQUEMENT)
 * - Occasion : ["occasion"] uniquement (avant 2023 OU Diesel avec km > 0)
 *
 * ⚠️ RÈGLE IMPORTANTE: Les véhicules DIESEL avec kilométrage ne peuvent JAMAIS être "recent"
 */

const vehiclesData = ${JSON.stringify(vehicles, null, 4)};
`;

    // Écrire le fichier
    fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');

    console.log(`\n✨ Fichier généré avec succès: ${OUTPUT_FILE}`);
    console.log(`📊 Total: ${vehicles.length} véhicules\n`);
}

// Exécuter le script
try {
    buildVehiclesData();
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
