const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const modal = document.getElementById('callback-modal');
const toast = document.querySelector('.toast');

const setHeaderState = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.classList.toggle('open', !isOpen);
  mobileMenu.setAttribute('aria-hidden', String(isOpen));
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

const openModal = () => {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => modal.querySelector('input')?.focus(), 100);
};

const closeModal = () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

document.querySelectorAll('.open-modal').forEach(button => button.addEventListener('click', openModal));
document.querySelectorAll('[data-close-modal]').forEach(button => button.addEventListener('click', closeModal));
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('active')) closeModal();
});

const showSuccess = (form) => {
  form.reset();
  closeModal();
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3800);
};

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    showSuccess(form);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  observer.observe(element);
});

// Лёгкий параллакс только на десктопе.
const heroMedia = document.querySelector('.hero-media');
if (window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const offset = Math.min(window.scrollY * 0.12, 90);
    heroMedia.style.transform = `scale(1.03) translateY(${offset}px)`;
  }, { passive: true });
}
