// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('uploadForm');
//     const fileInput = document.getElementById('mcqFile');
//     const submitBtn = document.getElementById('submit-button');
//     const token = localStorage.getItem('token');

//     // Utility function to show messages
//     function showMessage(message, isSuccess = true) {
//         alert(message); // You can replace this with a more sophisticated UI
//     }

//     if (!form || !token) {
//         return;
//     }

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const file = fileInput.files[0];
//         if (!file) {
//             showMessage('Please choose a file', false);
//             return;
//         }

//         const formData = new FormData();
//         formData.append('mcqFile', file);

//         try {
//             const res = await fetch('http://localhost:3000/api/upload-mcqs', {
//                 method: 'POST',
//                 headers: {
//                     'x-auth-token': token
//                 },
//                 body: formData
//             });
            
//             const data = await res.json();
            
//             if (!res.ok) {
//                 throw new Error(data.message || 'Upload failed');
//             }

//             showMessage(data.message, true);
//             form.reset();
//         } catch (err) {
//             console.error(err);
//             showMessage(err.message || 'File upload failed.', false);
//         }
//     });
// });


// document.addEventListener('DOMContentLoaded', () => {
//     const form = document.getElementById('uploadForm');
//     const fileInput = document.getElementById('mcqFile');
//     const token = localStorage.getItem('token');

//     if (!token) {
//         alert('Please login as admin to upload MCQs');
//         window.location.href = 'auth.html';
//         return;
//     }

//     function showMessage(message, isSuccess = true) {
//         alert(message);
//     }

//     if (!form) return;

//     form.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const file = fileInput?.files?.[0];
//         if (!file) {
//             showMessage('Please choose a file', false);
//             return;
//         }

//         const formData = new FormData();
//         formData.append('mcqFile', file);

//         try {
//             const response = await fetch('http://localhost:3000/api/upload-mcqs', {
//                 method: 'POST',
//                 headers: {
//                     'x-auth-token': token
//                 },
//                 body: formData
//             });
            
//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.message || 'Upload failed');
//             }

//             showMessage(data.message, true);
//             form.reset();
//         } catch (err) {
//             console.error(err);
//             showMessage(err.message || 'File upload failed.', false);
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('mcqFile');
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    console.log('Admin panel loaded. Token exists:', !!token, 'Is Admin:', isAdmin);

    if (!token || !isAdmin) {
        alert('Please login as admin to access this page');
        window.location.href = 'auth.html';
        return;
    }

    // Fixed API URL (same logic as auth.js)
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://your-domain.com/api';

    console.log('Admin API Base URL:', API_BASE_URL);

    function showMessage(message, isSuccess = true) {
        // Create a better alert system
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${isSuccess ? 'success' : 'danger'}`;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 1rem;
            border-radius: 6px;
            max-width: 400px;
            ${isSuccess ? 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724;' : 'background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;'}
        `;
        alertDiv.innerHTML = `
            <div>${message}</div>
            <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; font-size: 1.2rem; cursor: pointer;">×</button>
        `;
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            if (alertDiv.parentNode) alertDiv.remove();
        }, 5000);
    }

    if (!form) {
        console.error('Upload form not found');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = fileInput?.files?.[0];
        if (!file) {
            showMessage('Please choose a file', false);
            return;
        }

        console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

        const formData = new FormData();
        formData.append('mcqFile', file);

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Uploading...';

        try {
            console.log('Making request to:', `${API_BASE_URL}/upload-mcqs`);
            
            const response = await fetch(`${API_BASE_URL}/upload-mcqs`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                    // Don't set Content-Type for FormData - browser sets it automatically
                },
                body: formData
            });

            console.log('Upload response status:', response.status);
            
            const data = await response.json();
            console.log('Upload response data:', data);
            
            if (!response.ok) {
                throw new Error(data.message || `Upload failed with status ${response.status}`);
            }

            showMessage(data.message || 'MCQs uploaded successfully!', true);
            form.reset();
            
            // Show detailed results if available
            if (data.details) {
                console.log('Upload details:', data.details);
                setTimeout(() => {
                    showMessage(`Processed: ${data.details.processed}, Uploaded: ${data.details.uploaded}`, true);
                }, 2000);
            }
            
        } catch (err) {
            console.error('Upload error:', err);
            
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                showMessage('Cannot connect to server. Please check your internet connection.', false);
            } else {
                showMessage(err.message || 'File upload failed.', false);
            }
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });

    // Test server connection on load
    async function testConnection() {
        try {
            const response = await fetch(`${API_BASE_URL}/debug/users`, {
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                console.log('Admin server connection successful');
            } else {
                console.warn('Admin server connection issue:', response.status);
            }
        } catch (error) {
            console.error('Admin server connection failed:', error);
        }
    }

    testConnection();
});