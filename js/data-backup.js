/**
 * MBOULHI AUTO - Données des véhicules
 * Généré automatiquement depuis les fichiers CMS
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

const vehiclesData = [
    {
        "id": 576918916,
        "brand": "Renault",
        "model": "21",
        "year": 2015,
        "price": 5000,
        "mileage": 160000,
        "fuel": "Diesel",
        "transmission": "Manuelle",
        "power": "71 ch",
        "types": [
            "occasion"
        ],
        "destination": "europe",
        "image": "images/20230623_144748-scaled.jpg",
        "description": "voiture de collection élegante et spacieuse",
        "features": [
            "climatisation",
            "vitres électiques",
            "direction assisté",
            "feux anti brouillards",
            "gantes alliages",
            "siége cuires "
        ]
    }
];

// Fonction pour obtenir tous les véhicules
function getAllVehicles() {
    return vehiclesData;
}

// Fonction pour filtrer les véhicules (AVEC SUPPORT DES TAGS MULTIPLES)
function filterVehicles(filters) {
    let filtered = vehiclesData;

    if (filters.type) {
        // Filtre par type : vérifie si le type recherché est dans le tableau "types"
        filtered = filtered.filter(v => v.types.includes(filters.type));
    }

    if (filters.destination) {
        filtered = filtered.filter(v => v.destination === filters.destination);
    }

    if (filters.brand) {
        filtered = filtered.filter(v => v.brand.toLowerCase().includes(filters.brand.toLowerCase()));
    }

    if (filters.minPrice) {
        filtered = filtered.filter(v => v.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
        filtered = filtered.filter(v => v.price <= parseInt(filters.maxPrice));
    }

    if (filters.fuel) {
        filtered = filtered.filter(v => v.fuel === filters.fuel);
    }

    if (filters.transmission) {
        filtered = filtered.filter(v => v.transmission === filters.transmission);
    }

    return filtered;
}

// Fonction pour obtenir les véhicules en vedette (aléatoire)
function getFeaturedVehicles(count = 6) {
    const shuffled = [...vehiclesData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Fonction pour obtenir un véhicule par ID
function getVehicleById(id) {
    return vehiclesData.find(v => v.id === parseInt(id));
}

// Fonction pour formater le prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0
    }).format(price);
}

// Fonction pour formater le kilométrage
function formatMileage(mileage) {
    if (mileage === 0) return 'Neuf';
    return new Intl.NumberFormat('fr-FR').format(mileage) + ' km';
}

// Fonction pour obtenir le badge du type de véhicule (PREMIER TAG)
function getVehicleTypeBadge(types) {
    // Prioriser "neuf" si présent
    if (types.includes('neuf')) return 'Neuf';
    if (types.includes('recent')) return 'Moins de 3 ans';
    if (types.includes('occasion')) return 'Occasion';
    return types[0] || '';
}

// Fonction pour obtenir la destination
function getDestinationLabel(destination) {
    const labels = {
        export: 'Export',
        algerie: 'Algérie',
        europe: 'Europe'
    };
    return labels[destination] || destination;
}
