(async function () {
  // Decide relative prefix for fetching include files
  // - index.html at root: "" => "includes/header.html"
  // - /pages/*.html: "../" => "../includes/header.html"
  const isPagesFolder = window.location.pathname.includes('/pages/');
  const prefix = isPagesFolder ? '../' : '';

  async function loadInto(id, file) {
    const el = document.getElementById(id);
    if (!el) return;
    const res = await fetch(prefix + 'includes/' + file);
    if (!res.ok) {
      el.innerHTML = `<div style="padding:12px; border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff;">
        Failed to load ${file} (${res.status}). Check includes path.
      </div>`;
      return;
    }
    el.innerHTML = await res.text();
  }

  await loadInto('site-header', 'header.html');
  await loadInto('site-footer', 'footer.html');

  // Set footer year (after footer is injected)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu toggle (after header is injected)
  const navToggle = document.querySelector('.nav-toggle');
  const navLinksEl = document.querySelector('.navlinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navLinksEl.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinksEl.contains(e.target)) {
        navLinksEl.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Cookie banner handling (NO auto-accept)
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  if (cookieBanner && acceptBtn) {
    const accepted = localStorage.getItem('cookieBannerAccepted') === 'true';
    cookieBanner.style.display = accepted ? 'none' : 'block';
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieBannerAccepted', 'true');
      cookieBanner.style.display = 'none';
    });
  }
})();
