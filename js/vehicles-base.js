/**
 * MBOULHI AUTO - Données des véhicules
 * Base de données fictive pour démonstration
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
    // ===== VÉHICULES NEUFS (Export) =====
    {
        id: 1,
        brand: "VOLKSWAGEN",
        model: "Taigo",
        year: 2025,
        price: 25900,
        mileage: 0,
        fuel: "Essence",
        transmission: "Automatique",
        power: "110 ch",
        types: ["neuf"], // Seulement neuf (2025, 0 km)
        destination: "export",
        image: "images/VOLKSWAGEN-occasion-Taigo-102137-1.jpg",
        description: "SUV compact moderne, idéal pour l'export vers l'Algérie",
        features: ["Climatisation auto", "Écran tactile", "Caméra de recul", "Jantes alliage"]
    },
    {
        id: 2,
        brand: "PEUGEOT",
        model: "208",
        year: 2025,
        price: 19900,
        mileage: 0,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "100 ch",
        types: ["neuf"], // Seulement neuf (2025, 0 km)
        destination: "export",
        image: "images/PEUGEOT-occasion-208-800430-1.jpg",
        description: "Citadine élégante et économique, parfaite pour l'export",
        features: ["i-Cockpit 3D", "Aide au stationnement", "Régulateur de vitesse", "Bluetooth"]
    },

    // ===== VÉHICULES MOINS DE 3 ANS (Occasion + Récent) =====
    {
        id: 3,
        brand: "VOLKSWAGEN",
        model: "T-Cross",
        year: 2023,
        price: 22500,
        mileage: 28000,
        fuel: "Diesel",
        transmission: "Automatique",
        power: "115 ch",
        types: ["occasion"], // Seulement occasion (Diesel avec km)
        destination: "algerie",
        image: "images/VOLKSWAGEN-occasion-T-cross-102127-1-hp.jpg",
        description: "SUV compact récent, conforme pour l'Algérie",
        features: ["GPS intégré", "Sellerie cuir", "Volant multifonction", "Clim automatique"]
    },
    {
        id: 4,
        brand: "PEUGEOT",
        model: "2008",
        year: 2024,
        price: 21800,
        mileage: 15000,
        fuel: "Essence",
        transmission: "Automatique",
        power: "130 ch",
        types: ["moins de 3 ans"], // Seulement occasion (Essence avec km)
        destination: "algerie",
        image: "images/PEUGEOT-occasion-2008-009668-1-hp.jpg",
        description: "SUV urbain récent avec garantie constructeur restante",
        features: ["Full LED", "Grip Control", "Mirror Screen", "Radars de stationnement"]
    },
    {
        id: 5,
        brand: "NISSAN",
        model: "Qashqai",
        year: 2023,
        price: 24900,
        mileage: 32000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "115 ch",
        types: ["occasion"], // Seulement occasion (Diesel avec km)
        destination: "algerie",
        image: "images/NISSAN-occasion-Qashqai-011619-1-hp.jpg",
        description: "SUV familial fiable et spacieux",
        features: ["Caméra 360°", "Toit panoramique", "Sièges chauffants", "Keyless"]
    },
    {
        id: 6,
        brand: "PEUGEOT",
        model: "5008",
        year: 2023,
        price: 28900,
        mileage: 35000,
        fuel: "Diesel",
        transmission: "Automatique",
        power: "130 ch",
        types: ["occasion"], // Seulement occasion (Diesel avec km)
        destination: "algerie",
        image: "images/PEUGEOT-occasion-5008-102125-1-hp.jpg",
        description: "SUV 7 places, idéal pour les familles",
        features: ["7 places", "Massage lombaire", "Affichage tête haute", "Hayon électrique"]
    },

    // ===== VÉHICULES D'OCCASION (Europe) =====
    {
        id: 7,
        brand: "VOLKSWAGEN",
        model: "Polo",
        year: 2019,
        price: 13500,
        mileage: 68000,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "95 ch",
        types: ["occasion"], // Seulement occasion (> 3 ans)
        destination: "europe",
        image: "images/VOLKSWAGEN-occasion-Polo-102111-1-hp.jpg",
        description: "Citadine fiable à prix compétitif",
        features: ["Bluetooth", "Régulateur", "Climatisation", "Carnet d'entretien complet"]
    },
    {
        id: 8,
        brand: "CITROEN",
        model: "C3",
        year: 2018,
        price: 11900,
        mileage: 75000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "100 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/CITROEN-occasion-C3-009654-1-hp.jpg",
        description: "Économique et confortable pour tous les jours",
        features: ["Airbumps", "Écran tactile 7''", "Mirror Screen", "Suspensions confort"]
    },
    {
        id: 9,
        brand: "PEUGEOT",
        model: "308",
        year: 2020,
        price: 16900,
        mileage: 58000,
        fuel: "Diesel",
        transmission: "Automatique",
        power: "130 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/PEUGEOT-occasion-308-009662-1-hp.jpg",
        description: "Berline élégante avec boîte automatique",
        features: ["Full LED", "GPS 3D", "Active Safety Brake", "Jantes 17''"]
    },
    {
        id: 10,
        brand: "NISSAN",
        model: "Juke",
        year: 2019,
        price: 15800,
        mileage: 62000,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "117 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/NISSAN-occasion-Juke-011635-1-hp.jpg",
        description: "SUV compact au design unique",
        features: ["Caméra recul", "Bi-ton", "Écran tactile", "Garantie 6 mois"]
    },
    {
        id: 11,
        brand: "CITROEN",
        model: "C3",
        year: 2020,
        price: 12900,
        mileage: 52000,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "82 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/CITROEN-occasion-C3-800397-1-hp.jpg",
        description: "Petite citadine parfaite pour la ville",
        features: ["Vitres électriques", "Radio USB", "Direction assistée", "Excellent état"]
    },
    {
        id: 12,
        brand: "FIAT",
        model: "500X",
        year: 2018,
        price: 14200,
        mileage: 71000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "120 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/FIAT-occasion-500x-93070-1-hp.jpg",
        description: "SUV compact au style italien",
        features: ["Toit ouvrant", "Sièges sport", "Écran Uconnect", "Design unique"]
    },
    {
        id: 13,
        brand: "PEUGEOT",
        model: "208",
        year: 2019,
        price: 12500,
        mileage: 64000,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "100 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/PEUGEOT-occasion-208-800447-1-hp.jpg",
        description: "Compacte élégante et économique",
        features: ["i-Cockpit", "Climatisation", "Jantes alliage", "Historique complet"]
    },
    {
        id: 14,
        brand: "KIA",
        model: "Picanto",
        year: 2020,
        price: 10900,
        mileage: 48000,
        fuel: "Essence",
        transmission: "Manuelle",
        power: "67 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/KIA-occasion-Picanto-009669-1-hp.jpg",
        description: "Citadine ultra-compacte et économique",
        features: ["Garantie constructeur", "Faible consommation", "Compact", "Idéal ville"]
    },
    {
        id: 15,
        brand: "VOLKSWAGEN",
        model: "T-Cross",
        year: 2020,
        price: 18900,
        mileage: 55000,
        fuel: "Essence",
        transmission: "Automatique",
        power: "95 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/VOLKSWAGEN-occasion-T-cross-800355-1-hp.jpg",
        description: "SUV compact polyvalent",
        features: ["Boîte DSG", "Digital Cockpit", "App Connect", "Modulable"]
    },
    {
        id: 16,
        brand: "VOLKSWAGEN",
        model: "E-up!",
        year: 2021,
        price: 17500,
        mileage: 32000,
        fuel: "Électrique",
        transmission: "Automatique",
        power: "83 ch",
        types: ["occasion"], // Seulement occasion (2021, plus de 3 ans)
        destination: "europe",
        image: "images/VOLKSWAGEN-occasion-E-up!-102124-1-hp.jpg",
        description: "Citadine 100% électrique, zéro émission",
        features: ["100% Électrique", "Autonomie 260km", "Charge rapide", "Zéro émission"]
    },
    {
        id: 17,
        brand: "CITROEN",
        model: "C3",
        year: 2019,
        price: 11500,
        mileage: 69000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "100 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/CITROEN-occasion-C3-800398-1-hp.jpg",
        description: "Confort et personnalisation",
        features: ["Suspensions confort", "Airbumps", "Personnalisable", "Economique"]
    },
    {
        id: 18,
        brand: "FIAT",
        model: "Tipo",
        year: 2019,
        price: 12800,
        mileage: 73000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "120 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/FIAT-occasion-Tipo-009666-1-hp.jpg",
        description: "Berline spacieuse et pratique",
        features: ["Spacieuse", "Coffre XXL", "GPS Uconnect", "Confortable"]
    },
    {
        id: 19,
        brand: "PEUGEOT",
        model: "208",
        year: 2018,
        price: 11200,
        mileage: 82000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "100 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/PEUGEOT-occasion-208-800462-1-hp.jpg",
        description: "Compacte diesel économique",
        features: ["Faible consommation", "i-Cockpit", "Fiable", "Entretien suivi"]
    },
    {
        id: 20,
        brand: "PEUGEOT",
        model: "Boxer",
        year: 2019,
        price: 22900,
        mileage: 95000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "140 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/PEUGEOT-occasion-Boxer-fg-800349-1-hp.jpg",
        description: "Fourgon professionnel robuste",
        features: ["Grand volume", "Professionnel", "Puissant", "Robuste"]
    },
    {
        id: 21,
        brand: "TOYOTA",
        model: "Proace",
        year: 2018,
        price: 24500,
        mileage: 88000,
        fuel: "Diesel",
        transmission: "Manuelle",
        power: "150 ch",
        types: ["occasion"], // Seulement occasion
        destination: "europe",
        image: "images/TOYOTA-occasion-Proace-93069-1-hp.jpg",
        description: "Utilitaire fiable et spacieux",
        features: ["9 places", "Fiabilité Toyota", "Spacieux", "Polyvalent"]
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
