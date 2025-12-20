console.log("JS loaded");

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const portfolioGrid = document.getElementById('portfolioGrid');
const mediumButtons = [...document.querySelectorAll('.filters [data-filter]')];
const typeToggle = document.querySelector('.type-toggle');
const typeOptions = document.querySelector('.type-options');
const typeButtons = [...document.querySelectorAll('.type-option')];
const typeDropdown = document.querySelector('.type-dropdown');
const servicesInner = document.getElementById('servicesInner');
const servicesTrack = document.getElementById('servicesTrack');
const servicesPrev = document.getElementById('servicesPrev');
const servicesNext = document.getElementById('servicesNext');
let servicesIndex = 0;
let servicesAutoTimer = null;
const SERVICES_AUTO_DELAY = 3400;
const copyButtons = [...document.querySelectorAll('[data-copy]')];
const yearEl = document.getElementById('year');
const sectionTriggers = [...document.querySelectorAll('[data-target]')];
const sections = {
  home: document.getElementById('home'),
  portfolio: document.getElementById('portfolio'),
  services: document.getElementById('services'),
  studio: document.getElementById('studio'),
  about: document.getElementById('about'),
  contact: document.getElementById('contact')
};
const EMAILJS_PUBLIC_KEY = 'MRf0NgoC7kMfExS3b';
const EMAILJS_SERVICE_ID = 'service_kyla76w';
const EMAILJS_TEMPLATE_ID = 'template_0lecnzy';

function sendAnalyticsEvent(name, params = {}) {
  if (window.analytics && typeof window.analytics.trackEvent === 'function') {
    window.analytics.trackEvent(name, params);
  }
}

let activeMedium = 'all';
let activeType = 'all';
let typePanelOpen = false;
const defaultTypeLabel = 'All types ▼';

function updateTypeToggleLabel(label) {
  if (!typeToggle) return;
  typeToggle.textContent = label;
}

function updateTypeOptionsVisibility() {
  typeButtons.forEach(btn => {
    const isActive = btn.dataset.type === activeType;
    btn.classList.toggle('hidden', isActive);
  });
}

yearEl.textContent = new Date().getFullYear();

const savedTheme = localStorage.getItem('nave-theme');
if (savedTheme === 'light') {
  root.classList.add('light');
}

themeToggle.addEventListener('click', () => {
  root.classList.toggle('light');
  const mode = root.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('nave-theme', mode);
});

function setActiveNav(sectionId) {
  document.querySelectorAll('.nav a').forEach(link => {
    link.classList.toggle('active', link.dataset.target === sectionId);
  });
}

function showSection(sectionId) {
  Object.values(sections).forEach(sec => sec && sec.classList.remove('active'));
  const next = sections[sectionId];
  if (next) {
    next.classList.add('active');
    setActiveNav(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

sectionTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    const target = trigger.dataset.target;
    if (target) {
      e.preventDefault();
      showSection(target);
    }
  });
});

setActiveNav('home');

function applyPortfolioFilters() {
  [...portfolioGrid.children].forEach(card => {
    const matchMedium = activeMedium === 'all' || card.dataset.category === activeMedium;
    const matchType = activeType === 'all' || card.dataset.type === activeType;
    card.style.display = matchMedium && matchType ? 'flex' : 'none';
  });
}

mediumButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    mediumButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMedium = btn.dataset.filter || 'all';
    applyPortfolioFilters();
  });
});

typeToggle.addEventListener('click', () => {
  typePanelOpen = !typePanelOpen;
  typeToggle.classList.add('active');
  if (typeOptions) {
    updateTypeOptionsVisibility();
    typeOptions.classList.toggle('open', typePanelOpen);
  }
});

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeType = btn.dataset.type || 'all';
    typePanelOpen = false;
    if (typeOptions) {
      typeOptions.classList.remove('open');
    }
    typeToggle.classList.add('active');
    updateTypeToggleLabel(activeType === 'all' ? defaultTypeLabel : `${btn.textContent} ▼`);
    updateTypeOptionsVisibility();
    applyPortfolioFilters();
  });
});

document.addEventListener('click', (e) => {
  if (!typePanelOpen) return;
  if (typeDropdown && typeDropdown.contains(e.target)) return;
  typePanelOpen = false;
  if (typeOptions) typeOptions.classList.remove('open');
});

function updateServicesSlider() {
  if (!servicesInner) return;
  const slides = [...servicesInner.children];
  const total = slides.length;
  if (!total) return;

  servicesIndex = (servicesIndex + total) % total;

  slides.forEach((slide, idx) => {
    slide.classList.remove('is-center', 'is-left', 'is-right', 'is-far');
    const offset = (idx - servicesIndex + total) % total;
    if (offset === 0) {
      slide.classList.add('is-center');
    } else if (offset === 1) {
      slide.classList.add('is-right');
    } else if (offset === total - 1) {
      slide.classList.add('is-left');
    } else {
      slide.classList.add('is-far');
    }
  });
}

function stopServicesAuto() {
  if (servicesAutoTimer) {
    clearInterval(servicesAutoTimer);
    servicesAutoTimer = null;
  }
}

function startServicesAuto() {
  stopServicesAuto();
  servicesAutoTimer = setInterval(() => {
    servicesIndex += 1;
    updateServicesSlider();
  }, SERVICES_AUTO_DELAY);
}

if (servicesPrev && servicesNext && servicesInner) {
  servicesPrev.addEventListener('click', () => {
    servicesIndex -= 1;
    updateServicesSlider();
    startServicesAuto();
  });
  servicesNext.addEventListener('click', () => {
    servicesIndex += 1;
    updateServicesSlider();
    startServicesAuto();
  });
  updateServicesSlider();
  startServicesAuto();
}

if (servicesTrack) {
  servicesTrack.addEventListener('mouseenter', stopServicesAuto);
  servicesTrack.addEventListener('mouseleave', startServicesAuto);
}

copyButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const value = btn.dataset.copy;
    if (!value) return;
    const originalTip = btn.dataset.tooltip || '';
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      const temp = document.createElement('textarea');
      temp.value = value;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    btn.dataset.tooltip = 'Copied!';
    btn.classList.add('tooltip-show');
    setTimeout(() => {
      btn.dataset.tooltip = originalTip;
      btn.classList.remove('tooltip-show');
    }, 1200);
  });
});

function openModal({ title, category, desc, img }) {
  modalImage.src = img;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalCategory.textContent = category;
  modalDesc.textContent = desc;
  if (window.analytics && typeof window.analytics.trackEvent === 'function') {
    window.analytics.trackEvent('open_project', {
      title,
      category,
      description: desc
    });
  }
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('contactStatus');
  if (!form) return;

  const setStatus = (msg, type = '') => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.remove('success', 'error');
    if (type) statusEl.classList.add(type);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('Sending…');

    if (!window.emailjs || !EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      setStatus('EmailJS not configured. Add your keys in script.js.', 'error');
      return;
    }

    try {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
      await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      setStatus('Message sent. We will reply soon.', 'success');
      form.reset();
      sendAnalyticsEvent('submit_contact_form', { category: 'conversion' });
      sendAnalyticsEvent('lead_submitted', { category: 'conversion' });
    } catch (err) {
      console.error('EmailJS error', err);
      setStatus('Failed to send. Please try again.', 'error');
    }
  });
}

document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-modal]');
  if (trigger) {
    openModal({
      title: trigger.dataset.title,
      category: trigger.dataset.category,
      desc: trigger.dataset.desc,
      img: trigger.dataset.img
    });
  }
  if (e.target.hasAttribute('data-close')) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
    closeModal();
  }
});

bindContactForm();