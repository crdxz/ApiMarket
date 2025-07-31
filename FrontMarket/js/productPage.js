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

let productData = null;
let sellerData = null;

document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  if (!productId) {
    showError('No se especificó un ID de producto');
    return;
  }

  loadProduct(productId);
});

async function loadProduct(productId) {
  try {
    showLoading(true);

    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    const data = await response.json();

    if (response.ok) {
      productData = data;
      sellerData = data.seller;
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

  if (sellerData) {
    sellerName.textContent = sellerData.name;
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
