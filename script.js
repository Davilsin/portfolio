// ========================================
// COMPLETE SITE FUNCTIONALITY
// ========================================

// 1. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
        }
    });
});

// 2. MOBILE MENU FUNCTIONALITY
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-wrapper')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// 3. ADVANCED FORM SUBMISSION WITH VALIDATION
const contactForm = document.querySelector('.contact-form');

async function submitContactLead(formData) {
    const endpoints = ['/api/contact', 'http://localhost:3001/api/contact'];
    let lastError;

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || result.message || `Request failed (${response.status})`);
            }

            return result;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('Unable to submit contact form right now.');
}

if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form elements
        const nameInput = contactForm.querySelector('#contactName') || contactForm.querySelector('input[name="name"]') || contactForm.querySelector('input[placeholder="Your Full Name"]');
        const emailInput = contactForm.querySelector('#contactEmail') || contactForm.querySelector('input[name="email"]') || contactForm.querySelector('input[placeholder="Your Email Address"]');
        const subjectInput = contactForm.querySelector('#contactProjectTitle') || contactForm.querySelector('input[name="projectTitle"]') || contactForm.querySelector('input[placeholder="Project Title"]');
        const typeSelect = contactForm.querySelector('#contactService') || contactForm.querySelector('select[name="service"]') || contactForm.querySelector('select');
        const messageInput = contactForm.querySelector('#contactMessage') || contactForm.querySelector('textarea[name="message"]') || contactForm.querySelector('textarea');

        if (!nameInput || !emailInput || !subjectInput || !typeSelect || !messageInput) {
            showNotification('Form setup error. Please refresh and try again.', 'error');
            return;
        }
        
        // Get values
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value.trim(),
            type: typeSelect.value,
            message: messageInput.value.trim()
        };
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validation checks
        if (!formData.name) {
            showNotification('Please enter your name', 'error');
            nameInput.focus();
            return;
        }
        
        if (!formData.email || !emailRegex.test(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }
        
        if (!formData.subject) {
            showNotification('Please enter a subject', 'error');
            subjectInput.focus();
            return;
        }
        
        if (!formData.type) {
            showNotification('Please select a service type', 'error');
            typeSelect.focus();
            return;
        }
        
        if (!formData.message || formData.message.length < 10) {
            showNotification('Please enter a message (at least 10 characters)', 'error');
            messageInput.focus();
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            await submitContactLead({
                name: formData.name,
                email: formData.email,
                service: formData.type,
                message: `Project Title: ${formData.subject}\n\n${formData.message}`
            });
            
            // Store submission data (if needed)
            storeFormSubmission(formData);
            
            // Show success message
            showNotification('✓ Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log the submission
            console.log('Form submitted:', formData);
            
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// 4. NOTIFICATION SYSTEM
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInFromRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInFromRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// 5. STORE FORM SUBMISSIONS
function storeFormSubmission(formData) {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    submissions.push({
        ...formData,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
}

// 6. FORM INPUT FOCUS EFFECTS
document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.boxShadow = 'none';
    });
});

// 7. ACTIVE NAVIGATION LINK HIGHLIGHTING
function updateActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        const isActive = href === currentPage || 
                        (currentPage === '' && href === 'index.html');
        
        if (isActive) {
            link.style.color = 'var(--primary-color)';
            link.style.fontWeight = '600';
        } else {
            link.style.color = 'inherit';
            link.style.fontWeight = 'normal';
        }
    });
}

// Call on page load
updateActiveLink();

// 8. SCROLL ANIMATIONS FOR ELEMENTS
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .process-step, .preview-card, .intro-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// 9. NAVIGATION ACTIVE STATE ON SCROLL
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// 10. FEATURED PROJECTS CAPTIVATING INFO ON CLICK
const projectViewButtons = document.querySelectorAll('.portfolio-preview .view-project');

if (projectViewButtons.length > 0) {
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const modalSubtitle = document.getElementById('projectModalSubtitle');
    const modalDescription = document.getElementById('projectModalDescription');
    const modalCaption = document.getElementById('projectModalCaption');
    const modalTech = document.getElementById('projectModalTech');

    const closeProjectModal = () => {
        if (!projectModal) return;
        projectModal.classList.remove('open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const openProjectModal = (button) => {
        const projectCard = button.closest('.portfolio-preview-item');
        if (!projectCard || !projectModal || !modalTitle || !modalSubtitle || !modalDescription || !modalCaption || !modalTech) {
            return;
        }

        const title = projectCard.querySelector('h3')?.textContent?.trim() || 'Project Details';
        const subtitle = projectCard.querySelector('.portfolio-preview-subtitle')?.textContent?.trim() || 'Featured Project';
        const description = projectCard.querySelector('.portfolio-preview-description')?.textContent?.trim() || '';
        const caption = button.getAttribute('data-caption') || '';
        const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent?.trim()).filter(Boolean);

        modalTitle.textContent = title;
        modalSubtitle.textContent = subtitle;
        modalDescription.textContent = description;
        modalCaption.textContent = caption;
        modalTech.innerHTML = techTags.map(tag => `<span class="tech-tag">${tag}</span>`).join('');

        projectModal.classList.add('open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        button.classList.remove('is-clicked');
        void button.offsetWidth;
        button.classList.add('is-clicked');

        setTimeout(() => {
            button.classList.remove('is-clicked');
        }, 380);
    };

    projectViewButtons.forEach(button => {
        button.addEventListener('click', () => openProjectModal(button));
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(button);
            }
        });
    });

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            const target = e.target;
            if (target instanceof HTMLElement && target.hasAttribute('data-close-modal')) {
                closeProjectModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('open')) {
                closeProjectModal();
            }
        });
    }
}

// Add smooth scroll behavior for browsers that don't support it
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScroll = (target) => {
        const start = window.scrollY;
        const distance = target - start;
        const duration = 1000;
        let start_time = null;
        
        const easeInOutQuad = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const scroll = (currentTime) => {
            if (start_time === null) start_time = currentTime;
            const elapsed = currentTime - start_time;
            const run = easeInOutQuad(elapsed / duration);
            window.scrollTo(0, start + distance * run);
            if (elapsed < duration) requestAnimationFrame(scroll);
        };
        
        requestAnimationFrame(scroll);
    };
}

// ========================================
// CHATBOT FUNCTIONALITY
// ========================================

// FAQ Data
const faqData = [
    {
        question: "What's your typical project timeline?",
        answer: "Project duration varies based on complexity and scope. Small projects take 2-4 weeks, while larger applications typically take 2-4 months. I'll provide a detailed timeline during our initial consultation."
    },
    {
        question: "Do you work with remote clients?",
        answer: "Yes, I work with clients globally! I communicate effectively through email, video calls, and project management tools. Location is not a barrier to great collaboration."
    },
    {
        question: "What's your pricing model?",
        answer: "I offer flexible pricing based on project scope and engagement type: fixed-project pricing, hourly rates, or monthly retainers. I'll discuss options that best fit your budget and needs."
    },
    {
        question: "Can you work on existing projects?",
        answer: "Absolutely! I regularly take over projects, debug issues, optimize performance, and add new features. I can work with your existing codebase regardless of the technology stack."
    },
    {
        question: "Do you provide ongoing support?",
        answer: "Yes, I offer maintenance and support packages to keep your application running smoothly, implement updates, and add new features as your business grows."
    },
    {
        question: "How do you ensure project quality?",
        answer: "I follow industry best practices including comprehensive testing, code reviews, performance optimization, and continuous integration. Your success is my priority."
    }
];

// Initialize Mini Chatbot in Footer
document.addEventListener('DOMContentLoaded', () => {
    const miniChatDisplay = document.getElementById('miniChatDisplay');
    const miniChatInput = document.getElementById('miniChatInput');
    const miniChatSendBtn = document.querySelector('.mini-chat-send-btn');

    if (miniChatDisplay && miniChatInput && miniChatSendBtn) {
        // Helper function to add message to mini chat
        function addMiniMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `mini-chat-message ${isUser ? 'user-message' : 'bot-message'}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            miniChatDisplay.appendChild(messageDiv);
            
            // Auto scroll to bottom
            miniChatDisplay.scrollTop = miniChatDisplay.scrollHeight;
        }

        // Handle mini chat send
        miniChatSendBtn.addEventListener('click', () => {
            const message = miniChatInput.value.trim();
            
            if (message.length > 0) {
                addMiniMessage(message, true);
                miniChatInput.value = '';
                
                // Find matching FAQ or show default response
                setTimeout(() => {
                    let response = "Thanks! Let's discuss your project. 📧";
                    
                    // Simple keyword matching
                    const messageLC = message.toLowerCase();
                    faqData.forEach(faq => {
                        const questionLC = faq.question.toLowerCase();
                        if (messageLC.includes(questionLC.split('?')[0]) || messageLC.includes('timeline') || messageLC.includes('price') || messageLC.includes('support')) {
                            response = faq.answer.substring(0, 100) + '...';
                        }
                    });
                    
                    addMiniMessage(response, false);
                }, 500);
            }
        });

        // Send on Enter key
        miniChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                miniChatSendBtn.click();
            }
        });
    }
});

