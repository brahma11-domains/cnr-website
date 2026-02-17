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

// Cookie banner handling - requires explicit user consent
const cookieBanner = document.getElementById('cookie-banner');
const acceptBtn = document.getElementById('cookie-accept');
if (cookieBanner && acceptBtn) {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieBannerAccepted');

    if (cookieConsent === 'true') {
        // User has already accepted cookies
        cookieBanner.style.display = 'none';
    } else if (cookieConsent === 'false') {
        // User has rejected cookies
        cookieBanner.style.display = 'none';
    } else {
        // Show banner for first-time visitors
        cookieBanner.style.display = 'flex';
    }

    // Handle accept button click
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieBannerAccepted', 'true');
        cookieBanner.style.display = 'none';
        // Initialize analytics and tracking here
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    });

    // Add decline button handler if needed
    const declineBtn = document.getElementById('cookie-decline');
    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            localStorage.setItem('cookieBannerAccepted', 'false');
            cookieBanner.style.display = 'none';
            // Disable analytics
            if (window.gtag) {
                gtag('consent', 'update', {
                    'analytics_storage': 'denied'
                });
            }
        });
    }
}

// Form validation utilities
const validators = {
    name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return null;
    },
    phone: (value) => {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return null;
    },
    email: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return null;
    }
};

// Show validation error
function showValidationError(input, message) {
    const formGroup = input.closest('.form-group');
    let errorElement = formGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }

    errorElement.textContent = message;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id || `error-${input.id}`);
}

// Clear validation error
function clearValidationError(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    if (errorElement) {
        errorElement.remove();
    }

    input.classList.remove('error');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
}

// Validate form
function validateForm(form) {
    let isValid = true;
    const formData = new FormData(form);

    // Validate name
    const nameInput = form.querySelector('#form-name');
    const nameError = validators.name(formData.get('name'));
    if (nameError) {
        showValidationError(nameInput, nameError);
        isValid = false;
    } else {
        clearValidationError(nameInput);
    }

    // Validate phone
    const phoneInput = form.querySelector('#form-phone');
    const phoneError = validators.phone(formData.get('phone'));
    if (phoneError) {
        showValidationError(phoneInput, phoneError);
        isValid = false;
    } else {
        clearValidationError(phoneInput);
    }

    return isValid;
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
    // Add real-time validation on input
    const formInputs = contactForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.id && validators[input.id]) {
                const error = validators[input.id](input.value);
                if (error) {
                    showValidationError(input, error);
                } else {
                    clearValidationError(input);
                }
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                clearValidationError(input);
            }
        });
    });

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm(contactForm)) {
            return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="ph-bold ph-spinner-gap"></i> Sending...';
        submitBtn.style.animation = 'spin 1s linear infinite';
        trackEvent('contact_form_submitted', 'contact');

        // Submit the form
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                formFeedback.style.display = 'block';
                formFeedback.className = 'form-feedback success';
                formFeedback.innerHTML = '<i class="ph-bold ph-check-circle"></i> Thank you! Your request has been sent successfully. We'll contact you within 24 hours.';
                trackEvent('contact_form_success', 'contact');
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            formFeedback.style.display = 'block';
            formFeedback.className = 'form-feedback error';
            formFeedback.innerHTML = '<i class="ph-bold ph-warning-circle"></i> Sorry, there was an error submitting your request. Please try again or contact us directly via WhatsApp.';
            trackEvent('contact_form_error', 'contact');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.animation = 'none';

            // Hide feedback after 5 seconds
            setTimeout(() => {
                formFeedback.style.display = 'none';
            }, 5000);
        });
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
function loadEducationNews(retryCount = 0) {
    const container = document.getElementById('education-news-container');
    if (!container) return;

    const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=education+positive&hl=en-US&gl=US&ceid=US:en');
    const api = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

    // Show loading state
    container.innerHTML = '<div class="loading-state"><i class="ph-bold ph-spinner-gap"></i> Loading news...</div>';

    fetch(api)
        .then(r => {
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            return r.json();
        })
        .then(data => {
            if (data.items && data.items.length > 0) {
                container.innerHTML = '';
                data.items.slice(0, 3).forEach(item => {
                    const card = document.createElement('article');
                    card.className = 'blog-card';
                    card.innerHTML = `
                        <div class="blog-date">${new Date(item.pubDate).toLocaleDateString()}</div>
                        <h3>${item.title}</h3>
                        <p>${item.description.replace(/<[^>]*>?/gm, '').slice(0, 120)}...</p>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="blog-read-more">Read →</a>
                    `;
                    container.appendChild(card);
                });
            } else {
                throw new Error('No news items found');
            }
        })
        .catch(err => {
            console.error('News load failed:', err);

            // Retry logic (max 3 attempts)
            if (retryCount < 2) {
                setTimeout(() => loadEducationNews(retryCount + 1), 2000 * (retryCount + 1));
            } else {
                container.innerHTML = `
                    <div class="error-state">
                        <i class="ph-bold ph-warning-circle"></i>
                        <p>Unable to load news at the moment. Please try again later.</p>
                        <button onclick="loadEducationNews()" class="btn primary">Retry</button>
                    </div>
                `;
            }
        });
}

// BLOG POSTS FETCH
function loadBlogPosts(retryCount = 0) {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    // Array of Google News queries (can be RSS URLs too)
    const queries = [
        'student+visa+study+abroad+positive',
        'international+education+jobs+tech+positive',
        'AI+education+positive',
        'MBBS+abroad+positive'
    ];

    // Show loading state
    container.innerHTML = '<div class="loading-state"><i class="ph-bold ph-spinner-gap"></i> Loading articles...</div>';

    const fetches = queries.map(q => {
        const rssUrl = encodeURIComponent(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`);
        const api = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;
        return fetch(api)
            .then(r => {
                if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
                return r.json();
            })
            .catch(err => {
                console.error(`Failed to fetch feed for query: ${q}`, err);
                return null;
            });
    });

    Promise.all(fetches).then(results => {
        let items = [];
        results.forEach(data => {
            if (data && data.items) {
                items = items.concat(data.items);
            }
        });

        if (items.length > 0) {
            container.innerHTML = '';
            // Sort by date descending and pick top 6
            items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
            items.slice(0, 6).forEach(item => {
                const card = document.createElement('article');
                card.className = 'blog-card';
                card.innerHTML = `
                    <div class="blog-date">${new Date(item.pubDate).toLocaleDateString()}</div>
                    <h3>${item.title}</h3>
                    <p>${item.description.replace(/<[^>]*>?/gm, '').slice(0, 120)}...</p>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="blog-read-more">Read More →</a>
                `;
                container.appendChild(card);
            });
        } else {
            throw new Error('No blog posts found');
        }
    }).catch(err => {
        console.error('Blog feeds failed:', err);

        // Retry logic (max 3 attempts)
        if (retryCount < 2) {
            setTimeout(() => loadBlogPosts(retryCount + 1), 2000 * (retryCount + 1));
        } else {
            container.innerHTML = `
                <div class="error-state">
                    <i class="ph-bold ph-warning-circle"></i>
                    <p>Unable to load articles at the moment. Please try again later.</p>
                    <button onclick="loadBlogPosts()" class="btn primary">Retry</button>
                </div>
            `;
        }
    });
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
