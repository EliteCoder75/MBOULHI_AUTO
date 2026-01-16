# 🛠️ Guide de Développement Local - MBOULHI AUTO

## ⚠️ Problème Actuel

Quand vous ouvrez directement les fichiers HTML (`file:///...`), l'API Netlify Functions ne fonctionne pas car:
1. Les Netlify Functions nécessitent un serveur HTTP
2. Le endpoint `/.netlify/functions/vehicles` n'existe qu'avec Netlify

## ✅ Solution: 3 Options

### **Option 1: Netlify Dev (Recommandé)**

C'est la meilleure façon de tester en local avec l'API.

#### Installation:
```bash
# Installer Node.js si pas déjà installé
# Télécharger depuis: https://nodejs.org/

# Installer Netlify CLI globalement
npm install -g netlify-cli
```

#### Utilisation:
```bash
# Aller dans le dossier du projet
cd "c:\Users\bachi\Desktop\MBOULHI DZ"

# Lancer le serveur de développement
netlify dev
```

**Résultat:**
- Serveur local sur: `http://localhost:8888`
- API accessible sur: `http://localhost:8888/.netlify/functions/vehicles`
- Les fonctions Netlify fonctionnent exactement comme en production

---

### **Option 2: Utiliser data.js (Mode Actuel)**

Le site utilise automatiquement `data.js` comme fallback quand l'API ne fonctionne pas.

#### Comment ça marche:
```javascript
// Dans vehicles-api.js
try {
    const data = await fetch('/.netlify/functions/vehicles'); // ❌ Échoue en local
} catch (error) {
    return vehiclesData; // ✅ Utilise data.js à la place
}
```

#### Pour tester:
1. Ouvrez `index.html` directement dans le navigateur
2. Ouvrez la console (F12)
3. Vous verrez: `⚠️ Utilisation du fallback data.js`
4. Le site fonctionne avec les données de `js/data.js`

#### Pour mettre à jour data.js:
```bash
# Générer data.js depuis les fichiers markdown
node build-vehicles-data.js
```

**Note:** Il faut Node.js installé pour exécuter ce script.

---

### **Option 3: Serveur HTTP Simple**

Si vous ne voulez pas installer Netlify CLI, utilisez un serveur HTTP simple.

#### Avec Python (si installé):
```bash
# Python 3
cd "c:\Users\bachi\Desktop\MBOULHI DZ"
python -m http.server 8000

# Ouvrir: http://localhost:8000
```

#### Avec Node.js:
```bash
# Installer http-server
npm install -g http-server

# Lancer
cd "c:\Users\bachi\Desktop\MBOULHI DZ"
http-server -p 8000

# Ouvrir: http://localhost:8000
```

#### Avec VS Code:
- Installer l'extension "Live Server"
- Clic droit sur `index.html` > "Open with Live Server"

**Note:** Ces serveurs ne supportent pas les Netlify Functions, mais le fallback sur `data.js` fonctionnera.

---

## 🔍 Comment Vérifier que ça Fonctionne

### 1. Ouvrez la console du navigateur (F12)

#### En mode local avec data.js (fichier direct):
```
❌ Erreur lors du chargement des véhicules: TypeError: Failed to fetch
⚠️ Utilisation du fallback data.js (150 véhicules)
✅ 150 véhicules disponibles
```

#### En mode local avec Netlify Dev:
```
📡 Chargement des véhicules depuis l'API...
✅ 15 véhicules chargés depuis l'API
```

#### En production sur Netlify:
```
📡 Chargement des véhicules depuis l'API...
✅ 15 véhicules chargés depuis l'API
```

### 2. Testez l'endpoint API (avec Netlify Dev)

Ouvrez dans le navigateur:
```
http://localhost:8888/.netlify/functions/vehicles
```

Vous devriez voir:
```json
{
  "success": true,
  "count": 15,
  "vehicles": [...]
}
```

---

## 🚀 Workflow de Développement Recommandé

### En local (avant de pousser):
```bash
# 1. Tester avec Netlify Dev
netlify dev
# Ouvrir: http://localhost:8888

# 2. Vérifier que tout fonctionne
# - Ajouter/modifier une voiture dans /admin
# - Vérifier qu'elle apparaît sur le site

# 3. Commit et push
git add .
git commit -m "Description des changements"
git push origin master
```

### En production (après le push):
1. Netlify détecte le push automatiquement
2. Build et déploiement automatiques
3. Site mis à jour en 2-3 minutes
4. Tester sur: `https://votre-site.netlify.app`

---

## 📊 Comparaison des Options

| Méthode | API Fonctionne | Installation | Complexité |
|---------|---------------|--------------|------------|
| **Fichier direct** | ❌ Non (fallback data.js) | Aucune | Facile |
| **Netlify Dev** | ✅ Oui | `npm install -g netlify-cli` | Moyenne |
| **HTTP Server** | ❌ Non (fallback data.js) | Selon méthode | Facile |

---

## 🐛 Dépannage

### Erreur: "vehicles.filter is not a function"
**Cause:** `vehiclesData` n'est pas défini ou pas un tableau

**Solution:**
1. Vérifiez que `js/data.js` est bien chargé
2. Ouvrez la console et tapez: `console.log(vehiclesData)`
3. Si undefined, le fichier data.js n'est pas chargé

### Erreur: "404 Not Found" sur l'API
**Cause:** Normal en local sans Netlify Dev

**Solution:**
- Utilisez `netlify dev` pour tester l'API
- OU acceptez d'utiliser le fallback `data.js`

### Les modifications du CMS n'apparaissent pas
**En local:**
- L'API lit directement les fichiers `.md`
- Avec Netlify Dev: changements instantanés
- Sans Netlify Dev: utilisez `node build-vehicles-data.js` pour régénérer data.js

**En production:**
- Changements instantanés (max 5 min avec cache)

---

## 📝 Résumé

**Pour développer rapidement:**
```bash
netlify dev  # Meilleure expérience
```

**Pour tester vite sans installation:**
```
Ouvrez index.html directement (utilise data.js)
```

**En production sur Netlify:**
```
git push  # Tout fonctionne automatiquement
```

---

**Dernière mise à jour:** 2026-01-16
**Questions?** Consultez [NETLIFY_API_README.md](NETLIFY_API_README.md)
