// js/productPage.js

const API_BASE_URL = 'http://localhost:5000/api';

const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const productContent = document.getElementById('productContent');
const productTitle = document.getElementById('productTitle');
const productDescription = document.getElementById('productDescription');
const productPrice = document.getElementById('productPrice');
const productStock = document.getElementById('productStock');
const productCategory = document.getElementById('productCategory');
const sellerName = document.getElementById('sellerName');
const sellerEmail = document.getElementById('sellerEmail');
const sellerJoinDate = document.getElementById('sellerJoinDate');
const sellerPhone = document.getElementById('sellerPhone');
const sellerPhoneText = document.getElementById('sellerPhoneText');
const sellerAddress = document.getElementById('sellerAddress');
const sellerAddressText = document.getElementById('sellerAddressText');
const contactSellerBtn = document.getElementById('contactSellerBtn');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// Modal elements
const messageModal = document.getElementById('messageModal');
const closeMessageModal = document.getElementById('closeMessageModal');
const cancelMessage = document.getElementById('cancelMessage');
const messageForm = document.getElementById('messageForm');
const messageText = document.getElementById('messageText');
const buyerContact = document.getElementById('buyerContact');

let productData = null;
let sellerData = null;
let currentBuyerId = null; // Esto debería obtenerse del sistema de autenticación

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showError('No se especificó un ID de producto');
    return;
  }

  // Obtener el ID del usuario logueado
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    currentBuyerId = user.id;
    console.log('Usuario logueado:', user.name, 'ID:', user.id);
  } else {
    // Si no hay usuario logueado, redirigir al login
    alert('Debes iniciar sesión para enviar mensajes');
    window.location.href = 'loginPage.html';
    return;
  }

  loadProduct(productId);
  setupModalEvents();
});

async function loadProduct(productId) {
  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();

    if (response.ok) {
      productData = data;
      sellerData = data.seller;
      
      // Cargar imagen del producto
      try {
        const imagesResponse = await fetch(`${API_BASE_URL}/product-images/product/${productId}`);
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          if (imagesData.images && imagesData.images.length > 0) {
            productData.image_url = imagesData.images[0].full_image_url || imagesData.images[0].image_url;
          }
        }
      } catch (error) {
        console.error('Error al cargar imagen del producto:', error);
      }
      
      renderProduct();
    } else {
      showError(data.error || 'Error al cargar el producto');
    }
  } catch (error) {
    console.error('Error al conectar con la API:', error);
    showError('Error de conexión');
  } finally {
    showLoading(false);
  }
}

function renderProduct() {
  if (!productData) return;

  document.title = `${productData.title} - Marketplace`;
  productTitle.textContent = productData.title;
  productDescription.textContent = productData.description || 'Sin descripción disponible';
  productPrice.textContent = `$${parseFloat(productData.price).toFixed(2)}`;
  productStock.textContent = productData.stock;
  productCategory.textContent = productData.category?.name || 'Sin categoría';

  // Mostrar imagen del producto
  const mainImage = document.getElementById('mainImage');
  if (productData.image_url) {
    mainImage.style.backgroundImage = `url('${productData.image_url}')`;
  } else {
    mainImage.style.backgroundImage = `url('https://via.placeholder.com/600x400/CCCCCC/666666?text=${productData.title.charAt(0).toUpperCase()}')`;
  }

  if (sellerData) {
    // Crear enlace al perfil del vendedor
    sellerName.innerHTML = `<a href="profileSellerPage.html?id=${sellerData.id}" class="seller-profile-link">${sellerData.name}</a>`;
    sellerEmail.textContent = sellerData.email;

    if (sellerData.created_at) {
      const joinDate = new Date(sellerData.created_at);
      sellerJoinDate.textContent = `Miembro desde ${joinDate.getFullYear()}`;
    } else {
      sellerJoinDate.textContent = 'Miembro reciente';
    }

    if (sellerData.phone?.trim()) {
      sellerPhoneText.textContent = sellerData.phone;
      sellerPhone.classList.remove('hidden');
    } else {
      sellerPhone.classList.add('hidden');
    }

    if (sellerData.address?.trim()) {
      sellerAddressText.textContent = sellerData.address;
      sellerAddress.classList.remove('hidden');
    } else {
      sellerAddress.classList.add('hidden');
    }
  } else {
    sellerName.textContent = 'Vendedor no disponible';
    sellerEmail.textContent = 'Información no disponible';
    sellerJoinDate.textContent = '';
    sellerPhone.classList.add('hidden');
    sellerAddress.classList.add('hidden');
  }

  productContent.classList.remove('hidden');
}

function showLoading(show) {
  if (show) {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    productContent.classList.add('hidden');
  } else {
    loadingState.classList.add('hidden');
  }
}

function showError(message) {
  errorState.querySelector('p').textContent = message;
  errorState.classList.remove('hidden');
  loadingState.classList.add('hidden');
  productContent.classList.add('hidden');
}

contactSellerBtn.addEventListener('click', function () {
  if (sellerData?.email) {
    window.open(`mailto:${sellerData.email}?subject=Consulta sobre ${productData.title}`, '_blank');
  } else {
    alert('No se puede contactar al vendedor en este momento.');
  }
});

function setupModalEvents() {
  // Abrir modal
  sendMessageBtn.addEventListener('click', function() {
    openMessageModal();
  });

  // Cerrar modal
  closeMessageModal.addEventListener('click', function() {
    closeMessageModalFunc();
  });

  cancelMessage.addEventListener('click', function() {
    closeMessageModalFunc();
  });

  // Cerrar modal al hacer clic fuera
  messageModal.addEventListener('click', function(e) {
    if (e.target === messageModal) {
      closeMessageModalFunc();
    }
  });

  // Enviar mensaje
  messageForm.addEventListener('submit', function(e) {
    e.preventDefault();
    sendMessage();
  });
}

function openMessageModal() {
  // Mensaje predeterminado
  const defaultMessage = `Hola, estoy interesado en comprar "${productData?.title}". ¿Podrías proporcionarme más información sobre el producto, como su estado actual, si está disponible para envío, y si hay posibilidad de negociar el precio? También me gustaría saber si tienes más fotos del producto.`;
  
  messageText.value = defaultMessage;
  buyerContact.value = '';
  
  messageModal.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeMessageModalFunc() {
  messageModal.classList.remove('show');
  document.body.style.overflow = '';
}

async function sendMessage() {
  try {
    // Verificar que el usuario esté logueado
    if (!currentBuyerId) {
      alert('Debes iniciar sesión para enviar mensajes');
      window.location.href = 'loginPage.html';
      return;
    }

    const message = messageText.value.trim();
    const contact = buyerContact.value.trim();

    if (!message || !contact) {
      alert('Por favor completa todos los campos');
      return;
    }

    console.log('Enviando mensaje con buyer_id:', currentBuyerId);
    
    // Crear solicitud de compra primero
    const purchaseRequestData = {
      product_id: productData.id,
      buyer_id: currentBuyerId,
      quantity: 1,
      note: `${message}\n\nInformación de contacto: ${contact}`
    };

    const purchaseResponse = await fetch(`${API_BASE_URL}/purchase-requests/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(purchaseRequestData)
    });

    if (!purchaseResponse.ok) {
      const errorData = await purchaseResponse.json();
      throw new Error(errorData.error || 'Error al crear la solicitud de compra');
    }

    const purchaseData = await purchaseResponse.json();
    const purchaseRequestId = purchaseData.purchase_request.id;

    console.log('Enviando mensaje con sender_id:', currentBuyerId, 'receiver_id:', productData.seller.id);
    
    // Enviar mensaje
    const messageData = {
      purchase_request_id: purchaseRequestId,
      sender_id: currentBuyerId,
      receiver_id: productData.seller.id,
      message: `${message}\n\nInformación de contacto: ${contact}`
    };

    const messageResponse = await fetch(`${API_BASE_URL}/messages/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(errorData.error || 'Error al enviar el mensaje');
    }

    // Éxito
    alert('Mensaje enviado exitosamente. El vendedor se pondrá en contacto contigo pronto.');
    closeMessageModalFunc();
    
    // Limpiar formulario
    messageForm.reset();

  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    alert(`Error al enviar el mensaje: ${error.message}`);
  }
}
