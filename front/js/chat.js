// Vérifier l'authentification au chargement
checkAuth();

// Variables globales
let currentConversationId = null;
let selectedUsers = [];
let conversations = [];

// Afficher l'utilisateur actuel
const currentUser = UserManager.get();
document.getElementById('currentUser').textContent =
  `${currentUser.firstname} ${currentUser.lastname}`;

// Déconnexion
document.getElementById('logoutBtn').addEventListener('click', () => {
  TokenManager.remove();
  UserManager.remove();
  window.location.href = 'index.html';
});

// Charger les conversations
async function loadConversations() {
  try {
    const response = await fetch(API_ENDPOINTS.CONVERSATION_GET_ALL, {
      headers: TokenManager.getHeaders(),
    });

    if (response.ok) {
      conversations = await response.json();
      displayConversations();
    } else {
      console.error('Erreur lors du chargement des conversations');
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Afficher les conversations
function displayConversations() {
  const container = document.getElementById('conversationsList');

  if (conversations.length === 0) {
    container.innerHTML = `
            <div class="text-center text-muted p-3">
                <p>Aucune conversation</p>
                <p class="small">Créez-en une pour commencer !</p>
            </div>
        `;
    return;
  }

  container.innerHTML = conversations
    .map((conv) => {
      const isActive = conv.id === currentConversationId ? 'active' : '';
      // Afficher les participants (sauf l'utilisateur actuel)
      const participants = conv.Users
        ? conv.Users.filter((u) => u.id !== currentUser.id)
            .map((u) => u.username)
            .join(', ')
        : 'Conversation';

      return `
            <a href="#" class="list-group-item list-group-item-action conversation-item ${isActive}" data-conversation-id="${conv.id}">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${participants || 'Nouvelle conversation'}</h6>
                    <small>${conv.updatedAt ? formatDate(conv.updatedAt) : ''}</small>
                </div>
            </a>
        `;
    })
    .join('');

  // Ajouter les événements de clic
  document.querySelectorAll('.conversation-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const conversationId = parseInt(item.dataset.conversationId);
      selectConversation(conversationId);
    });
  });
}

// Sélectionner une conversation
async function selectConversation(conversationId) {
  currentConversationId = conversationId;

  // Mettre à jour l'affichage
  document.getElementById('noConversationSelected').classList.add('d-none');
  document.getElementById('chatContainer').classList.remove('d-none');

  // Charger les détails de la conversation
  await loadConversationDetails(conversationId);

  // Mettre à jour la liste des conversations
  displayConversations();
}

// Charger les détails d'une conversation
async function loadConversationDetails(conversationId) {
  try {
    const response = await fetch(API_ENDPOINTS.CONVERSATION_GET_BY_ID(conversationId), {
      headers: TokenManager.getHeaders(),
    });

    if (response.ok) {
      const conversation = await response.json();

      // Afficher le titre
      const participants = conversation.Users
        ? conversation.Users.filter((u) => u.id !== currentUser.id)
            .map((u) => u.username)
            .join(', ')
        : 'Conversation';
      document.getElementById('conversationTitle').textContent =
        participants || 'Nouvelle conversation';

      // Afficher les messages
      displayMessages(conversation.Messages || []);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Afficher les messages
function displayMessages(messages) {
  const container = document.getElementById('messagesContainer');

  if (messages.length === 0) {
    container.innerHTML = `
            <div class="text-center text-muted">
                <p>Aucun message pour le moment</p>
                <p class="small">Soyez le premier à écrire !</p>
            </div>
        `;
    return;
  }

  container.innerHTML = messages
    .map((msg) => {
      const isSent = msg.UserId === currentUser.id;
      const messageClass = isSent ? 'message-sent' : 'message-received';
      const author = msg.User ? `${msg.User.firstname} ${msg.User.lastname}` : 'Utilisateur';

      return `
            <div class="message ${messageClass}">
                ${!isSent ? `<div class="message-author">${author}</div>` : ''}
                <div class="message-content">${msg.content}</div>
                <div class="message-time">${formatDate(msg.createdAt)}</div>
            </div>
        `;
    })
    .join('');

  // Scroll vers le bas
  container.scrollTop = container.scrollHeight;
}

// Envoyer un message
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const content = document.getElementById('messageInput').value.trim();

  if (!content || !currentConversationId) return;

  try {
    const response = await fetch(API_ENDPOINTS.MESSAGE_CREATE, {
      method: 'POST',
      headers: TokenManager.getHeaders(),
      body: JSON.stringify({
        content,
        ConversationId: currentConversationId,
      }),
    });

    if (response.ok) {
      document.getElementById('messageInput').value = '';
      // Recharger la conversation
      await loadConversationDetails(currentConversationId);
    } else {
      alert("Erreur lors de l'envoi du message");
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur de connexion au serveur');
  }
});

// Rechercher des utilisateurs
document.getElementById('searchBtn').addEventListener('click', async () => {
  const username = document.getElementById('searchUsername').value.trim();

  if (!username) return;

  try {
    const response = await fetch(API_ENDPOINTS.USER_SEARCH(username), {
      headers: TokenManager.getHeaders(),
    });

    if (response.ok) {
      const users = await response.json();
      displaySearchResults(users);
    } else {
      showAlert('newConv-alert-container', 'Erreur lors de la recherche');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('newConv-alert-container', 'Erreur de connexion au serveur');
  }
});

// Afficher les résultats de recherche
function displaySearchResults(users) {
  const container = document.getElementById('searchResults');

  if (users.length === 0) {
    container.innerHTML = '<p class="text-muted text-center p-3">Aucun utilisateur trouvé</p>';
    return;
  }

  container.innerHTML = users
    .map(
      (user) => `
        <a href="#" class="list-group-item list-group-item-action" data-user-id="${user.id}" data-user-username="${user.username}">
            <div class="d-flex w-100 justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${user.firstname} ${user.lastname}</h6>
                    <small class="text-muted">@${user.username}</small>
                </div>
                <i class="bi bi-plus-circle text-primary"></i>
            </div>
        </a>
    `,
    )
    .join('');

  // Ajouter les événements
  container.querySelectorAll('.list-group-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const userId = parseInt(item.dataset.userId);
      const username = item.dataset.userUsername;
      addSelectedUser(userId, username);
    });
  });
}

// Ajouter un utilisateur sélectionné
function addSelectedUser(userId, username) {
  if (!selectedUsers.find((u) => u.id === userId)) {
    selectedUsers.push({ id: userId, username });
    displaySelectedUsers();
  }
}

// Afficher les utilisateurs sélectionnés
function displaySelectedUsers() {
  const container = document.getElementById('selectedUsersList');
  const createBtn = document.getElementById('createConversationBtn');

  if (selectedUsers.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucun utilisateur sélectionné</p>';
    createBtn.disabled = true;
    return;
  }

  container.innerHTML = selectedUsers
    .map(
      (user) => `
        <span class="selected-user-badge">
            ${user.username}
            <span class="remove-user" data-user-id="${user.id}">&times;</span>
        </span>
    `,
    )
    .join('');

  createBtn.disabled = false;

  // Événements pour retirer un utilisateur
  container.querySelectorAll('.remove-user').forEach((btn) => {
    btn.addEventListener('click', () => {
      const userId = parseInt(btn.dataset.userId);
      selectedUsers = selectedUsers.filter((u) => u.id !== userId);
      displaySelectedUsers();
    });
  });
}

// Créer une conversation
document.getElementById('createConversationBtn').addEventListener('click', async () => {
  if (selectedUsers.length === 0) return;

  try {
    const response = await fetch(API_ENDPOINTS.CONVERSATION_CREATE, {
      method: 'POST',
      headers: TokenManager.getHeaders(),
      body: JSON.stringify({
        userIds: selectedUsers.map((u) => u.id),
      }),
    });

    if (response.ok) {
      const newConversation = await response.json();

      // Réinitialiser le formulaire
      selectedUsers = [];
      document.getElementById('searchUsername').value = '';
      document.getElementById('searchResults').innerHTML = '';
      displaySelectedUsers();

      // Fermer le modal
      bootstrap.Modal.getInstance(document.getElementById('newConversationModal')).hide();

      // Recharger les conversations
      await loadConversations();

      // Sélectionner la nouvelle conversation
      selectConversation(newConversation.id || newConversation.conversation?.id);
    } else {
      showAlert('newConv-alert-container', 'Erreur lors de la création de la conversation');
    }
  } catch (error) {
    console.error('Erreur:', error);
    showAlert('newConv-alert-container', 'Erreur de connexion au serveur');
  }
});

// Charger les conversations au démarrage
loadConversations();

// Rafraîchir les messages toutes les 5 secondes si une conversation est ouverte
setInterval(() => {
  if (currentConversationId) {
    loadConversationDetails(currentConversationId);
  }
}, 5000);
