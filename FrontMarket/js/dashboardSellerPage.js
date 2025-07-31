// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Elementos del DOM
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const productsTableBody = document.querySelector('tbody');

// Elementos del modal de edición
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEdit = document.getElementById('cancelEdit');
const editProductForm = document.getElementById('editProductForm');
const editProductId = document.getElementById('editProductId');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');
const editPrice = document.getElementById('editPrice');
const editStock = document.getElementById('editStock');
const editCategory = document.getElementById('editCategory');
const editIsActive = document.getElementById('editIsActive');

// Funcionalidad del menú de usuario
userMenuBtn.addEventListener('click', function() {
    userMenu.classList.toggle('show');
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', function(event) {
    if (!userMenuBtn.contains(event.target) && !userMenu.contains(event.target)) {
        userMenu.classList.remove('show');
    }
});

// Funcionalidad de logout
logoutBtn.addEventListener('click', function() {
    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    
    // Redirigir al login
    window.location.href = 'loginPage.html';
});

// Funcionalidad del modal de edición
closeEditModal.addEventListener('click', closeModal);
cancelEdit.addEventListener('click', closeModal);

// Cerrar modal al hacer clic fuera
editModal.addEventListener('click', function(event) {
    if (event.target === editModal) {
        closeModal();
    }
});

function closeModal() {
    editModal.classList.remove('show');
    editProductForm.reset();
}

// Cargar categorías para el formulario de edición
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/`);
        const data = await response.json();
        
        if (response.ok) {
            editCategory.innerHTML = '<option value="">Seleccionar categoría</option>';
            data.categories.forEach(category => {
                editCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
}

// Función para cargar los productos del vendedor
async function loadSellerProducts() {
    try {
        // Obtener información del usuario logueado
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.user_type !== 'seller') {
            console.error('Usuario no es vendedor o no está logueado');
            return;
        }

        // Obtener productos del vendedor
        const response = await fetch(`${API_BASE_URL}/products/seller/${user.id}`);
        const data = await response.json();

        if (response.ok) {
            displayProducts(data.products);
        } else {
            console.error('Error al cargar productos:', data.error);
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para mostrar los productos en la tabla
function displayProducts(products) {
    if (!products || products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                        <div class="empty-state-title">No tienes productos publicados</div>
                        <div class="empty-state-message">Comienza creando tu primer producto para vender en el marketplace.</div>
                        <button class="empty-state-button">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path clip-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" fill-rule="evenodd"></path>
                            </svg>
                            Crear mi primer producto
                        </button>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td>
                <div class="product-cell">
                    <div class="product-image" style="background-image: url('https://via.placeholder.com/60x60/3b82f6/ffffff?text=${product.title.charAt(0).toUpperCase()}')"></div>
                    <div class="product-info">
                        <div class="product-title">${product.title}</div>
                        <div class="product-date">Listado ${formatDate(product.created_at)}</div>
                    </div>
                </div>
            </td>
            <td class="price-cell">$${product.price.toFixed(2)}</td>
            <td>
                <span class="status-badge ${product.is_active ? 'status-active' : 'status-inactive'}">
                    ${product.is_active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td class="actions-cell">
                <a class="action-link edit-link" href="#" onclick="editProduct(${product.id})">Editar</a>
                <a class="action-link delete-link" href="#" onclick="deleteProduct(${product.id})">Eliminar</a>
            </td>
        </tr>
    `).join('');
}

// Función para formatear fechas
function formatDate(dateString) {
    if (!dateString) return 'recientemente';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hoy';
    if (diffDays === 2) return 'ayer';
    if (diffDays <= 7) return `hace ${diffDays} días`;
    if (diffDays <= 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    return `hace ${Math.floor(diffDays / 30)} meses`;
}

// Función para editar producto
async function editProduct(productId) {
    try {
        // Obtener datos del producto
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        
        if (response.ok) {
            // Llenar el formulario con los datos del producto
            editProductId.value = data.id;
            editTitle.value = data.title;
            editDescription.value = data.description;
            editPrice.value = data.price;
            editStock.value = data.stock;
            editCategory.value = data.category_id;
            editIsActive.checked = data.is_active;
            
            // Mostrar el modal
            editModal.classList.add('show');
        } else {
            alert('Error al cargar datos del producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al cargar producto:', error);
        alert('Error al cargar datos del producto');
    }
}

// Función para eliminar producto
async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Recargar productos
            loadSellerProducts();
            alert('Producto eliminado exitosamente');
        } else {
            const data = await response.json();
            alert('Error al eliminar producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto');
    }
}

// Manejar envío del formulario de edición
editProductForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const productId = editProductId.value;
    const formData = {
        title: editTitle.value,
        description: editDescription.value,
        price: parseFloat(editPrice.value),
        stock: parseInt(editStock.value),
        category_id: parseInt(editCategory.value),
        is_active: editIsActive.checked
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeModal();
            loadSellerProducts();
            alert('Producto actualizado exitosamente');
        } else {
            alert('Error al actualizar producto: ' + data.error);
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert('Error al actualizar producto');
    }
});

// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('user');
    
    if (isLoggedIn !== 'true' || !userData) {
        // Si no está logueado, redirigir al login
        window.location.href = 'loginPage.html';
        return;
    }
    
    // Cargar información del usuario
    try {
        const user = JSON.parse(userData);
        
        // Verificar si el usuario es vendedor
        if (user.user_type !== 'seller') {
            window.location.href = 'mainPage.html';
            return;
        }
        
        userName.textContent = user.name || 'Usuario';
        userEmail.textContent = user.email || 'usuario@example.com';
        
        // Actualizar avatar con iniciales del usuario
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar && user.name) {
            userAvatar.textContent = user.name.charAt(0).toUpperCase();
        }
    } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        // Si hay error en los datos, limpiar y redirigir al login
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'loginPage.html';
    }
    
    // Cargar categorías y productos del vendedor
    loadCategories();
    loadSellerProducts();
}); 