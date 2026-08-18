'use strict';

/* =========================================================
   1. PROJECT DATA — single source of truth
   Change image / name / description / status / tags / links
   here only. No HTML edits required.
   ========================================================= */
const projects = [
  {
    name: 'StudyFlow',
    image: 'assets/projects/project-01.jpg',
    description: 'StudyFlow is an AI-powered learning tracker designed to help users organize their learning progress, manage study materials, and practice through AI-generated quizzes and interactive learning features.',
    status: 'available',
    tags: ['Python', 'Flask', 'AI'],
    github: 'https://github.com/Blueberrypieee/studyflow',
    demo: 'https://studyfloww.pythonanywhere.com/login'
  },
  {
    name: 'Finance Tracker',
    image: 'assets/projects/project-02.jpg',
    description: 'Finance Tracker is a personal finance management app designed to track income and expenses, manage transactions, and provide simple financial insights through summaries and statistics.',
    status: 'available',
    tags: ['JavaScript', 'API',],
    github: 'https://github.com/Blueberrypieee/Finance',
    demo: 'https://trackfinance.pythonanywhere.com/'
  },
  {
    name: 'Project 03',
    image: 'assets/projects/project-03.svg',
    description: 'Something is cooking.',
    status: 'coming-soon',
    tags: [],
    github: '',
    demo: ''
  },
  {
    name: 'Project 04',
    image: 'assets/projects/project-04.svg',
    description: 'Something is cooking.',
    status: 'coming-soon',
    tags: [],
    github: '',
    demo: ''
  },
  {
    name: 'Project 05',
    image: 'assets/projects/project-05.svg',
    description: 'Something is cooking.',
    status: 'coming-soon',
    tags: [],
    github: '',
    demo: ''
  }
];

/* =========================================================
   2. SKILLS DATA
   ========================================================= */
const skills = [
  { name: 'Python', icon: 'devicon-python-plain' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { name: 'HTML', icon: 'devicon-html5-plain' },
  { name: 'CSS', icon: 'devicon-css3-plain' },
  { name: 'Flask', icon: 'devicon-flask-original' },
  { name: 'Git', icon: 'devicon-git-plain' },
  { name: 'GitHub', icon: 'devicon-github-original' },
  { name: 'Linux', icon: 'devicon-linux-plain' },
  { name: 'SQLite', icon: 'devicon-sqlite-plain' }
];

const SKILL_ACCENTS = ['yellow', 'blue', 'pink', 'green', 'orange'];

/* =========================================================
   3. PROJECT RENDERER
   ========================================================= */
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.map(buildProjectCard).join('');
}

function buildProjectCard(project) {
  const isAvailable = project.status === 'available';
  const badgeLabel = isAvailable ? 'AVAILABLE' : 'COMING SOON';

  const tagsMarkup = project.tags.length
    ? `<div class="project-card__tags">${project.tags
        .map((tag) => `<span class="tag">${escapeHTML(tag)}</span>`)
        .join('')}</div>`
    : '';

  const githubButton = isAvailable && project.github
    ? `<a class="button button--outline" href="${escapeHTML(project.github)}" target="_blank" rel="noopener noreferrer">GITHUB</a>`
    : '';

  const demoButton = isAvailable && project.demo
    ? `<a class="button button--primary" href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer">DEMO</a>`
    : '';

  const linksMarkup = (githubButton || demoButton)
    ? `<div class="project-card__links">${githubButton}${demoButton}</div>`
    : '';

  return `
    <article class="project-card" data-status="${project.status}">
      <div class="project-card__media">
        <span class="project-card__badge">${badgeLabel}</span>
        <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.name)} preview" loading="lazy" width="800" height="500">
      </div>
      <div class="project-card__body">
        <h3 class="project-card__name">${escapeHTML(project.name)}</h3>
        <p class="project-card__desc">${escapeHTML(project.description)}</p>
        ${tagsMarkup}
        ${linksMarkup}
      </div>
    </article>
  `;
}

/* =========================================================
   4. SKILLS RENDERER
   ========================================================= */
function renderSkills() {
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;

  grid.innerHTML = skills
    .map((skill, index) => {
      const accent = SKILL_ACCENTS[index % SKILL_ACCENTS.length];
      return `
        <li class="skill-card">
          <span class="skill-card__icon" style="background: var(--color-${accent});">
            <i class="${escapeHTML(skill.icon)}" aria-hidden="true"></i>
          </span>
          <span class="skill-card__name">${escapeHTML(skill.name)}</span>
        </li>
      `;
    })
    .join('');
}

/* =========================================================
   5. MOBILE NAVIGATION
   ========================================================= */
function initMobileNav() {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    menu.dataset.open = 'true';
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    menu.dataset.open = 'false';
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  // Close automatically once a navigation item is chosen
  menu.querySelectorAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape for keyboard users
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      toggle.focus();
    }
  });
}

/* =========================================================
   6. SMOOTH NAVIGATION + ACTIVE SECTION INDICATOR
   ========================================================= */
function initSmoothNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  if (!navLinks.length || !sections.length) return;

  const linkBySectionId = new Map();
  navLinks.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    linkBySectionId.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkBySectionId.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((navLink) => navLink.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   7. MISC UI INTERACTIONS
   ========================================================= */
function initNavbarShadowOnScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateShadow() {
    if (window.scrollY > 4) {
      navbar.style.boxShadow = '0 4px 0 var(--color-border)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }

  updateShadow();
  window.addEventListener('scroll', updateShadow, { passive: true });
}

/* =========================================================
   HELPERS
   ========================================================= */
function escapeHTML(value) {
  const div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderSkills();
  renderProjects();
  initMobileNav();
  initSmoothNav();
  initNavbarShadowOnScroll();
});

