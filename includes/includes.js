// assets/js/includes.js
(() => {
  async function loadInclude(el) {
    const url = el.getAttribute("data-include");
    if (!url) return;

    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) {
        throw new Error(`Failed to load include: ${url} (${res.status})`);
      }
      const html = await res.text();
      el.outerHTML = html;
    } catch (err) {
      console.error(err);
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
      const href = a.getAttribute("href") || "";

      // Only mark active for real page routes (not hash links)
      const isPageLink = href.startsWith("/pages/") || href.startsWith("pages/");
      if (!isPageLink) return;

      // Normalize for comparison
      const hrefNormalized = href.startsWith("/") ? href : `/${href}`;
      if (path === hrefNormalized || path.startsWith(hrefNormalized.replace(".html", ""))) {
        a.classList.add("active");
      }
    });
  }

  async function init() {
    const placeholders = Array.from(document.querySelectorAll("[data-include]"));
    await Promise.all(placeholders.map(loadInclude));

    // after injection
    initMobileNav();
    initYear();
    markActiveNav();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
