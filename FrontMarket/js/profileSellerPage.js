// Configuración específica para profileSellerPage
const PROFILE_API_BASE_URL = 'http://localhost:5000/api';

// Variables globales específicas del perfil
let profileSellerData = null;
let profileSellerProducts = [];
let profileCurrentTab = 'listings';

// Función para obtener elementos del DOM de forma segura
function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Elemento con ID '${id}' no encontrado`);
  }
  return element;
}

// Configurar funcionalidades del header
function setupHeaderFunctionality() {
  console.log('ProfileSellerPage: Configurando funcionalidades del header');
  
  // Elementos del header
  const userMenuBtn = getElement('userMenuBtn');
  const userMenu = getElement('userMenu');
  const logoutBtn = getElement('logoutBtn');
  const dashboardBtn = getElement('dashboardBtn');
  const userName = getElement('userName');
  const userEmail = getElement('userEmail');
  const userAvatar = getElement('userAvatar');
  const searchInput = getElement('searchInput');
  
  console.log('ProfileSellerPage: Elementos del header encontrados:', {
    userMenuBtn: !!userMenuBtn,
    userMenu: !!userMenu,
    logoutBtn: !!logoutBtn,
    dashboardBtn: !!dashboardBtn,
    userName: !!userName,
    userEmail: !!userEmail,
    userAvatar: !!userAvatar,
    searchInput: !!searchInput
  });
  
  // Configurar menú de usuario
  if (userMenuBtn && userMenu) {
    console.log('ProfileSellerPage: Configurando menú de usuario');
    userMenuBtn.addEventListener('click', function() {
      console.log('ProfileSellerPage: Click en menú de usuario');
      userMenu.classList.toggle('show');
      console.log('ProfileSellerPage: Clase show:', userMenu.classList.contains('show'));
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(event) {
      if (!userMenuBtn.contains(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.remove('show');
      }
    });
  } else {
    console.error('ProfileSellerPage: No se encontraron elementos del menú de usuario');
  }
  
  // Configurar logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      window.location.href = 'loginPage.html';
    });
  }
  
  // Configurar dashboard button
  if (dashboardBtn) {
    dashboardBtn.addEventListener('click', function() {
      window.location.href = 'dashboardSellerPage.html';
    });
  }
  
  // Configurar búsqueda
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
          window.location.href = `mainPage.html?search=${encodeURIComponent(searchTerm)}`;
        }
      }
    });
  }
  
  // Actualizar información del usuario en el header
  updateHeaderUserInfo();
}

// Actualizar información del usuario en el header
function updateHeaderUserInfo() {
  const userData = localStorage.getItem('user');
  if (!userData) return;
  
  try {
    const user = JSON.parse(userData);
    
    // Actualizar nombre de usuario
    const userName = getElement('userName');
    if (userName) {
      userName.textContent = user.name || 'Usuario';
    }
    
    // Actualizar email
    const userEmail = getElement('userEmail');
    if (userEmail) {
      userEmail.textContent = user.email || 'usuario@example.com';
    }
    
    // Actualizar avatar
    const userAvatar = getElement('userAvatar');
    if (userAvatar && user.name) {
      userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
    
    // Mostrar botón de dashboard para usuarios "both"
    const dashboardBtn = getElement('dashboardBtn');
    if (dashboardBtn && (user.user_type === 'both' || user.user_type === 'seller')) {
      dashboardBtn.classList.remove('hidden');
    }
    
  } catch (error) {
    console.error('ProfileSellerPage: Error al actualizar información del usuario:', error);
  }
}

// Esperar a que main.js termine de cargar antes de inicializar
function initializeProfilePage() {
  console.log('ProfileSellerPage: Inicializando página de perfil');
  
  // Configurar funcionalidades del header
  setupHeaderFunctionality();
  
  // Simular datos de usuario para pruebas si no hay datos reales
  if (!localStorage.getItem('user')) {
    const testUser = {
      id: 1,
      name: 'Usuario de Prueba',
      email: 'usuario@test.com',
      user_type: 'seller'
    };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(testUser));
  }
  
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userData = localStorage.getItem('user');

  console.log('ProfileSellerPage: isLoggedIn:', isLoggedIn);
  console.log('ProfileSellerPage: userData:', userData);

  if (isLoggedIn !== 'true' || !userData) {
    console.log('ProfileSellerPage: Usuario no logueado, redirigiendo a login');
    window.location.href = 'loginPage.html';
    return;
  }

  try {
    const user = JSON.parse(userData);
    console.log('ProfileSellerPage: Usuario parseado:', user);
    
    // Obtener el ID del vendedor de la URL o usar el usuario logueado
    const urlParams = new URLSearchParams(window.location.search);
    const sellerId = urlParams.get('id') || user.id;
    console.log('ProfileSellerPage: Seller ID:', sellerId);
    
    console.log('ProfileSellerPage: Iniciando carga del perfil del vendedor');
    loadProfileSellerProfile(sellerId);
    setupProfileEventListeners();
  } catch (error) {
    console.error('ProfileSellerPage: Error al cargar datos del usuario:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'loginPage.html';
  }
}

// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('ProfileSellerPage: DOMContentLoaded ejecutado');
  
  // Esperar un poco para que main.js se inicialice
  setTimeout(() => {
    initializeProfilePage();
  }, 100);
});

async function loadProfileSellerProfile(sellerId) {
  try {
    console.log('ProfileSellerPage: Cargando perfil del vendedor con ID:', sellerId);
    showProfileLoading(true);
    
    // Intentar cargar datos reales de la API
    console.log('ProfileSellerPage: Intentando conectar con la API...');
    const sellerResponse = await fetch(`${PROFILE_API_BASE_URL}/users/${sellerId}`);
    console.log('ProfileSellerPage: Respuesta de la API:', sellerResponse.status);
    
    if (sellerResponse.ok) {
      const sellerData = await sellerResponse.json();
      console.log('ProfileSellerPage: Datos del vendedor de la API:', sellerData);
      
      renderProfileSellerProfile(sellerData);
      
      // Cargar productos del vendedor
      await loadProfileSellerProducts(sellerId);
      
      // Mostrar el contenido del perfil
      const profileContent = getElement('profileContent');
      if (profileContent) {
        profileContent.classList.remove('hidden');
      }
    } else {
      console.error('ProfileSellerPage: Error en la respuesta de la API:', sellerResponse.status);
      throw new Error(`Error ${sellerResponse.status}: ${sellerResponse.statusText}`);
    }
    
  } catch (error) {
    console.error('ProfileSellerPage: Error al conectar con la API:', error);
    console.log('ProfileSellerPage: Usando datos de prueba debido a error de conexión');
    
    // Usar datos de prueba como fallback
    const testSeller = {
      id: sellerId,
      name: 'Vendedor de Prueba',
      email: 'vendedor@test.com',
      created_at: '2023-01-01T00:00:00Z',
      phone: '123-456-7890',
      address: 'Dirección de prueba',
      description: 'Este es un vendedor de prueba con productos de calidad.'
    };
    
    renderProfileSellerProfile(testSeller);
    
    // Cargar productos de prueba
    await loadProfileSellerProducts(sellerId);
    
    // Mostrar el contenido del perfil
    const profileContent = getElement('profileContent');
    if (profileContent) {
      profileContent.classList.remove('hidden');
    }
  } finally {
    showProfileLoading(false);
  }
}

function renderProfileSellerProfile(seller) {
  console.log('ProfileSellerPage: Renderizando perfil del vendedor:', seller);
  profileSellerData = seller;
  
  // Renderizar información del vendedor
  const profileName = getElement('profileName');
  const profileDetails = getElement('profileDetails');
  const profileAvatar = getElement('profileAvatar');
  
  if (profileName) {
    profileName.textContent = seller.name || 'Vendedor';
  }
  
  if (profileDetails) {
    profileDetails.textContent = `Miembro desde ${new Date(seller.created_at).getFullYear()}`;
  }
  
  // Configurar avatar
  if (profileAvatar) {
    if (seller.name) {
      profileAvatar.textContent = seller.name.charAt(0).toUpperCase();
    } else {
      profileAvatar.textContent = 'V';
    }
  }
  
  // Renderizar estadísticas (se actualizarán cuando se carguen los productos)
  renderProfileStats();
  console.log('ProfileSellerPage: Perfil renderizado correctamente');
}

function renderProfileStats() {
  const profileStats = getElement('profileStats');
  if (!profileStats) return;
  
  console.log('ProfileSellerPage: Actualizando estadísticas con', profileSellerProducts.length, 'productos');
  
  profileStats.innerHTML = `
    <div class="stat-item">
      <span class="stat-number">${profileSellerProducts.length}</span>
      <span class="stat-label">Productos</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">5</span>
      <span class="stat-label">Calificación</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">100%</span>
      <span class="stat-label">Satisfacción</span>
    </div>
  `;
}

async function loadProfileSellerProducts(sellerId) {
  try {
    console.log('ProfileSellerPage: Cargando productos del vendedor con ID:', sellerId);
    
         // Intentar cargar productos reales de la API usando la ruta específica
     const response = await fetch(`${PROFILE_API_BASE_URL}/products/seller/${sellerId}`);
    console.log('ProfileSellerPage: Respuesta de productos:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('ProfileSellerPage: Datos de productos de la API:', data);
      
             if (data.products && data.products.length > 0) {
         // La API ya filtra por vendedor, usar directamente
         const sellerProducts = data.products;
         console.log('ProfileSellerPage: Productos del vendedor:', sellerProducts.length);
        
                 // Cargar imágenes para cada producto
         const productsWithImages = await Promise.all(sellerProducts.map(async (product) => {
           try {
             const imagesResponse = await fetch(`${PROFILE_API_BASE_URL}/product-images/product/${product.id}`);
             if (imagesResponse.ok) {
               const imagesData = await imagesResponse.json();
               if (imagesData.images && imagesData.images.length > 0) {
                 product.image_url = imagesData.images[0].full_image_url || imagesData.images[0].image_url;
               }
             }
           } catch (error) {
             console.error('ProfileSellerPage: Error al cargar imágenes del producto:', error);
           }
           
                       // La API ya incluye category_name, no necesitamos procesar nada
            if (!product.category_name) {
              product.category_name = 'Sin categoría';
            }
            
            console.log('ProfileSellerPage: Producto procesado:', {
              id: product.id,
              title: product.title,
              category_name: product.category_name
            });
           
           return product;
         }));
        
        profileSellerProducts = productsWithImages;
        console.log('ProfileSellerPage: Productos cargados de la API:', profileSellerProducts);
        renderProfileProducts();
        renderProfileStats(); // Actualizar estadísticas después de cargar productos
      } else {
        console.log('ProfileSellerPage: No hay productos en la API, usando datos de prueba');
        throw new Error('No hay productos disponibles');
      }
    } else {
      console.error('ProfileSellerPage: Error al cargar productos de la API:', response.status);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('ProfileSellerPage: Error al cargar productos:', error);
    console.log('ProfileSellerPage: Usando productos de prueba');
    
         // Usar productos de prueba como fallback
     const testProducts = [
       {
         id: 1,
         title: 'iPhone 13 Pro',
         price: 999.99,
         stock: 5,
         seller_id: sellerId, // Asociar al vendedor específico
         category_name: 'Electrónicos',
         image_url: 'https://via.placeholder.com/300x200/007AFF/FFFFFF?text=iPhone+13+Pro'
       },
       {
         id: 2,
         title: 'MacBook Air M1',
         price: 1299.99,
         stock: 3,
         seller_id: sellerId, // Asociar al vendedor específico
         category_name: 'Computadoras',
         image_url: 'https://via.placeholder.com/300x200/34C759/FFFFFF?text=MacBook+Air'
       },
       {
         id: 3,
         title: 'AirPods Pro',
         price: 249.99,
         stock: 10,
         seller_id: sellerId, // Asociar al vendedor específico
         category_name: 'Audio',
         image_url: 'https://via.placeholder.com/300x200/FF9500/FFFFFF?text=AirPods+Pro'
       },
       {
         id: 4,
         title: 'iPad Air',
         price: 599.99,
         stock: 8,
         seller_id: sellerId, // Asociar al vendedor específico
         category_name: 'Tablets',
         image_url: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=iPad+Air'
       },
       {
         id: 5,
         title: 'Apple Watch Series 7',
         price: 399.99,
         stock: 12,
         seller_id: sellerId, // Asociar al vendedor específico
         category_name: 'Smartwatches',
         image_url: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Apple+Watch'
       }
     ];
    
    profileSellerProducts = testProducts;
    console.log('ProfileSellerPage: Productos de prueba cargados:', profileSellerProducts);
    renderProfileProducts();
    renderProfileStats(); // Actualizar estadísticas después de cargar productos
  }
}

function renderProfileProducts() {
  const productsGrid = getElement('productsGrid');
  const emptyState = getElement('emptyState');
  
  if (!productsGrid) return;
  
  if (profileSellerProducts.length === 0) {
    showProfileEmptyState();
    return;
  }
  
  productsGrid.innerHTML = '';
  
  profileSellerProducts.forEach(product => {
    const productCard = createProfileProductCard(product);
    productsGrid.appendChild(productCard);
  });
  
  if (emptyState) {
    emptyState.classList.add('hidden');
  }
}

function createProfileProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  const defaultImage = 'https://via.placeholder.com/300x200/CCCCCC/666666?text=Producto';
  const productImage = product.image_url || defaultImage;
  
  // Verificar si el usuario está viendo su propio perfil
  const urlParams = new URLSearchParams(window.location.search);
  const sellerId = urlParams.get('id');
  const userData = JSON.parse(localStorage.getItem('user'));
  const isOwnProfile = !sellerId || sellerId == userData.id;
  const canEdit = isOwnProfile && (userData.user_type === 'seller' || userData.user_type === 'both');
  
     // Usar la misma lógica que main.js para las categorías
   const categoryName = product.category_name || 'Sin categoría';
   
   console.log('ProfileSellerPage: Creando tarjeta con categoría:', {
     productId: product.id,
     productTitle: product.title,
     categoryName: categoryName
   });
  
  const actionsHtml = canEdit ? `
    <div class="product-actions">
      <button class="btn-edit" onclick="editProfileProduct(${product.id})">Editar</button>
      <button class="btn-remove" onclick="removeProfileProduct(${product.id})">Eliminar</button>
    </div>
  ` : '';
  
  card.innerHTML = `
    <div class="product-image" style="background-image: url('${productImage}')"></div>
    <div class="product-info">
      <span class="product-category">${categoryName}</span>
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">$${parseFloat(product.price).toFixed(2)}</p>
      <p class="product-status">Stock: ${product.stock}</p>
      ${actionsHtml}
    </div>
  `;
  
  // Agregar evento para ver el producto
  card.addEventListener('click', function(e) {
    if (!e.target.classList.contains('btn-edit') && !e.target.classList.contains('btn-remove')) {
      window.location.href = `productPage.html?id=${product.id}`;
    }
  });
  
  return card;
}

function showProfileLoading(show) {
  console.log('ProfileSellerPage: showLoading called with:', show);
  const loadingContainer = getElement('loadingContainer');
  const emptyState = getElement('emptyState');
  const profileContent = getElement('profileContent');
  
  if (show) {
    if (loadingContainer) loadingContainer.classList.remove('hidden');
    if (emptyState) emptyState.classList.add('hidden');
    if (profileContent) profileContent.classList.add('hidden');
  } else {
    if (loadingContainer) loadingContainer.classList.add('hidden');
  }
}

function showProfileEmptyState() {
  const emptyState = getElement('emptyState');
  const productsGrid = getElement('productsGrid');
  
  if (emptyState) emptyState.classList.remove('hidden');
  if (productsGrid) productsGrid.innerHTML = '';
}

function showProfileError(message) {
  console.error('ProfileSellerPage:', message);
  showProfileEmptyState();
}

function setupProfileEventListeners() {
  console.log('ProfileSellerPage: Configurando event listeners');
  
  // Verificar si el usuario está viendo su propio perfil
  const urlParams = new URLSearchParams(window.location.search);
  const sellerId = urlParams.get('id');
  const userData = JSON.parse(localStorage.getItem('user'));
  const isOwnProfile = !sellerId || sellerId == userData.id;
  
  // Configurar botones solo si es el perfil propio
  const addProductBtn = getElement('addProductBtn');
  if (addProductBtn) {
    if (isOwnProfile && (userData.user_type === 'seller' || userData.user_type === 'both')) {
      addProductBtn.style.display = 'inline-flex';
      addProductBtn.addEventListener('click', function() {
        window.location.href = 'dashboardSellerPage.html';
      });
    } else {
      addProductBtn.style.display = 'none';
    }
  }
  
  const editProfileBtn = getElement('editProfileBtn');
  if (editProfileBtn) {
    if (isOwnProfile && (userData.user_type === 'seller' || userData.user_type === 'both')) {
      editProfileBtn.style.display = 'inline-flex';
      editProfileBtn.addEventListener('click', function() {
        alert('Funcionalidad de edición de perfil en desarrollo');
      });
    } else {
      editProfileBtn.style.display = 'none';
    }
  }
  
  // Configurar tabs
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      switchProfileTab(tabName);
    });
  });
}

function switchProfileTab(tabName) {
  profileCurrentTab = tabName;
  
  // Actualizar botones de tab
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('active');
  }
  
  // Mostrar contenido correspondiente
  switch(tabName) {
    case 'listings':
      showProfileListingsTab();
      break;
    case 'reviews':
      showProfileReviewsTab();
      break;
    case 'about':
      showProfileAboutTab();
      break;
  }
}

function showProfileListingsTab() {
  const listingsContent = getElement('listingsContent');
  const reviewsContent = getElement('reviewsContent');
  const aboutContent = getElement('aboutContent');
  
  if (listingsContent) listingsContent.classList.remove('hidden');
  if (reviewsContent) reviewsContent.classList.add('hidden');
  if (aboutContent) aboutContent.classList.add('hidden');
}

function showProfileReviewsTab() {
  const listingsContent = getElement('listingsContent');
  const reviewsContent = getElement('reviewsContent');
  const aboutContent = getElement('aboutContent');
  
  if (listingsContent) listingsContent.classList.add('hidden');
  if (reviewsContent) reviewsContent.classList.remove('hidden');
  if (aboutContent) aboutContent.classList.add('hidden');
  
  // Cargar reseñas si no están cargadas
  if (reviewsContent && !reviewsContent.children.length) {
    loadProfileReviews();
  }
}

function showProfileAboutTab() {
  const listingsContent = getElement('listingsContent');
  const reviewsContent = getElement('reviewsContent');
  const aboutContent = getElement('aboutContent');
  
  if (listingsContent) listingsContent.classList.add('hidden');
  if (reviewsContent) reviewsContent.classList.add('hidden');
  if (aboutContent) aboutContent.classList.remove('hidden');
  
  // Cargar información "Acerca de" si no está cargada
  if (aboutContent && !aboutContent.children.length) {
    loadProfileAboutInfo();
  }
}

async function loadProfileReviews() {
  const reviewsContent = getElement('reviewsContent');
  if (!reviewsContent) return;
  
  reviewsContent.innerHTML = `
    <div class="empty-state">
      <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
      </svg>
      <p>No hay reseñas disponibles aún.</p>
    </div>
  `;
}

function loadProfileAboutInfo() {
  const aboutContent = getElement('aboutContent');
  if (!aboutContent) return;
  
  aboutContent.innerHTML = `
    <div class="profile-section">
      <h3 class="section-title">Acerca de ${profileSellerData?.name || 'este vendedor'}</h3>
      <p class="about-text">
        ${profileSellerData?.description || 'Este vendedor aún no ha agregado información sobre sí mismo.'}
      </p>
      
      <div class="contact-info">
        <h4>Información de contacto</h4>
        <p><strong>Email:</strong> ${profileSellerData?.email || 'No disponible'}</p>
        ${profileSellerData?.phone ? `<p><strong>Teléfono:</strong> ${profileSellerData.phone}</p>` : ''}
        ${profileSellerData?.address ? `<p><strong>Dirección:</strong> ${profileSellerData.address}</p>` : ''}
      </div>
    </div>
  `;
}

// Funciones para editar y eliminar productos (con prefijo para evitar conflictos)
function editProfileProduct(productId) {
  window.location.href = `dashboardSellerPage.html?edit=${productId}`;
}

async function removeProfileProduct(productId) {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    try {
      // Intentar eliminar de la API
      const response = await fetch(`${PROFILE_API_BASE_URL}/products/${productId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Recargar productos
        await loadProfileSellerProducts(profileSellerData.id);
        alert('Producto eliminado exitosamente');
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar el producto: ${errorData.error}`);
      }
    } catch (error) {
      console.error('ProfileSellerPage: Error al eliminar producto:', error);
      // Si falla la API, eliminar localmente
      profileSellerProducts = profileSellerProducts.filter(p => p.id !== productId);
      renderProfileProducts();
      alert('Producto eliminado localmente (error de conexión con la API)');
    }
  }
} 