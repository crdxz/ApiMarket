const API_BASE_URL = 'http://localhost:5000/api';

const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const loginButtonSpinner = document.getElementById('loginButtonSpinner');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

// Register modal elements
const registerModal = document.getElementById('registerModal');
const openRegisterModal = document.getElementById('openRegisterModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const cancelRegister = document.getElementById('cancelRegister');
const registerForm = document.getElementById('registerForm');
const registerButton = document.getElementById('registerButton');
const registerButtonText = document.getElementById('registerButtonText');
const registerButtonSpinner = document.getElementById('registerButtonSpinner');

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

function setRegisterLoading(loading) {
  if (loading) {
    registerButton.disabled = true;
    registerButtonText.style.display = 'none';
    registerButtonSpinner.classList.remove('hidden');
  } else {
    registerButton.disabled = false;
    registerButtonText.style.display = 'inline';
    registerButtonSpinner.classList.add('hidden');
  }
}

// Register modal functions
function openRegisterModalFunc() {
  registerModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeRegisterModalFunc() {
  registerModal.style.display = 'none';
  document.body.style.overflow = '';
  registerForm.reset();
}

async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (response.ok) {
      // Registration successful
      alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.');
      closeRegisterModalFunc();
      
      // Auto-fill login form with new credentials
      document.getElementById('email-address').value = userData.email;
      document.getElementById('password').value = userData.password;
    } else {
      throw new Error(data.error || 'Error al crear la cuenta');
    }
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
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

      // Redirect based on user type
      if (data.user.user_type === 'seller') {
        window.location.href = 'dashboardSellerPage.html';
      } else if (data.user.user_type === 'both') {
        // For users who are both buyer and seller, redirect to main page
        // They can access seller dashboard from there
        window.location.href = 'mainPage.html';
      } else {
        // Default for buyers
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

// Event listeners
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

// Register modal event listeners
openRegisterModal.addEventListener('click', function(e) {
  e.preventDefault();
  openRegisterModalFunc();
});

closeRegisterModal.addEventListener('click', closeRegisterModalFunc);
cancelRegister.addEventListener('click', closeRegisterModalFunc);

// Close modal when clicking outside
registerModal.addEventListener('click', function(e) {
  if (e.target === registerModal) {
    closeRegisterModalFunc();
  }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const phone = document.getElementById('registerPhone').value.trim();
  const address = document.getElementById('registerAddress').value.trim();
  const userType = document.querySelector('input[name="userType"]:checked');

  if (!name || !email || !password || !userType) {
    showErrorModal('Por favor, completa todos los campos obligatorios.');
    return;
  }

  if (password.length < 6) {
    showErrorModal('La contraseña debe tener al menos 6 caracteres.');
    return;
  }

  setRegisterLoading(true);

  try {
    const userData = {
      name: name,
      email: email,
      password: password,
      phone: phone,
      address: address,
      user_type: userType.value
    };

    await registerUser(userData);
  } catch (error) {
    showErrorModal(error.message || 'Error al crear la cuenta.');
  } finally {
    setRegisterLoading(false);
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
