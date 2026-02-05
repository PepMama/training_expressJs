// Vérifier l'authentification au chargement
checkAuth();

// Gestion du formulaire de connexion
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.token) {
      TokenManager.set(data.token);
      UserManager.set(data.user);
      showAlert('alert-container', 'Connexion réussie !', 'success');
      setTimeout(() => {
        window.location.href = 'chat.html';
      }, 1000);
    } else {
      showAlert('alert-container', data.message || 'Erreur de connexion');
    }
  } catch (error) {
    showAlert('alert-container', 'Erreur de connexion au serveur');
    console.error('Erreur:', error);
  }
});

// Gestion du formulaire d'inscription
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstname = document.getElementById('signupFirstname').value;
  const lastname = document.getElementById('signupLastname').value;
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(API_ENDPOINTS.SIGNIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(
        'signup-alert-container',
        'Inscription réussie ! Vous pouvez maintenant vous connecter.',
        'success',
      );
      setTimeout(() => {
        bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
        document.getElementById('signupForm').reset();
        document.getElementById('loginUsername').value = username;
      }, 2000);
    } else {
      showAlert('signup-alert-container', data.message || "Erreur lors de l'inscription");
    }
  } catch (error) {
    showAlert('signup-alert-container', 'Erreur de connexion au serveur');
    console.error('Erreur:', error);
  }
});
