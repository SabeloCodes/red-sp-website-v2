document.addEventListener("DOMContentLoaded", () => {
  // Check if nav is already injected by script.js
  const navTarget = document.getElementById("navigation");
  if (navTarget && !navTarget.innerHTML.trim()) {
    fetch("components/nav.html")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load nav.html: ${res.status}`);
        return res.text();
      })
      .then(html => {
        navTarget.innerHTML = html;
        highlightActiveNav();
        setupHamburger();
      })
      .catch(err => console.error('Error loading nav:', err));
  } else {
    highlightActiveNav();
    setupHamburger();
  }

  function highlightActiveNav() {
    // Normalize current path
    let currentPath = window.location.pathname.toLowerCase().replace(/^\/|\/$/g, '');
    currentPath = currentPath.split('/').pop() || 'index.html'; // Get last segment or 'index.html'
    currentPath = currentPath.replace('.html', ''); // Remove .html for comparison
    console.log('Current Path:', currentPath); // Debug log

    document.querySelectorAll('nav.main-nav a').forEach(link => {
      let linkPath = link.getAttribute('href').toLowerCase().replace(/^\/|\/$/g, '');
      linkPath = linkPath.split('/').pop().replace('.html', ''); // Get last segment, remove .html
      console.log('Link Path:', linkPath, 'for link:', link.textContent); // Debug log

      // Highlight dropdown item or parent 'SERVICES' if on a sub-page
      const isServicesSubPage = currentPath.startsWith('services') && linkPath === currentPath;
      const isServicesParent = currentPath.startsWith('services') && linkPath === 'services';
      if (isServicesSubPage || isServicesParent || linkPath === currentPath) {
        link.classList.add('active');
        console.log('Active link set:', link.textContent); // Debug log
        // If a dropdown item is active, also activate parent 'SERVICES'
        if (isServicesSubPage) {
          const parentServices = document.querySelector('a[href="services.html"]');
          if (parentServices) parentServices.classList.add('active');
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  function setupHamburger() {
    const hamburger = document.querySelector(".hamburger");
    const mainNav = document.querySelector(".main-nav");

    if (hamburger && mainNav) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("open");
        mainNav.classList.toggle("show");
        highlightActiveNav(); // Re-apply active class
      });

      // Toggle dropdown on click for mobile
      const servicesToggle = document.querySelector(".dropdown-toggle");
      if (servicesToggle) {
        servicesToggle.addEventListener("click", (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault(); // Prevent navigation on click
            const parentLi = servicesToggle.parentElement;
            parentLi.classList.toggle("active");
            highlightActiveNav(); // Re-apply active class
          }
        });
      }
    }
  }
});