// ========================================
// ADVANCED INTERACTIONS & ANIMATIONS
// ========================================

// 1. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            entry.target.style.opacity = '1';
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements on page load
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .skill-item, .timeline-item, .preview-card, .value-card, .pricing-card, .intro-card, .faq-item, .process-step'
    );
    
    elements.forEach(el => {
        el.style.opacity = '0';
        animationObserver.observe(el);
    });
});


// 2. PARALLAX SCROLL EFFECT
let isParallaxEnabled = true;

window.addEventListener('scroll', () => {
    if (!isParallaxEnabled) return;
    
    const scrollPos = window.scrollY;
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = scrollPos * speed;
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Reduce parallax on mobile for performance
if (window.innerWidth < 768) {
    isParallaxEnabled = false;
}


// 3. ENHANCED CARD HOVER EFFECTS
const cards = document.querySelectorAll('.service-card, .portfolio-item, .preview-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable on mobile
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});


// 4. ENHANCED ACTIVE NAVIGATION LINK HIGHLIGHTING
document.addEventListener('DOMContentLoaded', () => {
    const updateActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            const href = link.getAttribute('href');
            const isActive = href === currentPage || (currentPage === '' && href === 'index.html');
            
            if (isActive) {
                link.style.color = 'var(--primary-color)';
                link.style.fontWeight = '600';
            } else {
                link.style.color = 'inherit';
                link.style.fontWeight = 'normal';
            }
        });
    };
    
    updateActiveLink();
    
    // Update on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (!link.getAttribute('href').startsWith('#')) {
                setTimeout(updateActiveLink, 100);
            }
        });
    });
});


// 5. ENHANCED FORM INPUT ANIMATION
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

formInputs.forEach(input => {
    // Focus effect
    input.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
    });
    
    // Blur effect
    input.addEventListener('blur', function() {
        this.style.borderColor = 'var(--border-light)';
        this.style.boxShadow = 'none';
        this.parentElement.style.boxShadow = 'none';
    });
    
    // Input effect
    input.addEventListener('input', function() {
        if (this.value.length > 0) {
            this.style.backgroundColor = 'rgba(0, 102, 255, 0.02)';
        } else {
            this.style.backgroundColor = 'var(--background-white)';
        }
    });
    
    // Validation feedback
    input.addEventListener('change', function() {
        if (this.hasAttribute('type') && this.type === 'email' && this.value) {
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
            if (isValid) {
                this.style.borderColor = '#10B981';
            } else {
                this.style.borderColor = '#EF4444';
            }
        }
    });
});


// 6. SCROLL-TO-TOP BUTTON FUNCTIONALITY
document.addEventListener('DOMContentLoaded', () => {
    // Create scroll-to-top button if it doesn't exist
    let scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) {
        scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.id = 'scrollToTop';
        scrollToTopBtn.innerHTML = '↑ TOP';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 12px 16px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);
        `;
        document.body.appendChild(scrollToTopBtn);
    }
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(0, 102, 255, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 102, 255, 0.3)';
    });
});


// 7. TESTIMONIALS AUTO-ROTATION CAROUSEL
document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (testimonials.length > 1) {
        let currentTestimonial = 0;
        let autoRotateInterval;
        
        function showTestimonial(index) {
            testimonials.forEach((card, i) => {
                if (i === index) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        }
        
        function nextTestimonial() {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }
        
        // Show first testimonial
        showTestimonial(0);
        
        // Auto-rotate every 5 seconds
        autoRotateInterval = setInterval(nextTestimonial, 5000);
        
        // Reset interval on user interaction
        testimonials.forEach(testimonial => {
            testimonial.addEventListener('click', () => {
                clearInterval(autoRotateInterval);
                autoRotateInterval = setInterval(nextTestimonial, 5000);
            });
        });
    }
});


// 8. ANIMATED COUNTERS FOR STATISTICS
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('[data-count]');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.count);
                    let current = 0;
                    const increment = Math.ceil(target / 50);
                    
                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            entry.target.textContent = Math.min(current, target) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target + '+';
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
});


// 9. MOBILE MENU ENHANCED MANAGEMENT
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-wrapper')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});


// 10. SMOOTH ANCHOR LINK SCROLLING
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                document.querySelector('.hamburger')?.classList.remove('active');
                document.querySelector('.nav-menu')?.classList.remove('active');
            }
        });
    });
});


// 11. LAZY LOADING IMAGES
document.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src || img.src;
                    
                    if (src && !img.src.includes('placeholder')) {
                        img.src = src;
                    }
                    
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});


// 12. DARK MODE TOGGLE (OPTIONAL)
document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    if (darkModeToggle) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkModeToggle.classList.add('active');
        }
        
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            darkModeToggle.classList.toggle('active');
        });
    }
});

// 13. PERFORMANCE MONITORING
document.addEventListener('DOMContentLoaded', () => {
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            // Log performance metrics
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log('📊 Performance Metrics:');
            console.log(`   Total Load Time: ${pageLoadTime}ms`);
            console.log(`   DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
            console.log(`   Resource Load: ${perfData.loadEventEnd - perfData.domContentLoadedEventEnd}ms`);
        });
    }
});

// 14. KEYBOARD NAVIGATION
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.nav-menu')?.classList.remove('active');
    }
    
    // Ctrl/Cmd + K to focus search/jump (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('[role="searchbox"]');
        if (searchInput) searchInput.focus();
    }
});

// 15. EXTERNAL LINK HANDLING
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

console.log('✨ All interactions loaded successfully!');

