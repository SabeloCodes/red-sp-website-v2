// -------------------- script.js --------------------

// Inject reusable components dynamically
function injectContent(url, targetId, callback) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
        if (typeof callback === 'function') callback();
      }
    })
    .catch(err => console.error(`Error loading ${url}:`, err));
}

// Inject external stylesheet if needed
function injectCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', () => {
  injectContent('components/nav.html', 'navigation');
  injectContent('components/footer.html', 'page-footer');

  injectCSS('css/carousel.css');
  injectContent('components/carousel.html', 'carousel-placeholder', () => {
    if (typeof setupCarouselOverlay === 'function') setupCarouselOverlay();
    if (typeof setupCarouselLoop === 'function') setupCarouselLoop();
  });

  // -------------------- Portfolio Carousel Logic --------------------
  const slides = document.querySelectorAll(".portfolio-slide");
  const nextBtn = document.querySelector(".portfolio-next");
  const prevBtn = document.querySelector(".portfolio-prev");
  const dotsContainer = document.querySelector(".portfolio-dots");
  let currentSlide = 0;

  if (slides.length > 0 && dotsContainer && nextBtn && prevBtn) {
    function updateSlides() {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
      });

      const dots = dotsContainer.querySelectorAll(".portfolio-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
      });
    }

    function goToNext() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlides();
    }

    function goToPrev() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlides();
    }

    nextBtn.addEventListener("click", goToNext);
    prevBtn.addEventListener("click", goToPrev);

    // Create dot indicators
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("portfolio-dot"); // ✅ Matches your CSS
      if (i === currentSlide) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlides();
      });
      dotsContainer.appendChild(dot);
    });

    updateSlides();
  }
});