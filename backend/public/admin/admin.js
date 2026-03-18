// API Base URL
const API_URL = '/api';

// Check Authentication on Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Check if user is authenticated
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include'
        });
        
        const data = await response.json();
        console.log('Auth check response:', data);
        
        if (data.authenticated && data.admin) {
            showDashboard(data.admin);
        } else {
            showLogin();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        showLogin();
    }
}

// Show Login Page
function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').classList.remove('active');
}

// Show Dashboard
function showDashboard(admin) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('adminUsername').textContent = admin.username;
    loadDashboardData();
}

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Show loading state
    submitButton.textContent = 'Logging in...';
    submitButton.disabled = true;
    errorDiv.style.display = 'none';
    
    try {
        console.log('Attempting login with username:', username);
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (response.ok) {
            console.log('Login successful! Redirecting...');
            // Small delay to ensure session is set
            setTimeout(() => {
                showDashboard(data.admin);
            }, 500);
        } else {
            errorDiv.textContent = data.message || 'Login failed. Please try again.';
            errorDiv.style.display = 'block';
            console.error('Login failed:', data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Connection error. Please make sure the backend is running on port 3001.';
        errorDiv.style.display = 'block';
    } finally {
        submitButton.textContent = 'Login';
        submitButton.disabled = false;
    }
});

// Logout Function
async function logout() {
    try {
        await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        showLogin();
    } catch (error) {
        console.error('Logout failed:', error);
        showLogin();
    }
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all menu items
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show active section
    document.getElementById(sectionName).classList.add('active');
    
    // Highlight active menu
    event.target.classList.add('active');
    
    // Load section data
    switch(sectionName) {
        case 'overview':
            loadDashboardData();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'services':
            loadServices();
            break;
        case 'testimonials':
            loadTestimonials();
            break;
        case 'contacts':
            loadContacts();
            break;
    }
}

// Load Dashboard Statistics
async function loadDashboardData() {
    const statsLoading = document.getElementById('statsLoading');
    const statsGrid = document.getElementById('statsGrid');
    
    statsLoading.style.display = 'block';
    statsGrid.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            credentials: 'include'
        });
        const data = await response.json();
        
        // Display stats
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Total Projects</h3>
                <div class="number">${data.projects.total}</div>
            </div>
            <div class="stat-card">
                <h3>Total Services</h3>
                <div class="number">${data.services.total}</div>
            </div>
            <div class="stat-card">
                <h3>New Contacts</h3>
                <div class="number">${data.contacts.new}</div>
            </div>
            <div class="stat-card">
                <h3>Total Testimonials</h3>
                <div class="number">${data.testimonials.total}</div>
            </div>
        `;
        
        // Display recent contacts
        const recentContactsDiv = document.getElementById('recentContacts');
        if (data.recentContacts.length > 0) {
            recentContactsDiv.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.recentContacts.map(contact => `
                            <tr>
                                <td>${contact.name}</td>
                                <td>${contact.email}</td>
                                <td>${contact.service || 'N/A'}</td>
                                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                                <td><span class="badge badge-${getStatusClass(contact.status)}">${contact.status}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            recentContactsDiv.innerHTML = '<p style="padding: 2rem; text-align: center;">No recent contacts</p>';
        }
        
        statsLoading.style.display = 'none';
        statsGrid.style.display = 'grid';
    } catch (error) {
        statsLoading.textContent = 'Failed to load statistics';
        console.error('Stats loading failed:', error);
    }
}

// Load Projects
async function loadProjects() {
    const tableDiv = document.getElementById('projectsTable');
    tableDiv.innerHTML = '<div class="loading">Loading projects...</div>';
    
    try {
        const response = await fetch(`${API_URL}/projects`, {
            credentials: 'include'
        });
        const projects = await response.json();
        
        if (projects.length > 0) {
            tableDiv.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${projects.map(project => `
                            <tr>
                                <td>${project.title}</td>
                                <td>${project.category || 'N/A'}</td>
                                <td><span class="badge badge-${getStatusClass(project.status)}">${project.status}</span></td>
                                <td>${project.featured ? '⭐ Yes' : 'No'}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-edit" onclick='editProject(${JSON.stringify(project)})'>Edit</button>
                                        <button class="btn-delete" onclick="deleteProject('${project._id}')">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center;">No projects found</p>';
        }
    } catch (error) {
        tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Failed to load projects</p>';
        console.error('Projects loading failed:', error);
    }
}

// Load Services
async function loadServices() {
    const tableDiv = document.getElementById('servicesTable');
    tableDiv.innerHTML = '<div class="loading">Loading services...</div>';
    
    try {
        const response = await fetch(`${API_URL}/services`, {
            credentials: 'include'
        });
        const services = await response.json();
        
        if (services.length > 0) {
            tableDiv.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Icon</th>
                            <th>Title</th>
                            <th>Features</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${services.map(service => `
                            <tr>
                                <td style="font-size: 1.5rem;">${service.icon}</td>
                                <td>${service.title}</td>
                                <td>${service.features.length} features</td>
                                <td><span class="badge badge-${getStatusClass(service.status)}">${service.status}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-edit" onclick='editService(${JSON.stringify(service)})'>Edit</button>
                                        <button class="btn-delete" onclick="deleteService('${service._id}')">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center;">No services found</p>';
        }
    } catch (error) {
        tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Failed to load services</p>';
        console.error('Services loading failed:', error);
    }
}

// Load Testimonials
async function loadTestimonials() {
    const tableDiv = document.getElementById('testimonialsTable');
    tableDiv.innerHTML = '<div class="loading">Loading testimonials...</div>';
    
    try {
        const response = await fetch(`${API_URL}/testimonials`, {
            credentials: 'include'
        });
        const testimonials = await response.json();
        
        if (testimonials.length > 0) {
            tableDiv.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Client</th>
                            <th>Company</th>
                            <th>Rating</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${testimonials.map(testimonial => `
                            <tr>
                                <td>${testimonial.clientName}</td>
                                <td>${testimonial.clientCompany || 'N/A'}</td>
                                <td>${'⭐'.repeat(testimonial.rating)}</td>
                                <td>${testimonial.featured ? '⭐ Yes' : 'No'}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-edit" onclick='editTestimonial(${JSON.stringify(testimonial)})'>Edit</button>
                                        <button class="btn-delete" onclick="deleteTestimonial('${testimonial._id}')">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center;">No testimonials found</p>';
        }
    } catch (error) {
        tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Failed to load testimonials</p>';
        console.error('Testimonials loading failed:', error);
    }
}

// Load Contacts
async function loadContacts() {
    const tableDiv = document.getElementById('contactsTable');
    tableDiv.innerHTML = '<div class="loading">Loading contacts...</div>';
    
    try {
        const response = await fetch(`${API_URL}/contact`, {
            credentials: 'include'
        });
        const contacts = await response.json();
        
        if (contacts.length > 0) {
            tableDiv.innerHTML = `
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Service</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${contacts.map(contact => `
                            <tr>
                                <td>${contact.name}</td>
                                <td>${contact.email}</td>
                                <td>${contact.phone || 'N/A'}</td>
                                <td>${contact.service || 'N/A'}</td>
                                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                                <td><span class="badge badge-${getStatusClass(contact.status)}">${contact.status}</span></td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="btn-edit" onclick="viewContact('${contact._id}')">View</button>
                                        <button class="btn-delete" onclick="deleteContact('${contact._id}')">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } else {
            tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center;">No contacts found</p>';
        }
    } catch (error) {
        tableDiv.innerHTML = '<p style="padding: 2rem; text-align: center; color: red;">Failed to load contacts</p>';
        console.error('Contacts loading failed:', error);
    }
}

// Helper: Get Status Class
function getStatusClass(status) {
    switch(status) {
        case 'active':
        case 'published':
        case 'replied':
            return 'success';
        case 'read':
        case 'draft':
            return 'warning';
        case 'new':
            return 'success';
        default:
            return 'warning';
    }
}

// Project CRUD Functions
function openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    const title = document.getElementById('projectModalTitle');
    
    form.reset();
    
    if (project) {
        title.textContent = 'Edit Project';
        document.getElementById('projectId').value = project._id;
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectSubtitle').value = project.subtitle;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectImage').value = project.image;
        document.getElementById('projectCategory').value = project.category || 'Web App';
        document.getElementById('projectDemo').value = project.demoLink || '';
        document.getElementById('projectTech').value = project.technologies.join(', ');
        document.getElementById('projectFeatured').checked = project.featured;
        document.getElementById('projectOrder').value = project.order || 0;
    } else {
        title.textContent = 'Add Project';
        document.getElementById('projectId').value = '';
    }
    
    modal.classList.add('active');
}

function editProject(project) {
    openProjectModal(project);
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value;
    const projectData = {
        title: document.getElementById('projectTitle').value,
        subtitle: document.getElementById('projectSubtitle').value,
        description: document.getElementById('projectDescription').value,
        image: document.getElementById('projectImage').value,
        category: document.getElementById('projectCategory').value,
        demoLink: document.getElementById('projectDemo').value,
        technologies: document.getElementById('projectTech').value.split(',').map(t => t.trim()),
        featured: document.getElementById('projectFeatured').checked,
        order: parseInt(document.getElementById('projectOrder').value) || 0,
        status: 'active'
    };
    
    try {
        const url = projectId ? `${API_URL}/projects/${projectId}` : `${API_URL}/projects`;
        const method = projectId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            closeModal('projectModal');
            loadProjects();
            alert(projectId ? 'Project updated successfully!' : 'Project created successfully!');
        } else {
            alert('Failed to save project');
        }
    } catch (error) {
        console.error('Save project failed:', error);
        alert('Error saving project');
    }
});

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadProjects();
            alert('Project deleted successfully!');
        } else {
            alert('Failed to delete project');
        }
    } catch (error) {
        console.error('Delete project failed:', error);
        alert('Error deleting project');
    }
}

// Service CRUD Functions (Similar to Projects)
function openServiceModal(service = null) {
    // Implementation similar to project modal
    alert('Service modal coming soon. Use API directly for now.');
}

function editService(service) {
    openServiceModal(service);
}

async function deleteService(id) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
        const response = await fetch(`${API_URL}/services/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadServices();
            alert('Service deleted successfully!');
        } else {
            alert('Failed to delete service');
        }
    } catch (error) {
        console.error('Delete service failed:', error);
        alert('Error deleting service');
    }
}

// Testimonial CRUD Functions
function openTestimonialModal(testimonial = null) {
    alert('Testimonial modal coming soon. Use API directly for now.');
}

function editTestimonial(testimonial) {
    openTestimonialModal(testimonial);
}

async function deleteTestimonial(id) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    try {
        const response = await fetch(`${API_URL}/testimonials/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadTestimonials();
            alert('Testimonial deleted successfully!');
        } else {
            alert('Failed to delete testimonial');
        }
    } catch (error) {
        console.error('Delete testimonial failed:', error);
        alert('Error deleting testimonial');
    }
}

// Contact Functions
async function viewContact(id) {
    try {
        const response = await fetch(`${API_URL}/contact`, {
            credentials: 'include'
        });
        const contacts = await response.json();
        const contact = contacts.find(c => c._id === id);
        
        if (contact) {
            alert(`
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone || 'N/A'}
Service: ${contact.service || 'N/A'}
Budget: ${contact.budget || 'N/A'}
Message: ${contact.message}
Date: ${new Date(contact.createdAt).toLocaleString()}
            `);
            
            // Mark as read
            if (contact.status === 'new') {
                await fetch(`${API_URL}/contact/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ status: 'read' })
                });
                loadContacts();
            }
        }
    } catch (error) {
        console.error('View contact failed:', error);
    }
}

async function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
        const response = await fetch(`${API_URL}/contact/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (response.ok) {
            loadContacts();
            alert('Contact deleted successfully!');
        } else {
            alert('Failed to delete contact');
        }
    } catch (error) {
        console.error('Delete contact failed:', error);
        alert('Error deleting contact');
    }
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
