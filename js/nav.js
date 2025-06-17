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
    currentPath = currentPath || 'index'; // Default to 'index' for home
    console.log('Current Path:', currentPath); // Debug log

    document.querySelectorAll('nav.main-nav a').forEach(link => {
      let linkPath = link.getAttribute('href').toLowerCase().replace(/^\/|\/$/g, '');
      linkPath = linkPath.replace('.html', ''); // Handle .html or clean URLs
      console.log('Link Path:', linkPath, 'for link:', link.textContent); // Debug log

      if (linkPath === currentPath || (currentPath === 'index' && linkPath === '')) {
        link.classList.add('active');
        console.log('Active link set:', link.textContent); // Debug log
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
    }
  }
});