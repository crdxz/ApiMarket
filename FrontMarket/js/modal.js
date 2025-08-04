// Modal utilitario reutilizable para mostrar mensajes
function showModalMessage(message, options = {}) {
  let modal = document.getElementById('globalModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'globalModal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <svg class="modal-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/>
        </svg>
        <div class="modal-message" id="globalModalMessage"></div>
        <button class="modal-button" id="globalModalClose">Cerrar</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('globalModalClose').onclick = closeGlobalModal;
    modal.querySelector('.modal-overlay').onclick = closeGlobalModal;
  }
  document.getElementById('globalModalMessage').textContent = message;
  modal.style.display = 'flex';
  setTimeout(() => {
    document.getElementById('globalModalClose').focus();
  }, 100);
}

function closeGlobalModal() {
  const modal = document.getElementById('globalModal');
  if (modal) modal.style.display = 'none';
}
