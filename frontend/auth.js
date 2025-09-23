// document.addEventListener('DOMContentLoaded', () => {
//     const registerForm = document.getElementById('registerForm');
//     const loginForm = document.getElementById('loginForm');

//     // Utility function to show messages to the user
//     function showMessage(message, isSuccess = true) {
//         const msgElement = document.getElementById('auth-message') || document.createElement('div');
//         msgElement.id = 'auth-message';
//         msgElement.style.color = isSuccess ? 'green' : 'red';
//         msgElement.textContent = message;
        
//         const parentForm = registerForm || loginForm;
//         if (parentForm && !document.getElementById('auth-message')) {
//             parentForm.prepend(msgElement);
//         }
//     }

//     if (registerForm) {
//         console.log('Register form found. Attaching event listener.');
//         registerForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             console.log('Register form submitted.');
//             const username = document.getElementById('reg-username').value;
//             const password = document.getElementById('reg-password').value;
//             await authenticate('/api/auth/register', username, password);
//         });
//     }

//     if (loginForm) {
//         console.log('Login form found. Attaching event listener.');
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             console.log('Login form submitted.');
//             const username = document.getElementById('log-username').value;
//             const password = document.getElementById('log-password').value;
//             await authenticate('/api/auth/login', username, password);
//         });
//     }
    
//     // Auth function
//     async function authenticate(endpoint, username, password) {
//         try {
//             console.log(`Sending request to: http://localhost:3000${endpoint}`);
//             const res = await fetch(`http://localhost:3000${endpoint}`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password })
//             });

//             const data = await res.json();
//             if (res.ok) {
//                 console.log('Authentication successful. Received data:', data);
//                 localStorage.setItem('token', data.token);
//                 localStorage.setItem('userId', data.userId);
//                 localStorage.setItem('isAdmin', data.isAdmin);
//                 showMessage('Authentication successful!', true);
//                 window.location.href = 'dashboard.html';
//             } else {
//                 console.error('Authentication failed. Server response:', data);
//                 showMessage(data.msg, false);
//             }
//         } catch (err) {
//             console.error('An error occurred during fetch:', err);
//             showMessage('An error occurred. Check the console.', false);
//         }
//     }
// });
// document.addEventListener('DOMContentLoaded', function() {
//     const registerForm = document.getElementById('registerForm');
//     const loginForm = document.getElementById('loginForm');
//     const adminRegisterForm = document.getElementById('adminRegisterForm');

//     // Check if already logged in
//     const token = localStorage.getItem('token');
//     if (token) {
//         const isAdmin = localStorage.getItem('isAdmin') === 'true';
//         window.location.href = isAdmin ? 'admin-panel.html' : 'dashboard.html';
//         return;
//     }

//     // Regular registration
//     registerForm.addEventListener('submit', handleRegister);
//     loginForm.addEventListener('submit', handleLogin);
//     adminRegisterForm.addEventListener('submit', handleAdminRegister);

//     // async function handleRegister(e) {
//     //     e.preventDefault();
//     //     const username = document.getElementById('reg-username').value;
//     //     const password = document.getElementById('reg-password').value;

//     //     try {
//     //         const response = await fetch('http://localhost:3000/api/auth/register', {
//     //             method: 'POST',
//     //             headers: { 'Content-Type': 'application/json' },
//     //             body: JSON.stringify({ username, password })
//     //         });

//     //         const data = await response.json();
            
//     //         if (response.ok) {
//     //             localStorage.setItem('token', data.token);
//     //             localStorage.setItem('userId', data.userId);
//     //             localStorage.setItem('isAdmin', data.isAdmin);
//     //             showAlert('Registration successful!', 'success');
//     //             setTimeout(() => window.location.href = 'dashboard.html', 1000);
//     //         } else {
//     //             showAlert(data.msg || 'Registration failed', 'error');
//     //         }
//     //     } catch (error) {
//     //         showAlert('Network error. Please try again.', 'error');
//     //     }
//     // }

//     async function handleRegister(e) {
//     e.preventDefault();
//     const firstName = document.getElementById('reg-firstname').value.trim();
//     const lastName = document.getElementById('reg-lastname').value.trim();
//     const email = document.getElementById('reg-email').value.trim();
//     const username = document.getElementById('reg-username').value.trim();
//     const password = document.getElementById('reg-password').value;

//     if (!firstName || !lastName) {
//         showAlert('First name and last name are required', 'error');
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:3000/api/auth/register', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password, firstName, lastName, email })
//         });

//         const data = await response.json();
        
//         if (response.ok) {
//             localStorage.setItem('token', data.token);
//             localStorage.setItem('userId', data.userId);
//             localStorage.setItem('isAdmin', data.isAdmin);
//             localStorage.setItem('firstName', data.firstName);
//             localStorage.setItem('lastName', data.lastName);
//             localStorage.setItem('fullName', data.fullName);
//             if (data.email) localStorage.setItem('email', data.email);
            
//             showAlert('Registration successful!', 'success');
//             setTimeout(() => window.location.href = 'dashboard.html', 1000);
//         } else {
//             showAlert(data.msg || 'Registration failed', 'error');
//         }
//     } catch (error) {
//         showAlert('Network error. Please try again.', 'error');
//     }
// }

//     async function handleLogin(e) {
//         e.preventDefault();
//         const username = document.getElementById('log-username').value;
//         const password = document.getElementById('log-password').value;

//         try {
//             const response = await fetch('http://localhost:3000/api/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password })
//             });

//             const data = await response.json();
            
//             if (response.ok) {
//                 localStorage.setItem('token', data.token);
//                 localStorage.setItem('userId', data.userId);
//                 localStorage.setItem('isAdmin', data.isAdmin);
//                 localStorage.setItem('username', data.username);
                
//                 showAlert('Login successful!', 'success');
//                 setTimeout(() => {
//                     window.location.href = data.isAdmin ? 'admin-panel.html' : 'dashboard.html';
//                 }, 1000);
//             } else {
//                 showAlert(data.msg || 'Login failed', 'error');
//             }
//         } catch (error) {
//             showAlert('Network error. Please try again.', 'error');
//         }
//     }

//     async function handleAdminRegister(e) {
//         e.preventDefault();
//         const username = document.getElementById('admin-username').value;
//         const password = document.getElementById('admin-password').value;
//         const adminSecret = document.getElementById('admin-secret').value;

//         try {
//             const response = await fetch('http://localhost:3000/api/auth/register-admin', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password, adminSecret })
//             });

//             const data = await response.json();
            
//             if (response.ok) {
//                 localStorage.setItem('token', data.token);
//                 localStorage.setItem('userId', data.userId);
//                 localStorage.setItem('isAdmin', data.isAdmin);
//                 showAlert('Admin registration successful!', 'success');
//                 setTimeout(() => window.location.href = 'admin-panel.html', 1000);
//             } else {
//                 showAlert(data.msg || 'Admin registration failed', 'error');
//             }
//         } catch (error) {
//             showAlert('Network error. Please try again.', 'error');
//         }
//     }

//     function showAlert(message, type) {
//         const alertDiv = document.createElement('div');
//         alertDiv.className = `alert alert-${type}`;
//         alertDiv.innerHTML = `
//             <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
//             <span>${message}</span>
//         `;
        
//         document.body.appendChild(alertDiv);
        
//         setTimeout(() => {
//             if (alertDiv.parentNode) {
//                 alertDiv.remove();
//             }
//         }, 3000);
//     }
// });

// auth.js - Fixed authentication system with better error handling

// Configuration with better error handling
// FIXED Configuration with better error handling
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'  // Added /api back - this was missing!
    : 'https://your-domain.com/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Current hostname:', window.location.hostname);

// Test server connection
async function testServerConnection() {
    try {
        console.log('Testing server connection...');
        const response = await fetch(`${API_BASE_URL}/debug/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            console.log('Server connection successful');
            const data = await response.json();
            console.log('Users found:', data.length);
        } else {
            console.warn('Server responded with:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Server connection test failed:', error);
        showAlert('Cannot connect to server. Please check if the server is running on port 3000.', 'error');
    }
}

console.log('API Base URL:', API_BASE_URL);

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const adminRegisterForm = document.getElementById('adminRegisterForm');

    console.log('Auth page loaded, forms found:', {
        registerForm: !!registerForm,
        loginForm: !!loginForm,
        adminRegisterForm: !!adminRegisterForm
    });

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('User already logged in, redirecting...');
        window.location.href = isAdmin ? 'admin-panel.html' : 'dashboard.html';
        return;
    }

    // Add event listeners
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log('Register form listener added');
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form listener added');
    }
    
    if (adminRegisterForm) {
        adminRegisterForm.addEventListener('submit', handleAdminRegister);
        console.log('Admin register form listener added');
    }

    // Add input validation
    setupInputValidation();

    // Test server connectivity
    testServerConnection();
});

// Test server connection
async function testServerConnection() {
    try {
        console.log('Testing server connection...');
        const response = await fetch(`${API_BASE_URL}/debug/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            console.log('Server connection successful');
        } else {
            console.warn('Server responded with:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Server connection test failed:', error);
        showAlert('Cannot connect to server. Please check if the server is running on port 3000.', 'error');
    }
}

// =========================
// ENHANCED FORM HANDLERS
// =========================

async function handleRegister(e) {
    e.preventDefault();
    console.log('Registration form submitted');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const firstName = document.getElementById('reg-firstname')?.value.trim();
    const lastName = document.getElementById('reg-lastname')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim();
    const username = document.getElementById('reg-username')?.value.trim();
    const password = document.getElementById('reg-password')?.value;

    console.log('Form data:', { firstName, lastName, email, username, passwordLength: password?.length });

    // Validate required fields
    if (!firstName || !lastName) {
        showAlert('First name and last name are required', 'error');
        return;
    }

    if (!username || username.length < 3) {
        showAlert('Username must be at least 3 characters long', 'error');
        return;
    }

    if (!password || password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';

    const payload = { 
        username, 
        password, 
        firstName, 
        lastName, 
        email: email || undefined 
    };

    console.log('Sending registration request:', { ...payload, password: '[HIDDEN]' });

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Registration response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration failed with response:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.msg || errorData.message || 'Registration failed');
            } catch (parseError) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Registration successful:', { ...data, token: '[HIDDEN]' });
        
        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        if (data.fullName) localStorage.setItem('fullName', data.fullName);
        if (data.email) localStorage.setItem('email', data.email);
        if (data.username) localStorage.setItem('username', data.username);
        
        showAlert('Registration successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        
    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showAlert('Cannot connect to server. Please check your internet connection and try again.', 'error');
        } else {
            showAlert(error.message || 'Registration failed. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const username = document.getElementById('log-username')?.value.trim();
    const password = document.getElementById('log-password')?.value;

    console.log('Login attempt for username:', username);

    // Validate required fields
    if (!username) {
        showAlert('Username is required', 'error');
        return;
    }

    if (!password) {
        showAlert('Password is required', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

    const payload = { username, password };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Login response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Login failed with response:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.msg || errorData.message || 'Login failed');
            } catch (parseError) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Login successful:', { ...data, token: '[HIDDEN]' });
        
        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        localStorage.setItem('username', data.username);
        
        // Store name data if available
        if (data.firstName) localStorage.setItem('firstName', data.firstName);
        if (data.lastName) localStorage.setItem('lastName', data.lastName);
        if (data.fullName) localStorage.setItem('fullName', data.fullName);
        if (data.email) localStorage.setItem('email', data.email);
        
        showAlert('Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = data.isAdmin ? 'admin-panel.html' : 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        console.error('Login error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showAlert('Cannot connect to server. Please check your internet connection and try again.', 'error');
        } else {
            showAlert(error.message || 'Login failed. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function handleAdminRegister(e) {
    e.preventDefault();
    console.log('Admin registration form submitted');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Get form data
    const firstName = document.getElementById('admin-firstname')?.value.trim();
    const lastName = document.getElementById('admin-lastname')?.value.trim();
    const username = document.getElementById('admin-username')?.value.trim();
    const password = document.getElementById('admin-password')?.value;
    const adminSecret = document.getElementById('admin-secret')?.value;

    console.log('Admin form data:', { firstName, lastName, username, passwordLength: password?.length, hasSecret: !!adminSecret });

    // Validate required fields
    if (!firstName || !lastName) {
        showAlert('First name and last name are required', 'error');
        return;
    }

    if (!username || username.length < 3) {
        showAlert('Username must be at least 3 characters long', 'error');
        return;
    }

    if (!password || password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }

    if (!adminSecret) {
        showAlert('Admin secret key is required', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating admin account...';

    const payload = { 
        username, 
        password, 
        firstName, 
        lastName, 
        adminSecret 
    };

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register-admin`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Admin registration response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Admin registration failed with response:', errorText);
            
            try {
                const errorData = JSON.parse(errorText);
                throw new Error(errorData.msg || errorData.message || 'Admin registration failed');
            } catch (parseError) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('Admin registration successful:', { ...data, token: '[HIDDEN]' });
        
        // Store user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('isAdmin', data.isAdmin);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        if (data.fullName) localStorage.setItem('fullName', data.fullName);
        if (data.username) localStorage.setItem('username', data.username);
        
        showAlert('Admin registration successful! Redirecting...', 'success');
        setTimeout(() => window.location.href = 'admin-panel.html', 1500);
        
    } catch (error) {
        console.error('Admin registration error:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showAlert('Cannot connect to server. Please check your internet connection and try again.', 'error');
        } else {
            showAlert(error.message || 'Admin registration failed. Please try again.', 'error');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// =========================
// INPUT VALIDATION (same as before)
// =========================

function setupInputValidation() {
    // Username validation
    const usernameInputs = document.querySelectorAll('#reg-username, #log-username, #admin-username');
    usernameInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.trim();
            if (value.length > 0 && value.length < 3) {
                this.setCustomValidity('Username must be at least 3 characters long');
            } else if (value.includes(' ')) {
                this.setCustomValidity('Username cannot contain spaces');
            } else {
                this.setCustomValidity('');
            }
        });
    });

    // Password validation
    const passwordInputs = document.querySelectorAll('#reg-password, #admin-password');
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value;
            if (value.length > 0 && value.length < 6) {
                this.setCustomValidity('Password must be at least 6 characters long');
            } else {
                this.setCustomValidity('');
            }
        });
    });

    // Email validation
    const emailInput = document.getElementById('reg-email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const value = this.value.trim();
            if (value && !isValidEmail(value)) {
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Name validation
    const nameInputs = document.querySelectorAll('#reg-firstname, #reg-lastname, #admin-firstname, #admin-lastname');
    nameInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.trim();
            if (value && !/^[a-zA-Z\s'-]+$/.test(value)) {
                this.setCustomValidity('Name can only contain letters, spaces, hyphens, and apostrophes');
            } else {
                this.setCustomValidity('');
            }
        });
    });
}

// =========================
// UTILITY FUNCTIONS
// =========================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 1rem;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 400px;
        ${type === 'success' ? 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 'background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'}
    `;
    
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: auto; color: inherit;">×</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Handle connection errors
window.addEventListener('online', function() {
    showAlert('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showAlert('Connection lost. Please check your internet connection.', 'error');
});