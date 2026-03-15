function setLang(lang) {
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.style.display = el.getAttribute('data-lang') === lang ? 'block' : 'none';
  });
  localStorage.setItem('lang', lang);
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );
}

function detectPreferences() {
  const savedLang = localStorage.getItem('lang');
  const savedTheme = localStorage.getItem('theme');

  // Theme (safe to auto-apply)
  if (
    savedTheme === 'dark' ||
    (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.body.classList.add('dark');
  }

  // Language: auto-detect ONLY if user never chose
  if (savedLang) {
    setLang(savedLang);
  } else {
    const browserLang = navigator.language.startsWith('es') ? 'es' : 'en';
    setLang(browserLang);
  }
}

document.addEventListener('DOMContentLoaded', detectPreferences);