(function () {
  'use strict';

  const html = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const tocToggle = document.getElementById('toc-toggle');
  const tocClose = document.getElementById('toc-close');
  const tocSidebar = document.getElementById('leanpub-toc');
  const tocOverlay = document.getElementById('toc-overlay');
  const backToTop = document.getElementById('back-to-top');

  /* ── Dark Mode ── */
  function getTheme() {
    if (localStorage.theme === 'dark') return 'dark';
    if (localStorage.theme === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.classList.toggle('dark', theme === 'dark');
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const sun = themeToggle.querySelector('[data-icon="sun"]');
    const moon = themeToggle.querySelector('[data-icon="moon"]');
    if (sun && moon) {
      sun.classList.toggle('hidden', theme === 'dark');
      moon.classList.toggle('hidden', theme !== 'dark');
    }
  }

  function toggleTheme() {
    const next = html.classList.contains('dark') ? 'light' : 'dark';
    localStorage.theme = next;
    applyTheme(next);
  }

  applyTheme(getTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!('theme' in localStorage)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── Mobile TOC ── */
  function openToc() {
    tocSidebar?.classList.add('toc-open');
    tocOverlay?.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeToc() {
    tocSidebar?.classList.remove('toc-open');
    tocOverlay?.classList.add('hidden');
    document.body.style.overflow = '';
  }

  tocToggle?.addEventListener('click', openToc);
  tocClose?.addEventListener('click', closeToc);
  tocOverlay?.addEventListener('click', closeToc);

  tocSidebar?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeToc();
    });
  });

  /* ── Back to Top ── */
  function onScroll() {
    if (!backToTop) return;
    backToTop.classList.toggle('opacity-0', window.scrollY < 400);
    backToTop.classList.toggle('pointer-events-none', window.scrollY < 400);
    backToTop.classList.toggle('opacity-100', window.scrollY >= 400);
  }

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Active TOC link on scroll ── */
  const headings = document.querySelectorAll('#leanpub-main h1[id], #leanpub-main h2[id]');
  const tocLinks = document.querySelectorAll('#leanpub-toc a[href^="#"]');

  function updateActiveTocLink() {
    let current = '';
    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top <= 100) {
        current = heading.id;
      }
    });

    tocLinks.forEach((link) => {
      const href = link.getAttribute('href')?.slice(1);
      link.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveTocLink, { passive: true });
  updateActiveTocLink();
})();
