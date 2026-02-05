# Front-End Messagerie

Interface web simple en HTML/CSS/Bootstrap pour l'application de messagerie Express.js.

## 📁 Structure

```
front/
├── index.html          # Page de connexion/inscription
├── chat.html           # Interface de messagerie
├── css/
│   └── style.css       # Styles personnalisés
└── js/
    ├── config.js       # Configuration API et fonctions utilitaires
    ├── auth.js         # Gestion de l'authentification
    └── chat.js         # Gestion du chat et des conversations
```

## 🚀 Fonctionnalités

### Page de connexion (index.html)
- Formulaire de connexion
- Modal d'inscription
- Validation des formulaires
- Gestion des erreurs

### Page de chat (chat.html)
- Liste des conversations
- Messages en temps réel
- Création de nouvelles conversations
- Recherche d'utilisateurs
- Envoi de messages
- Déconnexion

## 🔧 Configuration

Le fichier `js/config.js` contient la configuration de l'API :

```javascript
const API_URL = 'http://localhost:3000';
```

**Important** : Modifiez cette URL si votre serveur Express.js tourne sur un autre port ou domaine.

## 📦 Utilisation

### 1. Configuration du serveur Express.js

Assurez-vous que votre serveur Express.js accepte les requêtes CORS. Ajoutez dans votre `app.js` :

```javascript
const cors = require('cors');
app.use(cors());
```

Installez le package si nécessaire :
```bash
npm install cors
```

### 2. Lancement

Ouvrez simplement `index.html` dans votre navigateur ou utilisez un serveur local :

#### Avec Python :
```bash
cd front
python3 -m http.server 8000
```
Puis ouvrez : http://localhost:8000

#### Avec Node.js (live-server) :
```bash
npm install -g live-server
cd front
live-server
```

#### Avec l'extension VSCode "Live Server" :
Clic droit sur `index.html` > "Open with Live Server"

## 🎨 Technologies utilisées

- **HTML5** : Structure des pages
- **CSS3** : Styles personnalisés
- **Bootstrap 5.3** : Framework CSS
- **Bootstrap Icons** : Icônes
- **JavaScript Vanilla** : Logique applicative
- **Fetch API** : Appels API REST

## 🔐 Authentification

Le front-end utilise :
- **localStorage** pour stocker le token JWT et les informations utilisateur
- **Bearer Token** dans les headers pour les requêtes authentifiées

## 📱 Responsive Design

L'interface est entièrement responsive et s'adapte aux différentes tailles d'écran (mobile, tablette, desktop).

## ⚙️ Points d'API utilisés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | /auth/login | Connexion |
| POST | /auth/signin | Inscription |
| GET | /user/search/:username | Recherche d'utilisateurs |
| POST | /user/addContact | Ajouter un contact |
| GET | /conversation | Liste des conversations |
| GET | /conversation/:id | Détails d'une conversation |
| POST | /conversation | Créer une conversation |
| POST | /message | Envoyer un message |

## 🐛 Débogage

- Ouvrez la console du navigateur (F12) pour voir les logs
- Vérifiez que le serveur Express.js est lancé
- Vérifiez la configuration CORS du serveur
- Vérifiez l'URL de l'API dans `config.js`

## 🎯 Améliorations possibles

- [ ] WebSocket pour les messages en temps réel
- [ ] Notifications push
- [ ] Upload de fichiers/images
- [ ] Émojis
- [ ] Statut en ligne/hors ligne
- [ ] Réactions aux messages
- [ ] Mode sombre
