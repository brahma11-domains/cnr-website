// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll to Top Button
const scrollToTopBtn = document.getElementById('scrollToTop');

// Show/hide scroll to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

// Smooth scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for internal links and hash navigation
function smoothScrollToId(id) {
    const el = document.querySelector(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Handle anchor links on click
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        smoothScrollToId(id);
        // if mobile nav is open, close it after navigation
        const navLinksEl = document.querySelector('.navlinks');
        const navToggleEl = document.querySelector('.nav-toggle');
        if (navLinksEl && navLinksEl.classList.contains('show')) {
            navLinksEl.classList.remove('show');
            if (navToggleEl) navToggleEl.setAttribute('aria-expanded', 'false');
        }
    });
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.navlinks');
if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        navLinksEl.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinksEl.contains(e.target)) {
            navLinksEl.classList.remove('show');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

// Handle hash on page load
if (window.location.hash) {
    smoothScrollToId(window.location.hash);
}

// FAQ Accordion functionality
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        const answer = question.nextElementSibling;

        // Close all other answers
        faqQuestions.forEach(q => {
            q.setAttribute('aria-expanded', 'false');
            q.nextElementSibling.setAttribute('aria-hidden', 'true');
        });

        // Toggle current answer
        if (!isExpanded) {
            question.setAttribute('aria-expanded', 'true');
            answer.setAttribute('aria-hidden', 'false');
        }
    });
});

// Cookie banner handling - auto-accept and hide
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('cookie-accept');
if (cookieBanner && acceptBtn) {
    // Auto-accept cookies on page load
    localStorage.setItem('cookieBannerAccepted', 'true');
    cookieBanner.style.display = 'none';

    // Keep click handler for manual accept
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieBannerAccepted', 'true');
        cookieBanner.style.display = 'none';
    });
}

// Form submission with feedback
const contactForm = document.getElementById('contact-form');

// Track form submissions in Google Analytics
function trackEvent(action, label) {
    if (window.gtag) {
        gtag('event', action, { 'event_category': 'engagement', 'event_label': label });
    }
}
const submitBtn = document.getElementById('submit-btn');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ph-bold ph-spinner-gap"></i> Sending...';
        submitBtn.style.animation = 'spin 1s linear infinite';
        trackEvent('contact_form_submitted', 'contact');
    });
}

// FAQ Toggle functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQs
    document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    // Toggle current FAQ
    faqItem.classList.toggle('active');
}

// Newsletter signup functionality
function handleNewsletterSignup(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const feedbackDiv = document.getElementById('newsletter-feedback');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Show loading state
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph-bold ph-spinner-gap"></i> Subscribing...';
    submitBtn.style.animation = 'spin 1s linear infinite';

    // Simulate API call (replace with your actual email service like Mailchimp, ConvertKit, etc.)
    setTimeout(() => {
        // Success response
        feedbackDiv.style.display = 'block';
        feedbackDiv.className = 'newsletter-feedback success';
        feedbackDiv.innerHTML = '✓ Successfully subscribed! Check your email for exclusive resources.';
        trackEvent('newsletter_subscribed', email);

        // Reset form
        form.reset();

        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.animation = 'none';

        // Clear feedback after 5 seconds
        setTimeout(() => {
            feedbackDiv.style.display = 'none';
        }, 5000);
    }, 1500);
}

// EDUCATION NEWS FETCH
function loadEducationNews() {
    const container = document.getElementById('education-news-container');
    if (!container) return;
    const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=education+positive&hl=en-US&gl=US&ceid=US:en');
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
    fetch(api)
        .then(r => r.json())
        .then(data => {
            if (data.items) {
                container.innerHTML = '';
                data.items.slice(0, 3).forEach(item => {
                    const card = document.createElement('article');
                    card.className = 'blog-card';
                    card.innerHTML = `
                        <div class="blog-date">${new Date(item.pubDate).toLocaleDateString()}</div>
                        <h3>${item.title}</h3>
                        <p>${item.description.replace(/<[^>]*>?/gm, '').slice(0, 120)}...</p>
                        <a href="${item.link}" target="_blank" class="blog-read-more">Read →</a>
                    `;
                    container.appendChild(card);
                });
            }
        })
        .catch(err => console.error('News load failed', err));
}

// BLOG POSTS FETCH
function loadBlogPosts() {
    const container = document.getElementById('blog-grid');
    if (!container) return;
    // Array of Google News queries (can be RSS URLs too)
    const queries = [
        'student+visa+study+abroad+positive',
        'international+education+jobs+tech+positive',
        'AI+education+positive',
        'MBBS+abroad+positive'
    ];

    const fetches = queries.map(q => {
        const rssUrl = encodeURIComponent(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`);
        const api = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        return fetch(api).then(r => r.json()).catch(() => null);
    });

    Promise.all(fetches).then(results => {
        let items = [];
        results.forEach(data => {
            if (data && data.items) {
                items = items.concat(data.items);
            }
        });
        // Sort by date descending and pick top 6
        items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
        items.slice(0, 6).forEach(item => {
            const card = document.createElement('article');
            card.className = 'blog-card';
            card.innerHTML = `
                <div class="blog-date">${new Date(item.pubDate).toLocaleDateString()}</div>
                <h3>${item.title}</h3>
                <p>${item.description.replace(/<[^>]*>?/gm, '').slice(0, 120)}...</p>
                <a href="${item.link}" target="_blank" class="blog-read-more">Read More →</a>
            `;
            container.appendChild(card);
        });
    }).catch(err => console.error('Blog feeds failed', err));
}

document.addEventListener('DOMContentLoaded', () => {
    loadEducationNews();
    loadBlogPosts();
});

// Floating Chat Menu toggle functionality
function toggleFloatingMenu() {
    const menu = document.querySelector('.floating-chat-menu');
    menu.classList.toggle('expanded');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.querySelector('.floating-chat-menu');
    if (!menu.contains(e.target)) {
        menu.classList.remove('expanded');
    }
});

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Animate statistics numbers
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for statistics
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const suffix = stat.dataset.suffix || '';
                animateValue(stat, 0, target, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.getElementById('success-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}
