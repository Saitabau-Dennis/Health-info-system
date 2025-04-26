// API base URL
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

// Get client ID from URL parameters
function getClientIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load client data
async function loadClientData() {
    const clientId = getClientIdFromUrl();
    if (!clientId) {
        showAlert('Client ID is missing');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }

    try {
        // Fetch client details
        const response = await fetchWithAuth(`${API_URL}/clients/${clientId}`);
        const data = await response.json();

        if (!data.success) {
            showAlert('Failed to load client data');
            return;
        }

        const client = data.data;
        displayClientInfo(client);
        
        // Fetch client programs
        loadClientPrograms(clientId);
    } catch (error) {
        console.error('Error loading client data:', error);
        showAlert('Error loading client data');
    }
}

// Display client information
function displayClientInfo(client) {
    // Update page title and client name
    document.title = `${client.name} - Client Profile`;
    document.getElementById('client-name').textContent = client.name;
    document.getElementById('client-full-name').textContent = client.name;
    document.getElementById('client-id-display').textContent = `Client #${client.id}`;
    
    // Update client details
    document.getElementById('client-dob').textContent = formatDate(client.dateOfBirth);
    document.getElementById('client-gender').textContent = client.gender;
    document.getElementById('client-registration').textContent = formatDate(client.registrationDate);
    document.getElementById('client-contact').textContent = client.contactNumber || '-';
    document.getElementById('client-email').textContent = client.email || '-';
    document.getElementById('client-address').textContent = client.address ? client.address.value || '-' : '-';
    
    // Store client ID for enrollment and editing
    document.getElementById('enrollment-client-id').value = client.id;
    document.getElementById('client-id').value = client.id;
    
    // Populate edit form
    document.getElementById('edit-client-name').value = client.name;
    document.getElementById('edit-client-dob').value = formatDateForInput(client.dateOfBirth);
    document.getElementById('edit-client-gender').value = client.gender;
    document.getElementById('edit-client-contact').value = client.contactNumber || '';
    document.getElementById('edit-client-email').value = client.email || '';
    document.getElementById('edit-client-address').value = client.address ? client.address.value || '' : '';
}

// Load client programs
async function loadClientPrograms(clientId) {
    try {
        const response = await fetchWithAuth(`${API_URL}/clients/${clientId}/programs`);
        const data = await response.json();

        if (!data.success) {
            showAlert('Failed to load client programs');
            return;
        }

        displayClientPrograms(data.data);
        
        // Also load available programs for enrollment
        loadAvailablePrograms();
    } catch (error) {
        console.error('Error loading client programs:', error);
        showAlert('Error loading client programs');
    }
}

// Display client programs
function displayClientPrograms(programs) {
    const tableBody = document.getElementById('client-programs');
    
    if (programs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-3 text-center text-gray-500">Not enrolled in any programs</td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    programs.forEach(program => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td class="px-4 py-3 text-gray-300">${program.name}</td>
            <td class="px-4 py-3 text-gray-300">${formatDate(program.Enrollment.enrollmentDate)}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs rounded ${
                    program.Enrollment.status === 'Active' ? 'bg-green-900 text-green-300' : 
                    program.Enrollment.status === 'Completed' ? 'bg-blue-900 text-blue-300' : 
                    'bg-red-900 text-red-300'
                }">
                    ${program.Enrollment.status}
                </span>
            </td>
            <td class="px-4 py-3 text-gray-300">${program.Enrollment.notes || '-'}</td>
            <td class="px-4 py-3 text-right">
                <button class="text-blue-400 hover:text-blue-600 mr-2" onclick="updateEnrollmentStatus(${program.Enrollment.id}, 'Completed')">
                    <span class="text-xs">Complete</span>
                </button>
                <button class="text-red-400 hover:text-red-600" onclick="updateEnrollmentStatus(${program.Enrollment.id}, 'Withdrawn')">
                    <span class="text-xs">Withdraw</span>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Load available programs for enrollment
async function loadAvailablePrograms() {
    try {
        const response = await fetchWithAuth(`${API_URL}/programs`);
        const data = await response.json();

        if (!data.success) {
            return;
        }

        const activePrograms = data.data.filter(program => program.isActive);
        
        const programSelect = document.getElementById('enrollment-program');
        programSelect.innerHTML = '<option value="">Select a program</option>';
        
        activePrograms.forEach(program => {
            const option = document.createElement('option');
            option.value = program.id;
            option.textContent = program.name;
            programSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading available programs:', error);
    }
}

// Update enrollment status
async function updateEnrollmentStatus(enrollmentId, status) {
    try {
        const response = await fetchWithAuth(`${API_URL}/enrollments/${enrollmentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();

        if (data.success) {
            showAlert(`Status updated to ${status}`, 'success');
            // Reload client programs
            loadClientPrograms(getClientIdFromUrl());
        } else {
            showAlert('Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        showAlert('Error updating status');
    }
}

// Save client edit
async function saveClientEdit(event) {
    event.preventDefault();
    
    const clientId = document.getElementById('client-id').value;
    const clientData = {
        name: document.getElementById('edit-client-name').value,
        dateOfBirth: document.getElementById('edit-client-dob').value,
        gender: document.getElementById('edit-client-gender').value,
        contactNumber: document.getElementById('edit-client-contact').value,
        email: document.getElementById('edit-client-email').value,
        address: {
            value: document.getElementById('edit-client-address').value
        }
    };
    
    try {
        const response = await fetchWithAuth(`${API_URL}/clients/${clientId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(clientData)
        });

        const data = await response.json();

        if (data.success) {
            document.getElementById('add-client-modal').classList.add('hidden');
            showAlert('Client updated successfully', 'success');
            loadClientData();
        } else {
            showAlert('Failed to update client');
        }
    } catch (error) {
        console.error('Error updating client:', error);
        showAlert('Error updating client');
    }
}

// Handle client enrollment
async function handleEnrollment(event) {
    event.preventDefault();
    
    const enrollmentData = {
        clientId: document.getElementById('enrollment-client-id').value,
        programId: document.getElementById('enrollment-program').value,
        notes: document.getElementById('enrollment-notes').value
    };
    
    if (!enrollmentData.programId) {
        showAlert('Please select a program');
        return;
    }
    
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
            document.getElementById('enroll-modal').classList.add('hidden');
            document.getElementById('enrollment-notes').value = '';
            showAlert('Client enrolled successfully', 'success');
            loadClientPrograms(enrollmentData.clientId);
        } else {
            showAlert(data.message || 'Failed to enroll client');
        }
    } catch (error) {
        console.error('Error enrolling client:', error);
        showAlert('Error enrolling client');
    }
}

// Format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Format date for input fields (YYYY-MM-DD)
function formatDateForInput(dateString) {
    if (!dateString) return '';
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!checkAuth()) return;
    
    // Display user info
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-name').textContent = user.fullName;
        document.getElementById('user-role').textContent = user.role;
        document.getElementById('user-avatar').textContent = user.fullName.charAt(0);
    }
    
    // Add logout event listener
    document.getElementById('logout-btn').addEventListener('click', logout);
    
    // Add form submission handlers
    document.getElementById('client-form').addEventListener('submit', saveClientEdit);
    document.getElementById('enrollment-form').addEventListener('submit', handleEnrollment);
    
    // Load client data
    loadClientData();
});