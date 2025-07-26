document.addEventListener("DOMContentLoaded", () => {
  // --- Core Content Injection Function ---
  function injectContent(url, targetId, callback) {
      fetch(url)
          .then(res => {
              if (!res.ok) {
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

  // --- Tabbed Sections Logic ---
  function setupTabbedSections() {
      console.log("Setting up tabbed sections...");
      const tabs = document.querySelectorAll('.tab-section');
      console.log("Found tab sections:", tabs.length);

      if (tabs.length > 0) {
          tabs.forEach(tab => {
              const header = tab.querySelector('.tab-header');
              const content = tab.querySelector('.tab-content');

              if (header && content) {
                  console.log("Attaching click event to tab header:", header.textContent);
                  header.addEventListener('click', () => {
                      const isActive = tab.classList.contains('active');
                      tabs.forEach(t => {
                          t.classList.remove('active');
                          const tc = t.querySelector('.tab-content');
                          if (tc) tc.style.maxHeight = '0';
                      });

                      if (!isActive) {
                          tab.classList.add('active');
                          content.style.maxHeight = content.scrollHeight + 'px';
                          console.log("Expanded tab:", header.textContent);

                          const miniCarouselsInTab = content.querySelectorAll('.js-carousel');
                          miniCarouselsInTab.forEach(carousel => {
                              initializeSingleMiniCarousel(carousel);
                          });
                      } else {
                          tab.classList.remove('active');
                          content.style.maxHeight = '0';
                          console.log("Collapsed tab:", header.textContent);
                      }
                  });

                  if (tab.classList.contains('active')) {
                      content.style.maxHeight = content.scrollHeight + 'px';
                      const miniCarouselsInTab = content.querySelectorAll('.js-carousel');
                      miniCarouselsInTab.forEach(carousel => {
                          initializeSingleMiniCarousel(carousel);
                      });
                  }
              } else {
                  console.warn("Tab header or content not found in tab:", tab);
              }
          });
      } else {
          console.warn("No tab sections found with class 'tab-section'.");
      }
  }

  // --- Mini Carousel Initialization (for a single carousel instance) ---
  function initializeSingleMiniCarousel(carousel) {
      if (carousel.dataset.initialized) {
          console.log("Mini carousel already initialized:", carousel);
          return;
      }

      console.log("Initializing a single mini carousel:", carousel);
      const track = carousel.querySelector('.carousel-track');
      const items = Array.from(track.children).filter(el => el.classList.contains('carousel-item'));

      if (items.length === 0) {
          console.warn("No carousel items found in this mini carousel:", carousel);
          return;
      }

      const prevButton = carousel.querySelector('.carousel-arrow.prev');
      const nextButton = carousel.querySelector('.carousel-arrow.next');
      const dotsContainer = carousel.querySelector('.carousel-dots');

      let currentIndex = 0;
      let modalIndex = 0;

      const modal = document.getElementById('carousel-image-modal');
      const modalImg = modal ? modal.querySelector('.carousel-modal-image') : null;
      const modalCaption = modal ? modal.querySelector('.carousel-modal-caption') : null;
      const closeModal = modal ? modal.querySelector('.carousel-modal-close') : null;
      const modalPrev = modal ? modal.querySelector('.modal-prev') : null;
      const modalNext = modal ? modal.querySelector('.modal-next') : null;

      console.log("Modal elements:", { modal, modalImg, modalCaption, closeModal, modalPrev, modalNext });

      const dots = [];
      if (dotsContainer && dotsContainer.children.length === 0) {
          items.forEach((_, i) => {
              const dot = document.createElement('div');
              dot.classList.add('carousel-dot');
              dotsContainer.appendChild(dot);
              dot.addEventListener('click', () => {
                  currentIndex = i;
                  updateCarousel();
              });
              dots.push(dot);
          });
      } else if (dotsContainer) {
          dots.push(...Array.from(dotsContainer.children));
      }

      function openModal(index, sourceCarousel) {
          if (!modal || !modalImg || !modalCaption) {
              console.error("Modal elements not found for openModal function.");
              return;
          }
          const item = Array.from(sourceCarousel.querySelectorAll('.carousel-item'))[index];
          modalIndex = index;

          const img = item.querySelector('img');
          if (img && img.src) {
              modalImg.src = img.src;
              modalCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
              modal.classList.add('active');
          } else {
              console.error("Image not found for modal at index:", index, "Item:", item);
          }
      }

      function closeModalView() {
          if (modal) {
              modal.classList.remove('active');
          }
      }

      function showModalImage(index) {
          if (!modalImg || !modalCaption) return;
          const item = items[index];
          const img = item.querySelector('img');
          if (img && img.src) {
              modalImg.src = img.src;
              modalCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
          } else {
              console.error("Image not found for modal at index:", index, "Item:", item);
          }
      }

      if (closeModal) closeModal.addEventListener('click', closeModalView);
      if (modal) {
          modal.addEventListener('click', (e) => {
              if (e.target === modal || e.target.classList.contains('carousel-modal-overlay')) {
                  closeModalView();
              }
          });
      }
      if (modalNext) {
          modalNext.addEventListener('click', () => {
              modalIndex = (modalIndex + 1) % items.length;
              showModalImage(modalIndex);
          });
      }
      if (modalPrev) {
          modalPrev.addEventListener('click', () => {
              modalIndex = (modalIndex - 1 + items.length) % items.length;
              showModalImage(modalIndex);
          });
      }

      function updateCarousel() {
          const total = items.length;
          const prevIndex = (currentIndex - 1 + total) % total;
          const nextIndex = (currentIndex + 1) % total;

          console.log("Updating carousel, currentIndex:", currentIndex, "prevIndex:", prevIndex, "nextIndex:", nextIndex);

          items.forEach((item, i) => {
              item.classList.remove('active', 'prev-active', 'next-active');
              item.style.opacity = '0.4';
              item.style.pointerEvents = 'none';
              item.onclick = null;
              const img = item.querySelector('img');
              if (img) img.style.display = 'block';
          });

          if (items[prevIndex]) {
              items[prevIndex].classList.add('prev-active');
              items[prevIndex].style.opacity = '0.4';
              console.log("Set prev-active at index:", prevIndex);
          }
          if (items[currentIndex]) {
              items[currentIndex].classList.add('active');
              items[currentIndex].style.opacity = '1';
              items[currentIndex].style.pointerEvents = 'auto';
              items[currentIndex].onclick = (e) => {
                  e.stopPropagation();
                  openModal(currentIndex, carousel);
              };
              console.log("Set active at index:", currentIndex);
          }
          if (items[nextIndex]) {
              items[nextIndex].classList.add('next-active');
              items[nextIndex].style.opacity = '0.4';
              console.log("Set next-active at index:", nextIndex);
          }

          dots.forEach((dot, i) => {
              dot.classList.toggle('active', i === currentIndex);
          });

          items.forEach((item, i) => {
              const img = item.querySelector('img');
              if (img) {
                  if (!img.complete) {
                      console.warn(`Image at index ${i} not yet loaded: ${img.src}`);
                      img.onload = () => { console.log(`Image at index ${i} loaded: ${img.src}`); updateCarousel(); };
                      img.onerror = () => console.error(`Failed to load image at index ${i}: ${img.src}`);
                  } else if (img.naturalWidth === 0) {
                      console.error(`Image at index ${i} failed to load (naturalWidth 0): ${img.src}`);
                  }
              }
          });
      }

      function nextSlide() {
          currentIndex = (currentIndex + 1) % items.length;
          updateCarousel();
      }

      function prevSlide() {
          currentIndex = (currentIndex - 1 + items.length) % items.length;
          updateCarousel();
      }

      prevButton?.addEventListener('click', prevSlide);
      nextButton?.addEventListener('click', nextSlide);

      updateCarousel();
      carousel.dataset.initialized = "true";
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
  });

  injectContent('components/carousel.html', 'carousel-placeholder', () => {
      console.log('Carousel injected. Setting up overlay.');
      setupCarouselOverlay();
      if (typeof startCarouselLoop === 'function') {
          startCarouselLoop();
      }
  });

  injectContent('components/footer.html', 'page-footer', () => {
      console.log('Footer injected.');
      setupTabbedSections();
  });

  setupTestimonialCarousel();

  const initialActiveTab = document.querySelector('.tab-section.active');
  if (initialActiveTab) {
      const initialContent = initialActiveTab.querySelector('.tab-content');
      if (initialContent) {
          initialContent.style.maxHeight = initialContent.scrollHeight + 'px';
          const miniCarouselsInInitialTab = initialContent.querySelectorAll('.js-carousel');
          miniCarouselsInInitialTab.forEach(carousel => {
              initializeSingleMiniCarousel(carousel);
          });
      }
  }
});

// Define dummy functions if `carousel.js` isn't loaded (though it should be).
if (typeof startCarouselLoop === 'undefined') {
  window.startCarouselLoop = function() { /* do nothing */ };
}
if (typeof setupCarouselLoop === 'undefined') {
  window.setupCarouselLoop = function() { /* do nothing */ };
}