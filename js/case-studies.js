document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-section');

  tabs.forEach(tab => {
    const header = tab.querySelector('.tab-header');
    const content = tab.querySelector('.tab-content');
    const arrow = header.querySelector('.tab-toggle-arrow'); // Get the arrow inside the header

    header.addEventListener('click', () => {
      const isActive = tab.classList.contains('active');
      tabs.forEach(t => {
        t.classList.remove('active');
        const otherArrow = t.querySelector('.tab-toggle-arrow');
        if (otherArrow) otherArrow.style.transform = 'rotate(0deg)'; // Reset all arrows
      });

      if (!isActive) {
        tab.classList.add('active');
        if (arrow) arrow.style.transform = 'rotate(90deg)';
      } else {
        tab.classList.remove('active');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });
  });

  // Ensure carousels and modals work within expanded tabs
  import('./carousel.js').then(({ setupPortfolioCarousel }) => setupPortfolioCarousel());
  import('./modal-gallery.js').then(() => {});
});