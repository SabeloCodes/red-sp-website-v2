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

document.addEventListener("DOMContentLoaded", () => {
  injectContent("components/nav.html", "navigation", setupDropdownSlideLinks);
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
        entry.target.style.animationDelay = `${index * 150}ms`;
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
        slide.style.display = i === index ? 'block' : 'none';
        if (i === index) slide.classList.add('active');
      });

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
        });
      }
    }

    function createDots() {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.toggle('active', i === currentIndex);
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

    // -------------------- Handle Anchor Click + Slide Index --------------------
    function setupDropdownSlideLinks() {
      const navLinks = document.querySelectorAll('a[href*="#portfolio-section"][data-slide-index]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const index = parseInt(link.getAttribute('data-slide-index'), 10);
          const target = document.querySelector('#portfolio-section');

          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              currentIndex = index;
              showSlide(currentIndex);
            }, 600);
          }
        });
      });
    }

    // -------------------- Touch Drag Support --------------------
    let startX = 0;
    let endX = 0;
    const carousel = document.querySelector('.portfolio-carousel');

    if (carousel) {
      carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      });

      carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
      });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          currentIndex = (currentIndex + 1) % slides.length;
        } else {
          currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        }
        showSlide(currentIndex);
      }
    }
  }
});