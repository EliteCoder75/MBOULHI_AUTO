# MBOULHI AUTO - Site Web Professionnel

Site web complet et moderne pour un garage automobile spécialisé dans la vente de véhicules neufs et d'occasion, avec expertise en export international (France - Algérie - Europe).

## 🚗 Aperçu du Projet

MBOULHI AUTO est un site vitrine professionnel créé pour un créateur de contenu automobile reconnu sur les réseaux sociaux (TikTok, Facebook, YouTube). Le site met en avant trois concepts de vente distincts :

1. **Véhicules Neufs** - Export France → Algérie/International
2. **Véhicules - de 3 ans** - Pour l'Algérie
3. **Véhicules d'Occasion** - France & Europe

## ✨ Fonctionnalités Principales

### Pages du Site
- **Accueil** - Hero section, présentation des 3 concepts, véhicules en vedette, témoignages
- **Nos Véhicules** - Catalogue avec système de filtres avancés
- **Services** - Achat, vente, reprise, export, accompagnement
- **À Propos** - Histoire, valeurs, chiffres clés, engagement
- **Contact** - Formulaire, coordonnées, réseaux sociaux

### Caractéristiques Techniques
- ✅ Design responsive (Mobile First)
- ✅ Interface moderne et professionnelle
- ✅ Couleurs extraites du logo (Noir, Rouge, Blanc, Gris)
- ✅ Optimisé pour les performances
- ✅ SEO-friendly (balises meta, structure sémantique)
- ✅ Bouton WhatsApp flottant
- ✅ Intégration réseaux sociaux
- ✅ Animations et transitions fluides

### Système de Filtres (Page Véhicules)
- Type de véhicule (Neuf / Récent / Occasion)
- Destination (Export / Algérie / Europe)
- Marque
- Prix (min/max)
- Carburant
- Transmission

## 📁 Structure du Projet

```
MBOULHI DZ/
│
├── index.html              # Page d'accueil
├── vehicules.html          # Catalogue de véhicules
├── services.html           # Page des services
├── about.html              # À propos
├── contact.html            # Page de contact
├── README.md              # Documentation
│
├── css/
│   ├── style.css          # Styles principaux
│   └── vehicules.css      # Styles page véhicules
│
├── js/
│   ├── main.js            # Script principal
│   └── data.js            # Base de données véhicules
│
└── images/
    ├── logo.jpeg          # Logo MBOULHI AUTO
    └── [vehicules...]     # Photos des véhicules
```

## 🎨 Couleurs du Site

Extraites du logo MBOULHI AUTO :

- **Rouge Principal** : `#DC143C` (Crimson Red)
- **Noir** : `#000000`
- **Blanc** : `#FFFFFF`
- **Gris** : `#333333`, `#666666`, `#999999`

## 🚀 Installation et Déploiement

### Prérequis
Aucun prérequis technique n'est nécessaire. Le site est développé en HTML/CSS/JavaScript pur.

### Utilisation en Local

1. **Télécharger les fichiers**
   ```bash
   # Le projet est déjà dans votre dossier
   cd "MBOULHI DZ"
   ```

2. **Ouvrir le site**
   - Double-cliquez sur `index.html` pour ouvrir le site dans votre navigateur
   - OU utilisez un serveur local (recommandé) :
   ```bash
   # Avec Python 3
   python -m http.server 8000

   # Avec Node.js (npx)
   npx http-server
   ```
   Puis ouvrez `http://localhost:8000` dans votre navigateur

### Déploiement en Production

Le site peut être déployé sur n'importe quel hébergeur web :

#### Option 1 : Hébergement Gratuit
- **Netlify** : Drag & drop du dossier sur netlify.com
- **Vercel** : Importation depuis GitHub
- **GitHub Pages** : Gratuit avec GitHub

#### Option 2 : Hébergement Classique
- **cPanel** : Uploadez tous les fichiers via FTP
- **OVH, Ionos, O2Switch** : Upload via FTP/SFTP

#### Étapes générales :
1. Compressez tout le contenu du dossier (pas le dossier lui-même)
2. Uploadez via FTP ou interface web
3. Assurez-vous que `index.html` est à la racine
4. Configurez votre nom de domaine

## ⚙️ Configuration

### Personnalisation des Coordonnées

Modifiez ces éléments dans **TOUS les fichiers HTML** :

```html
<!-- Numéro de téléphone -->
<a href="tel:+33123456789">+33 1 23 45 67 89</a>

<!-- WhatsApp (remplacez le numéro) -->
<a href="https://wa.me/33123456789">

<!-- Email -->
<a href="mailto:contact@mboulhiauto.fr">contact@mboulhiauto.fr</a>

<!-- Adresse -->
<span>Paris, France</span>
```

### Personnalisation des Réseaux Sociaux

Dans les fichiers HTML, remplacez les `#` par vos vrais liens :

```html
<a href="https://tiktok.com/@votre_compte" target="_blank">
<a href="https://facebook.com/votre_page" target="_blank">
<a href="https://youtube.com/@votre_chaine" target="_blank">
<a href="https://instagram.com/votre_compte" target="_blank">
```

### Ajout/Modification de Véhicules

Éditez le fichier `js/data.js` :

```javascript
const vehiclesData = [
    {
        id: 1,
        brand: "VOLKSWAGEN",
        model: "Taigo",
        year: 2024,
        price: 25900,
        mileage: 0,
        fuel: "Essence",
        transmission: "Automatique",
        power: "110 ch",
        type: "neuf",          // neuf / recent / occasion
        destination: "export",  // export / algerie / europe
        image: "images/nom-fichier.jpg",
        description: "Description du véhicule",
        features: ["Option 1", "Option 2", ...]
    },
    // Ajoutez d'autres véhicules...
];
```

## 📱 Fonctionnalités Interactives

### Navigation Mobile
- Menu hamburger responsive
- Navigation fluide entre les pages

### Filtres Véhicules
- Filtrage dynamique sans rechargement
- Combinaison de plusieurs critères
- Bouton de réinitialisation

### Formulaire de Contact
- Validation des champs
- Redirection vers WhatsApp avec message pré-rempli
- Sélection du sujet de contact

### Animations
- Scroll animations
- Hover effects
- Transitions fluides

## 🔧 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Design moderne et responsive
  - CSS Grid & Flexbox
  - Variables CSS
  - Animations & Transitions
- **JavaScript Vanilla** - Interactivité
  - Manipulation DOM
  - Gestion d'événements
  - Filtrage dynamique
- **Font Awesome 6** - Icônes

## 📊 Base de Données Véhicules

Le fichier `js/data.js` contient actuellement **21 véhicules exemples** :
- 2 véhicules neufs
- 4 véhicules récents (- 3 ans)
- 15 véhicules d'occasion

Toutes les photos des véhicules sont déjà présentes dans le dossier `images/`.

## 🎯 SEO et Performance

### Optimisations SEO
- Balises meta descriptions sur toutes les pages
- Structure HTML sémantique (header, nav, section, article, footer)
- Attributs alt sur toutes les images
- URLs propres et parlantes
- Balises heading hiérarchisées (H1, H2, H3)

### Performance
- CSS et JS minifiables
- Images optimisées
- Chargement paresseux (lazy loading) des images
- Code léger et optimisé

### Améliorations Possibles
Pour aller plus loin :
- Minifier CSS et JS pour la production
- Compresser davantage les images (WebP)
- Ajouter un cache navigateur
- Implémenter un CDN

## 📞 Support et Contact

Pour toute question ou personnalisation supplémentaire du site :

- **WhatsApp** : À personnaliser
- **Email** : À personnaliser
- **Téléphone** : À personnaliser

## 📝 Notes Importantes

### À Faire Avant la Mise en Ligne

1. ✅ **Remplacer tous les numéros de téléphone** par les vrais
2. ✅ **Remplacer l'adresse email** par la vraie
3. ✅ **Ajouter les vrais liens des réseaux sociaux**
4. ✅ **Modifier l'adresse physique** si nécessaire
5. ✅ **Personnaliser les horaires d'ouverture**
6. ✅ **Ajouter/modifier les véhicules** dans `data.js`
7. ✅ **Tester le formulaire de contact**
8. ✅ **Vérifier tous les liens internes**

### Structure Prête Pour

Le site est conçu pour faciliter l'ajout futur de :
- ✅ Back-office administratif
- ✅ Système de gestion de stock
- ✅ Base de données (MySQL, PostgreSQL)
- ✅ Système de réservation en ligne
- ✅ Paiement en ligne
- ✅ Espace client
- ✅ Blog / Actualités

## 🏆 Avantages du Site

### Design
- ✅ Moderne et professionnel
- ✅ Couleurs du logo respectées
- ✅ Interface intuitive
- ✅ Responsive sur tous les appareils

### Fonctionnel
- ✅ Facile à utiliser
- ✅ Filtres performants
- ✅ Navigation fluide
- ✅ Contact facilité (WhatsApp)

### Marketing
- ✅ Met en avant les 3 concepts
- ✅ Témoignages clients
- ✅ Intégration réseaux sociaux
- ✅ Call-to-action efficaces

### Technique
- ✅ Code propre et commenté
- ✅ Structure évolutive
- ✅ SEO optimisé
- ✅ Performance optimale

## 📜 Licence

Ce site a été créé sur mesure pour MBOULHI AUTO. Tous droits réservés.

---

**Développé avec passion pour MBOULHI AUTO** 🚗

*Site web professionnel automobile - Spécialiste Export France-Algérie-Europe*
