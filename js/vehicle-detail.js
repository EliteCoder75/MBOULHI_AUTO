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

    console.log('Loading vehicle detail for ID:', vehicleId);

    if (!vehicleId) {
        console.log('No vehicle ID found, redirecting...');
        window.location.href = '/vehicules-occasion.html';
        return;
    }

    try {
        // Get vehicle from localStorage
        const vehicleData = localStorage.getItem('currentVehicle');

        if (!vehicleData) {
            console.log('No vehicle data in localStorage, redirecting...');
            window.location.href = '/vehicules-occasion.html';
            return;
        }

        const vehicle = JSON.parse(vehicleData);

        console.log('Found vehicle:', vehicle);

        // Verify the ID matches
        if (vehicle.id != vehicleId) {
            console.log('Vehicle ID mismatch, redirecting...');
            window.location.href = '/vehicules-occasion.html';
            return;
        }

        // Display vehicle details
        displayVehicleDetail(vehicle);

        // Clear localStorage after loading
        localStorage.removeItem('currentVehicle');

    } catch (error) {
        console.error('Error loading vehicle:', error);
        alert('Erreur lors du chargement du véhicule. Redirection...');
        window.location.href = '/vehicules-occasion.html';
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

    // Note: Description text and features sections have been removed as per requirements
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
