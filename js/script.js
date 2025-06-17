function injectContent(url, targetId, callback) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.text();
    })
    .then(html => {
      const target = document.getElementById(targetId);
      if (target) {
        target.innerHTML = html;
        if (typeof callback === 'function') callback();
      }
    })
    .catch(err => console.error(`Error loading ${url}:`, err));
}

function injectCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function highlightActiveNav() {
  // Normalize current path (remove leading/trailing slashes, query params)
  let currentPath = window.location.pathname.toLowerCase();
  currentPath = currentPath.replace(/^\/+|\/+$/g, '').split('?')[0];
  if (currentPath === '') currentPath = 'index.html';

  console.log('Current Path:', currentPath); // Debug log

  document.querySelectorAll('nav.main-nav ul li a').forEach(link => {
    let linkPath = link.getAttribute('href').toLowerCase();
    linkPath = linkPath.replace(/^\/+|\/+$/g, '').split('?')[0];

    console.log('Link Path:', linkPath); // Debug log

    if (linkPath === currentPath) {
      link.classList.add('active');
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
      highlightActiveNav(); // Re-run to ensure active state in mobile menu
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Inject nav and run highlighting + hamburger setup
  injectContent('components/nav.html', 'navigation', () => {
    highlightActiveNav();
    setupHamburger();
  });
  injectContent('components/footer.html', 'page-footer');

  injectCSS('css/carousel.css');
  injectContent('components/carousel.html', 'carousel-placeholder', () => {
    if (typeof setupCarouselOverlay === 'function') setupCarouselOverlay();
    if (typeof setupCarouselLoop === 'function') setupCarouselLoop();
  });

  // Portfolio Carousel Logic
  const slides = document.querySelectorAll(".portfolio-slide");
  const nextBtn = document.querySelector(".portfolio-next");
  const prevBtn = document.querySelector(".portfolio-prev");
  const dotsContainer = document.querySelector(".portfolio-dots");
  let currentSlide = 0;

  if (slides.length > 0 && dotsContainer && nextBtn && prevBtn) {
    function updateSlides() {
      slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === currentSlide);
      });

      const dots = dotsContainer.querySelectorAll(".portfolio-dot");
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide);
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

    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("portfolio-dot");
      if (i === currentSlide) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentSlide = i;
        updateSlides();
      });
      dotsContainer.appendChild(dot);
    });

    updateSlides();
  }
});

// Ensure overlay.js logic is included
function setupCarouselOverlay() {
  const carousel = document.querySelector("#carousel-container");
  if (!carousel) return;

  const observer = new MutationObserver(() => {
    const overlay = carousel.querySelector(".overlay");
    if (!overlay) return;

    observer.disconnect();

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

    const heading = document.getElementById("carousel-heading");
    const paragraph = document.getElementById("carousel-paragraph");
    const btn1 = document.querySelector("#carousel-btn-1");
    const btn2 = document.querySelector("#carousel-btn-2");

    const {
      carouselHeading,
      carouselParagraph,
      carouselButton1,
      carouselButton2,
    } = document.body.dataset;

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
  });

  observer.observe(carousel, { childList: true, subtree: true });

  if (typeof startCarouselLoop === "function") {
    startCarouselLoop();
  }
}