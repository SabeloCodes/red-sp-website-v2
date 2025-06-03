// js/overlay.js

function setupCarouselOverlay() {
  const carousel = document.querySelector("#carousel-container");
  if (!carousel) return;

  // Use a MutationObserver to wait for the overlay to be injected
  const observer = new MutationObserver(() => {
    const overlay = carousel.querySelector(".overlay");
    if (!overlay) return;

    observer.disconnect(); // Stop watching once overlay is present

    // Add page-specific overlay class
    const path = window.location.pathname;
    if (path.includes("who-we-are")) {
      overlay.classList.add("overlay-who-we-are");
    } else if (path.includes("services")) {
      overlay.classList.add("overlay-services");
    } else if (path.includes("case-studies")) {
      overlay.classList.add("overlay-case-studies");
    } else if (path.includes("contact")) {
      overlay.classList.add("overlay-contact");
    } else if (path.endsWith("/") || path.endsWith("/index.html") || path === "") {
      overlay.classList.add("overlay-home");
    }

    // Inject overlay content from body dataset
    const heading = document.getElementById("carousel-heading");
    const paragraph = document.getElementById("carousel-paragraph");
    const buttons = overlay.querySelectorAll(".btn");

    const {
      carouselHeading,
      carouselParagraph,
      carouselButton1,
      carouselButton2,
    } = document.body.dataset;

    if (heading && carouselHeading) heading.textContent = carouselHeading;
    if (paragraph && carouselParagraph) paragraph.textContent = carouselParagraph;
    if (buttons[0] && carouselButton1) buttons[0].textContent = carouselButton1;
    if (buttons[1] && carouselButton2) buttons[1].textContent = carouselButton2;

    buttons.forEach(btn => btn.classList.add("btn-animate"));
  });

  observer.observe(carousel, { childList: true, subtree: true });

  // Optional: start carousel loop
  if (typeof startCarouselLoop === "function") {
    startCarouselLoop();
  }
}
