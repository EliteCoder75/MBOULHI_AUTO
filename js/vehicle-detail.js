/**
 * MBOULHI AUTO - Vehicle Detail Page Script
 * Displays detailed information about a specific vehicle
 */

document.addEventListener('DOMContentLoaded', function() {
    loadVehicleDetail();
});

async function loadVehicleDetail() {
    // Get vehicle ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');

    if (!vehicleId) {
        window.location.href = 'vehicules-occasion.html';
        return;
    }

    try {
        // Load vehicle data
        const vehicles = await fetch('_vehicules/')
            .then(res => res.text())
            .then(html => {
                // Parse directory listing or use existing data
                return getAllVehicles();
            });

        const vehicle = vehicles.find(v => v.id == vehicleId);

        if (!vehicle) {
            window.location.href = 'vehicules-occasion.html';
            return;
        }

        // Display vehicle details
        displayVehicleDetail(vehicle);

    } catch (error) {
        console.error('Error loading vehicle:', error);
        window.location.href = 'vehicules-occasion.html';
    }
}

async function getAllVehicles() {
    // Try to get vehicles from sessionStorage first
    if (sessionStorage.getItem('vehicles')) {
        return JSON.parse(sessionStorage.getItem('vehicles'));
    }

    // Otherwise load all vehicle files
    const vehicles = [];

    try {
        const response = await fetch('_vehicules/');
        const text = await response.text();

        // Parse the directory listing
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a');

        for (const link of links) {
            const href = link.getAttribute('href');
            if (href && href.endsWith('.md')) {
                try {
                    const vehicleData = await fetch(`_vehicules/${href}`).then(r => r.text());
                    const vehicle = parseVehicleMarkdown(vehicleData);
                    if (vehicle) {
                        vehicles.push(vehicle);
                    }
                } catch (e) {
                    console.error('Error loading vehicle file:', e);
                }
            }
        }

        // Cache in sessionStorage
        sessionStorage.setItem('vehicles', JSON.stringify(vehicles));
        return vehicles;

    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return [];
    }
}

function parseVehicleMarkdown(content) {
    try {
        const lines = content.split('\n');
        let inFrontMatter = false;
        let frontMatter = '';

        for (const line of lines) {
            if (line.trim() === '---') {
                if (!inFrontMatter) {
                    inFrontMatter = true;
                } else {
                    break;
                }
            } else if (inFrontMatter) {
                frontMatter += line + '\n';
            }
        }

        // Parse YAML-like front matter
        const vehicle = {};
        const fmLines = frontMatter.split('\n');

        for (const line of fmLines) {
            if (line.includes(':')) {
                const [key, ...valueParts] = line.split(':');
                const value = valueParts.join(':').trim();

                // Remove quotes if present
                const cleanValue = value.replace(/^["']|["']$/g, '');

                // Handle arrays
                if (line.trim().startsWith('- ')) {
                    // This is an array item, we'll handle it differently
                    continue;
                } else if (cleanValue.startsWith('[')) {
                    // JSON array
                    try {
                        vehicle[key.trim()] = JSON.parse(cleanValue);
                    } catch (e) {
                        vehicle[key.trim()] = cleanValue;
                    }
                } else {
                    vehicle[key.trim()] = cleanValue;
                }
            }
        }

        return vehicle;

    } catch (error) {
        console.error('Error parsing vehicle markdown:', error);
        return null;
    }
}

function displayVehicleDetail(vehicle) {
    // Set page title
    const title = `${vehicle.brand} ${vehicle.model}`;
    document.getElementById('pageTitle').textContent = `${title} - MBOULHI AUTO`;
    document.title = `${title} - MBOULHI AUTO`;

    // Set breadcrumb
    document.getElementById('breadcrumbTitle').textContent = title;

    const typeLink = document.getElementById('breadcrumbType');
    if (vehicle.types && vehicle.types.includes('neuf')) {
        typeLink.textContent = 'Véhicules Neufs';
        typeLink.href = 'vehicules-neufs.html';
    } else {
        typeLink.textContent = 'Véhicules d\'Occasion';
        typeLink.href = 'vehicules-occasion.html';
    }

    // Set main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = vehicle.image;
    mainImage.alt = title;

    // Set gallery
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    thumbnailGallery.innerHTML = '';

    // Add main image as first thumbnail
    addThumbnail(vehicle.image, 0, true);

    // Add gallery images if available
    if (vehicle.gallery && Array.isArray(vehicle.gallery)) {
        vehicle.gallery.forEach((img, index) => {
            addThumbnail(img.image || img, index + 1, false);
        });
    }

    // Set vehicle info
    document.getElementById('vehicleTitle').textContent = title.toUpperCase();
    document.getElementById('vehicleSubtitle').textContent =
        `${vehicle.year} • ${vehicle.brand.toUpperCase()} • ${vehicle.model.toUpperCase()}`;
    document.getElementById('vehiclePrice').textContent = `€${Number(vehicle.price).toLocaleString('fr-FR')}.00`;

    // Set description fields
    document.getElementById('descYear').textContent = vehicle.year || '-';
    document.getElementById('descBrand').textContent = vehicle.brand || '-';
    document.getElementById('descModel').textContent = vehicle.model || '-';
    document.getElementById('descCondition').textContent = vehicle.condition || '-';
    document.getElementById('descMileage').textContent =
        vehicle.mileage ? `${Number(vehicle.mileage).toLocaleString('fr-FR')} km` : '-';
    document.getElementById('descTransmission').textContent = vehicle.transmission || '-';
    document.getElementById('descMotor').textContent = vehicle.motor || '-';
    document.getElementById('descFuel').textContent = vehicle.fuel || '-';
    document.getElementById('descExteriorColor').textContent = vehicle.exterior_color || '-';
    document.getElementById('descInteriorColor').textContent = vehicle.interior_color || '-';

    // Set description text
    const descText = document.getElementById('vehicleDescText');
    if (vehicle.desc || vehicle.description) {
        descText.textContent = vehicle.desc || vehicle.description;
        descText.style.display = 'block';
    } else {
        descText.style.display = 'none';
    }

    // Set features
    const featuresContainer = document.getElementById('vehicleFeatures');
    if (vehicle.features && vehicle.features.length > 0) {
        featuresContainer.innerHTML = '<h3>Caractéristiques</h3><ul></ul>';
        const featuresList = featuresContainer.querySelector('ul');

        vehicle.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature.feature || feature;
            featuresList.appendChild(li);
        });
    } else {
        featuresContainer.style.display = 'none';
    }
}

function addThumbnail(imageSrc, index, isActive) {
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    const thumbnail = document.createElement('div');
    thumbnail.className = `thumbnail ${isActive ? 'active' : ''}`;
    thumbnail.innerHTML = `<img src="${imageSrc}" alt="Image ${index + 1}">`;

    thumbnail.addEventListener('click', function() {
        // Update main image
        document.getElementById('mainImage').src = imageSrc;

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    });

    thumbnailGallery.appendChild(thumbnail);
}
