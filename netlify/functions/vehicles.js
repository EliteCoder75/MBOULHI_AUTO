/**
 * Netlify Function - API pour charger les véhicules depuis le CMS
 * Endpoint: /.netlify/functions/vehicles
 */

const fs = require('fs');
const path = require('path');

/**
 * Parse le front matter YAML d'un fichier markdown
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
                const value = line.substring(4).trim();
                currentList.push(value);
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
 * Normaliser les données d'un véhicule
 */
function normalizeVehicle(data) {
    return {
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
        types: Array.isArray(data.types) ? data.types : [],
        destination: data.destination || '',
        image: data.image || '',
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        description: data.description || data.desc || '',
        features: Array.isArray(data.features) ? data.features : []
    };
}

/**
 * Handler principal de la fonction
 */
exports.handler = async (event, context) => {
    try {
        // Autoriser CORS
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Content-Type': 'application/json'
        };

        // Gérer les requêtes OPTIONS (preflight)
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers,
                body: ''
            };
        }

        // Chemin vers le dossier _vehicules
        // Sur Netlify, essayer plusieurs chemins possibles
        let vehiclesDir;
        const possiblePaths = [
            path.join(__dirname, '../../_vehicules'),           // Chemin relatif standard
            path.join(process.cwd(), '_vehicules'),             // Depuis la racine du projet
            '/opt/build/repo/_vehicules',                        // Chemin Netlify build
            path.resolve(__dirname, '../../../_vehicules')       // Alternative
        ];

        // Trouver le bon chemin
        for (const tryPath of possiblePaths) {
            if (fs.existsSync(tryPath)) {
                vehiclesDir = tryPath;
                console.log('✅ Dossier _vehicules trouvé:', tryPath);
                break;
            }
        }

        // Vérifier que le dossier a été trouvé
        if (!vehiclesDir || !fs.existsSync(vehiclesDir)) {
            console.error('❌ Dossier _vehicules introuvable');
            console.error('Chemins testés:', possiblePaths);
            console.error('__dirname:', __dirname);
            console.error('process.cwd():', process.cwd());

            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Dossier _vehicules introuvable',
                    tried: possiblePaths,
                    __dirname: __dirname,
                    cwd: process.cwd()
                })
            };
        }

        // Lire tous les fichiers .md
        const files = fs.readdirSync(vehiclesDir)
            .filter(file => file.endsWith('.md'));

        console.log(`📂 ${files.length} fichiers markdown trouvés`);

        const vehicles = [];

        // Parser chaque fichier
        for (const file of files) {
            try {
                const filePath = path.join(vehiclesDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                const data = parseFrontMatter(content);

                if (data) {
                    const vehicle = normalizeVehicle(data);
                    vehicles.push(vehicle);
                    console.log(`✅ ${vehicle.brand} ${vehicle.model} (ID: ${vehicle.id})`);
                } else {
                    console.log(`⚠️ Impossible de parser: ${file}`);
                }
            } catch (error) {
                console.error(`❌ Erreur lecture fichier ${file}:`, error.message);
            }
        }

        // Trier par ID
        vehicles.sort((a, b) => a.id - b.id);

        console.log(`✨ ${vehicles.length} véhicules chargés avec succès`);

        // Retourner les véhicules
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                count: vehicles.length,
                vehicles: vehicles
            })
        };

    } catch (error) {
        console.error('❌ Erreur serveur:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
