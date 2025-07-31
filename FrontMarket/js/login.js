const API_BASE_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const loginButtonSpinner = document.getElementById('loginButtonSpinner');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

function showErrorModal(message) {
  errorMessage.textContent = message;
  errorModal.style.display = 'block';
}

function closeErrorModal() {
  errorModal.style.display = 'none';
}

function setLoading(loading) {
  if (loading) {
    loginButton.disabled = true;
    loginButtonText.style.display = 'none';
    loginButtonSpinner.classList.remove('hidden');
  } else {
    loginButton.disabled = false;
    loginButtonText.style.display = 'inline';
    loginButtonSpinner.classList.add('hidden');
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('isLoggedIn', 'true');

      if (data.user.user_type === 'seller') {
        window.location.href = 'dashboardSellerPage.html';
      } else {
        window.location.href = 'mainPage.html';
      }
    } else {
      throw new Error(data.error || 'Error al iniciar sesión');
    }
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email-address').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    showErrorModal('Por favor, completa todos los campos.');
    return;
  }

  setLoading(true);

  try {
    await loginUser(email, password);
  } catch (error) {
    showErrorModal(error.message || 'Error al conectar con el servidor.');
  } finally {
    setLoading(false);
  }
});

window.onclick = function (event) {
  if (event.target === errorModal) {
    closeErrorModal();
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    window.location.href = 'mainPage.html';
  }
});
