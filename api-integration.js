/**
 * Frontend API Integration Helper
 * 
 * This file provides helper functions to integrate the frontend with the backend API.
 * Include this file in your HTML pages that need API integration.
 */

const API_BASE_URL = 'http://localhost:3001/api';

// ============================================
// PROJECTS API
// ============================================

/**
 * Fetch all projects from the backend
 * @param {Object} filters - Optional filters (featured, status, category)
 * @returns {Promise<Array>} Array of projects
 */
async function fetchProjects(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const url = `${API_BASE_URL}/projects${queryParams ? '?' + queryParams : ''}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

/**
 * Fetch single project by ID
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Project object
 */
async function fetchProject(projectId) {
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        if (!response.ok) throw new Error('Project not found');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching project:', error);
        return null;
    }
}

// ============================================
// SERVICES API
// ============================================

/**
 * Fetch all services from the backend
 * @returns {Promise<Array>} Array of services
 */
async function fetchServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) throw new Error('Failed to fetch services');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching services:', error);
        return [];
    }
}

// ============================================
// TESTIMONIALS API
// ============================================

/**
 * Fetch all testimonials from the backend
 * @param {boolean} featuredOnly - Only fetch featured testimonials
 * @returns {Promise<Array>} Array of testimonials
 */
async function fetchTestimonials(featuredOnly = false) {
    try {
        const url = featuredOnly 
            ? `${API_BASE_URL}/testimonials?featured=true`
            : `${API_BASE_URL}/testimonials`;
            
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch testimonials');
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return [];
    }
}

// ============================================
// CONTACT FORM API
// ============================================

/**
 * Submit contact form to the backend
 * @param {Object} formData - Contact form data
 * @returns {Promise<Object>} Response object
 */
async function submitContactForm(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit form');
        }
        
        return {
            success: true,
            message: data.message || 'Form submitted successfully!'
        };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return {
            success: false,
            message: error.message || 'Failed to submit form. Please try again.'
        };
    }
}

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example: Load projects dynamically on portfolio page
 */
async function loadProjectsExample() {
    const projects = await fetchProjects({ featured: true, status: 'active' });
    
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <img src="${project.image}" alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.subtitle}</p>
            <div class="tech-stack">
                ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
            ${project.demoLink ? `<a href="${project.demoLink}" target="_blank">View Demo</a>` : ''}
        </div>
    `).join('');
}

/**
 * Example: Load services on services page
 */
async function loadServicesExample() {
    const services = await fetchServices();
    
    const servicesContainer = document.getElementById('services-container');
    if (!servicesContainer) return;
    
    servicesContainer.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">${service.icon}</div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

/**
 * Example: Handle contact form submission
 */
function setupContactFormExample() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone')?.value || '',
            service: document.getElementById('service')?.value || '',
            budget: document.getElementById('budget')?.value || '',
            message: document.getElementById('message').value
        };
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Submit form
        const result = await submitContactForm(formData);
        
        // Show result
        if (result.success) {
            // Success message
            alert('✅ ' + result.message);
            contactForm.reset();
        } else {
            // Error message
            alert('❌ ' + result.message);
        }
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================

// Automatically initialize based on current page
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    
    // Initialize based on page
    if (currentPage.includes('portfolio.html') || currentPage === '/') {
        loadProjectsExample();
    }
    
    if (currentPage.includes('services.html')) {
        loadServicesExample();
    }
    
    if (currentPage.includes('contact.html')) {
        setupContactFormExample();
    }
});

// Export functions for manual use
window.API = {
    fetchProjects,
    fetchProject,
    fetchServices,
    fetchTestimonials,
    submitContactForm
};
