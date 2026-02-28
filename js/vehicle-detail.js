/**
 * MBOULHI AUTO - Vehicle Detail Page Script
 * Displays detailed information about a specific vehicle
 */

document.addEventListener('DOMContentLoaded', function() {
    loadVehicleDetail();
    initContactModal();
});

// ===== CONTACT MODAL =====
function initContactModal() {
    const contactBtn = document.querySelector('.btn-contact-info');
    const modal = document.getElementById('contactModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const emailOptionBtn = document.getElementById('emailOptionBtn');
    const backToOptions = document.getElementById('backToOptions');
    const contactOptions = document.querySelector('.contact-options');
    const emailFormContainer = document.getElementById('emailFormContainer');
    const contactForm = document.getElementById('contactForm');

    // Open modal
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Reset to options view
            showOptions();
        });
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Show email form
    if (emailOptionBtn) {
        emailOptionBtn.addEventListener('click', function() {
            contactOptions.classList.add('hidden');
            emailFormContainer.classList.add('active');
            // Pre-fill vehicle info
            const vehicleTitle = document.getElementById('vehicleTitle')?.textContent || '';
            const vehiclePrice = document.getElementById('vehiclePrice')?.textContent || '';
            document.getElementById('vehicleInfo').value = `${vehicleTitle} - ${vehiclePrice}`;
            // Pre-fill message with vehicle info
            const messageField = document.getElementById('contactMessage');
            if (messageField && !messageField.value) {
                messageField.value = `Bonjour,\n\nJe suis intéressé(e) par le véhicule ${vehicleTitle} affiché à ${vehiclePrice}.\n\nMerci de me contacter pour plus d'informations.`;
            }
        });
    }

    // Back to options
    function showOptions() {
        contactOptions.classList.remove('hidden');
        emailFormContainer.classList.remove('active');
    }

    if (backToOptions) {
        backToOptions.addEventListener('click', showOptions);
    }

    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            const vehicleInfo = document.getElementById('vehicleInfo').value;

            // Create mailto link
            const subject = encodeURIComponent(`Demande d'information - ${vehicleInfo}`);
            const body = encodeURIComponent(
                `Nom: ${name}\n` +
                `Email: ${email}\n` +
                `Téléphone: ${phone || 'Non renseigné'}\n\n` +
                `Véhicule: ${vehicleInfo}\n\n` +
                `Message:\n${message}`
            );

            window.location.href = `mailto:contact@mboulhiauto.fr?subject=${subject}&body=${body}`;

            // Close modal after a short delay
            setTimeout(closeModal, 500);
        });
    }
}

async function loadVehicleDetail() {
    // Get vehicle ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');

    if (!vehicleId) {
        window.location.href = '/vehicules-occasion.html';
        return;
    }

    try {
        // Get vehicle from localStorage
        const vehicleData = localStorage.getItem('currentVehicle');

        if (!vehicleData) {
            window.location.href = '/vehicules-occasion.html';
            return;
        }

        const vehicle = JSON.parse(vehicleData);

        // Verify the ID matches
        if (vehicle.id != vehicleId) {
            window.location.href = '/vehicules-occasion.html';
            return;
        }

        // Display vehicle details
        displayVehicleDetail(vehicle);

        // Load similar vehicles
        loadSimilarVehicles(vehicle);

        // Clear localStorage after loading
        localStorage.removeItem('currentVehicle');

    } catch (error) {
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
    mainImage.src = optimizeImage(vehicle.image, 1200, 80);
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

    // Store original URLs for full-size click (before optimization)
    mainImage._originalSrc = vehicle.image;

    // Set vehicle info
    document.getElementById('vehicleTitle').textContent = title.toUpperCase();
    document.getElementById('vehicleSubtitle').textContent =
        `${vehicle.year} • ${vehicle.brand.toUpperCase()} • ${vehicle.model.toUpperCase()}`;
    document.getElementById('vehiclePrice').textContent = `€${Number(vehicle.price).toLocaleString('fr-FR')}.00`;

    // Set description fields
    document.getElementById('descYear').textContent = vehicle.year || '-';
    document.getElementById('descBrand').textContent = vehicle.brand || '-';
    document.getElementById('descModel').textContent = vehicle.model || '-';
    document.getElementById('descFinition').textContent = vehicle.finition || '-';
    document.getElementById('descCondition').textContent = vehicle.condition || '-';
    document.getElementById('descMileage').textContent =
        (vehicle.mileage !== undefined && vehicle.mileage !== null && vehicle.mileage !== '')
            ? `${Number(vehicle.mileage).toLocaleString('fr-FR')} km` : '-';
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
    thumbnail.innerHTML = `<img src="${optimizeImage(imageSrc, 120)}" alt="Image ${index + 1}">`;

    thumbnail.addEventListener('click', function() {
        // Update main image with optimized full-size version
        document.getElementById('mainImage').src = optimizeImage(imageSrc, 1200, 80);

        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
    });

    thumbnailGallery.appendChild(thumbnail);
}

// ===== SIMILAR VEHICLES =====
async function loadSimilarVehicles(currentVehicle) {
    try {
        const allVehicles = await getAllVehicles();

        // Filter: same type (occasion/recent/neuf), exclude current vehicle
        const similar = allVehicles.filter(v => {
            if (v.id === currentVehicle.id) return false;
            if (!v.types || !currentVehicle.types) return false;
            return v.types.some(t => currentVehicle.types.includes(t));
        });

        if (similar.length === 0) return;

        // Shuffle and take up to 4
        const shuffled = similar.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 4);

        const grid = document.getElementById('similarVehiclesGrid');
        const section = document.getElementById('similarVehiclesSection');

        selected.forEach(vehicle => {
            const card = createVehicleCard(vehicle);
            grid.appendChild(card);
        });

        section.style.display = '';
    } catch (error) {
        // Silently fail - similar vehicles is not critical
    }
}
