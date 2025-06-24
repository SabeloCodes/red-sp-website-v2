// Utility to inject external HTML
function injectContent(url, targetId, callback) {
  fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
        if (typeof callback === "function") callback();
      } else {
        console.error(`Element with ID "${targetId}" not found.`);
      }
    })
    .catch((err) => console.error(`Error loading ${url}:`, err));
}

// Utility to inject external CSS
function injectCSS(href) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

// On DOM load
document.addEventListener("DOMContentLoaded", () => {
  injectContent("components/nav.html", "navigation");
  injectContent("components/footer.html", "page-footer");

  // Inject carousel and setup
  injectCSS("css/carousel.css");
  injectContent("components/carousel.html", "carousel-placeholder", () => {
    setupCarouselOverlay();
    setupCarouselLoop();
  });

  // Scroll-triggered staggered animation
  const animatedItems = document.querySelectorAll(
    "#why-red-sp .why-red-item, #the-process .process-step"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 150}ms`; // 150ms stagger
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedItems.forEach((el) => observer.observe(el));

  // -------------------- Portfolio Carousel Logic --------------------
  const slides = document.querySelectorAll('.portfolio-slide');
  const prevBtn = document.querySelector('.portfolio-prev');
  const nextBtn = document.querySelector('.portfolio-next');
  const dotsContainer = document.querySelector('.portfolio-dots');

  if (slides.length) {
    let currentIndex = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) slide.classList.add('active');
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => {
          dot.classList.remove('active');
          if (i === index) dot.classList.add('active');
        });
      }
    }

    function createDots() {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          showSlide(currentIndex);
        });
        dotsContainer.appendChild(dot);
      });
    }

    createDots();

    prevBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    });

    nextBtn?.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    });

    showSlide(currentIndex);
  }
});