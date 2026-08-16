/**
 * MBOULHI AUTO — Netlify Function
 * Endpoint: /.netlify/functions/vehicles
 *
 * Lit les véhicules EN DIRECT depuis GitHub (_vehicules/) au lieu d'une
 * copie figée au build — un ajout/edit/suppression de véhicule dans la CMS
 * n'a donc plus besoin de redéploiement Netlify pour être pris en compte.
 *
 * Les photos restent servies par le CDN Images de Netlify (/.netlify/images,
 * utilisé par optimizeImage() côté front pour le redimensionnement à la
 * volée) — un déploiement reste donc nécessaire quand une photo change.
 * Seuls les changements texte (prix, dispo, description, suppression...)
 * évitent le déploiement.
 */

const matter = require('gray-matter');

const OWNER  = 'EliteCoder75';
const REPO   = 'MBOULHI_AUTO';
const BRANCH = 'master';
const TOKEN  = process.env.GITHUB_TOKEN;

const CACHE_TTL_MS = 60 * 1000;
let cache = { data: null, ts: 0 };

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

function normalizeVehicle(data) {
    return {
        id:             data.id || 0,
        brand:          (data.brand || '').toUpperCase(),
        model:          data.model || '',
        finition:       data.finition || '',
        year:           data.year || new Date().getFullYear(),
        price:          parseInt(String(data.price || '0').replace(/\D/g, ''), 10) || 0,
        mileage:        parseInt(String(data.mileage !== undefined ? data.mileage : '0').replace(/\D/g, ''), 10) || 0,
        fuel:           data.fuel || '',
        transmission:   data.transmission || '',
        motor:          data.motor || data.power || '',
        exterior_color: data.exterior_color || '',
        interior_color: data.interior_color || '',
        condition:      data.condition || '',
        types:          Array.isArray(data.types) ? data.types : [],
        destination:    data.destination || '',
        image:          data.image || '',
        gallery:        Array.isArray(data.gallery) ? data.gallery : [],
        description:    data.description || data.desc || '',
        features:       Array.isArray(data.features) ? data.features : []
    };
}

async function fetchVehiclesFromGitHub() {
    const listRes = await fetch(
        `https://api.github.com/repos/${OWNER}/${REPO}/contents/_vehicules?ref=${BRANCH}`,
        {
            headers: {
                'Accept': 'application/vnd.github+json',
                'User-Agent': 'mboulhi-auto-vehicles-function',
                ...(TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {})
            }
        }
    );
    if (!listRes.ok) {
        throw new Error(`GitHub API listing _vehicules a échoué: ${listRes.status}`);
    }
    const entries = await listRes.json();
    const mdFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.md'));

    const vehicles = await Promise.all(mdFiles.map(async (entry) => {
        const raw = await fetch(entry.download_url, {
            headers: TOKEN ? { 'Authorization': `Bearer ${TOKEN}` } : {}
        });
        if (!raw.ok) {
            console.error(`Erreur lecture ${entry.name}: HTTP ${raw.status}`);
            return null;
        }
        const content = await raw.text();
        try {
            const { data } = matter(content);
            return (data && data.id) ? normalizeVehicle(data) : null;
        } catch (e) {
            console.error(`Erreur parsing ${entry.name}:`, e.message);
            return null;
        }
    }));

    return vehicles.filter(Boolean);
}

async function getVehicles() {
    const now = Date.now();
    if (cache.data && (now - cache.ts) < CACHE_TTL_MS) {
        return cache.data;
    }
    try {
        const data = await fetchVehiclesFromGitHub();
        cache = { data, ts: now };
        return data;
    } catch (e) {
        console.error('Erreur fetch GitHub, fallback sur le cache existant:', e.message);
        if (cache.data) return cache.data;
        return [];
    }
}

exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: HEADERS, body: '' };
    }

    try {
        const vehicles = [...(await getVehicles())].sort((a, b) => String(a.id).localeCompare(String(b.id)));

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({ success: true, count: vehicles.length, vehicles })
        };

    } catch (err) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ success: false, error: err.message })
        };
    }
};
