function setLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });
  localStorage.setItem('lang', lang);
}

function normalizeTheme(theme) {
  return theme === 'dark' || theme === 'light' ? theme : null;
}

function applyTheme(theme, persist = true) {
  document.body.classList.toggle('dark', theme === 'dark');
  if (persist) {
    localStorage.setItem('theme', theme);
  }
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
  applyTheme(nextTheme);
}

function syncInternalLegalLinks(params) {
  const theme = normalizeTheme(params.get('theme'));
  const source = params.get('source');

  if (!theme && !source) return;

  document.querySelectorAll('a[href$=".html"]').forEach(link => {
    const url = new URL(link.getAttribute('href'), window.location.href);
    if (theme) url.searchParams.set('theme', theme);
    if (source) url.searchParams.set('source', source);
    link.setAttribute('href', `${url.pathname.split('/').pop()}${url.search}`);
  });
}

function hideAppControlledThemeToggle(params) {
  if (params.get('source') !== 'app') return;

  document.querySelectorAll('[data-app-theme-toggle], button[onclick="toggleTheme()"]').forEach(el => {
    el.style.display = 'none';
  });
}

function detectPreferences() {
  const params = new URLSearchParams(window.location.search);
  const requestedTheme = normalizeTheme(params.get('theme'));
  const savedLang = localStorage.getItem('lang');
  const savedTheme = normalizeTheme(localStorage.getItem('theme'));

  if (requestedTheme) {
    applyTheme(requestedTheme, params.get('source') !== 'app');
  } else if (savedTheme) {
    applyTheme(savedTheme, false);
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light', false);
  }

  syncInternalLegalLinks(params);
  hideAppControlledThemeToggle(params);

  // Language: auto-detect ONLY if user never chose
  if (savedLang) {
    setLang(savedLang);
  } else {
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
    setLang(browserLang);
  }
}

document.addEventListener('DOMContentLoaded', detectPreferences);
