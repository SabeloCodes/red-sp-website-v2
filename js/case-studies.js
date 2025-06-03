// ---------------- Component Injection ----------------
function injectComponent(id, file, callback) {
    fetch(file)
      .then(res => res.text())
      .then(data => {
        document.getElementById(id).innerHTML = data;
        if (typeof callback === 'function') callback();
      });
  }
  
  injectComponent('navigation', 'components/nav.html');
  injectComponent('page-footer', 'components/footer.html');
  
  // Inject carousel and set up overlay and carousel behavior
  injectComponent('carousel-placeholder', 'components/carousel.html', () => {
    if (typeof initializeCarousel === 'function') {
      initializeCarousel();
    }
    if (typeof setupCarouselOverlay === 'function') {
      setupCarouselOverlay(); // ✅ Overlay injection added here
    }
  });