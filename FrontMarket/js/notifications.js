// notifications.js
// Lógica reutilizable para la campana de notificaciones en todas las páginas

const NOTIF_API_BASE_URL = 'http://localhost:5000/api';

function setupNotificationBell({
  userType = 'seller',
  notificationBtnId = 'notificationBtn',
  notificationDotId = 'notificationDot',
  notificationMenuId = 'notificationMenu',
  notificationDropdownContentId = 'notificationDropdownContent',
  onMessagesLoaded = null
} = {}) {
  let todayNotifications = [];
  const notificationBtn = document.getElementById(notificationBtnId);
  const notificationDot = document.getElementById(notificationDotId);
  const notificationMenu = document.getElementById(notificationMenuId);
  const notificationDropdownContent = document.getElementById(notificationDropdownContentId);

  // Mostrar/ocultar menú
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

  // Cargar mensajes y actualizar notificaciones
  async function loadNotifications() {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return;
      const user = JSON.parse(userData);
      if (!user || (userType === 'seller' && user.user_type !== 'seller' && user.user_type !== 'both')) return;

      // Obtener solicitudes de compra donde el usuario es vendedor
      const response = await fetch(`${NOTIF_API_BASE_URL}/purchase-requests/`);
      const data = await response.json();
      if (!response.ok) return;

      // Filtrar solicitudes que pertenecen a productos del vendedor
      const sellerRequests = [];
      const productCache = new Map();
      for (const request of data.purchase_requests) {
        let productData;
        if (productCache.has(request.product_id)) {
          productData = productCache.get(request.product_id);
        } else {
          const productResponse = await fetch(`${NOTIF_API_BASE_URL}/products/${request.product_id}`);
          if (productResponse.ok) {
            productData = await productResponse.json();
            productCache.set(request.product_id, productData);
          }
        }
        if (productData && productData.seller_id === user.id) {
          sellerRequests.push(request);
        }
      }
      // Obtener mensajes para cada solicitud
      const messagesWithDetails = [];
      const buyerCache = new Map();
      for (const request of sellerRequests) {
        const messagesResponse = await fetch(`${NOTIF_API_BASE_URL}/messages/${request.id}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          if (messagesData.messages && messagesData.messages.length > 0) {
            let buyerData;
            if (buyerCache.has(request.buyer_id)) {
              buyerData = buyerCache.get(request.buyer_id);
            } else {
              const buyerResponse = await fetch(`${NOTIF_API_BASE_URL}/users/${request.buyer_id}`);
              if (buyerResponse.ok) {
                buyerData = await buyerResponse.json();
                buyerCache.set(request.buyer_id, buyerData);
              }
            }
            messagesData.messages.forEach(message => {
              if (message.receiver_id === user.id) {
                messagesWithDetails.push({
                  ...message,
                  buyer: buyerData,
                  purchase_request: request
                });
              }
            });
          }
        }
      }
      // Filtrar mensajes de hoy
      const today = new Date();
      today.setHours(0,0,0,0);
      todayNotifications = messagesWithDetails.filter(msg => {
        const msgDate = new Date(msg.timestamp);
        return msgDate >= today;
      });
      // Mostrar punto si hay mensajes nuevos hoy
      if (notificationDot) {
        notificationDot.style.display = todayNotifications.length > 0 ? 'block' : 'none';
      }
      // Renderizar menú
      if (notificationDropdownContent) {
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
      }
      if (typeof onMessagesLoaded === 'function') {
        onMessagesLoaded(todayNotifications);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  }

  // Cargar notificaciones al inicio
  document.addEventListener('DOMContentLoaded', loadNotifications);
}
