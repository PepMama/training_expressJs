// Configuration de l'API
const API_URL = 'http://localhost:3000';

// Endpoints de l'API
const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  SIGNIN: `${API_URL}/auth/signin`,

  // User
  USER_SEARCH: (username) => `${API_URL}/user/search/${username}`,
  USER_ADD_CONTACT: `${API_URL}/user/addContact`,

  // Conversation
  CONVERSATION_CREATE: `${API_URL}/conversation`,
  CONVERSATION_GET_ALL: `${API_URL}/conversation`,
  CONVERSATION_GET_BY_ID: (id) => `${API_URL}/conversation/${id}`,

  // Message
  MESSAGE_CREATE: `${API_URL}/message`,
  MESSAGE_GET_ALL: `${API_URL}/message`,
};

// Gestion du token
const TokenManager = {
  set: (token) => {
    localStorage.setItem('authToken', token);
  },
  get: () => {
    return localStorage.getItem('authToken');
  },
  remove: () => {
    localStorage.removeItem('authToken');
  },
  getHeaders: () => {
    const token = TokenManager.get();
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  },
};

// Gestion de l'utilisateur
const UserManager = {
  set: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  get: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  remove: () => {
    localStorage.removeItem('currentUser');
  },
};

// Vérification de l'authentification
function checkAuth() {
  const token = TokenManager.get();
  const currentPage = window.location.pathname.split('/').pop();

  if (!token && currentPage !== 'index.html' && currentPage !== '') {
    window.location.href = 'index.html';
  } else if (token && (currentPage === 'index.html' || currentPage === '')) {
    window.location.href = 'chat.html';
  }
}

// Fonction pour afficher des alertes
function showAlert(containerId, message, type = 'danger') {
  const container = document.getElementById(containerId);
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
  container.innerHTML = '';
  container.appendChild(alert);

  // Auto-dismiss après 5 secondes
  setTimeout(() => {
    alert.remove();
  }, 5000);
}

// Fonction utilitaire pour formater les dates
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // Si c'est aujourd'hui, afficher l'heure
  if (diff < 24 * 60 * 60 * 1000) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // Sinon afficher la date
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
