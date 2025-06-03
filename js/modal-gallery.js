// modal-gallery.js

document.addEventListener('DOMContentLoaded', () => {
  const allCarousels = document.querySelectorAll('.js-carousel');

  allCarousels.forEach((carousel, index) => {
    const items = Array.from(carousel.querySelectorAll('.carousel-item img'));

    // Create modal elements
    const modal = document.createElement('div');
    modal.classList.add('carousel-modal');
    modal.innerHTML = `
      <div class="carousel-modal-overlay"></div>
      <div class="carousel-modal-content">
        <span class="carousel-modal-close">&times;</span>
        <img src="" class="carousel-modal-image" alt="Large Preview">
        <button class="carousel-arrow modal-prev">&#10094;</button>
        <button class="carousel-arrow modal-next">&#10095;</button>
      </div>
    `;
    document.body.appendChild(modal);

    const modalOverlay = modal.querySelector('.carousel-modal-overlay');
    const modalContent = modal.querySelector('.carousel-modal-content');
    const modalImage = modal.querySelector('.carousel-modal-image');
    const closeButton = modal.querySelector('.carousel-modal-close');
    const prevButton = modal.querySelector('.modal-prev');
    const nextButton = modal.querySelector('.modal-next');

    let currentIndex = 0;

    function openModal(index) {
      currentIndex = index;
      modalImage.src = items[index].src;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    function showImage(index) {
      currentIndex = (index + items.length) % items.length;
      modalImage.src = items[currentIndex].src;
    }

    items.forEach((img, i) => {
      img.addEventListener('click', () => openModal(i));
    });

    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    prevButton.addEventListener('click', () => showImage(currentIndex - 1));
    nextButton.addEventListener('click', () => showImage(currentIndex + 1));
  });
});
