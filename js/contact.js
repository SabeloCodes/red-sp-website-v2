// -------------------- contact.js --------------------

// Utility: Inject external HTML into a DOM target
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
  
  // Utility: Inject external CSS into the page head
  function injectCSS(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
  
  // Initialize page once DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // Inject navigation, then initialize shared nav logic
    injectContent('components/nav.html', 'navigation', () => {
      if (typeof highlightActiveNav === 'function') highlightActiveNav();
      if (typeof setupHamburger === 'function') setupHamburger();
    });
  
    // Inject footer
    injectContent('components/footer.html', 'page-footer');
  
    // Inject and initialize carousel
    injectCSS('css/carousel.css');
    injectContent('components/carousel.html', 'carousel-placeholder', () => {
      if (typeof setupCarouselOverlay === 'function') setupCarouselOverlay();
      if (typeof setupCarouselLoop === 'function') setupCarouselLoop();
    });
  
    // Form modal + validation logic
    const contactForm = document.getElementById("contactForm");
    const modal = document.getElementById("thankYouModal");
    const closeBtn = document.querySelector(".close-modal");
  
    if (contactForm && modal) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const formData = new FormData(contactForm);
        fetch(contactForm.action, {
          method: "POST",
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
          .then(response => {
            if (response.ok) {
              contactForm.reset();
              modal.classList.add("show");
  
              // Auto-close modal after 5s
              setTimeout(() => {
                modal.classList.remove("show");
              }, 5000);
            } else {
              alert("Something went wrong. Please try again.");
            }
          })
          .catch(() => {
            alert("There was a problem submitting the form.");
          });
      });
  
      // Manual close modal
      closeBtn?.addEventListener("click", () => {
        modal.classList.remove("show");
      });
  
      // Live input validation + underline behavior
      const inputs = contactForm.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.addEventListener("input", () => {
          if (input.checkValidity()) {
            input.classList.add("valid");
            input.classList.remove("invalid");
          } else {
            input.classList.add("invalid");
            input.classList.remove("valid");
          }
        });
  
        input.addEventListener("blur", () => {
          input.classList.remove("valid", "invalid");
        });
      });
    }
  });