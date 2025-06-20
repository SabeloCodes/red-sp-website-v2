document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('carousel-image-modal');
  if (!modal) {
    console.error('Modal #carousel-image-modal not found');
    return;
  }

  const modalImage = modal.querySelector('.carousel-modal-image');
  const modalCaption = modal.querySelector('.carousel-modal-caption');
  let modalClose = modal.querySelector('.carousel-modal-close');
  let modalOverlay = modal.querySelector('.carousel-modal-overlay');
  const modalPrev = modal.querySelector('.modal-prev');
  const modalNext = modal.querySelector('.modal-next');

  let currentImages = [];
  let currentIndex = 0;

  // Update modal content
  function updateModalContent() {
    if (currentImages.length === 0) return;
    const image = currentImages[currentIndex];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modalCaption.textContent = image.caption;
  }

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    modal.style.display = 'none';
    modal.style.zIndex = '-1'; // Ensure overlay doesn't intercept
    document.body.style.overflow = '';
    currentIndex = 0;
    console.log('Modal closed');
  }

  // Clone close and overlay to prevent duplicate listeners
  const newClose = modalClose.cloneNode(true);
  modalClose.parentNode.replaceChild(newClose, modalClose);
  modalClose = newClose;

  const newOverlay = modalOverlay.cloneNode(true);
  modalOverlay.parentNode.replaceChild(newOverlay, modalOverlay);
  modalOverlay = newOverlay;

  // Add close listeners
  modalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });
  modalOverlay.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateModalContent();
    } else if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateModalContent();
    }
  });

  // Previous/next navigation
  modalPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModalContent();
  });
  modalNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModalContent();
  });

  // Handle all clicks (images and View Gallery) via document delegation
  document.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent mini-carousel interference

    // Handle image clicks
    const img = e.target.closest('.js-carousel .carousel-item img');
    if (img) {
      console.log('Image clicked:', img.src);
      const carousel = img.closest('.js-carousel');
      if (!carousel) {
        console.error('Carousel not found for image:', img.src);
        return;
      }

      currentImages = Array.from(carousel.querySelectorAll('.carousel-item img')).map(img => ({
        src: img.src,
        alt: img.alt,
        caption: img.getAttribute('data-caption') || img.alt
      }));

      currentIndex = currentImages.findIndex(image => image.src === img.src);
      if (currentIndex === -1) currentIndex = 0;

      updateModalContent();
      modal.classList.add('active');
      modal.style.display = '';
      modal.style.zIndex = '9999';
      document.body.style.overflow = 'hidden';
      return;
    }

    // Handle View Gallery clicks
    const button = e.target.closest('.open-gallery');
    if (button) {
      console.log('View Gallery clicked:', button.getAttribute('data-gallery'));
      const galleryId = button.getAttribute('data-gallery');
      const section = document.getElementById(`${galleryId}-section`);
      if (!section) {
        console.error(`Section #${galleryId}-section not found`);
        return;
      }

      currentImages = Array.from(section.querySelectorAll('.carousel-item img')).map(img => ({
        src: img.src,
        alt: img.alt,
        caption: img.getAttribute('data-caption') || img.alt
      }));

      if (currentImages.length === 0) {
        console.error(`No images found in #${galleryId}-section`);
        return;
      }

      currentIndex = 0;
      updateModalContent();
      modal.classList.add('active');
      modal.style.display = '';
      modal.style.zIndex = '9999';
      document.body.style.overflow = 'hidden';
      return;
    }

    console.log('Click ignored:', e.target);
  });

  // Fallback direct listeners
  const attachListeners = () => {
    document.querySelectorAll('.js-carousel .carousel-item img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Direct image click:', img.src);
        const carousel = img.closest('.js-carousel');
        if (!carousel) return;

        currentImages = Array.from(carousel.querySelectorAll('.carousel-item img')).map(img => ({
          src: img.src,
          alt: img.alt,
          caption: img.getAttribute('data-caption') || img.alt
        }));

        currentIndex = currentImages.findIndex(image => image.src === img.src);
        if (currentIndex === -1) currentIndex = 0;

        updateModalContent();
        modal.classList.add('active');
        modal.style.display = '';
        modal.style.zIndex = '9999';
        document.body.style.overflow = 'hidden';
      });
    });

    document.querySelectorAll('.open-gallery').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Direct View Gallery click:', button.getAttribute('data-gallery'));
        const galleryId = button.getAttribute('data-gallery');
        const section = document.getElementById(`${galleryId}-section`);
        if (!section) {
          console.error(`Section #${galleryId}-section not found`);
          return;
        }

        currentImages = Array.from(section.querySelectorAll('.carousel-item img')).map(img => ({
          src: img.src,
          alt: img.alt,
          caption: img.getAttribute('data-caption') || img.alt
        }));

        if (currentImages.length === 0) {
          console.error(`No images found in #${galleryId}-section`);
          return;
        }

        currentIndex = 0;
        updateModalContent();
        modal.classList.add('active');
        modal.style.display = '';
        modal.style.zIndex = '9999';
        document.body.style.overflow = 'hidden';
      });
    });
  };

  attachListeners();

  // Re-attach listeners on DOM changes
  const observer = new MutationObserver(() => {
    console.log('DOM mutated, re-attaching listeners');
    attachListeners();
  });

  document.querySelectorAll('.js-carousel').forEach(carousel => {
    observer.observe(carousel, { childList: true, subtree: true });
  });
});