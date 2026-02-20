// includes/includes.js
// Loads shared header/footer into placeholders.
// Usage in pages:
//   <div data-include="header" data-root=".."></div>
//   ...
//   <div data-include="footer" data-root=".."></div>

(function () {
  async function loadInclude(el) {
    const name = el.getAttribute("data-include"); // header | footer
    const root = el.getAttribute("data-root") || ".";
    const url = `${root}/includes/${name}.html`;

    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) {
      el.innerHTML = `<!-- Failed to load include: ${url} (${res.status}) -->`;
      return;
    }
    el.innerHTML = await res.text();
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

  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function markActiveNav() {
    const path = window.location.pathname;
    const links = document.querySelectorAll(".navlinks a");
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      // Mark active for exact page routes
      const isActive =
        (href.startsWith("/pages/") && path.startsWith(href)) ||
        (href === "/pages/mbbs-abroad.html" && path.includes("mbbs-abroad")) ||
        (href === "/pages/study-destinations.html" && path.includes("study-destinations")) ||
        (href === "/pages/why-choose-cnr.html" && path.includes("why-choose-cnr"));
      if (isActive) a.classList.add("active");
    });
  }

  async function init() {
    const placeholders = Array.from(document.querySelectorAll("[data-include]"));
    await Promise.all(placeholders.map(loadInclude));

    // After includes are injected:
    initMobileNav();
    initYear();
    markActiveNav();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
