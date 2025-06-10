function setupCarouselOverlay() {
  const carousel = document.querySelector("#carousel-container");
  if (!carousel) return;

  const observer = new MutationObserver(() => {
    const overlay = carousel.querySelector(".overlay");
    if (!overlay) return;

    observer.disconnect();

    const path = window.location.pathname;
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

    // Log for debugging
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