// /includes/includes.js
(async function () {
    async function loadInto(selector, url) {
        const el = document.querySelector(selector);
        if (!el) return;

        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) {
            console.error("Include failed:", url, res.status);
            return;
        }
        el.innerHTML = await res.text();
    }

    function wireMobileMenu() {
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

    function setYear() {
        const year = document.getElementById("year");
        if (year) year.textContent = new Date().getFullYear();
    }

    document.addEventListener("DOMContentLoaded", async () => {
        // IMPORTANT: absolute paths so it works from /pages/* too
        await loadInto("#site-header", "/includes/header.html");
        await loadInto("#site-footer", "/includes/footer.html");

        wireMobileMenu();
        setYear();
    });
})();
