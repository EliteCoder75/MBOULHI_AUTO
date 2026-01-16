# 🚀 API Netlify Functions - MBOULHI AUTO

## 📋 Vue d'ensemble

Votre site utilise maintenant **Netlify Functions** pour charger les véhicules directement depuis le CMS, **sans rebuild** à chaque modification.

## ✅ Ce qui a été implémenté

### 1. **Netlify Function** (`netlify/functions/vehicles.js`)
- Lit les fichiers markdown du dossier `_vehicules/`
- Parse le front matter YAML
- Retourne les véhicules en JSON
- Endpoint: `/.netlify/functions/vehicles`

### 2. **API Client** (`js/vehicles-api.js`)
- Charge les véhicules depuis l'API
- Cache les données pendant 5 minutes
- Fallback sur `data.js` en cas d'erreur
- Fonctions: `getAllVehicles()`, `filterVehicles()`, `getVehicleById()`

### 3. **JavaScript modifié** (`js/main.js`)
- Toutes les fonctions sont maintenant `async`
- Utilise l'API au lieu de `data.js`
- Affiche un loader pendant le chargement

### 4. **Configuration Netlify** (`netlify.toml`)
- Dossier des fonctions: `netlify/functions`
- Node.js version 18

## 🔄 Comment ça marche

### Avant (avec rebuild):
```
Ajouter voiture dans CMS → Créer fichier .md → ❌ Rebuild obligatoire → data.js généré → Site mis à jour
```

### Maintenant (sans rebuild):
```
Ajouter voiture dans CMS → Créer fichier .md → ✅ API lit le fichier → JSON retourné → Site mis à jour instantanément
```

## 🎯 Utilisation

### Ajouter une voiture
1. Allez sur `/admin`
2. Ajoutez une voiture via Netlify CMS
3. Cliquez sur "Publish"
4. ✨ La voiture apparaît instantanément sur le site (après 5 min max si cache)

### Tester l'API localement
Pour tester en local, vous devez installer Netlify CLI:

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Lancer le serveur de développement
netlify dev
```

Ensuite, ouvrez `http://localhost:8888` dans votre navigateur.

### Déployer sur Netlify
```bash
# Option 1: Push sur Git
git add .
git commit -m "Ajout API Netlify Functions"
git push

# Option 2: Via l'interface Netlify
# Glissez-déposez votre dossier sur netlify.app/drop
```

## 📁 Structure des fichiers

```
MBOULHI DZ/
├── netlify/
│   └── functions/
│       └── vehicles.js          ← API serverless
├── js/
│   ├── vehicles-api.js          ← Client API
│   ├── main.js                  ← Modifié pour async
│   └── data.js                  ← Backup (fallback)
├── _vehicules/                  ← Fichiers markdown du CMS
├── netlify.toml                 ← Configuration Netlify
└── admin/
    └── config.yml               ← Configuration CMS
```

## 🔧 Endpoints API

### `GET /.netlify/functions/vehicles`

**Réponse:**
```json
{
  "success": true,
  "count": 15,
  "vehicles": [
    {
      "id": 6,
      "brand": "VOLKSWAGEN",
      "model": "golf 8",
      "year": 2024,
      "price": 23999,
      "mileage": 54000,
      "fuel": "Essence",
      "transmission": "Automatique",
      "motor": "150 ch",
      "exterior_color": "",
      "interior_color": "",
      "condition": "",
      "types": ["recent"],
      "destination": "europe",
      "image": "images/téléchargement.jpg",
      "gallery": [],
      "description": "golf 8 style",
      "features": []
    }
  ]
}
```

## ⚡ Performance

### Cache
- Les véhicules sont mis en cache pendant **5 minutes**
- Pour forcer un rafraîchissement: `refreshVehiclesCache()`

### Fallback
- Si l'API échoue, le site utilise `data.js` comme backup
- Aucune erreur visible pour l'utilisateur

## 🐛 Dépannage

### L'API ne fonctionne pas en local
➡️ Utilisez `netlify dev` au lieu d'ouvrir directement `index.html`

### Les voitures n'apparaissent pas
1. Vérifiez que les fichiers `.md` sont dans `_vehicules/`
2. Ouvrez la console (F12) et cherchez les erreurs
3. Vérifiez l'endpoint: `/.netlify/functions/vehicles`

### Les changements n'apparaissent pas
➡️ Le cache dure 5 minutes. Attendez ou rafraîchissez le cache:
```javascript
// Dans la console du navigateur
await refreshVehiclesCache();
```

## 📊 Avantages

| Aspect | Avant | Maintenant |
|--------|-------|------------|
| Ajout voiture | ⏱️ 2-5 min (rebuild) | ⚡ Instantané |
| Modification | ⏱️ 2-5 min (rebuild) | ⚡ Instantané |
| Complexité | Simple | Moyenne |
| Coût | Gratuit | Gratuit |
| Maintenance | Manuelle | Automatique |

## 🚨 Important

- **data.js reste en backup**: Ne le supprimez pas
- **Cache de 5 min**: Les changements peuvent prendre jusqu'à 5 minutes pour apparaître
- **Netlify Functions**: Gratuit jusqu'à 125 000 requêtes/mois (largement suffisant)

## 📞 Support

Si vous rencontrez des problèmes:
1. Vérifiez les logs Netlify: `netlify.app/dashboard`
2. Consultez la console du navigateur (F12)
3. Testez l'API directement: `/.netlify/functions/vehicles`

---

**Créé le:** 2026-01-16
**Système:** Netlify Functions + Netlify CMS
**Version:** 1.0
