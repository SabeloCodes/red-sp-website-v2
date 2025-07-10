document.addEventListener("DOMContentLoaded", () => {

  // --- Core Content Injection Function ---
  function injectContent(url, targetId, callback) {
      fetch(url)
          .then(res => {
              if (!res.ok) {
                  // Corrected syntax for template literal
                  console.error(`HTTP error! status: ${res.status} for URL: ${url}`);
                  throw new Error(`Failed to load ${url}: ${res.status}`);
              }
              return res.text();
          })
          .then(html => {
              const target = document.getElementById(targetId);
              if (target) {
                  target.innerHTML = html;
                  if (typeof callback === 'function') {
                      callback();
                  }
              } else {
                  console.warn(`Target element with ID "${targetId}" not found for injecting ${url}.`);
              }
          })
          .catch(err => console.error(`Error loading content from ${url}:`, err));
  }

  // --- Highlight active nav item ---
  function highlightActiveNav() {
      let currentPath = window.location.pathname.toLowerCase();
      currentPath = currentPath.replace(/^\/+|\/+$/g, '').split('?')[0];
      if (currentPath === '' || currentPath === 'index') {
          currentPath = 'index.html';
      } else if (!currentPath.endsWith('.html')) {
          currentPath += '.html';
      }

      console.log('Current Page Path (normalized):', currentPath);

      const mainNavElement = document.querySelector('nav.main-nav');
      if (mainNavElement) {
          mainNavElement.querySelectorAll('ul li a').forEach(link => {
              let linkPath = link.getAttribute('href').toLowerCase();
              linkPath = linkPath.replace(/^\/+|\/+$/g, '').split('?')[0];

              if (linkPath === '' || linkPath === 'index') {
                  linkPath = 'index.html';
              } else if (!linkPath.endsWith('.html')) {
                  linkPath += '.html';
              }

              if (linkPath === currentPath) {
                  link.classList.add('active');
                  const parentDropdown = link.closest('.dropdown');
                  if (parentDropdown) {
                      parentDropdown.classList.add('active');
                  }
              } else {
                  link.classList.remove('active');
              }
          });
      }
  }

  // --- Hamburger and Mobile Menu Logic ---
  function setupHamburgerAndMobileEvents() {
      const hamburger = document.getElementById("hamburger");
      const mainNav = document.querySelector("#navigation nav.main-nav");
      const carouselTextOverlay = document.querySelector(".carousel-text-overlay");

      if (hamburger && mainNav) {
          console.log("Hamburger and mainNav found, setting up events");
          hamburger.addEventListener("click", (e) => {
              e.stopPropagation();
              hamburger.classList.toggle("open");
              mainNav.classList.toggle("show");

              if (mainNav.classList.contains("show")) {
                  document.body.style.overflowY = 'hidden';
              } else {
                  document.body.style.overflowY = 'auto';
              }

              if (carouselTextOverlay) {
                  carouselTextOverlay.classList.toggle("hidden-on-mobile-nav-open");
                  console.log("Toggled carousel text overlay visibility for mobile nav.");
              }
          });

          const servicesToggle = document.querySelector(".dropdown-toggle");
          if (servicesToggle) {
              servicesToggle.addEventListener("click", (e) => {
                  if (window.innerWidth <= 768) {
                      e.preventDefault();
                      const parentLi = servicesToggle.parentElement;
                      parentLi.classList.toggle("active");
                  }
              });
          }

          document.addEventListener("click", (event) => {
              if (window.innerWidth <= 768 && mainNav.classList.contains("show")) {
                  const isClickInsideNav = mainNav.contains(event.target);
                  const isClickInsideHamburger = hamburger.contains(event.target);

                  if (!isClickInsideNav && !isClickInsideHamburger) {
                      hamburger.classList.remove("open");
                      mainNav.classList.remove("show");
                      document.body.style.overflowY = 'auto';

                      if (carouselTextOverlay && carouselTextOverlay.classList.contains("hidden-on-mobile-nav-open")) {
                          carouselTextOverlay.classList.remove("hidden-on-mobile-nav-open");
                      }
                  }
              }
          });

          mainNav.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
              link.addEventListener('click', () => {
                  if (window.innerWidth <= 768) {
                      hamburger.classList.remove("open");
                      mainNav.classList.remove("show");
                      document.body.style.overflowY = 'auto';
                      if (carouselTextOverlay) {
                          carouselTextOverlay.classList.remove("hidden-on-mobile-nav-open");
                      }
                  }
              });
          });

      } else {
          console.warn("Hamburger or Main Nav elements not found after injection. Mobile menu functionality might be impaired.");
      }
  }

  // --- Back to Top Button Logic ---
  const backToTopButton = document.getElementById('back-to-top');
  const scrollThreshold = 200;

  function toggleBackToTopButton() {
      if (backToTopButton) {
          if (window.scrollY > scrollThreshold) {
              backToTopButton.classList.add('show');
          } else {
              backToTopButton.classList.remove('show');
          }
      }
  }

  window.addEventListener('scroll', toggleBackToTopButton);
  if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }
  toggleBackToTopButton();

  // --- Carousel Overlay Setup (for the main top carousel) ---
  function setupCarouselOverlay() {
      const carouselContainer = document.getElementById("carousel-placeholder");
      if (!carouselContainer) {
          console.warn("#carousel-placeholder not found for overlay setup.");
          return;
      }

      const observer = new MutationObserver((mutationsList, obs) => {
          const carousel = carouselContainer.querySelector("#carousel-container");
          if (carousel) {
              obs.disconnect();

              const overlay = carousel.querySelector(".overlay");
              if (!overlay) {
                  console.warn("Overlay element not found inside carousel container after injection.");
                  return;
              }

              const path = window.location.pathname.toLowerCase();
              if (path.includes("who-we-are")) {
                  overlay.classList.add("overlay-who-we-are");
              } else if (path.includes("services")) {
                  overlay.classList.add("overlay-services");
              } else if (path.includes("case-studies")) {
                  overlay.classList.add("overlay-case-studies");
              } else if (path.includes("contact")) {
                  overlay.classList.add("overlay-contact");
              } else {
                  overlay.classList.add("overlay-home");
              }

              const heading = overlay.querySelector("#carousel-heading");
              const paragraph = overlay.querySelector("#carousel-paragraph");
              const btn1 = overlay.querySelector("#carousel-btn-1");
              const btn2 = overlay.querySelector("#carousel-btn-2");

              const { carouselHeading, carouselParagraph, carouselButton1, carouselButton2 } = document.body.dataset;

              if (heading && carouselHeading) heading.innerHTML = carouselHeading;
              if (paragraph && carouselParagraph) paragraph.innerHTML = carouselParagraph;
              if (btn1 && carouselButton1) btn1.innerHTML = carouselButton1;
              if (btn2 && carouselButton2) btn2.innerHTML = carouselButton2;

              console.log("[Overlay] Injected content:", {
                  heading: carouselHeading,
                  paragraph: carouselParagraph,
                  btn1: carouselButton1,
                  btn2: carouselButton2
              });

              if (typeof startCarouselLoop === "function") {
                  startCarouselLoop();
              }
          }
      });

      observer.observe(carouselContainer, {
          childList: true,
          subtree: true
      });
  }

  // --- Testimonial Carousel Logic (if used on any page, e.g., index) ---
  function setupTestimonialCarousel() {
      const slides = document.querySelectorAll(".testimonial-slide");
      const nextBtn = document.querySelector(".next-testimonial");
      const prevBtn = document.querySelector(".prev-testimonial");
      let currentSlide = 0;

      if (slides.length > 0 && nextBtn && prevBtn) {
          function updateSlides() {
              slides.forEach((slide, i) => {
                  slide.classList.toggle("active", i === currentSlide);
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

          updateSlides();
      } else {
          console.warn("Testimonial carousel elements not found. Carousel might not function.");
      }
  }

  // --- Portfolio Carousel Logic (for services page) ---
  function setupPortfolioCarousel() {
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
              if (dotsContainer && dotsContainer.children.length === 0) {
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

          // --- Submenu click links to specific slide (within Portfolio Carousel) ---
          function setupDropdownSlideLinks() {
              console.log('Setting up dropdown slide links');
              const navLinks = document.querySelectorAll('#navigation .dropdown-menu a');
              if (navLinks.length) {
                  console.log('Found dropdown links:', navLinks);
                  navLinks.forEach(link => {
                      link.addEventListener('click', (e) => {
                          console.log('Click detected on:', link.textContent);
                          if (window.location.pathname.includes('services.html')) {
                              e.preventDefault();
                              const targetSlideId = link.getAttribute('href').split('#')[1];
                              const targetSlide = document.getElementById(targetSlideId);
                              if (targetSlide) {
                                  const portfolioSection = document.getElementById('portfolio-section');
                                  if (portfolioSection) {
                                      portfolioSection.scrollIntoView({
                                          behavior: 'smooth'
                                      });
                                      setTimeout(() => {
                                          currentIndex = Array.from(slides).indexOf(targetSlide);
                                          if (currentIndex !== -1) {
                                              showSlide(currentIndex);
                                              history.pushState(null, null, link.getAttribute('href'));
                                              console.log('Slide activated:', targetSlideId);
                                          } else {
                                              console.log('Slide not found:', targetSlideId);
                                          }
                                      }, 600);
                                  }
                              } else {
                                  window.location.href = link.getAttribute('href');
                              }
                          } else {
                              window.location.href = link.getAttribute('href');
                          }
                      });
                  });
              } else {
                  console.log('No dropdown links found inside #navigation for slide linking.');
              }
          }

          // On page load: check URL hash for slide ID (for services.html)
          const hash = window.location.hash;
          if (hash && window.location.pathname.includes('services.html')) {
              const targetSlideId = hash.substring(1);
              const targetSlide = document.getElementById(targetSlideId);
              if (targetSlide) {
                  const portfolioSection = document.getElementById('portfolio-section');
                  if (portfolioSection) {
                      portfolioSection.scrollIntoView({
                          behavior: 'smooth'
                      });
                      currentIndex = Array.from(slides).indexOf(targetSlide);
                      setTimeout(() => showSlide(currentIndex), 100);
                      console.log('Loaded slide from hash:', targetSlideId);
                  }
              }
          }

          // --- Touch Drag Support ---
          let startX = 0;
          let endX = 0;
          const portfolioCarouselElement = document.querySelector('.portfolio-carousel');

          if (portfolioCarouselElement) {
              portfolioCarouselElement.addEventListener('touchstart', (e) => {
                  startX = e.touches[0].clientX;
              });

              portfolioCarouselElement.addEventListener('touchend', (e) => {
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
          window.setupDropdownSlideLinks = setupDropdownSlideLinks; // Make globally accessible
      } else {
          console.warn("Portfolio carousel elements or dots container not found. Portfolio carousel might not function.");
      }
  }


  // --- Scroll-triggered staggered animation ---
  function setupScrollAnimations() {
      const animatedItems = document.querySelectorAll(
          "#why-red-sp .why-red-item, #the-process .process-step"
      );

      if (animatedItems.length > 0) {
          const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry, index) => {
                  if (entry.isIntersecting) {
                      entry.target.style.animationDelay = `${index * 150}ms`;
                      entry.target.classList.add("fade-in-up");
                      observer.unobserve(entry.target);
                  }
              });
          }, {
              threshold: 0.2
          });

          animatedItems.forEach((el) => observer.observe(el));
      } else {
          console.warn("No animated items found for scroll animation.");
      }
  }


  // --- Initialize content and events when the DOM is fully loaded ---
  injectContent('components/nav.html', 'navigation', () => {
      console.log('Nav injected. Setting up hamburger and highlighting.');
      setupHamburgerAndMobileEvents();
      highlightActiveNav();
      // Call setupDropdownSlideLinks AFTER nav is injected AND portfolio carousel exists
      if (typeof window.setupDropdownSlideLinks === 'function') {
          window.setupDropdownSlideLinks();
      } else {
          console.warn("setupDropdownSlideLinks not found. Ensure setupPortfolioCarousel ran.");
      }
  });

  injectContent('components/carousel.html', 'carousel-placeholder', () => {
      console.log('Carousel injected. Setting up overlay.');
      setupCarouselOverlay();
      if (typeof setupCarouselLoop === 'function') {
          setupCarouselLoop();
      }
  });

  injectContent('components/footer.html', 'page-footer');

  setupTestimonialCarousel();
  setupPortfolioCarousel();
  setupScrollAnimations();
});

// Define dummy functions if `carousel.js` isn't loaded (though it should be).
if (typeof startCarouselLoop === 'undefined') {
  window.startCarouselLoop = function() { /* do nothing */ };
}
if (typeof setupCarouselLoop === 'undefined') {
  window.setupCarouselLoop = function() { /* do nothing */ };
}