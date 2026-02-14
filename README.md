# cnr-website
CNR Study Abroad Consultants website

This repository contains a simple static site built with **HTML**, **CSS**, and a little **vanilla JavaScript**. No build tools or paid services are required – everything runs on free infrastructure such as GitHub Pages, Cloudflare, Formspree, and WhatsApp integration. The design has been tuned for mobile devices, accessibility, and fast performance without spending a rupee.

## Features & improvements

* Fully responsive layout: works on phones, tablets, and desktops.
* Mobile navigation with hamburger toggle on small screens.
* Keyboard‑friendly focus outlines and ARIA attributes for accessibility.
* Lightweight CSS with dark theme and CSS variables for easy customization.
* Contact form includes a hidden honeypot field to reduce spam.
* Smooth scrolling, FAQ accordions, newsletter signup feedback, and floating chat/WhatsApp buttons implemented in plain JS.
* Images use `loading="lazy"`; fonts and styles are preloaded to improve performance.

## Deployment (free)

1. **GitHub Pages** – simply push to the `main` branch, then enable Pages in repository settings. It serves the site over HTTPS with a custom domain (`CNAME` is already included).
2. **Cloudflare** – optional proxy and CDN for extra caching, SSL, and security. The free tier is sufficient.
3. **Form handling** – the contact form posts to Formspree (free tier). You can switch to other free mail services or serverless functions if you wish.

## Editing & local preview

* Clone the repo; open `index.html` in your browser or use the Live Server extension in VS Code.
* Styles are in `styles.css`; add new rules or components there. A mobile menu example has been added; see the `.nav-toggle` class.
* JavaScript logic lives in a single `<script>` at the bottom of `index.html` – easy to expand.

## Next steps (no cost)

* Add new pages by copying `index.html` and adjusting paths, or migrate to a free static site generator such as **Jekyll**, **Eleventy**, or **Hugo** for templating and easier maintenance.
* Use free image‑optimization tools (e.g. [Squoosh](https://squoosh.app/)) locally to convert graphics to WebP/AVIF.
* Monitor performance and accessibility with [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome DevTools).

## Analytics & Search Console

* Paste your Google Analytics (GA4) measurement ID into the `<head>` snippet (replace `G-XXXXXXXXXX`).
* Add your Google Search Console verification code in the corresponding `<meta>` tag.
* The contact and newsletter forms send simple `gtag('event', ...)` events so you can track submissions.

## Business Schema

A small JSON‑LD block describing your organisation is included in `<head>` to help search engines display your business details. Update the social links as needed.

## Education News Feed

The site now fetches a daily list of positive education articles from a public RSS feed using [rss2json](https://rss2json.com) and displays the top three in the **Education News & Updates** section. You can change the `rssUrl` constant in the embedded script to pull from any other public RSS source (news, blogs, etc.).

This keeps the homepage fresh without requiring manual edits or paid services.

This site has been built to help you establish trust in your local area using only free tools and minimal technical overhead. Feel free to adapt and expand as your startup grows.