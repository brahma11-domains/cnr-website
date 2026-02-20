// includes/includes.js
// Loads shared header/footer into placeholders:
// <div id="site-header"></div>
// <div id="site-footer"></div>

(function () {
  const isPages = window.location.pathname.includes("/pages/");
  const base = isPages ? ".." : ".";
  const headerUrl = `${base}/includes/header.html`;
  const footerUrl = `${base}/includes/footer.html`;

  async function loadInto(id, url) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to load ${url} (${res.status})`);
      el.innerHTML = await res.text();
    } catch (err) {
      console.error(err);
      el.innerHTML = "";
    }
  }

  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initMobileNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksEl = document.querySelector(".navlinks");
    if (!navToggle || !navLinksEl) return;

    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      navLinksEl.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navLinksEl.contains(e.target)) {
        navLinksEl.classList.remove("show");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  function markActiveNav() {
    const path = window.location.pathname;

    const links = document.querySelectorAll(".navlinks a");
    links.forEach((a) => {
      const href = (a.getAttribute("href") || "").trim();

      // Only mark active for real page routes (not hash links)
      const isPageLink = href.startsWith("/pages/") || href.startsWith("pages/");
      if (!isPageLink) return;

      const hrefNormalized = href.startsWith("/") ? href : `/${href}`;

      // Exact match, or folder-style match without .html
      const hrefNoExt = hrefNormalized.replace(".html", "");
      if (path === hrefNormalized || path === hrefNoExt) {
        a.classList.add("active");
      }
    });
  }

  async function init() {
    await loadInto("site-header", headerUrl);
    await loadInto("site-footer", footerUrl);

    // After injection:
    initMobileNav();
    initYear();
    markActiveNav();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
