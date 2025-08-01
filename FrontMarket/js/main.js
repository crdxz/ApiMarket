// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Elementos del DOM
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardBtn = document.getElementById('dashboardBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const allCategoriesBtn = document.getElementById('allCategoriesBtn');
const categoryButtons = document.getElementById('categoryButtons');
const productsGrid = document.getElementById('productsGrid');
const loadingProducts = document.getElementById('loadingProducts');
const noProducts = document.getElementById('noProducts');
const noSearchResults = document.getElementById('noSearchResults');
const searchInput = document.getElementById('searchInput');

// Variables globales
let categories = [];
let currentCategoryId = null;
let allProducts = [];
let filteredProducts = [];
let currentUser = null;

// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const userData = localStorage.getItem('user');

  if (isLoggedIn !== 'true' || !userData) {
    window.location.href = 'loginPage.html';
    return;
  }

  try {
    currentUser = JSON.parse(userData);

    // Solo redirigir si es SOLO vendedor (no "both")
    if (currentUser.user_type === 'seller') {
      window.location.href = 'dashboardSellerPage.html';
      return;
    }

    userName.textContent = currentUser.name || 'Usuario';
    userEmail.textContent = currentUser.email || 'usuario@example.com';
    
    // Mostrar botón de dashboard para usuarios "both"
    if (currentUser.user_type === 'both') {
      dashboardBtn.classList.remove('hidden');
    }
    
    // Actualizar el avatar del usuario con la primera letra del nombre
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar && currentUser.name) {
      userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    }
  } catch (error) {
    console.error('Error al cargar datos del usuario:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'loginPage.html';
  }

  loadCategories();
  loadProducts();
});

// Cargar categorías
async function loadCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    const data = await response.json();

    if (response.ok) {
      categories = data.categories;
      renderCategoryButtons();
    } else {
      console.error('Error al cargar categorías:', data.error);
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
  }
}

function renderCategoryButtons() {
  categoryButtons.innerHTML = '';

  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = 'category-btn';
    button.textContent = category.name;
    button.dataset.categoryId = category.id;

    button.addEventListener('click', function () {
      filterByCategory(category.id);
    });

    categoryButtons.appendChild(button);
  });
}

// Cargar productos
async function loadProducts(categoryId = null) {
  try {
    showLoading(true);
    let url = `${API_BASE_URL}/products/`;
    if (categoryId) {
      url += `?category_id=${categoryId}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
      // Cargar imágenes para cada producto
      const productsWithImages = await Promise.all(data.products.map(async (product) => {
        try {
          const imagesResponse = await fetch(`${API_BASE_URL}/product-images/product/${product.id}`);
          if (imagesResponse.ok) {
            const imagesData = await imagesResponse.json();
            if (imagesData.images && imagesData.images.length > 0) {
              product.image_url = imagesData.images[0].full_image_url || imagesData.images[0].image_url;
            }
          }
        } catch (error) {
          console.error('Error al cargar imágenes del producto:', error);
        }
        return product;
      }));
      
      allProducts = productsWithImages;
      applySearchFilter();
    } else {
      console.error('Error al cargar productos:', data.error);
      showNoProducts();
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    showNoProducts();
  } finally {
    showLoading(false);
  }
}

function renderProducts(products) {
  productsGrid.innerHTML = '';

  if (products.length === 0) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm !== '') {
      showNoSearchResults(searchTerm);
    } else {
      showNoProducts();
    }
    return;
  }

  products.forEach(product => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);
  });

  noProducts.classList.add('hidden');
  noSearchResults.classList.add('hidden');
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const defaultImage = 'https://via.placeholder.com/300x200/CCCCCC/666666?text=Producto';
  const productImage = product.image_url || defaultImage;

  card.innerHTML = `
    <div class="product-image" style="background-image: url('${productImage}')"></div>
    <div class="product-info">
      <span class="product-category">${product.category_name || 'Sin categoría'}</span>
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">$${product.price.toFixed(2)}</p>
      <p class="product-seller">Vendedor: ${product.seller_name || 'Anónimo'}</p>
      <p class="product-stock">Stock: ${product.stock}</p>
    </div>
  `;

  card.addEventListener('click', function () {
    window.location.href = `productPage.html?id=${product.id}`;
  });

  return card;
}

function filterByCategory(categoryId) {
  currentCategoryId = categoryId;
  updateCategoryButtonStyles(categoryId);
  loadProducts(categoryId);
}

function updateCategoryButtonStyles(selectedCategoryId) {
  // Remover clase active de todos los botones
  allCategoriesBtn.classList.remove('active');

  const categoryBtns = categoryButtons.querySelectorAll('button');
  categoryBtns.forEach(btn => {
    btn.classList.remove('active');
  });

  // Agregar clase active al botón seleccionado
  if (selectedCategoryId) {
    const selectedBtn = categoryButtons.querySelector(`[data-category-id="${selectedCategoryId}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('active');
    }
  } else {
    allCategoriesBtn.classList.add('active');
  }
}

function showLoading(show) {
  if (show) {
    loadingProducts.classList.remove('hidden');
    noProducts.classList.add('hidden');
    noSearchResults.classList.add('hidden');
  } else {
    loadingProducts.classList.add('hidden');
  }
}

function applySearchFilter() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  if (searchTerm === '') {
    filteredProducts = allProducts;
  } else {
    filteredProducts = allProducts.filter(product =>
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  renderProducts(filteredProducts);
}

let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applySearchFilter();
  }, 300);
}

function showNoProducts() {
  noProducts.classList.remove('hidden');
  noSearchResults.classList.add('hidden');
  productsGrid.innerHTML = '';
}

function showNoSearchResults() {
  noSearchResults.classList.remove('hidden');
  noProducts.classList.add('hidden');
  productsGrid.innerHTML = '';
}

// Event Listeners
allCategoriesBtn.addEventListener('click', function () {
  currentCategoryId = null;
  updateCategoryButtonStyles(null);
  loadProducts();
});

searchInput.addEventListener('input', handleSearch);

// Funcionalidad del menú de usuario
userMenuBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  userMenu.classList.toggle('show');
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function (e) {
  if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
    userMenu.classList.remove('show');
  }
});

// Botón de dashboard para usuarios "both"
dashboardBtn.addEventListener('click', function () {
  if (currentUser && currentUser.user_type === 'both') {
    window.location.href = 'dashboardSellerPage.html';
  }
});

logoutBtn.addEventListener('click', function () {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'loginPage.html';
  }
});

// Prevenir que el clic en el menú lo cierre
userMenu.addEventListener('click', function (e) {
  e.stopPropagation();
});
