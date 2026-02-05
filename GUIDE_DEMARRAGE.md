# 🚀 Guide de démarrage - Application de Messagerie

## 📋 Prérequis

- Node.js (version 14 ou supérieure)
- MySQL
- Navigateur web moderne

## 🔧 Configuration

### 1. Configuration de la base de données

Assurez-vous d'avoir un fichier `.env` dans le dossier `back/` avec vos informations de connexion MySQL :

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=messagerie
DB_PORT=3306
JWT_SECRET=votre_secret_jwt
```

### 2. Installation des dépendances

```bash
cd back
npm install
```

## 🎬 Démarrage de l'application

### Étape 1 : Démarrer le serveur back-end

```bash
cd back
node server.js
```

Le serveur devrait démarrer sur `http://localhost:3000`

### Étape 2 : Ouvrir le front-end

Plusieurs options :

#### Option A : Avec Python
```bash
cd front
python3 -m http.server 8000
```
Puis ouvrez : http://localhost:8000

#### Option B : Avec Node.js (live-server)
```bash
npm install -g live-server
cd front
live-server
```

#### Option C : Avec VSCode
- Installez l'extension "Live Server"
- Clic droit sur `front/index.html`
- Sélectionnez "Open with Live Server"

#### Option D : Directement dans le navigateur
Ouvrez simplement le fichier `front/index.html` dans votre navigateur
(Note : certaines fonctionnalités peuvent être limitées en mode file://)

## 📱 Utilisation

1. **Créer un compte** : Sur la page de connexion, cliquez sur "Créer un compte"
2. **Se connecter** : Utilisez vos identifiants
3. **Créer une conversation** : Cliquez sur le bouton "+" dans la liste des conversations
4. **Rechercher des contacts** : Utilisez la barre de recherche dans le modal
5. **Envoyer des messages** : Sélectionnez une conversation et tapez votre message

## 🐛 Résolution des problèmes

### Le serveur ne démarre pas
- Vérifiez que MySQL est lancé
- Vérifiez les informations dans le fichier `.env`
- Vérifiez que le port 3000 n'est pas déjà utilisé

### Erreur CORS
- Assurez-vous d'avoir installé le package `cors` : `npm install cors`
- Vérifiez que `app.use(cors())` est présent dans `back/app.js`

### Le front-end ne se connecte pas à l'API
- Vérifiez que le serveur back-end est lancé
- Vérifiez l'URL de l'API dans `front/js/config.js`
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Les messages ne s'affichent pas
- Rafraîchissez la page
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que le token d'authentification est valide

## 📦 Structure du projet

```
expressJS/
├── back/                    # Serveur Express.js
│   ├── app.js              # Configuration de l'application
│   ├── server.js           # Point d'entrée du serveur
│   ├── package.json        # Dépendances Node.js
│   ├── .env                # Variables d'environnement
│   ├── helper/             # Fonctions utilitaires
│   │   ├── associate.js    # Associations Sequelize
│   │   ├── connexion.js    # Connexion à la BDD
│   │   └── sync.js         # Synchronisation des modèles
│   └── module/             # Modules de l'application
│       ├── auth/           # Authentification
│       ├── conversation/   # Gestion des conversations
│       ├── message/        # Gestion des messages
│       └── user/           # Gestion des utilisateurs
│
└── front/                   # Interface utilisateur
    ├── index.html          # Page de connexion
    ├── chat.html           # Interface de chat
    ├── README.md           # Documentation du front
    ├── css/
    │   └── style.css       # Styles personnalisés
    └── js/
        ├── config.js       # Configuration API
        ├── auth.js         # Authentification
        └── chat.js         # Logique du chat
```

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- L'authentification utilise JWT (JSON Web Tokens)
- Les tokens sont stockés dans le localStorage du navigateur
- Les routes protégées nécessitent un token d'authentification valide

## 🎯 Fonctionnalités

- ✅ Inscription / Connexion
- ✅ Recherche d'utilisateurs
- ✅ Création de conversations
- ✅ Envoi de messages
- ✅ Affichage des conversations
- ✅ Déconnexion
- ✅ Interface responsive

## 📞 Support

En cas de problème, vérifiez :
1. Les logs du serveur back-end
2. La console du navigateur (F12)
3. Les fichiers de configuration (.env, config.js)
