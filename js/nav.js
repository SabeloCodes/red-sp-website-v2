// js/nav.js (Shared nav logic across all pages)

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Inject nav and THEN highlight
  fetch("components/nav.html")
    .then(res => res.text())
    .then(html => {
      const navTarget = document.getElementById("navigation");
      if (navTarget) {
        navTarget.innerHTML = html;
        highlightActiveNav(); // 👈 Run only after nav is injected
        setupHamburger();     // 👈 Run hamburger toggle after injection
      }
    });

  function highlightActiveNav() {
    const currentPath = window.location.pathname.replace(/\/$/, "").split("/").pop().toLowerCase();
    const navLinks = document.querySelectorAll("nav a");

    navLinks.forEach(link => {
      const linkPath = link.getAttribute("href").replace(/\/$/, "").split("/").pop().toLowerCase();
      if (linkPath === currentPath) {
        link.classList.add("active");
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
      });
    }
  }
});