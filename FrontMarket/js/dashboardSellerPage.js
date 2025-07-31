// Configuración de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Elementos del DOM
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');
const logoutBtn = document.getElementById('logoutBtn');
const mainPageBtn = document.getElementById('mainPageBtn');
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

// Botón de main page para usuarios "both"
mainPageBtn.addEventListener('click', function() {
    window.location.href = 'mainPage.html';
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
        
        // Verificar si el usuario es vendedor o both
        if (user.user_type !== 'seller' && user.user_type !== 'both') {
            window.location.href = 'mainPage.html';
            return;
        }
        
        userName.textContent = user.name || 'Usuario';
        userEmail.textContent = user.email || 'usuario@example.com';
        
        // Mostrar botón de main page para usuarios "both"
        if (user.user_type === 'both') {
            mainPageBtn.classList.remove('hidden');
        }
        
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
    
    // Configurar pestañas y cargar mensajes
    setupTabs();
    loadMessages();
});

// Funcionalidad de pestañas
function setupTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todas las pestañas
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Agregar clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const targetTab = this.getAttribute('data-tab');
            const targetPane = document.getElementById(`${targetTab}-tab`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
            
            // Si es la pestaña de mensajes, cargar mensajes
            if (targetTab === 'messages') {
                loadMessages();
            }
        });
    });
}

// Función para cargar mensajes del vendedor
async function loadMessages() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.user_type !== 'seller') {
            console.error('Usuario no es vendedor o no está logueado');
            return;
        }

        // Obtener solicitudes de compra donde el vendedor es el receptor
        const response = await fetch(`${API_BASE_URL}/purchase-requests/`);
        const data = await response.json();

        if (response.ok) {
            // Filtrar solicitudes que pertenecen a productos del vendedor
            const sellerRequests = data.purchase_requests.filter(request => {
                // Aquí necesitarías verificar si el producto pertenece al vendedor
                // Por ahora, asumimos que todas las solicitudes son para este vendedor
                return true;
            });

            // Obtener mensajes para cada solicitud
            const messagesWithDetails = [];
            for (const request of sellerRequests) {
                const messagesResponse = await fetch(`${API_BASE_URL}/messages/${request.id}`);
                if (messagesResponse.ok) {
                    const messagesData = await messagesResponse.json();
                    if (messagesData.messages && messagesData.messages.length > 0) {
                        // Obtener información del comprador y producto
                        const buyerResponse = await fetch(`${API_BASE_URL}/users/${request.buyer_id}`);
                        const productResponse = await fetch(`${API_BASE_URL}/products/${request.product_id}`);
                        
                        if (buyerResponse.ok && productResponse.ok) {
                            const buyerData = await buyerResponse.json();
                            const productData = await productResponse.json();
                            
                            messagesData.messages.forEach(message => {
                                if (message.receiver_id === user.id) {
                                    messagesWithDetails.push({
                                        ...message,
                                        buyer: buyerData,
                                        product: productData,
                                        purchase_request: request
                                    });
                                }
                            });
                        }
                    }
                }
            }

            displayMessages(messagesWithDetails);
        } else {
            console.error('Error al cargar solicitudes de compra:', data.error);
        }
    } catch (error) {
        console.error('Error al cargar mensajes:', error);
    }
}

// Función para mostrar mensajes
function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    const messagesCount = document.getElementById('messagesCount');
    
    messagesCount.textContent = messages.length;
    
    if (!messages || messages.length === 0) {
        messagesList.innerHTML = `
            <div class="no-messages">
                <svg class="no-messages-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p>No hay mensajes nuevos</p>
            </div>
        `;
        return;
    }

    messagesList.innerHTML = messages.map(message => `
        <div class="message-item">
            <div class="message-header">
                <div class="message-sender">
                    <div class="sender-avatar">${message.buyer?.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <div class="sender-info">
                        <div class="sender-name">${message.buyer?.name || 'Comprador'}</div>
                        <div class="sender-contact">${message.buyer?.email || 'Sin contacto'}</div>
                    </div>
                </div>
                <div class="message-timestamp">${formatDate(message.timestamp)}</div>
            </div>
            
            <div class="message-content">
                <div class="message-text">${message.message}</div>
            </div>
            
            <div class="message-product">
                <a href="productPage.html?id=${message.product?.id}" class="product-link">
                    <div class="product-thumbnail" style="background-image: url('https://via.placeholder.com/60x60/3b82f6/ffffff?text=${message.product?.title?.charAt(0).toUpperCase()}')"></div>
                    <div class="product-details">
                        <div class="product-name">${message.product?.title || 'Producto'}</div>
                        <div class="product-price">$${message.product?.price?.toFixed(2) || '0.00'}</div>
                    </div>
                </a>
            </div>
            
            <div class="message-actions">
                <button class="message-action-btn reply-btn" onclick="replyToMessage(${message.id}, '${message.buyer?.email}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                    </svg>
                    Responder
                </button>
                <button class="message-action-btn contact-btn" onclick="contactBuyer('${message.buyer?.email}')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Contactar
                </button>
            </div>
        </div>
    `).join('');
}

// Función para responder a un mensaje
function replyToMessage(messageId, buyerEmail) {
    const subject = 'Respuesta a tu consulta de compra';
    const body = 'Hola, gracias por tu interés en mi producto. Te respondo a continuación:';
    
    window.open(`mailto:${buyerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

// Función para contactar al comprador
function contactBuyer(buyerEmail) {
    window.open(`mailto:${buyerEmail}`, '_blank');
} 