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
const copyButtons = [...document.querySelectorAll('[data-copy]')];
const yearEl = document.getElementById('year');
const sectionTriggers = [...document.querySelectorAll('[data-target]')];
const sections = {
  home: document.getElementById('home'),
  portfolio: document.getElementById('portfolio'),
  about: document.getElementById('about'),
  contact: document.getElementById('contact')
};

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