// // admin-crud.js - Complete CRUD operations for MCQ management

// let uploadedImages = {};
// let currentEditingId = null;
// let allMCQs = [];
// const token = localStorage.getItem('token');
// const isAdmin = localStorage.getItem('isAdmin') === 'true';

// // Check authentication on page load
// if (!token || !isAdmin) {
//     alert('Please login as admin to access this panel');
//     window.location.href = 'auth.html';
// }

// document.addEventListener('DOMContentLoaded', function() {
//     initializeAdminPanel();
// });

// function initializeAdminPanel() {
//     setupTabs();
//     setupEventListeners();
//     loadAllMCQs();
// }

// // =========================
// // TAB MANAGEMENT
// // =========================

// function setupTabs() {
//     const tabButtons = document.querySelectorAll('.tab-button');
//     const tabContents = document.querySelectorAll('.tab-content');

//     tabButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const tabName = this.dataset.tab;
//             showTab(tabName);
//         });
//     });

//     // Show first tab by default
//     showTab('create');
// }

// function showTab(tabName) {
//     // Hide all tab contents
//     document.querySelectorAll('.tab-content').forEach(content => {
//         content.classList.remove('active');
//     });
    
//     // Remove active class from all tab buttons
//     document.querySelectorAll('.tab-button').forEach(btn => {
//         btn.classList.remove('active');
//     });
    
//     // Show selected tab content
//     const selectedTab = document.getElementById(`${tabName}-tab`);
//     if (selectedTab) {
//         selectedTab.classList.add('active');
//     }
    
//     // Add active class to clicked tab button
//     const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
//     if (selectedButton) {
//         selectedButton.classList.add('active');
//     }

//     // Load data based on tab
//     if (tabName === 'manage') {
//         loadAllMCQs();
//     }
// }

// // =========================
// // EVENT LISTENERS
// // =========================

// function setupEventListeners() {
//     // Image upload handlers
//     document.addEventListener('change', handleFileSelection);
    
//     // Form submissions
//     const createForm = document.getElementById('create-mcq-form');
//     if (createForm) {
//         createForm.addEventListener('submit', handleCreateMCQ);
//     }

//     const editForm = document.getElementById('edit-mcq-form');
//     if (editForm) {
//         editForm.addEventListener('submit', handleUpdateMCQ);
//     }

//     const uploadForm = document.getElementById('excel-upload-form');
//     if (uploadForm) {
//         uploadForm.addEventListener('submit', handleExcelUpload);
//     }

//     // Search and filter handlers
//     const searchInput = document.getElementById('mcq-search');
//     if (searchInput) {
//         searchInput.addEventListener('input', debounce(filterMCQs, 300));
//     }

//     const filterInputs = document.querySelectorAll('.mcq-filter');
//     filterInputs.forEach(input => {
//         input.addEventListener('change', filterMCQs);
//     });
// }

// // =========================
// // CREATE MCQ FUNCTIONALITY
// // =========================

// function handleFileSelection(e) {
//     if (e.target.classList.contains('image-upload-input')) {
//         const field = e.target.dataset.field;
//         const file = e.target.files[0];
        
//         if (file) {
//             if (file.size > 10 * 1024 * 1024) { // 10MB limit
//                 alert('File size must be less than 10MB');
//                 return;
//             }
            
//             uploadImage(file, field);
//         }
//     }
// }

// async function uploadImage(file, field) {
//     const formData = new FormData();
//     formData.append('image', file);
//     formData.append('description', `Image for ${field}`);

//     const uploadSection = document.querySelector(`[data-field="${field}"]`);
//     const uploadButton = uploadSection?.querySelector('.upload-button');
//     if (!uploadButton) return;

//     const originalText = uploadButton.innerHTML;
    
//     uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
//     uploadButton.disabled = true;

//     try {
//         const response = await fetch('http://localhost:3000/api/upload-image', {
//             method: 'POST',
//             headers: {
//                 'x-auth-token': token
//             },
//             body: formData
//         });

//         const result = await response.json();

//         if (result.success) {
//             uploadedImages[field] = result.data;
//             showImagePreview(field, result.data.url);
//             uploadButton.innerHTML = '<i class="fas fa-check"></i> Uploaded';
//             uploadButton.style.background = '#28a745';
//         } else {
//             throw new Error(result.message);
//         }
//     } catch (error) {
//         console.error('Upload error:', error);
//         showAlert(`Failed to upload image: ${error.message}`, 'error');
//         uploadButton.innerHTML = originalText;
//         uploadButton.disabled = false;
//     }
// }

// function showImagePreview(field, imageUrl) {
//     const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
//     if (!preview) return;

//     const img = preview.querySelector('.preview-image');
//     if (img) {
//         img.src = imageUrl;
//         preview.style.display = 'block';
//     }
// }

// async function removeImage(field) {
//     if (!uploadedImages[field]) return;

//     const publicId = encodeURIComponent(uploadedImages[field].publicId);
    
//     try {
//         const response = await fetch(`http://localhost:3000/api/delete-image/${publicId}`, {
//             method: 'DELETE',
//             headers: {
//                 'x-auth-token': token
//             }
//         });

//         if (response.ok) {
//             delete uploadedImages[field];
            
//             const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
//             if (preview) preview.style.display = 'none';
            
//             const uploadButton = document.querySelector(`[data-field="${field}"] .upload-button`);
//             if (uploadButton) {
//                 uploadButton.innerHTML = '<i class="fas fa-upload"></i> Choose Image';
//                 uploadButton.style.background = '#007bff';
//                 uploadButton.disabled = false;
//             }
            
//             const input = document.querySelector(`[data-field="${field}"] .image-upload-input`);
//             if (input) input.value = '';
//         } else {
//             throw new Error('Failed to delete image');
//         }
//     } catch (error) {
//         console.error('Delete error:', error);
//         showAlert(`Failed to remove image: ${error.message}`, 'error');
//     }
// }

// async function handleCreateMCQ(e) {
//     e.preventDefault();
    
//     const submitBtn = e.target.querySelector('.submit-btn');
//     const originalText = submitBtn.innerHTML;
    
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

//     try {
//         const formData = new FormData(e.target);
        
//         const mcqData = {
//             question: formData.get('question'),
//             options: {
//                 A: formData.get('optionA'),
//                 B: formData.get('optionB'),
//                 C: formData.get('optionC'),
//                 D: formData.get('optionD')
//             },
//             correctAnswer: formData.get('correctAnswer'),
//             explanation: formData.get('explanation') || '',
//             subject: formData.get('subject') || '',
//             topic: formData.get('topic') || '',
//             exam: formData.get('exam') || '',
//             year: formData.get('year') ? parseInt(formData.get('year')) : null
//         };

//         // Add images
//         if (uploadedImages.question) {
//             mcqData.questionImage = uploadedImages.question;
//         }

//         if (uploadedImages.explanation) {
//             mcqData.explanationImage = uploadedImages.explanation;
//         }

//         const optionImages = {};
//         ['optionA', 'optionB', 'optionC', 'optionD'].forEach((field, index) => {
//             if (uploadedImages[field]) {
//                 const option = ['A', 'B', 'C', 'D'][index];
//                 optionImages[option] = uploadedImages[field];
//             }
//         });

//         if (Object.keys(optionImages).length > 0) {
//             mcqData.optionImages = optionImages;
//         }

//         const response = await fetch('http://localhost:3000/api/mcqs', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-auth-token': token
//             },
//             body: JSON.stringify(mcqData)
//         });

//         const result = await response.json();

//         if (result.success) {
//             showAlert('MCQ created successfully!', 'success');
//             resetCreateForm();
//             // Refresh the manage tab if it's active
//             if (document.querySelector('[data-tab="manage"]').classList.contains('active')) {
//                 loadAllMCQs();
//             }
//         } else {
//             throw new Error(result.message);
//         }

//     } catch (error) {
//         console.error('Creation error:', error);
//         showAlert(`Failed to create MCQ: ${error.message}`, 'error');
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.innerHTML = originalText;
//     }
// }

// // =========================
// // READ/MANAGE MCQ FUNCTIONALITY
// // =========================

// async function loadAllMCQs() {
//     const container = document.getElementById('mcqs-container');
//     if (!container) return;

//     try {
//         showLoadingState(container);

//         const response = await fetch('http://localhost:3000/api/mcqs', {
//             headers: {
//                 'x-auth-token': token
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//         }

//         allMCQs = await response.json();
//         displayMCQs(allMCQs);
        
//     } catch (error) {
//         console.error('Error loading MCQs:', error);
//         container.innerHTML = `
//             <div class="error-state">
//                 <i class="fas fa-exclamation-triangle"></i>
//                 <p>Failed to load MCQs: ${error.message}</p>
//                 <button onclick="loadAllMCQs()" class="btn btn-primary">
//                     <i class="fas fa-refresh"></i> Retry
//                 </button>
//             </div>
//         `;
//     }
// }

// function displayMCQs(mcqs) {
//     const container = document.getElementById('mcqs-container');
//     if (!container) return;

//     if (mcqs.length === 0) {
//         container.innerHTML = `
//             <div class="empty-state">
//                 <i class="fas fa-question-circle"></i>
//                 <p>No MCQs found. Create your first question!</p>
//             </div>
//         `;
//         return;
//     }

//     const mcqsHtml = mcqs.map(mcq => createMCQCard(mcq)).join('');
//     container.innerHTML = mcqsHtml;

//     // Setup action buttons
//     setupMCQActions();
// }

// function createMCQCard(mcq) {
//     const examYear = mcq.exam && mcq.year ? `${mcq.exam} ${mcq.year}` : (mcq.exam || '');
    
//     return `
//         <div class="mcq-card" data-mcq-id="${mcq._id}">
//             <div class="mcq-header">
//                 <div class="mcq-meta">
//                     <span class="subject-tag">${mcq.subject}</span>
//                     <span class="topic-tag">${mcq.topic}</span>
//                     ${examYear ? `<span class="exam-tag">${examYear}</span>` : ''}
//                 </div>
//                 <div class="mcq-actions">
//                     <button class="btn-icon edit-btn" onclick="editMCQ('${mcq._id}')" title="Edit">
//                         <i class="fas fa-edit"></i>
//                     </button>
//                     <button class="btn-icon delete-btn" onclick="deleteMCQ('${mcq._id}')" title="Delete">
//                         <i class="fas fa-trash"></i>
//                     </button>
//                 </div>
//             </div>
            
//             <div class="mcq-question">
//                 <strong>Q:</strong> ${mcq.question}
//                 ${mcq.questionImage?.url ? `<div class="question-image"><img src="${mcq.questionImage.url}" alt="Question image" class="preview-img"></div>` : ''}
//             </div>
            
//             <div class="mcq-options">
//                 ${Object.entries(mcq.options).map(([key, value]) => `
//                     <div class="option ${key === mcq.correctAnswer ? 'correct' : ''}">
//                         <span class="option-letter">${key}.</span>
//                         <span class="option-text">${value}</span>
//                         ${mcq.optionImages?.[key]?.url ? `<img src="${mcq.optionImages[key].url}" alt="Option ${key}" class="option-img">` : ''}
//                     </div>
//                 `).join('')}
//             </div>
            
//             ${mcq.explanation ? `
//                 <div class="mcq-explanation">
//                     <strong>Explanation:</strong> ${mcq.explanation}
//                     ${mcq.explanationImage?.url ? `<div class="explanation-image"><img src="${mcq.explanationImage.url}" alt="Explanation" class="preview-img"></div>` : ''}
//                 </div>
//             ` : ''}
            
//             <div class="mcq-footer">
//                 <small class="creation-date">Created: ${new Date(mcq.createdAt).toLocaleDateString()}</small>
//                 ${mcq.updatedAt !== mcq.createdAt ? `<small class="update-date">Updated: ${new Date(mcq.updatedAt).toLocaleDateString()}</small>` : ''}
//             </div>
//         </div>
//     `;
// }

// function setupMCQActions() {
//     // Image click handlers for preview
//     document.querySelectorAll('.preview-img, .option-img').forEach(img => {
//         img.addEventListener('click', function() {
//             openImageModal(this.src, this.alt);
//         });
//     });
// }

// function filterMCQs() {
//     const searchTerm = document.getElementById('mcq-search')?.value.toLowerCase() || '';
//     const subjectFilter = document.getElementById('subject-filter')?.value || '';
//     const examFilter = document.getElementById('exam-filter')?.value || '';

//     const filtered = allMCQs.filter(mcq => {
//         const matchesSearch = !searchTerm || 
//             mcq.question.toLowerCase().includes(searchTerm) ||
//             mcq.subject.toLowerCase().includes(searchTerm) ||
//             mcq.topic.toLowerCase().includes(searchTerm) ||
//             (mcq.exam && mcq.exam.toLowerCase().includes(searchTerm));

//         const matchesSubject = !subjectFilter || mcq.subject === subjectFilter;
//         const matchesExam = !examFilter || mcq.exam === examFilter;

//         return matchesSearch && matchesSubject && matchesExam;
//     });

//     displayMCQs(filtered);
    
//     const resultCount = document.getElementById('result-count');
//     if (resultCount) {
//         resultCount.textContent = `Showing ${filtered.length} of ${allMCQs.length} questions`;
//     }
// }

// // =========================
// // UPDATE MCQ FUNCTIONALITY
// // =========================

// async function editMCQ(mcqId) {
//     try {
//         const response = await fetch(`http://localhost:3000/api/mcqs/${mcqId}`, {
//             headers: {
//                 'x-auth-token': token
//             }
//         });

//         if (!response.ok) {
//             throw new Error('Failed to fetch MCQ details');
//         }

//         const mcq = await response.json();
//         currentEditingId = mcqId;
        
//         // Switch to edit tab and populate form
//         showTab('edit');
//         populateEditForm(mcq);
        
//     } catch (error) {
//         console.error('Error fetching MCQ:', error);
//         showAlert(`Failed to load MCQ: ${error.message}`, 'error');
//     }
// }

// function populateEditForm(mcq) {
//     const form = document.getElementById('edit-mcq-form');
//     if (!form) return;

//     // Show the edit form
//     form.style.display = 'block';

//     // Clear uploaded images
//     uploadedImages = {};

//     // Populate text fields safely with better selectors
//     const setFieldValue = (name, value) => {
//         const field = form.querySelector(`[name="${name}"]`);
//         if (field) {
//             field.value = value || '';
//         } else {
//             console.warn(`Field not found: ${name}`);
//         }
//     };

//     setFieldValue('question', mcq.question);
//     setFieldValue('optionA', mcq.options?.A);
//     setFieldValue('optionB', mcq.options?.B);
//     setFieldValue('optionC', mcq.options?.C);
//     setFieldValue('optionD', mcq.options?.D);
//     setFieldValue('correctAnswer', mcq.correctAnswer);
//     setFieldValue('explanation', mcq.explanation);
//     setFieldValue('subject', mcq.subject);
//     setFieldValue('topic', mcq.topic);
//     setFieldValue('exam', mcq.exam);
//     setFieldValue('year', mcq.year);

//     // Handle existing images (same as your current code)
//     if (mcq.questionImage?.url) {
//         uploadedImages.question = mcq.questionImage;
//         showImagePreview('question', mcq.questionImage.url);
//     }

//     if (mcq.explanationImage?.url) {
//         uploadedImages.explanation = mcq.explanationImage;
//         showImagePreview('explanation', mcq.explanationImage.url);
//     }

//     if (mcq.optionImages) {
//         ['A', 'B', 'C', 'D'].forEach((option, index) => {
//             if (mcq.optionImages[option]?.url) {
//                 const field = ['optionA', 'optionB', 'optionC', 'optionD'][index];
//                 uploadedImages[field] = mcq.optionImages[option];
//                 showImagePreview(field, mcq.optionImages[option].url);
//             }
//         });
//     }
// }

// async function handleUpdateMCQ(e) {
//     e.preventDefault();
    
//     if (!currentEditingId) {
//         showAlert('No MCQ selected for editing', 'error');
//         return;
//     }

//     const submitBtn = e.target.querySelector('.submit-btn');
//     const originalText = submitBtn.innerHTML;
    
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

//     try {
//         const formData = new FormData(e.target);
        
//         const mcqData = {
//             question: formData.get('question'),
//             options: {
//                 A: formData.get('optionA'),
//                 B: formData.get('optionB'),
//                 C: formData.get('optionC'),
//                 D: formData.get('optionD')
//             },
//             correctAnswer: formData.get('correctAnswer'),
//             explanation: formData.get('explanation') || '',
//             subject: formData.get('subject') || '',
//             topic: formData.get('topic') || '',
//             exam: formData.get('exam') || '',
//             year: formData.get('year') ? parseInt(formData.get('year')) : null
//         };

//         // Add images
//         if (uploadedImages.question) {
//             mcqData.questionImage = uploadedImages.question;
//         }

//         if (uploadedImages.explanation) {
//             mcqData.explanationImage = uploadedImages.explanation;
//         }

//         const optionImages = {};
//         ['optionA', 'optionB', 'optionC', 'optionD'].forEach((field, index) => {
//             if (uploadedImages[field]) {
//                 const option = ['A', 'B', 'C', 'D'][index];
//                 optionImages[option] = uploadedImages[field];
//             }
//         });

//         if (Object.keys(optionImages).length > 0) {
//             mcqData.optionImages = optionImages;
//         }

//         const response = await fetch(`http://localhost:3000/api/mcqs/${currentEditingId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-auth-token': token
//             },
//             body: JSON.stringify(mcqData)
//         });

//         const result = await response.json();

//         if (result.success) {
//             showAlert('MCQ updated successfully!', 'success');
//             currentEditingId = null;
//             resetEditForm();
//             showTab('manage');
//             loadAllMCQs();
//         } else {
//             throw new Error(result.message);
//         }

//     } catch (error) {
//         console.error('Update error:', error);
//         showAlert(`Failed to update MCQ: ${error.message}`, 'error');
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.innerHTML = originalText;
//     }
// }

// // =========================
// // DELETE MCQ FUNCTIONALITY
// // =========================

// async function deleteMCQ(mcqId) {
//     if (!confirm('Are you sure you want to delete this MCQ? This action cannot be undone.')) {
//         return;
//     }

//     try {
//         const response = await fetch(`http://localhost:3000/api/mcqs/${mcqId}`, {
//             method: 'DELETE',
//             headers: {
//                 'x-auth-token': token
//             }
//         });

//         const result = await response.json();

//         if (result.success) {
//             showAlert('MCQ deleted successfully!', 'success');
//             loadAllMCQs(); // Refresh the list
//         } else {
//             throw new Error(result.message);
//         }

//     } catch (error) {
//         console.error('Delete error:', error);
//         showAlert(`Failed to delete MCQ: ${error.message}`, 'error');
//     }
// }

// // =========================
// // EXCEL UPLOAD FUNCTIONALITY
// // =========================

// async function handleExcelUpload(e) {
//     e.preventDefault();
    
//     const fileInput = e.target.querySelector('input[type="file"]');
//     const file = fileInput.files[0];
    
//     if (!file) {
//         showAlert('Please select an Excel file to upload', 'error');
//         return;
//     }
    
//     const submitBtn = e.target.querySelector('.submit-btn');
//     const originalText = submitBtn.innerHTML;
    
//     submitBtn.disabled = true;
//     submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
//     const formData = new FormData();
//     formData.append('mcqFile', file);
    
//     try {
//         const response = await fetch('http://localhost:3000/api/upload-mcqs', {
//             method: 'POST',
//             headers: {
//                 'x-auth-token': token
//             },
//             body: formData
//         });
        
//         const result = await response.json();
        
//         if (result.success) {
//             showAlert(`Successfully uploaded ${result.uploadedQuestions} questions!`, 'success');
//             displayUploadResults(result);
//             loadAllMCQs(); // Refresh the manage tab
//         } else {
//             showAlert(`Upload failed: ${result.message}`, 'error');
//             displayUploadResults(result);
//         }
        
//     } catch (error) {
//         console.error('Upload error:', error);
//         showAlert(`Network error: ${error.message}`, 'error');
//     } finally {
//         submitBtn.disabled = false;
//         submitBtn.innerHTML = originalText;
//     }
// }

// function displayUploadResults(result) {
//     const resultsContainer = document.getElementById('upload-results');
//     if (!resultsContainer) return;

//     let html = `<div class="upload-results ${result.success ? 'success' : 'error'}">`;
    
//     if (result.details) {
//         html += `
//             <h4>Upload Summary:</h4>
//             <ul>
//                 <li>Total rows processed: ${result.details.processed || 0}</li>
//                 <li>Successfully uploaded: ${result.details.uploaded || result.uploadedQuestions || 0}</li>
//                 <li>Errors: ${result.details.errorCount || 0}</li>
//                 <li>Warnings: ${result.details.warningCount || 0}</li>
//             </ul>
//         `;
//     }

//     if (result.errors && result.errors.length > 0) {
//         html += `
//             <h4>Errors:</h4>
//             <ul class="error-list">
//                 ${result.errors.slice(0, 10).map(error => `<li>${error}</li>`).join('')}
//                 ${result.errors.length > 10 ? `<li><em>... and ${result.errors.length - 10} more errors</em></li>` : ''}
//             </ul>
//         `;
//     }

//     if (result.warnings && result.warnings.length > 0) {
//         html += `
//             <h4>Warnings:</h4>
//             <ul class="warning-list">
//                 ${result.warnings.slice(0, 5).map(warning => `<li>${warning}</li>`).join('')}
//                 ${result.warnings.length > 5 ? `<li><em>... and ${result.warnings.length - 5} more warnings</em></li>` : ''}
//             </ul>
//         `;
//     }

//     html += '</div>';
    
//     resultsContainer.innerHTML = html;
//     resultsContainer.style.display = 'block';
// }

// // =========================
// // UTILITY FUNCTIONS
// // =========================

// function resetCreateForm() {
//     const form = document.getElementById('create-mcq-form');
//     if (form) form.reset();
    
//     resetImageUploads();
// }

// function resetEditForm() {
//     const form = document.getElementById('edit-mcq-form');
//     if (form) form.reset();
    
//     resetImageUploads();
//     currentEditingId = null;
//     hideEditForm();
// }

// function resetImageUploads() {
//     uploadedImages = {};
    
//     document.querySelectorAll('.image-preview').forEach(preview => {
//         preview.style.display = 'none';
//     });
    
//     document.querySelectorAll('.upload-button').forEach(button => {
//         button.innerHTML = '<i class="fas fa-upload"></i> Choose Image';
//         button.style.background = '';
//         button.disabled = false;
//     });
// }

// function showAlert(message, type) {
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert alert-${type}`;
//     alertDiv.innerHTML = `
//         <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
//         <span>${message}</span>
//         <button class="alert-close" onclick="this.parentElement.remove()">×</button>
//     `;
    
//     document.body.prepend(alertDiv);
    
//     setTimeout(() => {
//         if (alertDiv.parentNode) {
//             alertDiv.remove();
//         }
//     }, 5000);
// }

// function showLoadingState(container) {
//     container.innerHTML = `
//         <div class="loading-state">
//             <i class="fas fa-spinner fa-spin"></i>
//             <p>Loading MCQs...</p>
//         </div>
//     `;
// }

// function debounce(func, wait) {
//     let timeout;
//     return function executedFunction(...args) {
//         const later = () => {
//             clearTimeout(timeout);
//             func(...args);
//         };
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//     };
// }

// function openImageModal(imageUrl, description) {
//     // This function should match the one in your mcq.js
//     let modal = document.getElementById('image-modal');
//     if (!modal) {
//         modal = document.createElement('div');
//         modal.id = 'image-modal';
//         modal.className = 'image-modal';
//         modal.innerHTML = `
//             <div class="image-modal-overlay" onclick="closeImageModal()">
//                 <div class="image-modal-content" onclick="event.stopPropagation()">
//                     <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
//                     <img class="image-modal-img" alt="">
//                     <div class="image-modal-description"></div>
//                 </div>
//             </div>
//         `;
//         document.body.appendChild(modal);
//     }
    
//     const img = modal.querySelector('.image-modal-img');
//     const desc = modal.querySelector('.image-modal-description');
    
//     img.src = imageUrl;
//     img.alt = description;
//     desc.textContent = description;
    
//     modal.style.display = 'flex';
//     document.body.style.overflow = 'hidden';
// }

// function closeImageModal() {
//     const modal = document.getElementById('image-modal');
//     if (modal) {
//         modal.style.display = 'none';
//         document.body.style.overflow = '';
//     }
// }

// // Global functions for HTML onclick handlers
// window.editMCQ = editMCQ;
// window.deleteMCQ = deleteMCQ;
// window.removeImage = removeImage;
// window.openImageModal = openImageModal;
// window.closeImageModal = closeImageModal;

// function showEditForm() {
//     const form = document.getElementById('edit-mcq-form');
//     const message = document.querySelector('#edit-tab p');
    
//     if (form) {
//         form.style.display = 'block';
//         form.classList.remove('edit-form-hidden');
//     }
    
//     if (message) {
//         message.style.display = 'none';
//     }
// }

// function hideEditForm() {
//     const form = document.getElementById('edit-mcq-form');
//     const message = document.querySelector('#edit-tab p');
    
//     if (form) {
//         form.style.display = 'none';
//         form.classList.add('edit-form-hidden');
//     }
    
//     if (message) {
//         message.style.display = 'block';
//     }
// }


// admin-crud.js - Complete CRUD operations for MCQ management with difficulty and marks

let uploadedImages = {};
let currentEditingId = null;
let allMCQs = [];
const token = localStorage.getItem('token');
const isAdmin = localStorage.getItem('isAdmin') === 'true';

// Fixed API URL configuration
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : 'https://your-domain.com/api';

// Check authentication on page load
if (!token || !isAdmin) {
    alert('Please login as admin to access this panel');
    window.location.href = 'auth.html';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    setupTabs();
    setupEventListeners();
    loadAllMCQs();
}

// =========================
// TAB MANAGEMENT
// =========================

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });

    // Show first tab by default
    showTab('create');
}

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked tab button
    const selectedButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedButton) {
        selectedButton.classList.add('active');
    }

    // Load data based on tab
    if (tabName === 'manage') {
        loadAllMCQs();
    }
}

// =========================
// EVENT LISTENERS
// =========================

function setupEventListeners() {
    // Image upload handlers
    document.addEventListener('change', handleFileSelection);
    
    // Form submissions
    const createForm = document.getElementById('create-mcq-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateMCQ);
    }

    const editForm = document.getElementById('edit-mcq-form');
    if (editForm) {
        editForm.addEventListener('submit', handleUpdateMCQ);
    }

    const uploadForm = document.getElementById('excel-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleExcelUpload);
    }

    // Search and filter handlers
    const searchInput = document.getElementById('mcq-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterMCQs, 300));
    }

    const filterInputs = document.querySelectorAll('.mcq-filter');
    filterInputs.forEach(input => {
        input.addEventListener('change', filterMCQs);
    });
}

// =========================
// IMAGE UPLOAD FUNCTIONALITY
// =========================

function handleFileSelection(e) {
    if (e.target.classList.contains('image-upload-input')) {
        const field = e.target.dataset.field;
        const file = e.target.files[0];
        
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert('File size must be less than 10MB');
                return;
            }
            
            uploadImage(file, field);
        }
    }
}

async function uploadImage(file, field) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('description', `Image for ${field}`);

    const uploadSection = document.querySelector(`[data-field="${field}"]`);
    const uploadButton = uploadSection?.querySelector('.upload-button');
    if (!uploadButton) return;

    const originalText = uploadButton.innerHTML;
    
    uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    uploadButton.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/upload-image`, {
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
        showAlert(`Failed to upload image: ${error.message}`, 'error');
        uploadButton.innerHTML = originalText;
        uploadButton.disabled = false;
    }
}

function showImagePreview(field, imageUrl) {
    const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
    if (!preview) return;

    const img = preview.querySelector('.preview-image');
    if (img) {
        img.src = imageUrl;
        preview.style.display = 'block';
    }
}

async function removeImage(field) {
    if (!uploadedImages[field]) return;

    const publicId = encodeURIComponent(uploadedImages[field].publicId);
    
    try {
        const response = await fetch(`${API_BASE_URL}/delete-image/${publicId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        });

        if (response.ok) {
            delete uploadedImages[field];
            
            const preview = document.querySelector(`[data-field="${field}"] .image-preview`);
            if (preview) preview.style.display = 'none';
            
            const uploadButton = document.querySelector(`[data-field="${field}"] .upload-button`);
            if (uploadButton) {
                uploadButton.innerHTML = '<i class="fas fa-upload"></i> Choose Image';
                uploadButton.style.background = '';
                uploadButton.disabled = false;
            }
            
            const input = document.querySelector(`[data-field="${field}"] .image-upload-input`);
            if (input) input.value = '';
        } else {
            throw new Error('Failed to delete image');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showAlert(`Failed to remove image: ${error.message}`, 'error');
    }
}

// =========================
// CREATE MCQ FUNCTIONALITY
// =========================

async function handleCreateMCQ(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';

    try {
        const formData = new FormData(e.target);
        
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
            year: formData.get('year') ? parseInt(formData.get('year')) : null,
            difficulty: formData.get('difficulty') || 'medium',
            marks: formData.get('marks') ? parseFloat(formData.get('marks')) : 1
        };

        // Validate marks
        const marks = parseFloat(formData.get('marks'));
        if (marks && (marks < 0.25 || marks > 10 || marks !== Math.round(marks * 4) / 4)) {
            throw new Error('Marks must be between 0.25 and 10, in increments of 0.25');
        }

        // Add images
        if (uploadedImages.question) {
            mcqData.questionImage = uploadedImages.question;
        }

        if (uploadedImages.explanation) {
            mcqData.explanationImage = uploadedImages.explanation;
        }

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

        const response = await fetch(`${API_BASE_URL}/mcqs`, {
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
            resetCreateForm();
            // Refresh the manage tab if it's active
            if (document.querySelector('[data-tab="manage"]').classList.contains('active')) {
                loadAllMCQs();
            }
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Creation error:', error);
        showAlert(`Failed to create MCQ: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// =========================
// READ/MANAGE MCQ FUNCTIONALITY
// =========================

async function loadAllMCQs() {
    const container = document.getElementById('mcqs-container');
    if (!container) return;

    try {
        showLoadingState(container);

        const response = await fetch(`${API_BASE_URL}/mcqs`, {
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        allMCQs = await response.json();
        displayMCQs(allMCQs);
        populateFilterDropdowns();
        
    } catch (error) {
        console.error('Error loading MCQs:', error);
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load MCQs: ${error.message}</p>
                <button onclick="loadAllMCQs()" class="btn btn-primary">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
    }
}

function populateFilterDropdowns() {
    if (!allMCQs || allMCQs.length === 0) return;

    // Extract unique values from loaded MCQs
    const subjects = [...new Set(allMCQs.map(mcq => mcq.subject).filter(Boolean))].sort();
    const exams = [...new Set(allMCQs.map(mcq => mcq.exam).filter(Boolean))].sort();
    const difficulties = [...new Set(allMCQs.map(mcq => mcq.difficulty).filter(Boolean))].sort();
    const markValues = [...new Set(allMCQs.map(mcq => mcq.marks).filter(Boolean))].sort((a, b) => a - b);

    // Populate subject filter
    const subjectFilter = document.getElementById('subject-filter');
    if (subjectFilter) {
        subjectFilter.innerHTML = '<option value="">All Subjects</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectFilter.appendChild(option);
        });
    }

    // Populate exam filter
    const examFilter = document.getElementById('exam-filter');
    if (examFilter) {
        examFilter.innerHTML = '<option value="">All Exams</option>';
        exams.forEach(exam => {
            const option = document.createElement('option');
            option.value = exam;
            option.textContent = exam;
            examFilter.appendChild(option);
        });
    }

    // Populate difficulty filter
    const difficultyFilter = document.getElementById('difficulty-filter');
    if (difficultyFilter) {
        difficultyFilter.innerHTML = '<option value="">All Difficulties</option>';
        difficulties.forEach(difficulty => {
            const option = document.createElement('option');
            option.value = difficulty;
            option.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
            difficultyFilter.appendChild(option);
        });
    }

    // Populate marks filter
    const marksFilter = document.getElementById('marks-filter');
    if (marksFilter) {
        marksFilter.innerHTML = '<option value="">All Marks</option>';
        markValues.forEach(marks => {
            const option = document.createElement('option');
            option.value = marks;
            option.textContent = `${marks} Mark${marks !== 1 ? 's' : ''}`;
            marksFilter.appendChild(option);
        });
    }
}

function displayMCQs(mcqs) {
    const container = document.getElementById('mcqs-container');
    if (!container) return;

    if (mcqs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-question-circle"></i>
                <p>No MCQs found. Create your first question!</p>
            </div>
        `;
        return;
    }

    const mcqsHtml = mcqs.map(mcq => createMCQCard(mcq)).join('');
    container.innerHTML = mcqsHtml;

    // Setup action buttons
    setupMCQActions();
}

function createMCQCard(mcq) {
    const examYear = mcq.exam && mcq.year ? `${mcq.exam} ${mcq.year}` : (mcq.exam || '');
    
    return `
        <div class="mcq-card" data-mcq-id="${mcq._id}">
            <div class="mcq-header">
                <div class="mcq-meta">
                    <span class="subject-tag">${mcq.subject}</span>
                    <span class="topic-tag">${mcq.topic}</span>
                    ${examYear ? `<span class="exam-tag">${examYear}</span>` : ''}
                    <span class="difficulty-tag ${mcq.difficulty}">${mcq.difficulty || 'medium'}</span>
                    <span class="marks-tag">${mcq.marks || 1} Mark${(mcq.marks || 1) !== 1 ? 's' : ''}</span>
                </div>
                <div class="mcq-actions">
                    <button class="btn-icon edit-btn" onclick="editMCQ('${mcq._id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon delete-btn" onclick="deleteMCQ('${mcq._id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="mcq-question">
                <strong>Q:</strong> ${mcq.question}
                ${mcq.questionImage?.url ? `<div class="question-image"><img src="${mcq.questionImage.url}" alt="Question image" class="preview-img"></div>` : ''}
            </div>
            
            <div class="mcq-options">
                ${Object.entries(mcq.options).map(([key, value]) => `
                    <div class="option ${key === mcq.correctAnswer ? 'correct' : ''}">
                        <span class="option-letter">${key}.</span>
                        <span class="option-text">${value}</span>
                        ${mcq.optionImages?.[key]?.url ? `<img src="${mcq.optionImages[key].url}" alt="Option ${key}" class="option-img">` : ''}
                    </div>
                `).join('')}
            </div>
            
            ${mcq.explanation ? `
                <div class="mcq-explanation">
                    <strong>Explanation:</strong> ${mcq.explanation}
                    ${mcq.explanationImage?.url ? `<div class="explanation-image"><img src="${mcq.explanationImage.url}" alt="Explanation" class="preview-img"></div>` : ''}
                </div>
            ` : ''}
            
            <div class="mcq-footer">
                <small class="creation-date">Created: ${new Date(mcq.createdAt).toLocaleDateString()}</small>
                ${mcq.updatedAt !== mcq.createdAt ? `<small class="update-date">Updated: ${new Date(mcq.updatedAt).toLocaleDateString()}</small>` : ''}
            </div>
        </div>
    `;
}

function setupMCQActions() {
    // Image click handlers for preview
    document.querySelectorAll('.preview-img, .option-img').forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

function filterMCQs() {
    const searchTerm = document.getElementById('mcq-search')?.value.toLowerCase() || '';
    const subjectFilter = document.getElementById('subject-filter')?.value || '';
    const examFilter = document.getElementById('exam-filter')?.value || '';
    const difficultyFilter = document.getElementById('difficulty-filter')?.value || '';
    const marksFilter = document.getElementById('marks-filter')?.value || '';

    const filtered = allMCQs.filter(mcq => {
        const matchesSearch = !searchTerm || 
            mcq.question.toLowerCase().includes(searchTerm) ||
            mcq.subject.toLowerCase().includes(searchTerm) ||
            mcq.topic.toLowerCase().includes(searchTerm) ||
            (mcq.exam && mcq.exam.toLowerCase().includes(searchTerm));

        const matchesSubject = !subjectFilter || mcq.subject === subjectFilter;
        const matchesExam = !examFilter || mcq.exam === examFilter;
        const matchesDifficulty = !difficultyFilter || mcq.difficulty === difficultyFilter;
        const matchesMarks = !marksFilter || mcq.marks == parseFloat(marksFilter);

        return matchesSearch && matchesSubject && matchesExam && matchesDifficulty && matchesMarks;
    });

    displayMCQs(filtered);
    
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        resultCount.textContent = `Showing ${filtered.length} of ${allMCQs.length} questions`;
    }
}

// =========================
// UPDATE MCQ FUNCTIONALITY
// =========================

async function editMCQ(mcqId) {
    try {
        const response = await fetch(`${API_BASE_URL}/mcqs/${mcqId}`, {
            headers: {
                'x-auth-token': token
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch MCQ details');
        }

        const mcq = await response.json();
        currentEditingId = mcqId;
        
        // Switch to edit tab and populate form
        showTab('edit');
        populateEditForm(mcq);
        
    } catch (error) {
        console.error('Error fetching MCQ:', error);
        showAlert(`Failed to load MCQ: ${error.message}`, 'error');
    }
}

function populateEditForm(mcq) {
    const form = document.getElementById('edit-mcq-form');
    if (!form) return;

    // Show the edit form
    showEditForm();

    // Clear uploaded images
    uploadedImages = {};

    // Populate text fields safely with better selectors
    const setFieldValue = (name, value) => {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) {
            field.value = value || '';
        } else {
            console.warn(`Field not found: ${name}`);
        }
    };

    setFieldValue('question', mcq.question);
    setFieldValue('optionA', mcq.options?.A);
    setFieldValue('optionB', mcq.options?.B);
    setFieldValue('optionC', mcq.options?.C);
    setFieldValue('optionD', mcq.options?.D);
    setFieldValue('correctAnswer', mcq.correctAnswer);
    setFieldValue('explanation', mcq.explanation);
    setFieldValue('subject', mcq.subject);
    setFieldValue('topic', mcq.topic);
    setFieldValue('exam', mcq.exam);
    setFieldValue('year', mcq.year);
    setFieldValue('difficulty', mcq.difficulty || 'medium');
    setFieldValue('marks', mcq.marks || 1);

    // Handle existing images
    if (mcq.questionImage?.url) {
        uploadedImages.question = mcq.questionImage;
        showImagePreview('question', mcq.questionImage.url);
    }

    if (mcq.explanationImage?.url) {
        uploadedImages.explanation = mcq.explanationImage;
        showImagePreview('explanation', mcq.explanationImage.url);
    }

    if (mcq.optionImages) {
        ['A', 'B', 'C', 'D'].forEach((option, index) => {
            if (mcq.optionImages[option]?.url) {
                const field = ['optionA', 'optionB', 'optionC', 'optionD'][index];
                uploadedImages[field] = mcq.optionImages[option];
                showImagePreview(field, mcq.optionImages[option].url);
            }
        });
    }
}

async function handleUpdateMCQ(e) {
    e.preventDefault();
    
    if (!currentEditingId) {
        showAlert('No MCQ selected for editing', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
        const formData = new FormData(e.target);
        
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
            year: formData.get('year') ? parseInt(formData.get('year')) : null,
            difficulty: formData.get('difficulty') || 'medium',
            marks: formData.get('marks') ? parseFloat(formData.get('marks')) : 1
        };

        // Validate marks
        const marks = parseFloat(formData.get('marks'));
        if (marks && (marks < 0.25 || marks > 10 || marks !== Math.round(marks * 4) / 4)) {
            throw new Error('Marks must be between 0.25 and 10, in increments of 0.25');
        }

        // Add images if they exist
        if (uploadedImages.question) {
            mcqData.questionImage = uploadedImages.question;
        }

        if (uploadedImages.explanation) {
            mcqData.explanationImage = uploadedImages.explanation;
        }

        // Handle option images
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

        // Send update request to server
        const response = await fetch(`${API_BASE_URL}/mcqs/${currentEditingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify(mcqData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('MCQ updated successfully!', 'success');
            currentEditingId = null;
            resetEditForm();
            showTab('manage');
            loadAllMCQs(); // Refresh the list
        } else {
            throw new Error(result.message || 'Failed to update MCQ');
        }

    } catch (error) {
        console.error('Update error:', error);
        showAlert(`Failed to update MCQ: ${error.message}`, 'error');
    } finally {
        // Always reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// =========================
// DELETE MCQ FUNCTIONALITY
// =========================

async function deleteMCQ(mcqId) {
    if (!confirm('Are you sure you want to delete this MCQ? This action cannot be undone.')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/mcqs/${mcqId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        });

        const result = await response.json();

        if (result.success) {
            showAlert('MCQ deleted successfully!', 'success');
            loadAllMCQs(); // Refresh the list
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Delete error:', error);
        showAlert(`Failed to delete MCQ: ${error.message}`, 'error');
    }
}

// =========================
// EXCEL UPLOAD FUNCTIONALITY
// =========================

async function handleExcelUpload(e) {
    e.preventDefault();
    
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('Please select an Excel file to upload', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    const formData = new FormData();
    formData.append('mcqFile', file);
    
    try {
        const response = await fetch(`${API_BASE_URL}/upload-mcqs`, {
            method: 'POST',
            headers: {
                'x-auth-token': token
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            showAlert(`Successfully uploaded ${result.uploadedQuestions} questions!`, 'success');
            displayUploadResults(result);
            loadAllMCQs(); // Refresh the manage tab
        } else {
            showAlert(`Upload failed: ${result.message}`, 'error');
            displayUploadResults(result);
        }
        
    } catch (error) {
        console.error('Upload error:', error);
        showAlert(`Network error: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function displayUploadResults(result) {
    const resultsContainer = document.getElementById('upload-results');
    if (!resultsContainer) return;

    let html = `<div class="upload-results ${result.success ? 'success' : 'error'}">`;
    
    if (result.details) {
        html += `
            <h4>Upload Summary:</h4>
            <ul>
                <li>Total rows processed: ${result.details.processed || 0}</li>
                <li>Successfully uploaded: ${result.details.uploaded || result.uploadedQuestions || 0}</li>
                <li>Errors: ${result.details.errorCount || 0}</li>
                <li>Warnings: ${result.details.warningCount || 0}</li>
            </ul>
        `;
    }

    if (result.errors && result.errors.length > 0) {
        html += `
            <h4>Errors:</h4>
            <ul class="error-list">
                ${result.errors.slice(0, 10).map(error => `<li>${error}</li>`).join('')}
                ${result.errors.length > 10 ? `<li><em>... and ${result.errors.length - 10} more errors</em></li>` : ''}
            </ul>
        `;
    }

    if (result.warnings && result.warnings.length > 0) {
        html += `
            <h4>Warnings:</h4>
            <ul class="warning-list">
                ${result.warnings.slice(0, 5).map(warning => `<li>${warning}</li>`).join('')}
                ${result.warnings.length > 5 ? `<li><em>... and ${result.warnings.length - 5} more warnings</em></li>` : ''}
            </ul>
        `;
    }

    html += '</div>';
    
    resultsContainer.innerHTML = html;
    resultsContainer.style.display = 'block';
}

// =========================
// UTILITY FUNCTIONS
// =========================

function resetCreateForm() {
    const form = document.getElementById('create-mcq-form');
    if (form) form.reset();
    
    resetImageUploads();
}

function resetEditForm() {
    const form = document.getElementById('edit-mcq-form');
    if (form) form.reset();
    
    resetImageUploads();
    currentEditingId = null;
    hideEditForm();
}

function resetImageUploads() {
    uploadedImages = {};
    
    document.querySelectorAll('.image-preview').forEach(preview => {
        preview.style.display = 'none';
    });
    
    document.querySelectorAll('.upload-button').forEach(button => {
        button.innerHTML = '<i class="fas fa-upload"></i> Choose Image';
        button.style.background = '';
        button.disabled = false;
    });
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.prepend(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

function showLoadingState(container) {
    container.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading MCQs...</p>
        </div>
    `;
}

function debounce(func, wait) {
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

function openImageModal(imageUrl, description) {
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-overlay" onclick="closeImageModal()">
                <div class="image-modal-content" onclick="event.stopPropagation()">
                    <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
                    <img class="image-modal-img" alt="">
                    <div class="image-modal-description"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    const img = modal.querySelector('.image-modal-img');
    const desc = modal.querySelector('.image-modal-description');
    
    img.src = imageUrl;
    img.alt = description;
    desc.textContent = description;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function showEditForm() {
    const form = document.getElementById('edit-mcq-form');
    const message = document.querySelector('#edit-tab p');
    
    if (form) {
        form.style.display = 'block';
        form.classList.remove('edit-form-hidden');
    }
    
    if (message) {
        message.style.display = 'none';
    }
}

function hideEditForm() {
    const form = document.getElementById('edit-mcq-form');
    const message = document.querySelector('#edit-tab p');
    
    if (form) {
        form.style.display = 'none';
        form.classList.add('edit-form-hidden');
    }
    
    if (message) {
        message.style.display = 'block';
    }
}

// Global functions for HTML onclick handlers
window.editMCQ = editMCQ;
window.deleteMCQ = deleteMCQ;
window.removeImage = removeImage;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;