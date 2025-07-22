document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-section');

  tabs.forEach(tab => {
    const header = tab.querySelector('.tab-header');
    const content = tab.querySelector('.tab-content');

    header.addEventListener('click', () => {
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => t.classList.remove('active')); // Close all other tabs
      if (!isActive) {
        tab.classList.add('active');
        // Set max-height dynamically if needed, but 1000px is usually sufficient
      } else {
        tab.classList.remove('active');
      }
    });
  });

  // Ensure carousels and modals work within expanded tabs
  import('./carousel.js').then(({ setupPortfolioCarousel }) => setupPortfolioCarousel());
  import('./modal-gallery.js').then(() => {});
});