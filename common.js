// DaltoVisto — Utilidades compartidas (navegación móvil, estado activo y fallbacks de imagen)

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Marcar enlace activo según la ruta actual
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-drawer-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.setAttribute('aria-current', 'page');
    }
  });

  // Política cero imágenes rotas: fallback visual limpio si falta algún archivo
  document.querySelectorAll('img').forEach((img) => {
    img.setAttribute('referrerpolicy', 'no-referrer');
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied) return;
      img.dataset.fallbackApplied = 'true';
      img.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #f1f5f9 100%)';
      img.style.objectFit = 'contain';
      img.alt = img.alt || 'Recurso visual de DaltoVisto';
    });
  });
});
