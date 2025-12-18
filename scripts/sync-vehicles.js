#!/usr/bin/env node

/**
 * Script pour synchroniser les véhicules du CMS vers data.js
 * Convertit les fichiers Markdown de _vehicules/ en tableau JavaScript
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const VEHICLES_DIR = path.join(__dirname, '..', '_vehicules');
const OUTPUT_FILE = path.join(__dirname, '..', 'js', 'data.js');

// Lire tous les fichiers Markdown dans _vehicules/
function loadVehiclesFromMarkdown() {
    if (!fs.existsSync(VEHICLES_DIR)) {
        console.log('⚠️  Le dossier _vehicules/ n\'existe pas encore.');
        return [];
    }

    const files = fs.readdirSync(VEHICLES_DIR).filter(file => file.endsWith('.md'));

    const vehicles = files.map(file => {
        const filePath = path.join(VEHICLES_DIR, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent);

        return {
            id: data.id,
            brand: data.brand,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            fuel: data.fuel,
            transmission: data.transmission,
            power: data.power,
            types: data.types,
            destination: data.destination,
            image: data.image,
            description: data.description,
            features: data.features
        };
    });

    // Trier par ID
    return vehicles.sort((a, b) => a.id - b.id);
}

// Générer le fichier data.js
function generateDataJS(vehicles) {
    const template = `/**
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

const vehiclesData = ${JSON.stringify(vehicles, null, 4)};

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
`;

    fs.writeFileSync(OUTPUT_FILE, template, 'utf8');
    console.log(`✅ Fichier data.js mis à jour avec ${vehicles.length} véhicule(s)`);
}

// Exécuter le script
try {
    console.log('🔄 Synchronisation des véhicules...');
    const vehicles = loadVehiclesFromMarkdown();
    generateDataJS(vehicles);
    console.log('✨ Synchronisation terminée!');
} catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
}
