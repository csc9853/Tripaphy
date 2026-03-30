// Main JavaScript File for TRIPATHY & CO Website

class WebsiteManager {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAnimations();
        this.setupFormValidation();
        this.setupBackToTop();
        this.setupMobileMenu();
        console.log('Website initialized successfully');
    }

    bindEvents() {
        // Contact form submission
        const contactForms = document.querySelectorAll('#contact-form');
        contactForms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // WhatsApp const whatsappBtns = document.querySelectorAll('a[href*="wa.me"]');
        whatsappBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('WhatsApp Click', 'Contact', 'WhatsApp Button');
            });
        });

        // Phone call tracking
        const phoneBtns = document.querySelectorAll('a[href*="tel:"]');
        phoneBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackEvent('Phone Call', 'Contact', 'Call Button');
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.innerHTML = '<div class="loading mr-2"></div> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            this.showAlert('Thank you for your message! We will contact you soon.', 'success');

            // Reset form
            form.reset();

            // Track form submission
            this.trackEvent('Form Submission', 'Contact', 'Contact Form');
        }, 2000);
    }

    showAlert(message, type = 'success') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-${type} animate-fade-in`;
        alertDiv.textContent = message;
        
        // Insert after the form
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.parentNode.insertBefore(alertDiv, contactForm.nextSibling);
        }

        // Remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe elements to animate
        document.querySelectorAll('.card, .service-item, .testimonial-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.markFieldInvalid(field);
                isValid = false;
            } else {
                this.markFieldValid(field);
            }
        });

        // Validate email fields
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(emailField => {
            if (emailField.value && !this.isValidEmail(emailField.value)) {
                this.markFieldInvalid(emailField);
                isValid = false;
            } else if (emailField.value) {
                this.markFieldValid(emailField);
            }
        });

        return isValid;
    }

    markFieldInvalid(field) {
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    markFieldValid(field) {
        field.style.borderColor = '#10b981';
        field.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupBackToTop() {
        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.title = 'Back to Top';
        
        document.body.appendChild(backToTopBtn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }

    trackEvent(action, category, label) {
        // Console log for development
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
        
        // Here you would integrate with analytics (Google Analytics, etc.)
        // For now, just logging to console
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Load more content dynamically
    loadMoreContent() {
        // This would be used for blog pagination, service expansion, etc.
        console.log('Loading more content...');
    }

    // Initialize chat widget (if needed)
    initializeChatWidget() {
        // Placeholder for chat widget initialization
        console.log('Chat widget initialized');
    }

    // Handle live chat requests
    handleLiveChat() {
        // Placeholder for live chat functionality
        console.log('Live chat initiated');
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WebsiteManager();
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Log to analytics or send to error tracking service
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebsiteManager;
}
