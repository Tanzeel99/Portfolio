'use strict';

// Interactions enhance semantic HTML; content remains accessible without JavaScript.
const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function updateThemeLabel() {
  const light = root.dataset.theme === 'light';
  themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
  themeButton.title = `Switch to ${light ? 'dark' : 'light'} theme`;
  document.querySelector('meta[name="theme-color"]').content = light ? '#D6D6D5' : '#1E1E1E';
  document.querySelector('link[rel="icon"]').href = light ? 'assets/favicon-light.svg' : 'assets/favicon.svg';
}
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('tk-theme', root.dataset.theme); } catch { /* Theme still works in private mode. */ }
  updateThemeLabel();
});
updateThemeLabel();

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu(returnFocus = false) {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.querySelector('use').setAttribute('href', '#i-menu');
  if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => {
  if (!mobileNav.hidden) { closeMenu(); return; }
  mobileNav.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation');
  menuButton.querySelector('use').setAttribute('href', '#i-close');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) closeMenu(true);
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const projects = {
  pvantage: {
    title: 'PVantage', category: 'DATA & REPORTING · FULL STACK',
    summary: 'A platform for integrating, analyzing, and visualizing data from uploaded reports, enabling data-driven insights and streamlined reporting.',
    tags: ['.NET Web API', 'Angular', 'Angular Material', 'Kendo UI', 'Azure Functions', 'Azure Storage', 'SFTP'],
    contributions: [
      'Developed a dynamic script upload feature with validation and report generation tailored to customizable settings.',
      'Designed and implemented a workflow to convert uploaded PDF files to XML.',
      'Connected file processing to secure SFTP transfers for downstream storage and processing.'
    ],
    outcome: 'More flexible report handling, customizable validation, and an integrated path from uploaded documents to structured data.'
  },
  mdms: {
    title: 'MDMS', category: 'ENTERPRISE & PEOPLE · FULL STACK',
    summary: 'An internal employee management system that streamlines employee data management and HR workflows.',
    tags: ['ASP.NET MVC', 'SQL Server', 'Entity Framework', 'Kendo UI', 'JavaScript', 'Azure Functions', 'Microsoft Entra ID'],
    contributions: [
      'Migrated plain HTML grids to Telerik Kendo ASP.NET MVC UI and implemented AJAX data binding.',
      'Independently developed a dynamic survey feature used by approximately 1,000 users.',
      'Implemented single sign-on using Microsoft Entra ID.',
      'Built a dynamic email template system so administrators could customize messages and select recipients.'
    ],
    outcome: 'The UI migration increased engagement by 25%, while AJAX data binding improved website performance by 30%, as reported in my resume.'
  },
  esko: {
    title: 'Esko', category: 'LEGACY MODERNIZATION · BACKEND',
    summary: 'Modernization work for Esko, a global provider of software and hardware solutions for the packaging industry.',
    tags: ['ASP.NET Core 9', 'Web API', 'Salesforce API', 'Microsoft Access'],
    contributions: [
      'Independently migrated a legacy VB.NET codebase to a modern web application with ASP.NET Core 9 Web API as the backend.',
      'Integrated Salesforce API for data synchronization.',
      'Connected the modern application to Microsoft Access to retrieve and manage existing business data.'
    ],
    outcome: 'A modern API foundation that connects existing business data with Salesforce and supports the transition from a legacy application.'
  }
};

const filters = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project-card')];
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    const visible = button.dataset.filter === 'all' || card.dataset.category.split(' ').includes(button.dataset.filter);
    card.hidden = !visible;
    if (visible) { count++; card.classList.add('visible'); }
  });
  document.querySelector('#filter-status').textContent = `${count} projects shown.`;
}));

const dialog = document.querySelector('#project-dialog');
let dialogTrigger;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  dialogTrigger = button;
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-summary').textContent = project.summary;
  document.querySelector('#dialog-outcome').textContent = project.outcome;
  document.querySelector('#dialog-tags').replaceChildren(...project.tags.map(tag => {
    const span = document.createElement('span'); span.textContent = tag; return span;
  }));
  document.querySelector('#dialog-contributions').replaceChildren(...project.contributions.map(text => {
    const item = document.createElement('li'); item.textContent = text; return item;
  }));
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('modal-open');
  dialog.querySelector('.dialog-close').focus({ preventScroll: true });
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  dialogTrigger?.focus({ preventScroll: true });
});

const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    item.querySelector('.tab-plus').textContent = selected ? '−' : '+';
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let target;
    if (['ArrowRight', 'ArrowDown'].includes(event.key)) target = tabs[(index + 1) % tabs.length];
    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) target = tabs[(index + tabs.length - 1) % tabs.length];
    if (event.key === 'Home') target = tabs[0];
    if (event.key === 'End') target = tabs.at(-1);
    if (target) { event.preventDefault(); activateTab(target); target.focus(); }
  });
});

let toastTimeout;
function showToast(text) {
  const toast = document.querySelector('#toast');
  toast.textContent = text;
  toast.classList.add('visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('visible'), 3500);
}
document.querySelector('.copy-email').addEventListener('click', async () => {
  const email = 'mtanzeel.k99@gmail.com';
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email address copied');
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.email-row > a'));
    selection.removeAllRanges(); selection.addRange(range);
    showToast('Email selected — copy it using your device’s copy command.');
  }
});
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const name = fields.get('name').trim();
  const email = fields.get('email').trim();
  const message = fields.get('message').trim();
  if (!name || !message) {
    document.querySelector('#form-status').textContent = 'Please enter your name and a message.';
    return;
  }
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`Hi Tanzeel,\n\n${message}\n\n${name}\n${email}`);
  window.location.href = `mailto:mtanzeel.k99@gmail.com?subject=${subject}&body=${body}`;
  document.querySelector('#form-status').textContent = 'Your email draft is ready in your email app. If it didn’t open, copy the email address and send your message directly.';
});
document.querySelector('#year').textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => {
      // Never conceal content that is already in the viewport.
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add('ready'); revealObserver.observe(element);
    });
  }
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
}
