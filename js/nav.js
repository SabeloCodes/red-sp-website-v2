document.addEventListener("DOMContentLoaded", () => {

  // Get the main navigation element (using its ID as per CSS #navigation)
  const navigation = document.getElementById("navigation");
  const hamburger = document.getElementById("hamburger"); // Assuming hamburger has this ID
  const mainNav = document.querySelector("nav.main-nav"); // This is your <nav class="main-nav"> element
  const carouselTextOverlay = document.querySelector(".carousel-text-overlay"); // If this is for your carousel text

  // --- Highlight active nav item ---
  function highlightActiveNav() {
    let currentPath = window.location.pathname.toLowerCase().replace(/^\/|\/$/g, '');
    currentPath = currentPath.split('/').pop() || 'index.html';
    currentPath = currentPath.replace('.html', '');

    document.querySelectorAll('nav.main-nav a').forEach(link => {
      let linkPath = link.getAttribute('href').toLowerCase().replace(/^\/|\/$/g, '');
      linkPath = linkPath.split('/').pop().replace('.html', '');

      const isServicesSubPage = currentPath.startsWith('services') && linkPath === currentPath;
      const isServicesParent = currentPath.startsWith('services') && linkPath === 'services';
      if (isServicesSubPage || isServicesParent || linkPath === currentPath) {
        link.classList.add('active');
        if (isServicesSubPage) {
          const parentServices = document.querySelector('a[href="services.html"]');
          if (parentServices) parentServices.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Setup hamburger and mobile events ---
  function setupHamburgerAndMobileEvents() {
    if (hamburger && mainNav) {
      console.log("Hamburger and mainNav found, setting up events"); // Debug log
      hamburger.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click from bubbling up to document and immediately closing
        hamburger.classList.toggle("open");
        mainNav.classList.toggle("show");
        // No need to highlightActiveNav here, it's already called on DOMContentLoaded

        // Disable scroll when mobile nav is open (optional, but good UX)
        if (mainNav.classList.contains("show")) {
          document.body.style.overflowY = 'hidden';
        } else {
          document.body.style.overflowY = 'auto';
        }

        if (carouselTextOverlay) {
          carouselTextOverlay.classList.toggle("hidden-on-mobile-nav-open");
          console.log("Toggled carousel text overlay"); // Debug log
        } else {
          console.log("Carousel text overlay not found"); // Debug log
        }
      });

      const servicesToggle = document.querySelector(".dropdown-toggle");
      if (servicesToggle) {
        servicesToggle.addEventListener("click", (e) => {
          if (window.innerWidth <= 768) { // Only apply for mobile widths
            e.preventDefault(); // Prevent default link navigation
            const parentLi = servicesToggle.parentElement; // Get the parent <li> of the dropdown
            parentLi.classList.toggle("active"); // Toggle 'active' class on the parent <li> to show/hide dropdown menu
            // No need to highlightActiveNav here
          }
        });
      }

      // Close mobile nav when clicking outside
      document.addEventListener("click", (event) => {
        if (window.innerWidth <= 768 && mainNav.classList.contains("show")) {
          const isClickInsideNav = mainNav.contains(event.target);
          const isClickInsideHamburger = hamburger.contains(event.target);
          if (!isClickInsideNav && !isClickInsideHamburger) {
            hamburger.classList.remove("open");
            mainNav.classList.remove("show");
            document.body.style.overflowY = 'auto'; // Re-enable scroll
            // No need to highlightActiveNav here

            if (carouselTextOverlay && carouselTextOverlay.classList.contains("hidden-on-mobile-nav-open")) {
              carouselTextOverlay.classList.remove("hidden-on-mobile-nav-open");
            }
          }
        }
      });

      // Close mobile nav when a link inside it is clicked (except dropdown toggles)
      mainNav.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) { // Only apply for mobile widths
            hamburger.classList.remove("open");
            mainNav.classList.remove("show");
            document.body.style.overflowY = 'auto'; // Re-enable scroll
            if (carouselTextOverlay) {
                carouselTextOverlay.classList.remove("hidden-on-mobile-nav-open");
            }
          }
        });
      });


    } else {
      console.log("Hamburger or mainNav not found. Check HTML IDs."); // Debug log
    }
  }

  // --- Back to Top Button Logic ---
  const backToTopButton = document.getElementById('back-to-top');
  // Define a scroll threshold to show the button (e.g., 200px down from the top)
  const scrollThreshold = 200;

  function toggleBackToTopButton() {
      if (backToTopButton) { // Ensure the button exists
          if (window.scrollY > scrollThreshold) {
              backToTopButton.classList.add('show');
          } else {
              backToTopButton.classList.remove('show');
          }
      }
  }

  // Add scroll event listener to show/hide the button
  window.addEventListener('scroll', toggleBackToTopButton);

  // Add click event listener to scroll to top
  if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      });
  }

  // Initial check on page load in case user refreshed partway down
  toggleBackToTopButton();

  // Call setup functions
  highlightActiveNav(); // Call once on load
  setupHamburgerAndMobileEvents();
});