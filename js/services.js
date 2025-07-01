document.addEventListener("DOMContentLoaded", () => {
  // Inject navigation and footer
  injectContent("components/nav.html", "navigation", () => {
    setupDropdownSlideLinks();
    setupCarouselOverlay();
  });
  injectContent("components/footer.html", "page-footer");

  injectCSS("css/carousel.css");
  injectContent("components/carousel.html", "carousel-placeholder", () => {
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

    // -------------------- Submenu click links to specific slide --------------------
    function setupDropdownSlideLinks() {
      console.log('Setting up dropdown slide links'); // Debug log
      const navLinks = document.querySelectorAll('.dropdown-menu a');
      if (navLinks.length) {
        console.log('Found dropdown links:', navLinks); // Debug log
        navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
            console.log('Click detected on:', link.textContent); // Debug log
            e.preventDefault(); // Prevent default navigation
            const targetSlideId = link.getAttribute('href').split('#')[1]; // Get slide ID
            const targetSlide = document.getElementById(targetSlideId);
            if (targetSlide && window.location.pathname.includes('services.html')) {
              const portfolioSection = document.querySelector('#portfolio-section');
              if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  currentIndex = Array.from(slides).indexOf(targetSlide);
                  if (currentIndex !== -1) {
                    showSlide(currentIndex);
                    history.pushState(null, null, link.getAttribute('href')); // Update URL
                    console.log('Slide activated:', targetSlideId); // Debug log
                  } else {
                    console.log('Slide not found:', targetSlideId); // Debug log
                  }
                }, 600);
              }
            } else {
              window.location.href = link.getAttribute('href'); // Fallback for non-services pages
            }
          });
        });
      } else {
        console.log('No dropdown links found'); // Debug log
      }
    }

    // On page load: check URL hash for slide ID
    const hash = window.location.hash;
    if (hash && window.location.pathname.includes('services.html')) {
      const targetSlideId = hash.substring(1);
      const targetSlide = document.getElementById(targetSlideId);
      if (targetSlide) {
        const portfolioSection = document.querySelector('#portfolio-section');
        if (portfolioSection) {
          portfolioSection.scrollIntoView({ behavior: 'smooth' });
          currentIndex = Array.from(slides).indexOf(targetSlide);
          showSlide(currentIndex);
          console.log('Loaded slide from hash:', targetSlideId); // Debug log
        }
      }
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

  // Utility functions
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

  function injectCSS(href) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }

  function setupCarouselOverlay() {
    // Placeholder for overlay setup if needed
  }

  function setupCarouselLoop() {
    // Placeholder for loop setup if needed
  }
});