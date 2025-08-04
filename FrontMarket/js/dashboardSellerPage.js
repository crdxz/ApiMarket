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
const createButton = document.querySelector('.create-button');

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

// Elementos del modal de creación
const createModal = document.getElementById('createModal');
const closeCreateModal = document.getElementById('closeCreateModal');
const cancelCreate = document.getElementById('cancelCreate');
const createProductForm = document.getElementById('createProductForm');
const createTitle = document.getElementById('createTitle');
const createDescription = document.getElementById('createDescription');
const createPrice = document.getElementById('createPrice');
const createStock = document.getElementById('createStock');
const createCategory = document.getElementById('createCategory');
const createIsActive = document.getElementById('createIsActive');

// Elementos del modal de crear categoría
const createCategoryModal = document.getElementById('createCategoryModal');
const closeCreateCategoryModal = document.getElementById('closeCreateCategoryModal');
const cancelCreateCategory = document.getElementById('cancelCreateCategory');
const createCategoryForm = document.getElementById('createCategoryForm');
const newCategoryName = document.getElementById('newCategoryName');
const newCategoryDescription = document.getElementById('newCategoryDescription');
const createNewCategoryBtn = document.getElementById('createNewCategoryBtn');

// Elementos para subida de imágenes
const createImage = document.getElementById('createImage');
const imagePreview = document.getElementById('imagePreview');
const editImage = document.getElementById('editImage');
const editImagePreview = document.getElementById('editImagePreview');

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

// Botón de crear nuevo producto
createButton.addEventListener('click', function() {
    createNewProduct();
});

// Funcionalidad del modal de edición
closeEditModal.addEventListener('click', closeEditModalFunc);
cancelEdit.addEventListener('click', closeEditModalFunc);

// Cerrar modal al hacer clic fuera
editModal.addEventListener('click', function(event) {
    if (event.target === editModal) {
        closeEditModalFunc();
    }
});

function closeEditModalFunc() {
    editModal.classList.remove('show');
    editProductForm.reset();
}

// Funcionalidad del modal de creación
closeCreateModal.addEventListener('click', closeCreateModalFunc);
cancelCreate.addEventListener('click', closeCreateModalFunc);

// Cerrar modal al hacer clic fuera
createModal.addEventListener('click', function(event) {
    if (event.target === createModal) {
        closeCreateModalFunc();
    }
});

function closeCreateModalFunc() {
    createModal.classList.remove('show');
    createProductForm.reset();
    removeImage(); // Limpiar también la imagen
}

// Funcionalidad del modal de crear categoría
closeCreateCategoryModal.addEventListener('click', closeCreateCategoryModalFunc);
cancelCreateCategory.addEventListener('click', closeCreateCategoryModalFunc);
createNewCategoryBtn.addEventListener('click', openCreateCategoryModal);

// Cerrar modal al hacer clic fuera
createCategoryModal.addEventListener('click', function(event) {
    if (event.target === createCategoryModal) {
        closeCreateCategoryModalFunc();
    }
});

function closeCreateCategoryModalFunc() {
    createCategoryModal.classList.remove('show');
    createCategoryForm.reset();
}

function openCreateCategoryModal() {
    createCategoryModal.classList.add('show');
    newCategoryName.focus();
}

// Funcionalidad para subida de imágenes
// Lógica compartida para previsualización (debe estar antes de setupImageUpload)
function handleImagePreview(e, previewElem, inputElem, removeFn) {
    const file = e.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('La imagen es demasiado grande. Máximo 5MB permitido.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" />
                <button type="button" class="remove-image" onclick="(${removeFn.name})()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
            previewElem.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
}

// Remover imagen en edición (debe estar antes de su uso)
function removeEditImage() {
    if (editImage) editImage.value = '';
    if (editImagePreview) {
        editImagePreview.innerHTML = `
            <svg class="image-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="image-placeholder-text">Haz clic para seleccionar una imagen</p>
        `;
        editImagePreview.classList.remove('has-image');
    }
}

function setupImageUpload() {
    // Crear producto: previsualización
    imagePreview.addEventListener('click', function() {
        createImage.click();
    });
    createImage.addEventListener('change', function(e) {
        handleImagePreview(e, imagePreview, createImage, removeImage);
    });

    // Editar producto: previsualización
    if (editImagePreview && editImage) {
        editImagePreview.addEventListener('click', function() {
            editImage.click();
        });
        editImage.addEventListener('change', function(e) {
            handleImagePreview(e, editImagePreview, editImage, removeEditImage);
        });
    }
}

// Función para remover imagen
function removeImage() {
// Remover imagen en edición
function removeEditImage() {
    if (editImage) editImage.value = '';
    if (editImagePreview) {
        editImagePreview.innerHTML = `
            <svg class="image-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p class="image-placeholder-text">Haz clic para seleccionar una imagen</p>
        `;
        editImagePreview.classList.remove('has-image');
    }
}

// Lógica compartida para previsualización
function handleImagePreview(e, previewElem, inputElem, removeFn) {
    const file = e.target.files[0];
    if (file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('La imagen es demasiado grande. Máximo 5MB permitido.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            previewElem.innerHTML = `
                <img src="${e.target.result}" alt="Preview" />
                <button type="button" class="remove-image" onclick="(${removeFn.name})()">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            `;
            previewElem.classList.add('has-image');
        };
        reader.readAsDataURL(file);
    }
}
    createImage.value = '';
    imagePreview.innerHTML = `
        <svg class="image-placeholder" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="image-placeholder-text">Haz clic para seleccionar una imagen</p>
    `;
    imagePreview.classList.remove('has-image');
}

// Cargar categorías para los formularios
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories/`);
        const data = await response.json();
        
        if (response.ok) {
            // Cargar categorías en el formulario de edición
            editCategory.innerHTML = '<option value="">Seleccionar categoría</option>';
            data.categories.forEach(category => {
                editCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
            });
            
            // Cargar categorías en el formulario de creación
            createCategory.innerHTML = '<option value="">Seleccionar categoría</option>';
            data.categories.forEach(category => {
                createCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
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
        if (!user || (user.user_type !== 'seller' && user.user_type !== 'both')) {
            console.error('Usuario no es vendedor o no está logueado');
            return;
        }

        // Mostrar estado de carga
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                </td>
            </tr>
        `;

        // Obtener productos del vendedor
        const response = await fetch(`${API_BASE_URL}/products/seller/${user.id}`);
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
            
            displayProducts(productsWithImages);
        } else {
            console.error('Error al cargar productos:', data.error);
            // Mostrar error en la tabla
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-state">
                            <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                            <div class="empty-state-title">Error al cargar productos</div>
                            <div class="empty-state-message">No se pudieron cargar los productos. Intenta recargar la página.</div>
                        </div>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        // Mostrar error en la tabla
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    <div class="empty-state">
                        <svg class="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <div class="empty-state-title">Error de conexión</div>
                        <div class="empty-state-message">No se pudo conectar con el servidor. Verifica tu conexión a internet.</div>
                    </div>
                </td>
            </tr>
        `;
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
                        <div class="empty-state-title">No has publicado ningún producto</div>
                        <div class="empty-state-message">Comienza creando tu primer producto para vender en el marketplace. Los productos que publiques aparecerán aquí.</div>
                        <button class="empty-state-button" onclick="createNewProduct()">
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
                    <div class="product-image" style="background-image: url('${product.image_url || `https://via.placeholder.com/60x60/3b82f6/ffffff?text=${product.title.charAt(0).toUpperCase()}`}')"></div>
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

            // Imagen actual (si existe)
            if (editImagePreview) {
                if (data.image_url) {
                    editImagePreview.innerHTML = `<img src="${data.image_url}" alt="Imagen actual" />`;
                    editImagePreview.classList.add('has-image');
                } else {
                    removeEditImage();
                }
            }

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
        // Actualizar datos del producto
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (response.ok) {
            // Si hay imagen nueva, subirla
            if (editImage && editImage.files && editImage.files[0]) {
                const imageFile = editImage.files[0];
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                imageFormData.append('product_id', productId);
                // Puedes agregar lógica para eliminar la imagen anterior si tu API lo soporta
                const imageResponse = await fetch(`${API_BASE_URL}/product-images/upload`, {
                    method: 'POST',
                    body: imageFormData
                });
                if (!imageResponse.ok) {
                    const imageError = await imageResponse.json();
                    console.warn('Error al subir imagen:', imageError);
                }
            }
            closeEditModalFunc();
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

// Manejar envío del formulario de creación
createProductForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Obtener el usuario logueado
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Debes iniciar sesión para crear productos');
        return;
    }
    
    // Verificar si hay imagen seleccionada
    const imageFile = createImage.files[0];
    
    try {
        // Primero crear el producto
        const productData = {
            title: createTitle.value,
            description: createDescription.value,
            price: parseFloat(createPrice.value),
            stock: parseInt(createStock.value),
            category_id: parseInt(createCategory.value),
            seller_id: user.id
        };
        
        const productResponse = await fetch(`${API_BASE_URL}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        const productResult = await productResponse.json();
        
        if (productResponse.ok) {
            // Si hay imagen, subirla
            if (imageFile) {
                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);
                imageFormData.append('product_id', productResult.product.id);
                
                const imageResponse = await fetch(`${API_BASE_URL}/product-images/upload`, {
                    method: 'POST',
                    body: imageFormData
                });
                
                if (!imageResponse.ok) {
                    const imageError = await imageResponse.json();
                    console.warn('Error al subir imagen:', imageError);
                    // No fallar la creación del producto si la imagen falla
                }
            }
            
            closeCreateModalFunc();
            loadSellerProducts();
            alert('Producto creado exitosamente');
        } else {
            alert('Error al crear producto: ' + productResult.error);
        }
    } catch (error) {
        console.error('Error al crear producto:', error);
        alert('Error al crear producto');
    }
});

// Manejar envío del formulario de crear categoría
createCategoryForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: newCategoryName.value.trim(),
        description: newCategoryDescription.value.trim()
    };
    
    // Validar que el nombre no esté vacío
    if (!formData.name) {
        alert('El nombre de la categoría es obligatorio');
        newCategoryName.focus();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/categories/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeCreateCategoryModalFunc();
            // Recargar categorías y actualizar el select
            await loadCategories();
            // Seleccionar la nueva categoría creada
            createCategory.value = data.category.id;
            alert('Categoría creada exitosamente');
        } else if (response.status === 409) {
            // Categoría ya existe
            alert(`Error: ${data.error}\n\n${data.details || ''}`);
        } else {
            alert(`Error al crear categoría: ${data.error || 'Error desconocido'}`);
        }
    } catch (error) {
        console.error('Error al crear categoría:', error);
        alert('Error de conexión al crear categoría');
    }
});

// Verificar si el usuario está logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  // --- Notificaciones de mensajes nuevos del día ---
  let todayNotifications = [];
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDot = document.getElementById('notificationDot');
  const notificationMenu = document.getElementById('notificationMenu');
  const notificationDropdownContent = document.getElementById('notificationDropdownContent');

  // Hook para mostrar notificaciones después de cargar mensajes
  const originalDisplayMessages = window.displayMessages;
  window.displayMessages = function(messages) {
    // Lógica original
    if (typeof originalDisplayMessages === 'function') {
      originalDisplayMessages(messages);
    }
    // Filtrar mensajes de hoy
    const today = new Date();
    today.setHours(0,0,0,0);
    todayNotifications = messages.filter(msg => {
      const msgDate = new Date(msg.timestamp);
      return msgDate >= today;
    });
    // Mostrar punto si hay mensajes nuevos hoy
    if (todayNotifications.length > 0) {
      notificationDot.style.display = 'block';
    } else {
      notificationDot.style.display = 'none';
    }
    // Renderizar menú
    if (todayNotifications.length > 0) {
      notificationDropdownContent.innerHTML = todayNotifications.map(msg => `
        <div class="notification-item">
          <div class="notification-avatar">${msg.buyer?.name?.charAt(0).toUpperCase() || 'U'}</div>
          <div class="notification-text"><b>${msg.buyer?.name || 'Comprador'}</b> te envió un mensaje nuevo</div>
        </div>
      `).join('');
    } else {
      notificationDropdownContent.innerHTML = '<div class="notification-item">No tienes mensajes nuevos hoy.</div>';
    }
  };

  // Función para mostrar/ocultar el menú de notificaciones
  function toggleNotificationMenu() {
    if (notificationMenu.style.display === 'none' || notificationMenu.style.display === '') {
      notificationMenu.style.display = 'block';
    } else {
      notificationMenu.style.display = 'none';
    }
  }
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleNotificationMenu();
    });
    document.addEventListener('click', function(e) {
      if (!notificationMenu.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationMenu.style.display = 'none';
      }
    });
  }

  // Cargar mensajes inmediatamente para la campana
  loadMessages();
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
    
    // Configurar funcionalidad de subida de imágenes (creación y edición)
    setupImageUpload();
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
        if (!user || (user.user_type !== 'seller' && user.user_type !== 'both')) {
            console.error('Usuario no es vendedor o no está logueado');
            return;
        }

        console.log('Cargando mensajes para usuario:', user);

        // Obtener solicitudes de compra donde el vendedor es el receptor
        const response = await fetch(`${API_BASE_URL}/purchase-requests/`);
        const data = await response.json();

        if (response.ok) {
            // Filtrar solicitudes que pertenecen a productos del vendedor
            const sellerRequests = [];
            const productCache = new Map(); // Cache para evitar llamadas repetidas
            
            for (const request of data.purchase_requests) {
                try {
                    // Verificar si el producto pertenece al vendedor actual
                    let productData;
                    
                    if (productCache.has(request.product_id)) {
                        productData = productCache.get(request.product_id);
                    } else {
                        const productResponse = await fetch(`${API_BASE_URL}/products/${request.product_id}`);
                        if (productResponse.ok) {
                            productData = await productResponse.json();
                            productCache.set(request.product_id, productData);
                        }
                    }
                    
                    if (productData && productData.seller_id === user.id) {
                        sellerRequests.push(request);
                    }
                } catch (error) {
                    console.error('Error al verificar producto:', error);
                }
            }

            console.log('Solicitudes encontradas:', sellerRequests.length);

            // Obtener mensajes para cada solicitud
            const messagesWithDetails = [];
            const buyerCache = new Map(); // Cache para compradores
            const productCacheForMessages = new Map(); // Cache para productos en mensajes
            
            for (const request of sellerRequests) {
                console.log('Procesando solicitud ID:', request.id, 'Comprador ID:', request.buyer_id);
                
                const messagesResponse = await fetch(`${API_BASE_URL}/messages/${request.id}`);
                if (messagesResponse.ok) {
                    const messagesData = await messagesResponse.json();
                    if (messagesData.messages && messagesData.messages.length > 0) {
                        console.log('Mensajes encontrados para solicitud', request.id, ':', messagesData.messages.length);
                        
                        // Obtener información del comprador y producto (usando cache)
                        let buyerData, productData;
                        
                        // Obtener datos del comprador
                        if (buyerCache.has(request.buyer_id)) {
                            buyerData = buyerCache.get(request.buyer_id);
                        } else {
                            const buyerResponse = await fetch(`${API_BASE_URL}/users/${request.buyer_id}`);
                            if (buyerResponse.ok) {
                                buyerData = await buyerResponse.json();
                                buyerCache.set(request.buyer_id, buyerData);
                            }
                        }
                        
                        // Obtener datos del producto
                        if (productCacheForMessages.has(request.product_id)) {
                            productData = productCacheForMessages.get(request.product_id);
                        } else {
                            const productResponse = await fetch(`${API_BASE_URL}/products/${request.product_id}`);
                            if (productResponse.ok) {
                                productData = await productResponse.json();
                                productCacheForMessages.set(request.product_id, productData);
                            }
                        }
                        
                        if (buyerData && productData) {
                            console.log('Datos del comprador:', buyerData);
                            console.log('Datos del producto:', productData);
                            
                            messagesData.messages.forEach(message => {
                                console.log('Verificando mensaje:', message.id, 'Receiver ID:', message.receiver_id, 'User ID:', user.id);
                                if (message.receiver_id === user.id) {
                                    messagesWithDetails.push({
                                        ...message,
                                        buyer: buyerData,
                                        product: productData,
                                        purchase_request: request
                                    });
                                }
                            });
                        } else {
                            console.error('Error al obtener datos del comprador o producto para solicitud', request.id);
                        }
                    }
                } else {
                    console.error('Error al cargar mensajes para solicitud', request.id);
                }
            }

            console.log('Mensajes finales para el vendedor:', messagesWithDetails);
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

    // Ordenar mensajes por timestamp descendente (más nuevo primero)
    const sortedMessages = messages.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    messagesList.innerHTML = sortedMessages.map(message => `
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

// Función para crear nuevo producto (llamada desde el estado vacío y botón)
function createNewProduct() {
    // Limpiar formulario
    createProductForm.reset();
    createIsActive.checked = true;
    
    // Mostrar modal
    createModal.classList.add('show');
    document.body.style.overflow = 'hidden';
} 