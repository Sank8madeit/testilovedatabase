// Main JavaScript for I Love Database
class ILoveDatabase {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupMobileMenu();
        this.setupSearch();
        this.setupCodeCopy();
        this.setupNewsletterForm();
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.loadTheme();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle?.querySelector('i');
        
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(newTheme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.querySelector('.theme-toggle i');
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        this.updateMetaThemeColor(theme);
    }

    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#ffffff';
    }

    // Mobile Menu Functionality
    setupMobileMenu() {
        this.createMobileMenu();
        this.setupMobileMenuToggle();
    }

    createMobileMenu() {
        // Create mobile menu if it doesn't exist
        if (document.querySelector('.mobile-menu')) return;

        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-menu-header">
                <div class="logo">
                    <a href="/" class="logo-link">
                        <i class="fas fa-database"></i>
                        <span>I Love Database</span>
                    </a>
                </div>
                <button class="mobile-menu-close" aria-label="Close menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <ul class="mobile-nav-menu">
                <li><a href="/" class="mobile-nav-link">Home</a></li>
                <li><a href="/tutorials/" class="mobile-nav-link">Tutorials</a></li>
                <li><a href="/tutorials/sql-basics/" class="mobile-nav-link">SQL Basics</a></li>
                <li><a href="/tutorials/advanced-sql/" class="mobile-nav-link">Advanced SQL</a></li>
                <li><a href="/tutorials/nosql/" class="mobile-nav-link">NoSQL</a></li>
                <li><a href="/tutorials/cloud-databases/" class="mobile-nav-link">Cloud Databases</a></li>
                <li><a href="/tutorials/database-design/" class="mobile-nav-link">Database Design</a></li>
                <li><a href="/tutorials/etl-data-warehousing/" class="mobile-nav-link">ETL & Data Warehousing</a></li>
                <li><a href="/blog/" class="mobile-nav-link">Blog</a></li>
                <li><a href="/about/" class="mobile-nav-link">About</a></li>
            </ul>
            <div class="mobile-search">
                <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search tutorials...">
                    <button class="search-btn"><i class="fas fa-search"></i></button>
                </div>
            </div>
        `;

        const overlay = document.createElement('div');
        overlay.className = 'mobile-overlay';

        document.body.appendChild(mobileMenu);
        document.body.appendChild(overlay);
    }

    setupMobileMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const overlay = document.querySelector('.mobile-overlay');

        if (!menuToggle || !mobileMenu) return;

        const toggleMenu = (show) => {
            mobileMenu.classList.toggle('active', show);
            overlay.classList.toggle('active', show);
            document.body.style.overflow = show ? 'hidden' : '';
        };

        menuToggle.addEventListener('click', () => toggleMenu(true));
        mobileMenuClose?.addEventListener('click', () => toggleMenu(false));
        overlay?.addEventListener('click', () => toggleMenu(false));

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // Search Functionality
    setupSearch() {
        const searchInputs = document.querySelectorAll('.search-input');
        const searchButtons = document.querySelectorAll('.search-btn');

        searchInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(input.value);
                }
            });
        });

        searchButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const input = button.parentElement.querySelector('.search-input');
                if (input) {
                    this.performSearch(input.value);
                }
            });
        });
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // For now, we'll redirect to a search results page
        // In a real implementation, this could be a dynamic search
        const searchUrl = `/search/?q=${encodeURIComponent(query.trim())}`;
        window.location.href = searchUrl;
        
        // Store search query for analytics
        this.trackEvent('search', { query: query.trim() });
    }

    // Code Copy Functionality
    setupCodeCopy() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.copyCode(button);
            });
        });
    }

    async copyCode(button) {
        const codeBlock = button.closest('.code-preview')?.querySelector('code') || 
                         button.closest('pre')?.querySelector('code');
        
        if (!codeBlock) return;

        const code = codeBlock.textContent;
        
        try {
            await navigator.clipboard.writeText(code);
            this.showCopyFeedback(button, 'Copied!');
        } catch (err) {
            // Fallback for older browsers
            this.fallbackCopyCode(code);
            this.showCopyFeedback(button, 'Copied!');
        }
    }

    fallbackCopyCode(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }

    showCopyFeedback(button, message) {
        const originalIcon = button.innerHTML;
        button.innerHTML = `<i class="fas fa-check"></i>`;
        button.style.color = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.color = '';
        }, 2000);
    }

    // Newsletter Form
    setupNewsletterForm() {
        const form = document.querySelector('.newsletter-form');
        
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleNewsletterSubmission(form);
        });
    }

    async handleNewsletterSubmission(form) {
        const email = form.querySelector('.newsletter-input').value.trim();
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (!email || !this.isValidEmail(email)) {
            this.showFormMessage(form, 'Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Subscribing...';
        submitButton.disabled = true;

        try {
            // Simulate API call - replace with actual newsletter service
            await this.simulateApiCall();
            
            this.showFormMessage(form, 'Thank you for subscribing!', 'success');
            form.reset();
            this.trackEvent('newsletter_signup', { email });
        } catch (error) {
            this.showFormMessage(form, 'Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showFormMessage(form, message, type) {
        // Remove existing message
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageEl = document.createElement('div');
        messageEl.className = `form-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            text-align: center;
            background-color: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
            color: ${type === 'success' ? '#065f46' : '#991b1b'};
            border: 1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'};
        `;

        form.appendChild(messageEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }

    simulateApiCall() {
        return new Promise((resolve) => {
            setTimeout(resolve, 1500);
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.category-card, .feature-item, .hero-visual'
        );
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Analytics and Tracking
    trackEvent(eventName, properties = {}) {
        // Placeholder for analytics tracking
        console.log('Track Event:', eventName, properties);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }

    // Utility Methods
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
        };
    }
}

// Tutorial Page Specific Functionality
class TutorialPage {
    constructor() {
        if (this.isTutorialPage()) {
            this.init();
        }
    }

    isTutorialPage() {
        return window.location.pathname.includes('/tutorials/');
    }

    init() {
        this.setupTableOfContents();
        this.setupCodeTabs();
        this.setupProgressTracking();
    }

    setupTableOfContents() {
        const headings = document.querySelectorAll('.tutorial-content h2, .tutorial-content h3');
        if (headings.length === 0) return;

        const tocContainer = document.querySelector('.table-of-contents');
        if (!tocContainer) return;

        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            const id = heading.id || `heading-${index}`;
            heading.id = id;

            const li = document.createElement('li');
            li.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
            
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = heading.textContent;
            link.className = 'toc-link';
            
            li.appendChild(link);
            tocList.appendChild(li);
        });

        tocContainer.appendChild(tocList);
    }

    setupCodeTabs() {
        const codeTabs = document.querySelectorAll('.code-tabs');
        
        codeTabs.forEach(tabContainer => {
            const tabs = tabContainer.querySelectorAll('.tab-button');
            const panels = tabContainer.querySelectorAll('.tab-panel');

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => {
                    // Remove active class from all tabs and panels
                    tabs.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));

                    // Add active class to clicked tab and corresponding panel
                    tab.classList.add('active');
                    panels[index]?.classList.add('active');
                });
            });
        });
    }

    setupProgressTracking() {
        // Track reading progress
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #2563eb, #0891b2);
            z-index: 1000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
        };

        window.addEventListener('scroll', this.throttle(updateProgress, 10));
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
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ILoveDatabase();
    new TutorialPage();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Page is visible - could refresh data or resume animations
    } else {
        // Page is hidden - could pause heavy operations
    }
});

// Export for potential module usage
window.ILoveDatabase = ILoveDatabase;
window.TutorialPage = TutorialPage;