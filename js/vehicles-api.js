/**
 * MBOULHI AUTO - API Client pour charger les véhicules
 * Utilise Netlify Functions pour charger les véhicules depuis le CMS
 */

let vehiclesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Charger les véhicules depuis l'API Netlify
 */
async function loadVehiclesFromAPI() {
    try {
        console.log('📡 Chargement des véhicules depuis l\'API...');

        const response = await fetch('/.netlify/functions/vehicles');

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.vehicles) {
            console.log(`✅ ${data.count} véhicules chargés depuis l'API`);
            return data.vehicles;
        } else {
            throw new Error('Réponse API invalide');
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des véhicules:', error);

        // Fallback: utiliser data.js si disponible
        if (typeof vehiclesData !== 'undefined' && Array.isArray(vehiclesData)) {
            console.log('⚠️ Utilisation du fallback data.js (' + vehiclesData.length + ' véhicules)');
            return vehiclesData;
        }

        console.error('❌ Aucune donnée disponible (ni API ni data.js)');
        return [];
    }
}

/**
 * Obtenir tous les véhicules (avec cache)
 */
async function getAllVehicles(forceRefresh = false) {
    const now = Date.now();

    // Utiliser le cache si valide
    if (!forceRefresh && vehiclesCache && cacheTimestamp && (now - cacheTimestamp < CACHE_DURATION)) {
        console.log('💾 Utilisation du cache');
        return vehiclesCache;
    }

    // Charger depuis l'API
    vehiclesCache = await loadVehiclesFromAPI();
    cacheTimestamp = now;

    return vehiclesCache;
}

/**
 * Obtenir les véhicules en vedette
 */
async function getFeaturedVehicles(limit = 6) {
    const vehicles = await getAllVehicles();

    // Mélanger et prendre les premiers
    const shuffled = [...vehicles].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
}

/**
 * Filtrer les véhicules selon les critères
 */
async function filterVehicles(filters) {
    const vehicles = await getAllVehicles();

    return vehicles.filter(vehicle => {
        // Filtre par type
        if (filters.type) {
            if (!vehicle.types || !vehicle.types.includes(filters.type)) {
                return false;
            }
        }

        // Filtre par destination
        if (filters.destination && vehicle.destination !== filters.destination) {
            return false;
        }

        // Filtre par marque
        if (filters.brand) {
            const searchBrand = filters.brand.toLowerCase();
            if (!vehicle.brand.toLowerCase().includes(searchBrand)) {
                return false;
            }
        }

        // Filtre par prix min
        if (filters.minPrice && vehicle.price < Number(filters.minPrice)) {
            return false;
        }

        // Filtre par prix max
        if (filters.maxPrice && vehicle.price > Number(filters.maxPrice)) {
            return false;
        }

        // Filtre par carburant
        if (filters.fuel && vehicle.fuel !== filters.fuel) {
            return false;
        }

        // Filtre par transmission
        if (filters.transmission && vehicle.transmission !== filters.transmission) {
            return false;
        }

        return true;
    });
}

/**
 * Obtenir un véhicule par ID
 */
async function getVehicleById(id) {
    const vehicles = await getAllVehicles();
    return vehicles.find(vehicle => vehicle.id === Number(id));
}

/**
 * Rafraîchir le cache des véhicules
 */
async function refreshVehiclesCache() {
    console.log('�� Rafraîchissement du cache...');
    return await getAllVehicles(true);
}

// ===== FONCTIONS UTILITAIRES (compatibilité avec l'ancien code) =====

function formatPrice(price) {
    return `${Number(price).toLocaleString('fr-FR')} €`;
}

function formatMileage(mileage) {
    if (mileage === 0) return '0 km';
    return `${Number(mileage).toLocaleString('fr-FR')} km`;
}

function getVehicleTypeBadge(types) {
    if (!types || types.length === 0) return 'Véhicule';

    if (types.includes('neuf')) return 'Neuf';
    if (types.includes('recent')) return 'Moins de 3 ans';
    if (types.includes('occasion')) return 'Occasion';

    return 'Véhicule';
}

function getDestinationLabel(destination) {
    const destinations = {
        'export': 'Export',
        'algerie': 'Algérie',
        'europe': 'Europe'
    };

    return destinations[destination] || destination;
}
