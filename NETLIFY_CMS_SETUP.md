# Configuration Netlify CMS pour MBOULHI AUTO

## Installation et Configuration

### 1. Déployer sur Netlify

1. Créez un compte sur [Netlify](https://www.netlify.com/)
2. Connectez votre dépôt Git (GitHub, GitLab, ou Bitbucket)
3. Déployez le site

### 2. Activer Netlify Identity

1. Dans votre dashboard Netlify, allez dans **Site settings** > **Identity**
2. Cliquez sur **Enable Identity**
3. Sous **Registration preferences**, sélectionnez **Invite only** (pour plus de sécurité)
4. Sous **External providers**, vous pouvez activer Google, GitHub, etc.

### 3. Activer Git Gateway

1. Toujours dans **Identity**, allez dans **Services** > **Git Gateway**
2. Cliquez sur **Enable Git Gateway**

### 4. Inviter des utilisateurs

1. Allez dans **Identity** > **Invite users**
2. Entrez l'adresse email de l'administrateur
3. L'utilisateur recevra un email d'invitation

### 5. Accéder au CMS

Une fois configuré, accédez au CMS via :
```
https://votre-site.netlify.app/admin/
```

## Structure du CMS

### Collections

#### Véhicules
Gérez tous les véhicules avec les champs suivants :
- **ID** : Numéro unique du véhicule
- **Marque** : Volkswagen, Peugeot, etc.
- **Modèle** : Taigo, 208, etc.
- **Année** : 2015-2026
- **Prix** : En euros
- **Kilométrage** : En km (0 pour neuf)
- **Carburant** : Essence, Diesel, Électrique, Hybride
- **Transmission** : Manuelle ou Automatique
- **Puissance** : Format "XXX ch"
- **Types** : neuf, recent (moins de 3 ans), occasion
- **Destination** : export, algerie, europe
- **Image** : Photo principale du véhicule
- **Description** : Texte descriptif
- **Caractéristiques** : Liste de 3 à 6 caractéristiques

#### Règles de classification des véhicules

**IMPORTANT** : Suivez ces règles lors de l'ajout de véhicules :

1. **Véhicule Neuf** (`neuf`) :
   - Année : 2025-2026
   - Kilométrage : 0 km
   - Carburant : Tous types
   - Types : `["neuf"]` uniquement

2. **Véhicule Moins de 3 ans** (`recent`) :
   - Année : 2023-2025
   - Kilométrage : > 0
   - **Carburant : ESSENCE, ÉLECTRIQUE ou HYBRIDE uniquement**
   - Types : `["recent", "occasion"]`

3. **Véhicule Occasion** (`occasion`) :
   - Année : < 2023 OU
   - Tous véhicules avec km > 0 qui ne sont pas "neuf" ou "moins de 3 ans"
   - Carburant : Tous types
   - Types : `["occasion"]` uniquement

**⚠️ Règle importante** : Les véhicules DIESEL avec kilométrage ne peuvent JAMAIS être classés comme "moins de 3 ans", même s'ils sont de 2023-2025. Ils sont toujours "occasion" uniquement. Seuls les véhicules Essence, Électrique et Hybride avec kilométrage peuvent être "moins de 3 ans".

### Paramètres

#### Informations de contact
- Téléphone
- WhatsApp
- Email
- Adresse
- Horaires

#### Réseaux sociaux
- TikTok
- Facebook
- YouTube
- Instagram

## Workflow

### Ajouter un véhicule

1. Connectez-vous au CMS (`/admin/`)
2. Cliquez sur **Véhicules** > **New Véhicule**
3. Remplissez tous les champs requis
4. **Vérifiez la classification selon les règles ci-dessus**
5. Uploadez l'image du véhicule
6. Cliquez sur **Publish**

Le véhicule sera automatiquement créé dans le dossier `_vehicules/` et ajouté au fichier de données.

### Modifier un véhicule

1. Connectez-vous au CMS
2. Cliquez sur **Véhicules**
3. Sélectionnez le véhicule à modifier
4. Effectuez vos modifications
5. Cliquez sur **Publish**

### Supprimer un véhicule

1. Ouvrez le véhicule dans le CMS
2. Cliquez sur **Delete entry**
3. Confirmez la suppression

## Synchronisation avec le site

Les véhicules dans le CMS sont stockés dans le dossier `_vehicules/` au format Markdown.

Pour les afficher sur le site, vous devrez créer un script qui :
1. Lit les fichiers dans `_vehicules/`
2. Parse le frontmatter YAML
3. Met à jour le fichier `js/data.js`

### Script de synchronisation (à créer)

Créez un fichier `scripts/sync-vehicles.js` qui convertit les fichiers Markdown en données JavaScript.

Exemple de contenu d'un fichier véhicule :
```markdown
---
id: 1
brand: "VOLKSWAGEN"
model: "Taigo"
year: 2025
price: 25900
mileage: 0
fuel: "Essence"
transmission: "Automatique"
power: "110 ch"
types:
  - neuf
destination: "export"
image: "images/VOLKSWAGEN-occasion-Taigo-102137-1.jpg"
description: "SUV compact moderne, idéal pour l'export vers l'Algérie"
features:
  - "Climatisation auto"
  - "Écran tactile"
  - "Caméra de recul"
  - "Jantes alliage"
---
```

## Sécurité

- **Ne jamais** partager vos identifiants Netlify Identity
- Utilisez **Invite only** pour les nouvelles inscriptions
- Activez l'authentification à deux facteurs si disponible
- Gardez une liste des utilisateurs autorisés à jour

## Support

Pour toute question sur Netlify CMS :
- Documentation officielle : https://www.netlifycms.org/docs/
- Netlify Identity : https://docs.netlify.com/visitor-access/identity/
