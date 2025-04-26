// API base URL - change this if your backend runs on a different port
const API_URL = 'http://localhost:3000/api';
// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    return true;
}

// Add token to all fetch requests
function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login';
        return;
    }
    
    if (!options.headers) {
        options.headers = {};
    }
    
    options.headers['Authorization'] = `Bearer ${token}`;
    return fetch(url, options);
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) {
        return;
    }
    
    // Display user info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-name').textContent = user.fullName;
        document.getElementById('user-role').textContent = user.role;
        document.getElementById('user-avatar').textContent = user.fullName.charAt(0);
    }
    
    // Add logout event listener
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Initialize the rest of the app
    init();
});

// Global state
let clients = [];
let programs = [];
let enrollments = [];

// DOM Elements - Tabs (updated selectors to match new sidebar design)
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const tabContents = document.querySelectorAll('.tab-content');

// DOM Elements - Modals
const addClientModal = document.getElementById('add-client-modal');
const addProgramModal = document.getElementById('add-program-modal');
const enrollModal = document.getElementById('enroll-modal');
const closeModalButtons = document.querySelectorAll('.close-modal');

// DOM Elements - Forms
const clientForm = document.getElementById('client-form');
const programForm = document.getElementById('program-form');
const enrollmentForm = document.getElementById('enrollment-form');

// DOM Elements - Tables and Grids
const clientsTable = document.getElementById('clients-table');
const programsGrid = document.getElementById('programs-grid');

// DOM Elements - Counters
const clientCount = document.getElementById('client-count');
const programCount = document.getElementById('program-count');
const enrollmentCount = document.getElementById('enrollment-count');

// DOM Elements - Buttons
const addClientBtn = document.getElementById('add-client-btn');
const addProgramBtn = document.getElementById('add-program-btn');

// DOM Elements - Search
const clientSearch = document.getElementById('client-search');

// Tab Functionality (updated to work with new sidebar design)
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        sidebarLinks.forEach(l => {
            l.classList.remove('active');
            l.classList.add('text-gray-400');
            l.classList.remove('text-gray-200');
        });
        
        // Add active class to clicked link
        link.classList.add('active');
        link.classList.remove('text-gray-400');
        link.classList.add('text-gray-200');
        
        // Hide all tab contents
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Show corresponding content
        const contentId = link.id.replace('-tab', '-content');
        document.getElementById(contentId).classList.add('active');
        
        // Update page title
        const pageTitle = document.getElementById('page-title');
        pageTitle.textContent = link.textContent.trim();
        
        // Load data for the tab
        if (contentId === 'clients-content') {
            fetchClients();
        } else if (contentId === 'programs-content') {
            fetchPrograms();
        } else if (contentId === 'dashboard-content') {
            fetchDashboardData();
        }
    });
});

// Modal Functionality
closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        addClientModal.classList.add('hidden');
        addProgramModal.classList.add('hidden');
        enrollModal.classList.add('hidden');
    });
});

// Button Event Listeners
addClientBtn.addEventListener('click', () => {
    document.getElementById('add-client-modal-title').textContent = 'Add New Client';
    clientForm.reset();
    document.getElementById('client-id').value = '';
    addClientModal.classList.remove('hidden');
});

addProgramBtn.addEventListener('click', () => {
    document.getElementById('add-program-modal-title').textContent = 'Add New Program';
    programForm.reset();
    document.getElementById('program-id').value = '';
    addProgramModal.classList.remove('hidden');
});

// Form submissions
clientForm.addEventListener('submit', handleClientFormSubmit);
programForm.addEventListener('submit', handleProgramFormSubmit);
enrollmentForm.addEventListener('submit', handleEnrollmentFormSubmit);

// Search functionality
clientSearch.addEventListener('input', () => {
    const searchTerm = clientSearch.value.toLowerCase();
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm)
    );
    renderClientsTable(filteredClients);
});

// API Functions

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        const [clientsRes, programsRes, enrollmentsRes] = await Promise.all([
            fetchWithAuth(`${API_URL}/clients`),
            fetchWithAuth(`${API_URL}/programs`),
            fetchWithAuth(`${API_URL}/enrollments`)
        ]);
        
        const clientsData = await clientsRes.json();
        const programsData = await programsRes.json();
        const enrollmentsData = await enrollmentsRes.json();
        
        console.log('Dashboard data:', { clientsData, programsData, enrollmentsData });
        
        if (clientCount) clientCount.textContent = clientsData.count || 0;
        if (programCount) programCount.textContent = programsData.count || 0;
        
        // Ensure the enrollment count is displayed properly
        if (enrollmentCount) {
            // If enrollmentsData.count exists, use it; otherwise count the array length
            const count = enrollmentsData.count !== undefined ? 
                enrollmentsData.count : 
                (enrollmentsData.data ? enrollmentsData.data.length : 0);
            
            enrollmentCount.textContent = count;
            console.log('Setting enrollment count to:', count);
        }
        
        // Store enrollments data for later use
        if (enrollmentsData.data) {
            enrollments = enrollmentsData.data;
        }
        
        // Fetch recent activities for dashboard
        fetchRecentActivities();
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showAlert('Failed to load dashboard data');
    }
}

// Fetch recent activities (placeholder function)
async function fetchRecentActivities() {
    // In a real implementation, this would fetch from an API endpoint
    const recentActivitiesContainer = document.getElementById('recent-activities');
    if (!recentActivitiesContainer) return;
    
    // For now we'll just use placeholder data
    const activeProgramsList = document.getElementById('active-programs-list');
    if (activeProgramsList) {
        activeProgramsList.innerHTML = '';
        
        // Get the first 3 active programs
        const activePrograms = programs.filter(p => p.isActive).slice(0, 3);
        
        if (activePrograms.length === 0) {
            activeProgramsList.innerHTML = '<p class="text-gray-400 text-center py-4">No active programs</p>';
            return;
        }
        
        activePrograms.forEach(program => {
            const item = document.createElement('div');
            item.className = 'p-3 bg-dark-100/50 rounded-lg border border-dark-400';
            item.innerHTML = `
                <div class="flex justify-between items-center">
                    <h4 class="font-medium text-white">${program.name}</h4>
                    <span class="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">Active</span>
                </div>
                <p class="text-sm text-gray-400 mt-1 line-clamp-1">${program.description}</p>
            `;
            activeProgramsList.appendChild(item);
        });
        
        // Add "View all" link
        const viewAllLink = document.createElement('div');
        viewAllLink.className = 'mt-3 text-center';
        viewAllLink.innerHTML = '<a href="#" class="text-blue-400 text-sm hover:underline">View all programs</a>';
        viewAllLink.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('programs-tab').click();
        });
        activeProgramsList.appendChild(viewAllLink);
    }
}

// Fetch clients
async function fetchClients() {
    try {
        const response = await fetchWithAuth(`${API_URL}/clients`);
        const data = await response.json();
        
        if (data.success) {
            clients = data.data;
            renderClientsTable(clients);
        } else {
            console.error('Failed to fetch clients:', data.message);
            showAlert('Failed to load clients');
        }
    } catch (error) {
        console.error('Error fetching clients:', error);
        showAlert('Failed to connect to server');
    }
}

// Fetch programs
async function fetchPrograms() {
    try {
        const response = await fetchWithAuth(`${API_URL}/programs`);
        const data = await response.json();
        
        if (data.success) {
            programs = data.data;
            renderProgramsGrid(programs);
            updateEnrollmentProgramDropdown();
        } else {
            console.error('Failed to fetch programs:', data.message);
            showAlert('Failed to load programs');
        }
    } catch (error) {
        console.error('Error fetching programs:', error);
        showAlert('Failed to connect to server');
    }
}

// Navigate to client profile page
function navigateToClientProfile(clientId) {
    window.location.href = `/client-profile.html?id=${clientId}`;
}

// Form Handlers

// Handle client form submission (create or update)
async function handleClientFormSubmit(event) {
    event.preventDefault();
    
    const clientId = document.getElementById('client-id').value;
    const clientData = {
        name: document.getElementById('client-name').value,
        dateOfBirth: document.getElementById('client-dob').value,
        gender: document.getElementById('client-gender').value,
        contactNumber: document.getElementById('client-contact').value,
        email: document.getElementById('client-email').value,
        address: {
            value: document.getElementById('client-address').value
        }
    };
    
    try {
        let url = `${API_URL}/clients`;
        let method = 'POST';
        
        if (clientId) {
            url = `${API_URL}/clients/${clientId}`;
            method = 'PUT';
        }
        
        const response = await fetchWithAuth(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            addClientModal.classList.add('hidden');
            fetchClients();
            fetchDashboardData();
            showAlert(clientId ? 'Client updated successfully' : 'Client created successfully', 'success');
        } else {
            console.error('Failed to save client:', data.message);
            showAlert(`Failed to save client: ${data.message}`);
        }
    } catch (error) {
        console.error('Error saving client:', error);
        showAlert('Failed to connect to server');
    }
}

// Handle program form submission (create or update)
async function handleProgramFormSubmit(event) {
    event.preventDefault();
    
    const programId = document.getElementById('program-id').value;
    const programData = {
        name: document.getElementById('program-name').value,
        description: document.getElementById('program-description').value,
        startDate: document.getElementById('program-start-date').value,
        endDate: document.getElementById('program-end-date').value || null,
        isActive: document.getElementById('program-active').checked
    };
    
    try {
        let url = `${API_URL}/programs`;
        let method = 'POST';
        
        if (programId) {
            url = `${API_URL}/programs/${programId}`;
            method = 'PUT';
        }
        
        const response = await fetchWithAuth(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            addProgramModal.classList.add('hidden');
            fetchPrograms();
            fetchDashboardData();
            showAlert(programId ? 'Program updated successfully' : 'Program created successfully', 'success');
        } else {
            console.error('Failed to save program:', data.message);
            showAlert(`Failed to save program: ${data.message}`);
        }
    } catch (error) {
        console.error('Error saving program:', error);
        showAlert('Failed to connect to server');
    }
}

// Handle enrollment form submission
async function handleEnrollmentFormSubmit(event) {
    event.preventDefault();
    
    const enrollmentData = {
        clientId: document.getElementById('enrollment-client-id').value,
        programId: document.getElementById('enrollment-program').value,
        notes: document.getElementById('enrollment-notes').value
    };
    
    try {
        const response = await fetchWithAuth(`${API_URL}/enrollments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(enrollmentData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            enrollModal.classList.add('hidden');
            showAlert('Client enrolled successfully', 'success');
            // Navigate to client profile page after enrollment
            navigateToClientProfile(enrollmentData.clientId);
            fetchDashboardData();
        } else {
            console.error('Failed to enroll client:', data.message);
            showAlert(`Failed to enroll client: ${data.message}`);
        }
    } catch (error) {
        console.error('Error enrolling client:', error);
        showAlert('Failed to connect to server');
    }
}

// Rendering Functions

// Render clients table
function renderClientsTable(clientsList) {
    clientsTable.innerHTML = '';
    
    if (clientsList.length === 0) {
        clientsTable.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-4 text-center text-gray-400">No clients found</td>
            </tr>
        `;
        return;
    }
    
    clientsList.forEach(client => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-dark-100';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${client.id}</td>
            <td class="px-6 py-4 whitespace-nowrap font-medium text-white">${client.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">${client.gender}</td>
            <td class="px-6 py-4 whitespace-nowrap">${client.contactNumber || '-'}</td>
            <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <button class="view-client bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 px-3 py-1.5 rounded text-sm" data-id="${client.id}">
                    View Profile
                </button>
                <button class="edit-client bg-dark-100 hover:bg-dark-400 px-3 py-1.5 rounded text-sm" data-id="${client.id}">
                    Edit
                </button>
                <button class="delete-client bg-red-600/20 text-red-400 hover:bg-red-600/30 px-3 py-1.5 rounded text-sm" data-id="${client.id}">
                    Delete
                </button>
            </td>
        `;
        
        clientsTable.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-client').forEach(button => {
        button.addEventListener('click', () => navigateToClientProfile(button.dataset.id));
    });
    
    document.querySelectorAll('.edit-client').forEach(button => {
        button.addEventListener('click', () => editClient(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-client').forEach(button => {
        button.addEventListener('click', () => deleteClient(button.dataset.id));
    });
}

// Render programs grid
function renderProgramsGrid(programsList) {
    programsGrid.innerHTML = '';
    
    if (programsList.length === 0) {
        programsGrid.innerHTML = `
            <div class="col-span-full text-center text-gray-400 py-8">
                No programs found
            </div>
        `;
        return;
    }
    
    programsList.forEach(program => {
        const card = document.createElement('div');
        card.className = 'bg-dark-200 rounded-xl shadow-lg overflow-hidden border border-dark-400 hover:-translate-y-1 transition-all duration-300';
        
        // Format dates
        const startDate = new Date(program.startDate).toLocaleDateString();
        const endDate = program.endDate ? new Date(program.endDate).toLocaleDateString() : 'Ongoing';
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-start">
                    <h3 class="text-xl font-semibold mb-2 text-white">${program.name}</h3>
                    <span class="px-2 py-1 text-xs rounded ${program.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}">
                        ${program.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <p class="text-gray-400 mb-4">${program.description}</p>
                <div class="text-sm text-gray-500">
                    <p>Start: ${startDate}</p>
                    <p>End: ${endDate}</p>
                </div>
            </div>
            <div class="border-t border-dark-400 px-6 py-3 bg-dark-300 flex justify-end space-x-2">
                <button class="edit-program text-blue-400 hover:underline" data-id="${program.id}">Edit</button>
                <button class="delete-program text-red-400 hover:underline" data-id="${program.id}">Delete</button>
            </div>
        `;
        
        programsGrid.appendChild(card);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-program').forEach(button => {
        button.addEventListener('click', () => editProgram(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-program').forEach(button => {
        button.addEventListener('click', () => deleteProgram(button.dataset.id));
    });
}

// Update the program dropdown in enrollment modal
function updateEnrollmentProgramDropdown() {
    const programDropdown = document.getElementById('enrollment-program');
    if (!programDropdown) return;
    
    programDropdown.innerHTML = '<option value="">Select a program</option>';
    
    programs.forEach(program => {
        if (program.isActive) {
            const option = document.createElement('option');
            option.value = program.id;
            option.textContent = program.name;
            programDropdown.appendChild(option);
        }
    });
}

// Edit client
async function editClient(clientId) {
    try {
        const response = await fetchWithAuth(`${API_URL}/clients/${clientId}`);
        const data = await response.json();
        
        if (data.success) {
            const client = data.data;
            
            // Populate form
            document.getElementById('client-id').value = client.id;
            document.getElementById('client-name').value = client.name;
            document.getElementById('client-dob').value = formatDateForInput(client.dateOfBirth);
            document.getElementById('client-gender').value = client.gender;
            document.getElementById('client-contact').value = client.contactNumber || '';
            document.getElementById('client-email').value = client.email || '';
            document.getElementById('client-address').value = client.address ? client.address.value || '' : '';
            
            // Show modal
            document.getElementById('add-client-modal-title').textContent = 'Edit Client';
            addClientModal.classList.remove('hidden');
        } else {
            console.error('Failed to fetch client:', data.message);
            showAlert('Failed to load client details');
        }
    } catch (error) {
        console.error('Error fetching client:', error);
        showAlert('Failed to connect to server');
    }
}

// Edit program
async function editProgram(programId) {
    try {
        const response = await fetchWithAuth(`${API_URL}/programs/${programId}`);
        const data = await response.json();
        
        if (data.success) {
            const program = data.data;
            
            // Populate form
            document.getElementById('program-id').value = program.id;
            document.getElementById('program-name').value = program.name;
            document.getElementById('program-description').value = program.description;
            document.getElementById('program-start-date').value = formatDateForInput(program.startDate);
            document.getElementById('program-end-date').value = program.endDate ? formatDateForInput(program.endDate) : '';
            document.getElementById('program-active').checked = program.isActive;
            
            // Show modal
            document.getElementById('add-program-modal-title').textContent = 'Edit Program';
            addProgramModal.classList.remove('hidden');
        } else {
            console.error('Failed to fetch program:', data.message);
            showAlert('Failed to load program details');
        }
    } catch (error) {
        console.error('Error fetching program:', error);
        showAlert('Failed to connect to server');
    }
}

// Delete client
async function deleteClient(clientId) {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_URL}/clients/${clientId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            fetchClients();
            fetchDashboardData();
            showAlert('Client deleted successfully', 'success');
        } else {
            console.error('Failed to delete client:', data.message);
            showAlert(`Failed to delete client: ${data.message}`);
        }
    } catch (error) {
        console.error('Error deleting client:', error);
        showAlert('Failed to connect to server');
    }
}

// Delete program
async function deleteProgram(programId) {
    if (!confirm('Are you sure you want to delete this program? This will also remove all client enrollments in this program.')) {
        return;
    }
    
    try {
        const response = await fetchWithAuth(`${API_URL}/programs/${programId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            fetchPrograms();
            fetchDashboardData();
            showAlert('Program deleted successfully', 'success');
        } else {
            console.error('Failed to delete program:', data.message);
            showAlert(`Failed to delete program: ${data.message}`);
        }
    } catch (error) {
        console.error('Error deleting program:', error);
        showAlert('Failed to connect to server');
    }
}

// Utility Functions

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Show alert message
function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alertDiv.classList.add('opacity-0', 'transition-opacity', 'duration-500');
        setTimeout(() => {
            alertDiv.remove();
        }, 500);
    }, 3000);
}

// Initialize application
function init() {
    // Load dashboard data by default
    fetchDashboardData();
    
    // Load programs data (needed for enrollment dropdown)
    fetchPrograms();
    
    // Initialize welcome button action
    const newClientBtn = document.querySelector('#dashboard-content .bg-blue-600');
    if (newClientBtn) {
        newClientBtn.addEventListener('click', () => {
            document.getElementById('add-client-btn').click();
        });
    }
}

// Start the application
init();