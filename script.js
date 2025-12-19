console.log("JS loaded");

const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const modal = document.getElementById('projectModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const portfolioGrid = document.getElementById('portfolioGrid');
const filterButtons = [...document.querySelectorAll('.filter-btn')];
const yearEl = document.getElementById('year');
const sectionTriggers = [...document.querySelectorAll('[data-target]')];
const sections = {
  home: document.getElementById('home'),
  portfolio: document.getElementById('portfolio'),
  about: document.getElementById('about'),
  contact: document.getElementById('contact')
};

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

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    [...portfolioGrid.children].forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'flex' : 'none';
    });
  });
});

function openModal({ title, category, desc, img }) {
  modalImage.src = img;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalCategory.textContent = category;
  modalDesc.textContent = desc;
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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