// Final fix: Only attach modal click handler to active item and ensure only one modal opens.
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.js-carousel');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(track.children).filter(el => el.classList.contains('carousel-item'));
    const prevButton = carousel.querySelector('.carousel-arrow.prev');
    const nextButton = carousel.querySelector('.carousel-arrow.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentIndex = 0;
    let modalIndex = 0;

    const modal = document.getElementById('carousel-image-modal');
    const modalImg = modal.querySelector('.carousel-modal-image');
    const modalCaption = modal.querySelector('.carousel-modal-caption');
    const closeModal = modal.querySelector('.carousel-modal-close');
    const modalPrev = modal.querySelector('.modal-prev');
    const modalNext = modal.querySelector('.modal-next');

    // Create dot indicators
    const dots = items.map((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      dotsContainer?.appendChild(dot);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateCarousel();
      });
      return dot;
    });

    function openModal(index, sourceCarousel) {
      const item = Array.from(sourceCarousel.querySelectorAll('.carousel-item'))[index];
      modalIndex = index;

      const img = item.querySelector('img');
      modalImg.src = img.src;
      modalCaption.textContent = img.getAttribute('data-caption') || img.alt || '';
      modal.classList.add('active');
    }

    function closeModalView() {
      modal.classList.remove('active');
    }

    function showModalImage(index) {
      const item = items[index];
      modalImg.src = item.querySelector('img').src;
      modalCaption.textContent = item.querySelector('img').getAttribute('data-caption') || item.querySelector('img').alt || '';
    }

    closeModal.addEventListener('click', closeModalView);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('carousel-modal-overlay')) {
        closeModalView();
      }
    });
    modalNext.addEventListener('click', () => {
      modalIndex = (modalIndex + 1) % items.length;
      showModalImage(modalIndex);
    });
    modalPrev.addEventListener('click', () => {
      modalIndex = (modalIndex - 1 + items.length) % items.length;
      showModalImage(modalIndex);
    });

    function updateCarousel() {
      const total = items.length;
      const prevIndex = (currentIndex - 1 + total) % total;
      const nextIndex = (currentIndex + 1) % total;

      items.forEach((item, i) => {
        item.classList.remove('active');
        item.style.opacity = '0.4';
        item.style.pointerEvents = 'none';
        item.style.display = 'none';
        item.style.order = '0';
        item.onclick = null; // Remove old click
      });

      items[prevIndex].style.display = 'block';
      items[prevIndex].style.order = '1';

      const currentItem = items[currentIndex];
      currentItem.style.display = 'block';
      currentItem.classList.add('active');
      currentItem.style.opacity = '1';
      currentItem.style.pointerEvents = 'auto';
      currentItem.style.order = '2';
      currentItem.onclick = (e) => {
        e.stopPropagation();
        openModal(currentIndex, carousel);
      };

      items[nextIndex].style.display = 'block';
      items[nextIndex].style.order = '3';

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
    }

    updateCarousel();
    nextButton?.addEventListener('click', nextSlide);
    prevButton?.addEventListener('click', prevSlide);
  });
});