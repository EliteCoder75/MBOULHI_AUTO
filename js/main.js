/**
 * MBOULHI AUTO - Script principal
 * Gestion des interactions et fonctionnalités du site
 */

// ===== VARIABLES GLOBALES =====
let currentFilters = {};

// ===== INITIALISATION AU CHARGEMENT DU DOM =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initFeaturedVehicles();
    initVehiclesPage();
    initContactForm();
    initReviewsCarousel();
});

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fermer le menu mobile au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navToggle.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // Activer le lien correspondant à la page actuelle
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
}

// ===== EFFETS AU SCROLL =====
function initScrollEffects() {
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', function() {
        // Header au scroll
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Bouton retour en haut
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        }
    });

    // Retour en haut au clic
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CHARGEMENT DES VÉHICULES EN VEDETTE (Page d'accueil) =====
function initFeaturedVehicles() {
    const featuredContainer = document.getElementById('featuredVehicles');

    if (!featuredContainer) return;

    const featured = getFeaturedVehicles(6);
    featuredContainer.innerHTML = '';

    featured.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        featuredContainer.appendChild(card);
    });
}

// ===== CRÉATION D'UNE CARTE VÉHICULE =====
function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.onclick = () => viewVehicleDetails(vehicle.id);

    card.innerHTML = `
        <div class="vehicle-image">
            <img src="${vehicle.image}" alt="${vehicle.brand} ${vehicle.model}" loading="lazy">
            <div class="vehicle-badge">${getVehicleTypeBadge(vehicle.types)}</div>
            <div class="vehicle-price">${formatPrice(vehicle.price)}</div>
        </div>
        <div class="vehicle-info">
            <h3 class="vehicle-title">${vehicle.brand} ${vehicle.model}</h3>
            <p class="vehicle-subtitle">${vehicle.year} • ${getDestinationLabel(vehicle.destination)}</p>
            <div class="vehicle-specs">
                <div class="spec-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>${formatMileage(vehicle.mileage)}</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-gas-pump"></i>
                    <span>${vehicle.fuel}</span>
                </div>
                <div class="spec-item">
                    <i class="fas fa-cog"></i>
                    <span>${vehicle.transmission}</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

// ===== PAGE VÉHICULES =====
function initVehiclesPage() {
    const vehiclesContainer = document.getElementById('vehiclesContainer');

    if (!vehiclesContainer) return;

    // Charger les filtres depuis l'URL
    loadFiltersFromURL();

    // Initialiser les filtres
    initFilters();

    // Afficher les véhicules
    displayVehicles();
}

// ===== CHARGER LES FILTRES DEPUIS L'URL =====
function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.get('type')) {
        currentFilters.type = params.get('type');
        const typeSelect = document.getElementById('filterType');
        if (typeSelect) typeSelect.value = params.get('type');
    }

    if (params.get('destination')) {
        currentFilters.destination = params.get('destination');
    }
}

// ===== INITIALISER LES FILTRES =====
function initFilters() {
    const filterType = document.getElementById('filterType');
    const filterDestination = document.getElementById('filterDestination');
    const filterBrand = document.getElementById('filterBrand');
    const filterMinPrice = document.getElementById('filterMinPrice');
    const filterMaxPrice = document.getElementById('filterMaxPrice');
    const filterFuel = document.getElementById('filterFuel');
    const filterTransmission = document.getElementById('filterTransmission');
    const resetBtn = document.getElementById('resetFilters');

    // Écouteurs d'événements pour les filtres
    if (filterType) {
        filterType.addEventListener('change', function() {
            currentFilters.type = this.value || null;
            displayVehicles();
        });
    }

    if (filterDestination) {
        filterDestination.addEventListener('change', function() {
            currentFilters.destination = this.value || null;
            displayVehicles();
        });
    }

    if (filterBrand) {
        filterBrand.addEventListener('input', function() {
            currentFilters.brand = this.value || null;
            displayVehicles();
        });
    }

    if (filterMinPrice) {
        filterMinPrice.addEventListener('input', function() {
            currentFilters.minPrice = this.value || null;
            displayVehicles();
        });
    }

    if (filterMaxPrice) {
        filterMaxPrice.addEventListener('input', function() {
            currentFilters.maxPrice = this.value || null;
            displayVehicles();
        });
    }

    if (filterFuel) {
        filterFuel.addEventListener('change', function() {
            currentFilters.fuel = this.value || null;
            displayVehicles();
        });
    }

    if (filterTransmission) {
        filterTransmission.addEventListener('change', function() {
            currentFilters.transmission = this.value || null;
            displayVehicles();
        });
    }

    // Bouton de réinitialisation
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            currentFilters = {};

            // Réinitialiser les champs
            if (filterType) filterType.value = '';
            if (filterDestination) filterDestination.value = '';
            if (filterBrand) filterBrand.value = '';
            if (filterMinPrice) filterMinPrice.value = '';
            if (filterMaxPrice) filterMaxPrice.value = '';
            if (filterFuel) filterFuel.value = '';
            if (filterTransmission) filterTransmission.value = '';

            displayVehicles();
        });
    }
}

// ===== AFFICHER LES VÉHICULES =====
function displayVehicles() {
    const vehiclesContainer = document.getElementById('vehiclesContainer');
    const resultsCount = document.getElementById('resultsCount');

    if (!vehiclesContainer) return;

    // Nettoyer les filtres vides
    const cleanFilters = {};
    for (let key in currentFilters) {
        if (currentFilters[key]) {
            cleanFilters[key] = currentFilters[key];
        }
    }

    // Obtenir les véhicules filtrés
    const vehicles = filterVehicles(cleanFilters);

    // Afficher le nombre de résultats
    if (resultsCount) {
        resultsCount.textContent = `${vehicles.length} véhicule${vehicles.length > 1 ? 's' : ''} trouvé${vehicles.length > 1 ? 's' : ''}`;
    }

    // Afficher les véhicules
    vehiclesContainer.innerHTML = '';

    if (vehicles.length === 0) {
        vehiclesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <h3>Aucun véhicule trouvé</h3>
                <p style="color: var(--text-light);">Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }

    vehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        vehiclesContainer.appendChild(card);
    });
}

// ===== VOIR LES DÉTAILS D'UN VÉHICULE =====
function viewVehicleDetails(vehicleId) {
    // Pour l'instant, on redirige vers WhatsApp avec les infos du véhicule
    const vehicle = getVehicleById(vehicleId);

    if (!vehicle) return;

    const message = `Bonjour, je suis intéressé(e) par le véhicule suivant :\n\n${vehicle.brand} ${vehicle.model}\nAnnée : ${vehicle.year}\nPrix : ${formatPrice(vehicle.price)}\nKilométrage : ${formatMileage(vehicle.mileage)}\n\nPouvez-vous me donner plus d'informations ?`;

    const whatsappUrl = `https://wa.me/33123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// ===== FORMULAIRE DE CONTACT =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Récupérer les données du formulaire
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Validation basique
        if (!formData.name || !formData.email || !formData.message) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Pour l'instant, on redirige vers WhatsApp
        const whatsappMessage = `Nouveau message de contact :\n\nNom : ${formData.name}\nEmail : ${formData.email}\nTéléphone : ${formData.phone || 'Non renseigné'}\nSujet : ${formData.subject}\n\nMessage :\n${formData.message}`;

        const whatsappUrl = `https://wa.me/33123456789?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');

        // Réinitialiser le formulaire
        contactForm.reset();

        // Message de confirmation
        alert('Merci pour votre message ! Vous allez être redirigé vers WhatsApp.');
    });
}

// ===== ANIMATIONS AU SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les éléments à animer
    const animatedElements = document.querySelectorAll('.concept-card, .vehicle-card, .feature-card, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Initialiser les animations au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// ===== GESTION DES ERREURS D'IMAGES =====
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            // Image de remplacement en cas d'erreur
            this.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="18"%3EImage non disponible%3C/text%3E%3C/svg%3E';
        });
    });
});

// ===== REVIEWS CAROUSEL =====
function initReviewsCarousel() {
    const reviewsCarousel = document.getElementById('reviewsCarousel');

    if (!reviewsCarousel) return;

    // Enable smooth horizontal scrolling
    reviewsCarousel.style.cursor = 'grab';

    let isDown = false;
    let startX;
    let scrollLeft;

    reviewsCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        reviewsCarousel.style.cursor = 'grabbing';
        startX = e.pageX - reviewsCarousel.offsetLeft;
        scrollLeft = reviewsCarousel.scrollLeft;
    });

    reviewsCarousel.addEventListener('mouseleave', () => {
        isDown = false;
        reviewsCarousel.style.cursor = 'grab';
    });

    reviewsCarousel.addEventListener('mouseup', () => {
        isDown = false;
        reviewsCarousel.style.cursor = 'grab';
    });

    reviewsCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - reviewsCarousel.offsetLeft;
        const walk = (x - startX) * 2;
        reviewsCarousel.scrollLeft = scrollLeft - walk;
    });
}
