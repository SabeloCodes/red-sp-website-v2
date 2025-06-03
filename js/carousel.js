// js/carousel.js

// Carousel state
let carouselImage1, carouselImage2;
let currentImageIndex = 0;
let showingImage1 = true;
const displayTime = 7000; // Time image is fully visible (7 seconds)
const fadeOutTime = 4000; // Time for fade out (4 seconds)
const zoomDuration = 8000; // Total zoom duration

const heroImages = [
  "img/PROJECTS/REV_CAPITAL/HighRes__W9A4780-Edit 1.jpg",
  "img/PROJECTS/US_HEDGE_FUND/Magnetar_0051-HDR.jpg",
  "img/PROJECTS/REV_CAPITAL/HighRes__W9A4741.jpg",
  "img/PROJECTS/US_HEDGE_FUND/Magnetar 0011.jpg",
  "img/PROJECTS/US_HEDGE_FUND/Magnetar_0051-HDR.jpg",
  "img/PROJECTS/REV_CAPITAL/HighRes__W9A4822 1.jpg"
];

// Setup carousel functionality
function setupCarouselLoop() {
  carouselImage1 = document.getElementById("carousel-image-1");
  carouselImage2 = document.getElementById("carousel-image-2");
  if (!carouselImage1 || !carouselImage2) return;

  // Initial state for the first image: visible and zooming
  carouselImage1.classList.add("active");
  carouselImage1.style.zIndex = 2;
  carouselImage2.style.zIndex = 1;

  // Start the image cycling
  setTimeout(swapImages, displayTime);
}

function swapImages() {
  const nextImageIndex = (currentImageIndex + 1) % heroImages.length;
  const nextSrc = heroImages[nextImageIndex];

  const incoming = showingImage1 ? carouselImage2 : carouselImage1;
  const outgoing = showingImage1 ? carouselImage1 : carouselImage2;

  // Prepare incoming image
  incoming.src = nextSrc;
  incoming.classList.remove("fading-out", "active");
  void incoming.offsetWidth; // Force reflow
  incoming.classList.add("active");
  incoming.style.zIndex = 2;

  // Fade out the outgoing image after the display time
  setTimeout(() => {
    outgoing.classList.add("fading-out");
    outgoing.style.zIndex = 1;
  }, 0); // Start fade-out immediately

  // Reset outgoing image after fade out
  setTimeout(() => {
    outgoing.classList.remove("active", "fading-out", "zoom-animation");
  }, fadeOutTime);

  showingImage1 = !showingImage1;
  currentImageIndex = nextImageIndex;

  // Schedule the next swap after the total cycle (display + fade)
  setTimeout(swapImages, displayTime + fadeOutTime);
}

function setupCarouselOverlay() {
  const h1 = document.querySelector("#carousel-container .overlay h1");
  const p = document.querySelector("#carousel-container .overlay p");
  const buttons = document.querySelectorAll("#carousel-container .btn");

  const heading = document.body.dataset.carouselHeading;
  const paragraph = document.body.dataset.carouselParagraph;
  const btn1 = document.body.dataset.carouselButton1;
  const btn1Link = document.body.dataset.carouselButton1Link;
  const btn2 = document.body.dataset.carouselButton2;
  const btn2Link = document.body.dataset.carouselButton2Link;

  if (h1 && heading) h1.textContent = heading;
  if (p && paragraph) p.textContent = paragraph;

  if (buttons[0] && btn1) {
    buttons[0].textContent = btn1;
    if (btn1Link) buttons[0].setAttribute("href", btn1Link);
  }

  if (buttons[1] && btn2) {
    buttons[1].textContent = btn2;
    if (btn2Link) buttons[1].setAttribute("href", btn2Link);
  }
}

window.setupCarouselLoop = setupCarouselLoop;
window.setupCarouselOverlay = setupCarouselOverlay;