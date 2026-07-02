document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal');
  const close = document.getElementById('close');
  const form = document.getElementById('signupForm');
  const status = document.getElementById('status');
  const openButtons = [
    document.getElementById('openSignup'),
    document.getElementById('openSignupFooter'),
  ].filter(Boolean);
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  openButtons.forEach((button) => button.addEventListener('click', openModal));
  if (close) close.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const parallaxItems = document.querySelectorAll('[data-scroll-speed]');
  const updateParallax = () => {
    const offset = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.scrollSpeed) || 0;
      item.style.transform = `translate3d(0, ${offset * speed}px, 0)`;
    });
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  const slider = document.getElementById('imageSlider');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slider-slide'));
    // attach image error fallback to keep slider visible when remote images fail
    const placeholderSVG = encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'><rect width='100%' height='100%' fill='#900d1f'/><text x='50%' y='50%' font-size='48' fill='%23fff' dominant-baseline='middle' text-anchor='middle'>Image</text></svg>");
    slides.forEach((slide) => {
      const img = slide.querySelector('img');
      if (img) {
        img.onerror = () => { img.onerror = null; img.src = 'data:image/svg+xml;charset=utf-8,' + placeholderSVG; };
      }
    });
    const dots = Array.from(document.querySelectorAll('.slider-dot'));
    const prevButton = document.getElementById('sliderPrev');
    const nextButton = document.getElementById('sliderNext');
    let currentIndex = 0;

    const renderSlide = () => {
      slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentIndex));
      dots.forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      renderSlide();
    };

    const previousSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      renderSlide();
    };

    if (prevButton) prevButton.addEventListener('click', previousSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    dots.forEach((dot, index) => dot.addEventListener('click', () => {
      currentIndex = index;
      renderSlide();
    }));

    renderSlide();
    setInterval(nextSlide, 7000);
  }

  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  const attachFormHandler = (formElement, statusElement) => {
    if (!formElement) return;
    formElement.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (statusElement) statusElement.textContent = 'Sending...';
      const data = {
        name: formElement.name.value.trim(),
        email: formElement.email.value.trim(),
        phone: formElement.phone.value.trim(),
        invitationCode: formElement.invitationCode.value.trim(),
        message: formElement.message.value.trim(),
      };

      try {
        const res = await fetch('/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const j = await res.json();
        if (j.ok) {
          if (statusElement) statusElement.textContent = 'Message sent successfully.';
          formElement.reset();
        } else {
          if (statusElement) statusElement.textContent = 'Error: ' + (j.error || 'unknown');
        }
      } catch (err) {
        if (statusElement) statusElement.textContent = 'Network error';
      }
    });
  };

  attachFormHandler(form, status);
  attachFormHandler(contactForm, contactStatus);

  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));

  const hero = document.querySelector('.hero');
  const orb = document.querySelector('.hero-orb');
  if (hero && orb) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.18;
      hero.style.setProperty('--scroll-offset', `${offset}px`);
      orb.style.transform = `translateY(${offset}px)`;
    });
  }
});
