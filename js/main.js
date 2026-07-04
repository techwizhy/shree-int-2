/* ============================================================
   Shree Interior — Premium Landing Page Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initRevealOnScroll();
  initStickyHeader();
  initMobileMenu();
  initCustomCursor();
  initHeroCinematic();
  initProcessFlow();
  initAccordion();
  initGalleryDrag();
  initScrollToTop();
  initModal();
  initFaqAccordion();
  initSideRailMobile();
  initPromoPopup(); // Bottom Popup trigger
  initStatsCounter();
  initTestimonialsSlider();
  initPartnerTrail();
  initStackingCards();
  initSuccessStoriesAccordion();
});

/* ------------------------------------------------------------
   1. Sticky Header
   – Adds .header--scrolled when page is scrolled past 50px.
   – Uses rAF-throttled scroll listener for performance.
   ------------------------------------------------------------ */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('header--scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ------------------------------------------------------------
   2. Mobile Menu (Drawer)
   – Toggles .mobile-drawer--open on hamburger click.
   – Toggles .header__hamburger--open for the X animation.
   – Closes on link click, overlay click, or outside tap.
   – Locks body scroll while drawer is open.
   – Handles Products sub-list accordion inside the drawer.
   ------------------------------------------------------------ */
function initMobileMenu() {
  const hamburger = document.querySelector('.header__hamburger');
  const drawer    = document.querySelector('.mobile-drawer');
  if (!hamburger || !drawer) return;

  const navLinks       = drawer.querySelectorAll('a');
  const productsToggle = drawer.querySelector('.mobile-drawer__products-toggle');
  const productsList   = drawer.querySelector('.mobile-drawer__products-list');

  function openDrawer() {
    drawer.classList.add('mobile-drawer--open');
    hamburger.classList.add('header__hamburger--open');
    document.body.style.overflow = 'hidden';
  }

  // Delay body unlock slightly for smooth slide-out transition
  function closeDrawer() {
    drawer.classList.remove('mobile-drawer--open');
    hamburger.classList.remove('header__hamburger--open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('mobile-drawer--open');
    isOpen ? closeDrawer() : openDrawer();
  });

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  if (productsToggle && productsList) {
    productsToggle.addEventListener('click', () => {
      const isExpanded = productsToggle.classList.contains('mobile-drawer__products-toggle--open');
      productsToggle.classList.toggle('mobile-drawer__products-toggle--open');
      if (isExpanded) {
        productsList.style.maxHeight = '0';
      } else {
        productsList.style.maxHeight = productsList.scrollHeight + 'px';
      }
    });
  }
}

/* ------------------------------------------------------------
   3. Custom Cursor (Orange outline ring, orange dot + native cursor remains visible)
   – Centered exactly on the mouse coordinates.
   – Changes color to brand blue and enlarges on interactive elements.
   ------------------------------------------------------------ */
function initCustomCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.getElementById('customCursor');
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    // Smoothen the motion of the custom circle / dot
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animate);
  }
  animate();

  cursor.classList.add('cursor--active');

  // Use event delegation for hover states to make cursor interactions extremely responsive and robust
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, [data-modal-trigger], .gallery__card, .services-grid__card, .accordion__header, .faq__question, .why-us__item, .testimonials__nav-btn, .testimonials__dot, .scroll-top')) {
      cursor.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, [data-modal-trigger], .gallery__card, .services-grid__card, .accordion__header, .faq__question, .why-us__item, .testimonials__nav-btn, .testimonials__dot, .scroll-top')) {
      cursor.classList.remove('cursor--hover');
    }
  });
}

/* ------------------------------------------------------------
   4. Process Flow (Scroll-Triggered Steps)
   – IntersectionObserver reveals each .process-flow__step.
   ------------------------------------------------------------ */
function initProcessFlow() {
  const steps = document.querySelectorAll('.process-flow__step');
  if (!steps.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(steps).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('process-flow__step--active');
        }, index * 400);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });

  steps.forEach(step => observer.observe(step));
}

/* ------------------------------------------------------------
   5. Services Accordion (Single-Open, Realignment, Floating card styles)
   – Point 1 auto-expanded on load.
   – Smooth expansion via scrollHeight.
   ------------------------------------------------------------ */
function initAccordion() {
  const items = document.querySelectorAll('.accordion__item');
  if (!items.length) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const body   = item.querySelector('.accordion__body');
    if (!header || !body) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('accordion__item--open');

      items.forEach(i => {
        i.classList.remove('accordion__item--open');
        const iBody = i.querySelector('.accordion__body');
        if (iBody) iBody.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('accordion__item--open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Auto expand point 1 on initial load
  const firstItem = items[0];
  if (firstItem) {
    const firstBody = firstItem.querySelector('.accordion__body');
    if (firstBody) {
      firstBody.style.maxHeight = firstBody.scrollHeight + 'px';
    }
  }
}

/* ------------------------------------------------------------
   6. Gallery Drag (Desktop) + Circular "Drag" Badge cursor tracker + Auto-Scroll
   – Desktop: Grab track to drag with inertia.
   – Circular "Drag" badge follows mouse pointer tip inside the gallery.
   – Continuous leftward auto-scrolling (pauses on hover).
   ------------------------------------------------------------ */
function initGalleryDrag() {
  const track     = document.querySelector('.gallery__track');
  const gallery   = document.querySelector('.gallery');
  const container = document.getElementById('galleryContainer');
  const dragBadge = document.getElementById('galleryDragBadge');
  const cursor    = document.getElementById('customCursor');
  if (!track || !gallery) return;

  let isDragging      = false;
  let startX          = 0;
  let currentTranslate = 0;
  let prevTranslate   = 0;
  let velocity        = 0;
  let lastX           = 0;
  let animId          = 0;
  let autoScrollId    = null;
  let autoScrollPaused = false;

  /* ---------- Desktop: drag & badge tracker ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {

    // Custom "Drag" circular badge follows cursor inside gallery container
    if (container && dragBadge) {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x    = e.clientX - rect.left;
        const y    = e.clientY - rect.top;
        dragBadge.style.left = x + 'px';
        dragBadge.style.top  = y + 'px';
      });

      container.addEventListener('mouseenter', () => {
        if (cursor) cursor.classList.add('cursor--hidden');
      });

      container.addEventListener('mouseleave', () => {
        if (cursor) cursor.classList.remove('cursor--hidden');
      });
    }

    // --- Mouse Down ---
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX     = e.clientX;
      lastX      = startX;
      velocity   = 0;
      cancelAnimationFrame(animId);
      track.classList.add('grabbing');
      track.style.transition = 'none';
    });

    // --- Mouse Move ---
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diff      = e.clientX - startX;
      let target      = prevTranslate + diff;
      const maxScroll = Math.min(0, gallery.clientWidth - track.scrollWidth);

      if (target > 0) {
        target *= 0.25;
      } else if (target < maxScroll) {
        target = maxScroll + (target - maxScroll) * 0.25;
      }

      currentTranslate = target;
      track.style.transform = `translateX(${currentTranslate}px)`;
      velocity = e.clientX - lastX;
      lastX    = e.clientX;
    });

    // --- Mouse Up ---
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging    = false;
      prevTranslate = currentTranslate;
      track.classList.remove('grabbing');
      animId = requestAnimationFrame(applyMomentum);
    });

    // --- Continuous Auto-Scroll Left ---
    function startAutoScroll() {
      autoScrollId = setInterval(() => {
        if (autoScrollPaused || isDragging) return;
        const maxScroll = Math.min(0, gallery.clientWidth - track.scrollWidth);
        currentTranslate -= 0.6; // Speed rate
        if (currentTranslate < maxScroll) currentTranslate = 0; // wrap back
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
      }, 16);
    }
    startAutoScroll();

    gallery.addEventListener('mouseenter', () => { autoScrollPaused = true; });
    gallery.addEventListener('mouseleave', () => {
      setTimeout(() => { autoScrollPaused = false; }, 2000);
    });

  } else {
    /* ---------- Touch: native horizontal scroll ---------- */
    track.style.overflowX = 'auto';
    track.style.cursor    = 'default';
  }

  function applyMomentum() {
    if (isDragging) return;

    velocity *= 0.93;
    currentTranslate += velocity;

    const maxScroll = Math.min(0, gallery.clientWidth - track.scrollWidth);

    if (currentTranslate > 0) {
      currentTranslate += (0 - currentTranslate) * 0.15;
      if (Math.abs(currentTranslate) < 0.5) currentTranslate = 0;
    } else if (currentTranslate < maxScroll) {
      currentTranslate += (maxScroll - currentTranslate) * 0.15;
      if (Math.abs(currentTranslate - maxScroll) < 0.5) currentTranslate = maxScroll;
    }

    track.style.transform = `translateX(${currentTranslate}px)`;
    prevTranslate = currentTranslate;

    if (Math.abs(velocity) > 0.1) {
      animId = requestAnimationFrame(applyMomentum);
    }
  }
}

/* ------------------------------------------------------------
   7. Scroll-to-Top Button (Water Fill Effect)
   – Vertical background height fill matches scroll percentage.
   ------------------------------------------------------------ */
function initScrollToTop() {
  const btn  = document.getElementById('scrollTop');
  const fill = document.getElementById('scrollTopFill');
  if (!btn || !fill) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop    = window.scrollY;
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        // Dynamic water level vertical rise
        fill.style.height = scrollPercent + '%';

        // Add class to toggle arrow color when water rises past 50%
        btn.classList.toggle('scroll-top--filled', scrollPercent > 50);
        btn.classList.toggle('scroll-top--visible', scrollTop > 300);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    const duration = 1500; // 1.5 seconds for slow, premium scroll
    const start = window.scrollY;
    const startTime = performance.now();

    function scrollStep(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      
      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  });
}

/* ------------------------------------------------------------
   8. Enquiry Modal
   ------------------------------------------------------------ */
function initModal() {
  const modal = document.getElementById('enquiryModal');
  if (!modal) return;

  const overlay   = modal.querySelector('.modal__overlay');
  const closeBtn  = modal.querySelector('.modal__close');
  const form      = modal.querySelector('#enquiryForm');
  const successEl = modal.querySelector('.modal__success');
  const formEl    = modal.querySelector('.modal__form-fields');

  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('modal--open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay)  overlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn    = form.querySelector('.modal__submit-btn');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = 'Sending...';
      submitBtn.disabled    = true;

      setTimeout(() => {
        if (formEl)    formEl.classList.add('modal__form-fields--hidden');
        if (successEl) successEl.classList.add('modal__success--visible');

        setTimeout(() => {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled    = false;
          if (formEl)    formEl.classList.remove('modal__form-fields--hidden');
          if (successEl) successEl.classList.remove('modal__success--visible');
          closeModal();
        }, 3000);
      }, 1000);
    });
  }
}

/* ------------------------------------------------------------
   9. FAQ Accordion (Multi-Open)
   ------------------------------------------------------------ */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer   = item.querySelector('.faq__answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq__item--open');
      item.classList.toggle('faq__item--open');
      answer.style.maxHeight = isOpen ? '0' : answer.scrollHeight + 'px';
    });
  });
}

/* ------------------------------------------------------------
   10. Side-Rail Mobile Adaptation
   ------------------------------------------------------------ */
function initSideRailMobile() {
  const rail = document.querySelector('.side-rail');
  if (!rail) return;

  function checkViewport() {
    rail.classList.toggle('side-rail--mobile', window.innerWidth < 768);
  }
  checkViewport();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(checkViewport, 250);
  });
}

/* ------------------------------------------------------------
   11. Bottom Promo Popup (Triggered past 300 px scroll)
   – User cancel state stored in sessionStorage.
   ------------------------------------------------------------ */
function initPromoPopup() {
  const popup    = document.getElementById('promoPopup');
  const closeBtn = document.getElementById('promoClose');
  if (!popup || !closeBtn) return;

  if (sessionStorage.getItem('promoDismissed') === 'true') return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (sessionStorage.getItem('promoDismissed') === 'true') return;

    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          popup.classList.add('promo-popup--visible');
        } else {
          popup.classList.remove('promo-popup--visible');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('promo-popup--visible');
    sessionStorage.setItem('promoDismissed', 'true');
  });
}

/* ------------------------------------------------------------
   12. Animated Stats Counter (Scroll Triggered)
   – Counts up from 0 (or baseline for years) to data-target.
   ------------------------------------------------------------ */
function initStatsCounter() {
  const stats = document.querySelectorAll('.hero__stat-value');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        observer.disconnect(); // Trigger once
      }
    });
  }, { threshold: 0.2 });

  const statsContainer = document.querySelector('.hero__stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }

  function animateStats() {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds counting animation
      const startTime = performance.now();
      const startValue = target > 1000 ? target - 50 : 0; // Starts closer for years (e.g. 1960 for Since 2010)

      function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing outQuad
        const easeProgress = progress * (2 - progress);
        
        const currentValue = Math.floor(startValue + easeProgress * (target - startValue));
        stat.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    });
  }
}

/* ------------------------------------------------------------
   13. Client Testimonials Slider
   – Slides/fades active slides, syncs indicators (dots).
   – Prev: Outline circle, Next: Solid orange circle.
   ------------------------------------------------------------ */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const slides = document.querySelectorAll('.testimonials__slide');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');
  const dotsContainer = document.getElementById('testimonialsDots');
  if (!track || !slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.testimonials__dot') : [];

  function showSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    slides.forEach((slide, i) => {
      slide.classList.toggle('testimonials__slide--active', i === currentIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });

  // Autoplay functionality
  let autoplayTimer = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 6000);

  const sliderWrapper = document.querySelector('.testimonials__slider-wrapper');
  if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    sliderWrapper.addEventListener('mouseleave', () => {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => {
        showSlide(currentIndex + 1);
      }, 6000);
    });
  }
}

/* ------------------------------------------------------------
   14. Minimalist Preloader
   ------------------------------------------------------------ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Gracefully fade out preloader on window load
  window.addEventListener('load', () => {
    preloader.classList.add('preloader--hidden');
  });

  // Fallback: fade out after 2.5 seconds in case load event does not fire
  setTimeout(() => {
    preloader.classList.add('preloader--hidden');
  }, 2500);
}

/* ------------------------------------------------------------
   15. Reveal on Scroll (Intersection Observer)
   ------------------------------------------------------------ */
function initRevealOnScroll() {
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        if (element.classList.contains('reveal-up')) {
          element.classList.add('reveal-up--active');
        } else {
          element.classList.add('reveal-fade--active');
        }
        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ------------------------------------------------------------
   16. Partner With Us Interactive Image Trail
   ------------------------------------------------------------ */
function initPartnerTrail() {
  const container = document.getElementById('partnerCard');
  const trailBox = document.getElementById('partnerTrail');
  if (!container || !trailBox) return;

  const images = [
    'assets/images/portfolio/img_1.jpg',
    'assets/images/portfolio/img_2.jpg',
    'assets/images/portfolio/img_3.jpg',
    'assets/images/portfolio/img_4.jpg',
    'assets/images/portfolio/img_5.jpg',
    'assets/images/portfolio/img_6.jpg',
    'assets/images/portfolio/img_7.jpg',
    'assets/images/portfolio/img_8.jpg',
    'assets/images/portfolio/img_9.jpg',
    'assets/images/portfolio/img_10.jpg',
    'assets/images/portfolio/img_11.jpg',
    'assets/images/portfolio/img_12.jpg',
    'assets/images/portfolio/img_13.jpg',
    'assets/images/portfolio/img_14.jpg',
    'assets/images/portfolio/img_15.jpg',
    'assets/images/portfolio/img_16.jpg'
  ];

  let trail = [];
  let lastSpawnTime = 0;
  let imageIndex = 0;
  let animId = null;

  function animateTrail() {
    const now = Date.now();
    trail = trail.filter(item => {
      const age = now - item.createdAt;
      if (age >= 1000) {
        if (item.el && item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
        return false;
      }
      const progress = Math.min(1, age / 1000);
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.35;
      if (item.el) {
        item.el.style.opacity = opacity;
        item.el.style.transform = `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${scale})`;
      }
      return true;
    });

    if (trail.length > 0) {
      animId = requestAnimationFrame(animateTrail);
    } else {
      animId = null;
    }
  }

  container.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawnTime < 80) return;
    lastSpawnTime = now;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgUrl = images[imageIndex % images.length];
    imageIndex++;

    const rotation = (Math.random() - 0.5) * 24;
    const imgEl = document.createElement('img');
    imgEl.src = imgUrl;
    imgEl.alt = 'Shree Interior Portfolio';
    imgEl.className = 'partner-trail-item';
    imgEl.style.left = `${x}px`;
    imgEl.style.top = `${y}px`;
    imgEl.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
    imgEl.style.opacity = '1';

    trailBox.appendChild(imgEl);

    trail.push({
      el: imgEl,
      rotation: rotation,
      createdAt: now
    });

    if (!animId) {
      animId = requestAnimationFrame(animateTrail);
    }
  });
}

/* ------------------------------------------------------------
   17. Stacking Cards Transform & Opacity Animation (Demo-1 Formula)
   ------------------------------------------------------------ */
function initStackingCards() {
  const cards = document.querySelectorAll('.stack-card');
  if (!cards.length) return;

  const totalCards = cards.length;

  const updateCardTransforms = () => {
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const nextCard = cards[index + 1];
      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const cardHeight = rect.height || 600;
        const overlap = Math.max(0, rect.bottom - nextRect.top);
        const progress = Math.min(1, Math.max(0, overlap / cardHeight));

        const maxScaleReduction = (totalCards - 1 - index) * 0.03;
        const currentScale = 1 - progress * maxScaleReduction;

        card.style.transform = `scale(${currentScale})`;
      } else {
        card.style.transform = 'scale(1)';
      }
    });
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateCardTransforms);
  }, { passive: true });

  updateCardTransforms();
}

/* ------------------------------------------------------------
   Success Stories Horizontal Slider (Invertase.io replica)
   ------------------------------------------------------------ */
function initSuccessStoriesAccordion() {
  const track = document.getElementById('invertaseStoriesTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.inv-card');
  let currentIndex = 0;
  let autoPlayInterval = null;

  function setActiveCard(index) {
    currentIndex = index;
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Auto scroll track horizontally to center active card
    const wrapper = document.getElementById('storiesWrapper');
    if (wrapper && cards[index]) {
      const cardOffset = cards[index].offsetLeft;
      const cardWidth = cards[index].offsetWidth;
      const wrapperWidth = wrapper.offsetWidth;
      const scrollPos = cardOffset - (wrapperWidth / 2) + (cardWidth / 2);
      wrapper.scrollTo({
        left: Math.max(0, scrollPos),
        behavior: 'smooth'
      });
    }
  }

  // Hover and Click events for cards
  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      stopAutoPlay();
      setActiveCard(i);
    });

    card.addEventListener('mouseleave', () => {
      startAutoPlay();
    });

    card.addEventListener('click', () => {
      setActiveCard(i);
    });
  });

  // Auto Play every 4 seconds
  function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % cards.length;
      setActiveCard(nextIndex);
    }, 4000);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
  }

  startAutoPlay();
}

/* ------------------------------------------------------------
   Hero Cinematic Category Switcher & Before/After Slider
   ------------------------------------------------------------ */
function initHeroCinematic() {
  const pills = document.querySelectorAll('.hero-pill');

  // Background <picture> sources
  const heroBgMobileAvif = document.getElementById('heroBgMobileAvif');
  const heroBgMobileWebp = document.getElementById('heroBgMobileWebp');
  const heroBgDesktopAvif = document.getElementById('heroBgDesktopAvif');
  const heroBgDesktopWebp = document.getElementById('heroBgDesktopWebp');
  const heroBgImg = document.getElementById('heroBgImg');

  // Before <picture> sources
  const heroBeforeAvif = document.getElementById('heroBeforeAvif');
  const heroBeforeWebp = document.getElementById('heroBeforeWebp');
  const heroBeforeImg = document.getElementById('heroBeforeImg');

  // After <picture> sources
  const heroAfterAvif = document.getElementById('heroAfterAvif');
  const heroAfterWebp = document.getElementById('heroAfterWebp');
  const heroAfterImg = document.getElementById('heroAfterImg');

  // Slider elements
  const slider = document.getElementById('heroBaSlider');
  const afterWrapper = document.getElementById('heroAfterWrapper');
  const handle = document.getElementById('heroBaHandle');

  // Category Switcher Pill Handler
  if (pills.length && heroBgImg) {
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        // Read all data attributes from the clicked pill
        const deskAvif = pill.getAttribute('data-desktop-avif');
        const deskWebp = pill.getAttribute('data-desktop-webp');
        const mobAvif = pill.getAttribute('data-mobile-avif');
        const mobWebp = pill.getAttribute('data-mobile-webp');
        const beforeAvif = pill.getAttribute('data-before-avif');
        const beforeWebp = pill.getAttribute('data-before-webp');
        const afterAvif = pill.getAttribute('data-after-avif');
        const afterWebp = pill.getAttribute('data-after-webp');

        // Phase 1: Cinematic fade-out (scale 1.00 → 1.02, opacity 1 → 0)
        heroBgImg.classList.remove('hero-fade-in-end');
        heroBgImg.classList.add('hero-fade-out');

        setTimeout(() => {
          // Swap all <source> srcsets for the hero background
          if (heroBgMobileAvif && mobAvif) heroBgMobileAvif.srcset = mobAvif;
          if (heroBgMobileWebp && mobWebp) heroBgMobileWebp.srcset = mobWebp;
          if (heroBgDesktopAvif && deskAvif) heroBgDesktopAvif.srcset = deskAvif;
          if (heroBgDesktopWebp && deskWebp) heroBgDesktopWebp.srcset = deskWebp;
          if (heroBgImg && deskWebp) heroBgImg.src = deskWebp;

          // Phase 2a: Instantly set incoming start state (scale 1.04, opacity 0)
          heroBgImg.classList.remove('hero-fade-out');
          heroBgImg.classList.add('hero-fade-in-start');

          // Force reflow so browser registers the start state before transitioning
          void heroBgImg.offsetWidth;

          // Phase 2b: Cinematic fade-in (scale 1.04 → 1.00, opacity 0 → 1)
          heroBgImg.classList.remove('hero-fade-in-start');
          heroBgImg.classList.add('hero-fade-in-end');
        }, 350);

        // Update Before <picture> sources
        if (heroBeforeAvif && beforeAvif) heroBeforeAvif.srcset = beforeAvif;
        if (heroBeforeWebp && beforeWebp) heroBeforeWebp.srcset = beforeWebp;
        if (heroBeforeImg && beforeWebp) heroBeforeImg.src = beforeWebp;

        // Update After <picture> sources
        if (heroAfterAvif && afterAvif) heroAfterAvif.srcset = afterAvif;
        if (heroAfterWebp && afterWebp) heroAfterWebp.srcset = afterWebp;
        if (heroAfterImg && afterWebp) heroAfterImg.src = afterWebp;
        // Reset auto-rotate timer on manual click
        resetAutoRotate();
      });
    });

    // Auto-rotate through category pills every 4 seconds
    let autoRotateInterval = null;
    let autoRotateTimeout = null;
    let currentPillIndex = 0;

    function autoRotateNext() {
      currentPillIndex = (currentPillIndex + 1) % pills.length;
      pills[currentPillIndex].click();
    }

    function startAutoRotate() {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(autoRotateNext, 4000);
    }

    function stopAutoRotate() {
      if (autoRotateInterval) clearInterval(autoRotateInterval);
      autoRotateInterval = null;
    }

    function resetAutoRotate() {
      stopAutoRotate();
      // Find current active pill index
      pills.forEach((p, i) => { if (p.classList.contains('active')) currentPillIndex = i; });
      // Resume auto-rotate after 8 seconds of inactivity
      if (autoRotateTimeout) clearTimeout(autoRotateTimeout);
      autoRotateTimeout = setTimeout(startAutoRotate, 8000);
    }

    // Start auto-rotate on page load
    startAutoRotate();
  }

  // Draggable Before/After Slider Handler
  if (slider && afterWrapper && handle) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = slider.getBoundingClientRect();
      let offsetX = x - rect.left;
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;

      const percentage = (offsetX / rect.width) * 100;
      afterWrapper.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    }

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }
}




