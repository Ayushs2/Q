// create-mcq.js - JavaScript for the Create MCQ page

let uploadedImages = {};
const token = localStorage.getItem('token');

// Check authentication on page load
if (!token) {
    alert('Please login as admin to create MCQs');
    window.location.href = 'auth.html';
}

// Trigger file input
function triggerFileInput(field) {
    const input = document.querySelector(`[data-field="${field}"] .image-upload-input`);
    input.click();
}

// Handle file selection
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('image-upload-input')) {
        const field = e.target.dataset.field;
        const file = e.target.files[0];
        
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            uploadImage(file, field);
        }
    }
});

// Upload image to Cloudinary
async function uploadImage(file, field) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', 'mcq-images');
    formData.append('description', `Image for ${field}`);

    const uploadSection = document.querySelector(`[data-field="${field}"]`);
    const uploadButton = uploadSection.querySelector('.upload-button');
    const originalText = uploadButton.innerHTML;
    
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    uploadButton.disabled = true;

    try {
        const response = await fetch('http://localhost:3000/api/upload-image', {
            method: 'POST',
            headers: {
                'x-auth-token': token
            },
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            uploadedImages[field] = result.data;
            showImagePreview(field, result.data.url);
            uploadButton.innerHTML = '<i class="fas fa-check"></i> Uploaded';
            uploadButton.style.background = '#28a745';
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert(`Failed to upload image: ${error.message}`);
        uploadButton.innerHTML = originalText;
        uploadButton.disabled = false;
    }
}

// Show image preview
function showImagePreview(field, imageUrl) {
    const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
    const img = preview.querySelector('.preview-image');
    
    img.src = imageUrl;
    preview.style.display = 'block';
}

// Remove image
async function removeImage(field) {
    if (!uploadedImages[field]) return;

    const publicId = encodeURIComponent(uploadedImages[field].publicId);
    
    try {
        const response = await fetch(`http://localhost:3000/api/delete-image/${publicId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        });

        if (response.ok) {
            delete uploadedImages[field];
            
            const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
            preview.style.display = 'none';
            
            const uploadButton = document.querySelector(`[data-field="${field}"] .upload-button`);
            uploadButton.innerHTML = '<i class="fas fa-upload"></i> Choose Image';
            uploadButton.style.background = '#007bff';
            uploadButton.disabled = false;
            
            const input = document.querySelector(`[data-field="${field}"] .image-upload-input`);
            input.value = '';
        } else {
            throw new Error('Failed to delete image');
        }
    } catch (error) {
        console.error('Delete error:', error);
        alert(`Failed to remove image: ${error.message}`);
    }
}

// Handle form submission
document.getElementById('mcq-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');
    const form = this;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    loading.style.display = 'block';

    // Remove any existing alerts
    document.querySelectorAll('.alert').forEach(alert => alert.remove());

    try {
        const formData = new FormData(form);
        
        // Build MCQ data
        const mcqData = {
            question: formData.get('question'),
            options: {
                A: formData.get('optionA'),
                B: formData.get('optionB'),
                C: formData.get('optionC'),
                D: formData.get('optionD')
            },
            correctAnswer: formData.get('correctAnswer'),
            explanation: formData.get('explanation') || '',
            subject: formData.get('subject') || '',
            topic: formData.get('topic') || '',
            exam: formData.get('exam') || '',
            year: formData.get('year') ? parseInt(formData.get('year')) : null
        };

        // Add image data
        if (uploadedImages.question) {
            mcqData.questionImage = uploadedImages.question;
        }

        if (uploadedImages.explanation) {
            mcqData.explanationImage = uploadedImages.explanation;
        }

        // Add option images
        const optionImages = {};
        ['optionA', 'optionB', 'optionC', 'optionD'].forEach((field, index) => {
            if (uploadedImages[field]) {
                const option = ['A', 'B', 'C', 'D'][index];
                optionImages[option] = uploadedImages[field];
            }
        });

        if (Object.keys(optionImages).length > 0) {
            mcqData.optionImages = optionImages;
        }

        // Submit to backend
        const response = await fetch('http://localhost:3000/api/create-mcq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(mcqData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('MCQ created successfully!', 'success');
            resetForm();
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Creation error:', error);
        showAlert(`Failed to create MCQ: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Create MCQ';
        loading.style.display = 'none';
    }
});

// Show alert message
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${message}
    `;
    
    const form = document.getElementById('mcq-form');
    form.parentNode.insertBefore(alert, form);
    
    setTimeout(() => alert.remove(), 5000);
}

// Reset form
async function resetForm() {
    // Delete all uploaded images
    for (const field in uploadedImages) {
        await removeImage(field);
    }
    
    document.getElementById('mcq-form').reset();
    uploadedImages = {};
    
    // Hide all image previews
    document.querySelectorAll('.image-preview').forEach(preview => {
        preview.style.display = 'none';
    });
    
    // Reset upload buttons
    document.querySelectorAll('.upload-button').forEach(button => {
        button.innerHTML = button.innerHTML.includes('Choose Image') ? 
            button.innerHTML.replace(/.*/, '<i class="fas fa-upload"></i> Choose Image') :
            '<i class="fas fa-upload"></i> Choose Image';
        button.style.background = '#007bff';
        button.disabled = false;
    });
}

// Drag and drop support
document.querySelectorAll('.image-upload-section').forEach(section => {
    section.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    section.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
    });
    
    section.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const field = this.dataset.field;
        const files = e.dataTransfer.files;
        
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                uploadImage(file, field);
            } else {
                alert('Please drop only image files');
            }
        }
    });
});