// document.addEventListener('DOMContentLoaded', async () => {
//     // Check if the user is authenticated before doing anything
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (!token || !userId) {
//         alert('You must be logged in to take a test.');
//         window.location.href = 'auth.html';
//         return; // Stop the script here
//     }

//     const testContainer = document.getElementById('test-container');
//     const testForm = document.getElementById('test-form');
//     const submitButton = document.getElementById('submit-button');
//     const timerDisplay = document.getElementById('timer');
//     const resultsDiv = document.getElementById('results');
//     const scoreDiv = document.getElementById('score');
//     const detailsDiv = document.getElementById('results-details');

//     let allQuestions = [];
//     let timeRemaining = 30 * 60;
//     let timerInterval;

//     function startTimer() {
//         timerInterval = setInterval(() => {
//             const minutes = Math.floor(timeRemaining / 60);
//             const seconds = timeRemaining % 60;
//             timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//             timeRemaining--;

//             if (timeRemaining < 0) {
//                 clearInterval(timerInterval);
//                 alert('Time is up! Submitting your test...');
//                 submitTest();
//             }
//         }, 1000);
//     }

//     async function fetchTestQuestions() {
//         try {
//             const response = await fetch('http://localhost:3000/api/test-series', {
//                 headers: { 'x-auth-token': token }
//             });
//             if (!response.ok) throw new Error('Could not fetch mock test.');
//             allQuestions = await response.json();
//             renderQuestions(allQuestions);
//             startTimer();
//             submitButton.disabled = false;
//         } catch (error) {
//             console.error('Error fetching test:', error);
//             testContainer.innerHTML = '<p class="loading-message">Error loading test. Please log in and try again.</p>';
//         }
//     }

//     function renderQuestions(questions) {
//         testContainer.innerHTML = '';
//         questions.forEach((q, index) => {
//             const questionCard = document.createElement('div');
//             questionCard.className = 'question-card';
            
//             const questionText = document.createElement('p');
//             questionText.innerHTML = `<strong>${index + 1}.</strong> ${q.question}`;
//             questionCard.appendChild(questionText);
            
//             const optionsList = document.createElement('ul');
//             optionsList.className = 'options-list';
            
//             Object.keys(q.options).forEach(optionKey => {
//                 const optionItem = document.createElement('li');
//                 optionItem.innerHTML = `<label><input type="radio" name="q-${q._id}" value="${optionKey}"> ${q.options[optionKey]}</label>`;
//                 optionsList.appendChild(optionItem);
//             });
            
//             questionCard.appendChild(optionsList);
//             testContainer.appendChild(questionCard);
//         });
//         MathJax.typesetPromise();
//     }

//     testForm.addEventListener('submit', async (event) => {
//         event.preventDefault();
//         submitTest();
//     });

//     async function submitTest() {
//         clearInterval(timerInterval);
//         const submittedAnswers = {};
//         const formData = new FormData(testForm);
        
//         for (let [name, value] of formData.entries()) {
//             const questionId = name.replace('q-', '');
//             submittedAnswers[questionId] = value;
//         }

//         try {
//             const response = await fetch('http://localhost:3000/api/grade-test', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'x-auth-token': token
//                 },
//                 body: JSON.stringify({
//                     submittedAnswers,
//                     userId
//                 })
//             });

//             const result = await response.json();
//             displayResults(result);
//         } catch (error) {
//             console.error('Error submitting test:', error);
//         }
//     }

//     function displayResults(result) {
//         testForm.style.display = 'none';
//         resultsDiv.style.display = 'block';

//         scoreDiv.innerHTML = `Your Score: <strong>${result.score} / ${allQuestions.length}</strong>`;
        
//         result.results.forEach(item => {
//             const question = allQuestions.find(q => q._id === item.questionId);
//             if (!question) return;

//             const questionResult = document.createElement('div');
//             questionResult.className = 'question-result';
//             questionResult.innerHTML = `
//                 <p><strong>Q:</strong> ${question.question}</p>
//                 <p>Your Answer: <strong>${item.yourAnswer}</strong></p>
//                 <p>Correct Answer: <strong>${item.correctAnswer}</strong></p>
//                 <p>Explanation: ${item.explanation}</p>
//                 <hr>
//             `;
//             detailsDiv.appendChild(questionResult);
//         });
//         MathJax.typesetPromise();
//     }

//     fetchTestQuestions();
// });


// redesigned-test.js - Comprehensive test management system

// Global variables
let currentTest = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = {};
let testStartTime = null;
let timerInterval = null;
let timeRemaining = 0;
let availableTests = [];
let testHistory = [];
let subjects = [];
let topics = {};
let examTypes = [];

// Fullscreen test specific variables
let questionStatus = {}; // 'answered', 'not-answered', 'marked', 'not-visited', 'current'
let isFullscreenActive = false;

// Configuration
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api' 
    : 'https://your-domain.com/api';

// Authentication check
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const isAdmin = localStorage.getItem('isAdmin') === 'true';

if (!token || !userId) {
    alert('You must be logged in to access tests.');
    window.location.href = 'auth.html';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTestSystem();
});

// =========================
// INITIALIZATION
// =========================

function initializeTestSystem() {
    setupTabs();
    setupEventListeners();
    loadInitialData();
    
    // Show admin tab if user is admin
    if (isAdmin) {
        document.querySelector('[data-tab="admin"]').style.display = 'block';
        setupAdminFeatures();
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.test-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.test-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Load tab-specific data
    switch(tabName) {
        case 'available':
            loadAvailableTests();
            break;
        case 'create':
            loadSubjectsAndTopics();
            break;
        case 'history':
            loadTestHistory();
            break;
        case 'admin':
            if (isAdmin) loadAdminTests();
            break;
    }
}

function setupEventListeners() {
    // Custom test form
    const customTestForm = document.getElementById('custom-test-form');
    if (customTestForm) {
        customTestForm.addEventListener('submit', handleCreateCustomTest);
    }

    // Results buttons
    const backBtn = document.getElementById('back-to-dashboard');
    const retakeBtn = document.getElementById('retake-test');
    
    if (backBtn) backBtn.addEventListener('click', backToDashboard);
    if (retakeBtn) retakeBtn.addEventListener('click', retakeCurrentTest);

    // Setup fullscreen test prevention of navigation
    setupFullscreenProtection();
}

function setupFullscreenProtection() {
    // Prevent context menu and shortcuts during test
    document.addEventListener('contextmenu', function(e) {
        if (isFullscreenActive) {
            e.preventDefault();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!isFullscreenActive) return;
        
        // Prevent F12, Ctrl+Shift+I, Ctrl+U, etc.
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.shiftKey && e.key === 'C') ||
            (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
        
        // Allow navigation with arrow keys
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextQuestion();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            previousQuestion();
        }
    });

    // Prevent page refresh during fullscreen test
    window.addEventListener('beforeunload', function(e) {
        if (isFullscreenActive) {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave the test?';
        }
    });
}

function setupAdminFeatures() {
    // Add admin-specific event listeners and UI elements
    const adminUploadForm = createAdminUploadForm();
    const adminTab = document.getElementById('admin-tab');
    if (adminTab && adminUploadForm) {
        adminTab.appendChild(adminUploadForm);
    }
}

// =========================
// DATA LOADING (Same as before)
// =========================

async function loadInitialData() {
    try {
        await Promise.all([
            loadAvailableTests(),
            loadSubjectsAndTopics(),
            loadExamTypes()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
        showAlert('Failed to load test data', 'error');
    }
}

async function loadSubjectsAndTopics() {
    try {
        // Load subjects
        const subjectsResponse = await fetch(`${API_BASE_URL}/mcqs/subjects`, {
            headers: { 'x-auth-token': token }
        });

        if (subjectsResponse.ok) {
            subjects = await subjectsResponse.json();
        } else {
            // Fallback: get subjects from MCQs
            const mcqResponse = await fetch(`${API_BASE_URL}/mcqs?limit=1000`, {
                headers: { 'x-auth-token': token }
            });
            const mcqs = await mcqResponse.json();
            subjects = [...new Set(mcqs.map(mcq => mcq.subject).filter(Boolean))];
        }

        // Load topics for each subject
        for (const subject of subjects) {
            try {
                const topicsResponse = await fetch(`${API_BASE_URL}/mcqs/topics?subject=${encodeURIComponent(subject)}`, {
                    headers: { 'x-auth-token': token }
                });

                if (topicsResponse.ok) {
                    topics[subject] = await topicsResponse.json();
                } else {
                    // Fallback: extract topics from MCQs
                    const mcqResponse = await fetch(`${API_BASE_URL}/mcqs?subject=${encodeURIComponent(subject)}&limit=1000`, {
                        headers: { 'x-auth-token': token }
                    });
                    const mcqs = await mcqResponse.json();
                    topics[subject] = [...new Set(mcqs.map(mcq => mcq.topic).filter(Boolean))];
                }
            } catch (error) {
                console.error(`Error loading topics for ${subject}:`, error);
                topics[subject] = [];
            }
        }
        
        displaySubjectFilters();
        displayTopicFilters();
    } catch (error) {
        console.error('Error loading subjects and topics:', error);
        // Default subjects if API fails
        subjects = ['Thermodynamics', 'Fluid Mechanics', 'Heat Transfer', 'Mass Transfer', 'Chemical Reaction Engineering'];
        topics = {
            'Thermodynamics': ['First Law', 'Second Law', 'Entropy', 'Phase Equilibrium'],
            'Fluid Mechanics': ['Flow Properties', 'Bernoulli Equation', 'Pumps', 'Piping Systems'],
            'Heat Transfer': ['Conduction', 'Convection', 'Radiation', 'Heat Exchangers'],
            'Mass Transfer': ['Diffusion', 'Absorption', 'Distillation', 'Extraction'],
            'Chemical Reaction Engineering': ['Kinetics', 'Reactor Design', 'Catalysis', 'Mass Balance']
        };
        displaySubjectFilters();
        displayTopicFilters();
    }
}

async function loadExamTypes() {
    try {
        const response = await fetch(`${API_BASE_URL}/exams-meta`, {
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            const meta = await response.json();
            examTypes = meta.exams || [];
        } else {
            examTypes = ['GATE', 'IES', 'PSU', 'University Exam'];
        }
    } catch (error) {
        console.error('Error loading exam types:', error);
        examTypes = ['GATE', 'IES', 'PSU', 'University Exam'];
    }
}

async function loadAvailableTests() {
    try {
        const response = await fetch(`${API_BASE_URL}/tests`, {
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            availableTests = await response.json();
        } else {
            // Fallback: create default tests
            availableTests = await createDefaultTests();
        }

        displayAvailableTests();
    } catch (error) {
        console.error('Error loading tests:', error);
        availableTests = await createDefaultTests();
        displayAvailableTests();
    }
}

async function createDefaultTests() {
    const defaultTests = [
        {
            _id: 'random-20',
            title: 'Quick Practice Test',
            description: 'Random 20 questions from all subjects',
            questionCount: 20,
            duration: 30,
            type: 'predefined',
            subjects: 'All',
            difficulty: 'mixed'
        },
        {
            _id: 'comprehensive-50',
            title: 'Comprehensive Test',
            description: 'Complete 50-question test covering all topics',
            questionCount: 50,
            duration: 75,
            type: 'predefined',
            subjects: 'All',
            difficulty: 'mixed'
        }
    ];

    // Add exam-specific tests
    examTypes.forEach(exam => {
        defaultTests.push({
            _id: `exam-${exam.toLowerCase().replace(/\s+/g, '-')}`,
            title: `${exam} Mock Test`,
            description: `Practice test based on ${exam} pattern`,
            questionCount: 30,
            duration: 45,
            type: 'predefined',
            subjects: exam,
            difficulty: 'mixed'
        });
    });

    return defaultTests;
}

async function loadTestHistory() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/test-history`, {
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            testHistory = await response.json();
        } else {
            // Fallback: use localStorage
            const storedHistory = localStorage.getItem(`testHistory_${userId}`);
            testHistory = storedHistory ? JSON.parse(storedHistory) : [];
        }
        
        displayTestHistory();
    } catch (error) {
        console.error('Error loading test history:', error);
        testHistory = [];
        displayTestHistory();
    }
}

// =========================
// DISPLAY FUNCTIONS (Same as before)
// =========================

function displayAvailableTests() {
    const container = document.getElementById('available-tests');
    if (!container) return;

    if (availableTests.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No tests available at the moment.</p>
            </div>
        `;
        return;
    }

    const testsHtml = availableTests.map(test => `
        <div class="test-card" onclick="startTest('${test._id}')">
            <div class="test-card-header">
                <h3 class="test-title">${test.title}</h3>
                <span class="test-type ${test.type}">${test.type}</span>
            </div>
            
            <div class="test-info">
                <div class="test-stat">
                    <span class="test-stat-number">${test.questionCount}</span>
                    <span class="test-stat-label">Questions</span>
                </div>
                <div class="test-stat">
                    <span class="test-stat-number">${test.duration}</span>
                    <span class="test-stat-label">Minutes</span>
                </div>
            </div>
            
            <p class="test-description">${test.description}</p>
            
            <div class="test-actions">
                <button class="btn-start" onclick="event.stopPropagation(); startTest('${test._id}')">
                    <i class="fas fa-play"></i> Start Test
                </button>
                <button class="btn-analytics" onclick="event.stopPropagation(); viewTestAnalytics('${test._id}')">
                    <i class="fas fa-chart-bar"></i> Analytics
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = testsHtml;
}

function displaySubjectFilters() {
    const container = document.getElementById('subject-filters');
    if (!container) return;

    const subjectsHtml = subjects.map(subject => `
        <div class="subject-chip" data-subject="${subject}" onclick="handleSubjectSelection('${subject}')">
            ${subject}
        </div>
    `).join('');

    container.innerHTML = subjectsHtml;
}

function displayTopicFilters() {
    const container = document.createElement('div');
    container.id = 'topic-filters';
    container.className = 'topic-filters';
    container.style.display = 'none';
    container.innerHTML = '<label>Select Topics (Optional):</label><div class="topic-chips"></div>';

    const subjectFilters = document.getElementById('subject-filters');
    if (subjectFilters && !document.getElementById('topic-filters')) {
        subjectFilters.parentNode.insertBefore(container, subjectFilters.nextSibling);
    }
}

function handleSubjectSelection(selectedSubject) {
    const subjectChip = document.querySelector(`[data-subject="${selectedSubject}"]`);
    const topicFiltersContainer = document.getElementById('topic-filters');
    const topicChipsContainer = document.querySelector('.topic-chips');

    if (!subjectChip || !topicFiltersContainer || !topicChipsContainer) return;

    subjectChip.classList.toggle('selected');
    
    const selectedSubjects = Array.from(document.querySelectorAll('.subject-chip.selected'))
        .map(chip => chip.dataset.subject);

    if (selectedSubjects.length > 0) {
        topicFiltersContainer.style.display = 'block';
        
        // Show topics for selected subjects
        const availableTopics = new Set();
        selectedSubjects.forEach(subject => {
            if (topics[subject]) {
                topics[subject].forEach(topic => availableTopics.add(topic));
            }
        });

        const topicsHtml = Array.from(availableTopics).map(topic => `
            <div class="topic-chip" data-topic="${topic}">
                ${topic}
            </div>
        `).join('');

        topicChipsContainer.innerHTML = topicsHtml;

        // Add click handlers for topic chips
        topicChipsContainer.querySelectorAll('.topic-chip').forEach(chip => {
            chip.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
        });
    } else {
        topicFiltersContainer.style.display = 'none';
    }
}

function displayTestHistory() {
    const container = document.getElementById('test-history');
    if (!container) return;

    if (testHistory.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fas fa-history" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>No test history found. Take your first test!</p>
            </div>
        `;
        return;
    }

    const historyHtml = testHistory.map(test => `
        <div class="test-card">
            <div class="test-card-header">
                <h3 class="test-title">${test.testName}</h3>
                <span class="test-type ${test.accuracy >= 70 ? 'custom' : 'predefined'}">
                    ${test.accuracy}%
                </span>
            </div>
            
            <div class="test-info">
                <div class="test-stat">
                    <span class="test-stat-number">${test.score}</span>
                    <span class="test-stat-label">Score</span>
                </div>
                <div class="test-stat">
                    <span class="test-stat-number">${test.totalQuestions}</span>
                    <span class="test-stat-label">Total</span>
                </div>
            </div>
            
            <p class="test-description">
                Completed: ${new Date(test.completedAt).toLocaleDateString()}
            </p>
            
            <div class="test-actions">
                <button class="btn-analytics" onclick="viewDetailedResults('${test._id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
            </div>
        </div>
    `).join('');

    container.innerHTML = historyHtml;
}

// =========================
// FULLSCREEN TEST INTERFACE
// =========================

function startFullscreenTest(testConfig, questions) {
    try {
        console.log('Starting fullscreen test:', testConfig.title);
        
        // Reset test state
        currentQuestionIndex = 0;
        userAnswers = {};
        questionStatus = {};
        testStartTime = Date.now();
        timeRemaining = testConfig.duration * 60;
        isFullscreenActive = true;

        // Initialize question status
        for (let i = 1; i <= questions.length; i++) {
            questionStatus[i] = i === 1 ? 'current' : 'not-visited';
        }

        // Update UI with test data
        document.getElementById('test-title').textContent = testConfig.title || testConfig.testName;
        document.getElementById('user-name').textContent = localStorage.getItem('userName') || 'Student';

        // Show fullscreen interface
        document.getElementById('main-dashboard').style.display = 'none';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('fullscreen-test').style.display = 'flex';

        // Generate question palette
        generateFullscreenQuestionPalette(questions.length);

        // Load first question
        loadFullscreenQuestion(0);

        // Start timer
        startFullscreenTimer();

        // Update stats
        updateFullscreenStats();

        // Try to go fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen request failed:', err);
            });
        }

        showAlert('Test started! Use the question palette to navigate.', 'success');

    } catch (error) {
        console.error('Error starting fullscreen test:', error);
        showAlert('Failed to start fullscreen test', 'error');
    }
}

function generateFullscreenQuestionPalette(totalQuestions) {
    const palette = document.getElementById('question-palette');
    let paletteHtml = '';
    
    for (let i = 1; i <= totalQuestions; i++) {
        paletteHtml += `
            <button class="palette-btn ${i === 1 ? 'current' : 'not-visited'}" 
                    onclick="jumpToFullscreenQuestion(${i - 1})" 
                    id="fs-btn-${i}">
                ${i}
            </button>
        `;
    }
    
    palette.innerHTML = paletteHtml;
    
    // Update progress info
    document.getElementById('progress-info').textContent = `Question 1 of ${totalQuestions}`;
    document.getElementById('not-visited-count').textContent = totalQuestions - 1;
}

function loadFullscreenQuestion(index) {
    if (!currentQuestions || !currentQuestions[index]) return;
    
    const question = currentQuestions[index];
    
    // Update question header
    document.getElementById('question-number').textContent = `Question No. ${index + 1}`;
    document.getElementById('question-text').textContent = question.question;
    
    // Handle question image
    const questionImageDiv = document.getElementById('question-image');
    const questionImg = document.getElementById('question-img');
    
    if (question.questionImage && question.questionImage.url) {
        questionImg.src = question.questionImage.url;
        questionImg.alt = 'Question Image';
        questionImageDiv.style.display = 'block';
    } else {
        questionImageDiv.style.display = 'none';
    }
    
    // Update marks information
    document.getElementById('positive-marks').textContent = '1';
    document.getElementById('negative-marks').textContent = question.negativeMarks || '0';
    
    // Load options
    const container = document.getElementById('options-container');
    let optionsHtml = '';
    
    if (question.options) {
        Object.entries(question.options).forEach(([key, value]) => {
            const isSelected = userAnswers[question._id || question.id] === key ? 'selected' : '';
            optionsHtml += `
                <div class="fs-option ${isSelected}" onclick="selectFullscreenOption(this, '${key}')">
                    <div class="option-radio"></div>
                    <div class="option-content">
                        <span class="option-label">${key}.</span>
                        <span class="option-text">${value}</span>
                        ${question.optionImages && question.optionImages[key] ? `
                            <div class="option-image">
                                <img src="${question.optionImages[key].url}" alt="Option ${key}" class="mcq-image">
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = optionsHtml;
    
    // Update navigation buttons
    updateFullscreenNavButtons();
    
    // Render LaTeX if present
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([container]);
    }
}

function selectFullscreenOption(element, answer) {
    // Remove selection from other options
    document.querySelectorAll('.fs-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    element.classList.add('selected');
    
    // Store answer
    const questionId = currentQuestions[currentQuestionIndex]._id || currentQuestions[currentQuestionIndex].id;
    userAnswers[questionId] = answer;
    
    // Update status
    questionStatus[currentQuestionIndex + 1] = 'answered';
    updateFullscreenQuestionPalette();
    updateFullscreenStats();
}

function jumpToFullscreenQuestion(index) {
    if (index < 0 || index >= currentQuestions.length) return;
    
    // Update previous question status
    if (questionStatus[currentQuestionIndex + 1] === 'current') {
        const questionId = currentQuestions[currentQuestionIndex]._id || currentQuestions[currentQuestionIndex].id;
        if (userAnswers[questionId]) {
            questionStatus[currentQuestionIndex + 1] = 'answered';
        } else {
            questionStatus[currentQuestionIndex + 1] = 'not-answered';
        }
    }
    
    // Update to new question
    currentQuestionIndex = index;
    questionStatus[index + 1] = 'current';
    
    // Load new question
    loadFullscreenQuestion(index);
    updateFullscreenQuestionPalette();
    updateFullscreenProgress();
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        jumpToFullscreenQuestion(currentQuestionIndex + 1);
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        jumpToFullscreenQuestion(currentQuestionIndex - 1);
    }
}

function saveAndNext() {
    // Mark as answered if an option is selected
    const questionId = currentQuestions[currentQuestionIndex]._id || currentQuestions[currentQuestionIndex].id;
    if (userAnswers[questionId]) {
        questionStatus[currentQuestionIndex + 1] = 'answered';
    } else {
        questionStatus[currentQuestionIndex + 1] = 'not-answered';
    }
    
    updateFullscreenQuestionPalette();
    updateFullscreenStats();
    nextQuestion();
}

function markForReviewAndNext() {
    questionStatus[currentQuestionIndex + 1] = 'marked';
    updateFullscreenQuestionPalette();
    updateFullscreenStats();
    nextQuestion();
}

function clearResponse() {
    const questionId = currentQuestions[currentQuestionIndex]._id || currentQuestions[currentQuestionIndex].id;
    delete userAnswers[questionId];
    
    // Remove selection from UI
    document.querySelectorAll('.fs-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    questionStatus[currentQuestionIndex + 1] = 'not-answered';
    updateFullscreenQuestionPalette();
    updateFullscreenStats();
}

function updateFullscreenQuestionPalette() {
    Object.entries(questionStatus).forEach(([questionNum, status]) => {
        const btn = document.getElementById(`fs-btn-${questionNum}`);
        if (btn) {
            btn.className = `palette-btn ${status}`;
        }
    });
}

function updateFullscreenStats() {
    const stats = {
        answered: 0,
        notAnswered: 0,
        notVisited: 0,
        marked: 0
    };
    
    Object.values(questionStatus).forEach(status => {
        if (status === 'answered') stats.answered++;
        else if (status === 'not-answered') stats.notAnswered++;
        else if (status === 'not-visited') stats.notVisited++;
        else if (status === 'marked') stats.marked++;
    });
    
    document.getElementById('answered-count').textContent = stats.answered;
    document.getElementById('not-answered-count').textContent = stats.notAnswered;
    document.getElementById('not-visited-count').textContent = stats.notVisited;
    document.getElementById('marked-count').textContent = stats.marked;
}

function updateFullscreenProgress() {
    document.getElementById('progress-info').textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
}

function updateFullscreenNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
        prevBtn.style.opacity = currentQuestionIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
        nextBtn.style.opacity = currentQuestionIndex === currentQuestions.length - 1 ? '0.5' : '1';
    }
}

function startFullscreenTimer() {
    const timerDisplay = document.getElementById('timer-display');
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;
        
        let displayTime;
        if (hours > 0) {
            displayTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (timerDisplay) {
            timerDisplay.textContent = displayTime;
        }
        
        // Change timer color based on remaining time
        const timer = document.getElementById('timer');
        if (timer) {
            if (timeRemaining <= 300) { // 5 minutes
                timer.className = 'timer danger';
            } else if (timeRemaining <= 900) { // 15 minutes
                timer.className = 'timer warning';
            } else {
                timer.className = 'timer';
            }
        }
        
        timeRemaining--;
        
        if (timeRemaining < 0) {
            clearInterval(timerInterval);
            alert('Time is up! Test will be submitted automatically.');
            submitFullscreenTest();
        }
    }, 1000);
}

function submitFullscreenTest() {
    const unansweredCount = currentQuestions.length - Object.keys(userAnswers).length;
    
    if (unansweredCount > 0 && timeRemaining > 0) {
        const proceed = confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`);
        if (!proceed) return;
    }
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    isFullscreenActive = false;
    
    // Calculate results
    const timeTaken = Math.round((Date.now() - testStartTime) / 1000);
    const result = calculateFullscreenTestResults();
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    
    // Display results
    displayFullscreenTestResults(result, timeTaken);
}

function calculateFullscreenTestResults() {
    let score = 0;
    const results = [];
    
    currentQuestions.forEach(question => {
        const questionId = question._id || question.id;
        const userAnswer = userAnswers[questionId];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
            score++;
        }
        
        results.push({
            id: questionId,
            correct: isCorrect,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer
        });
    });
    
    return {
        score: score,
        results: results
    };
}

function displayFullscreenTestResults(result, timeTaken) {
    try {
        // Hide fullscreen test interface
        document.getElementById('fullscreen-test').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
        
        const accuracy = Math.round((result.score / currentQuestions.length) * 100);
        const timeMinutes = Math.floor(timeTaken / 60);
        const timeSeconds = timeTaken % 60;

        // Update results display
        document.getElementById('score-display').textContent = `${accuracy}%`;
        document.getElementById('correct-count').textContent = result.score;
        document.getElementById('incorrect-count').textContent = currentQuestions.length - result.score;
        document.getElementById('time-taken').textContent = `${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        // Score summary
        const scoreSummary = document.getElementById('score-summary');
        if (scoreSummary) {
            let message = '';
            if (accuracy >= 90) message = 'Excellent performance!';
            else if (accuracy >= 80) message = 'Great job!';
            else if (accuracy >= 70) message = 'Good work!';
            else if (accuracy >= 60) message = 'Keep practicing!';
            else message = 'More practice needed';
            
            scoreSummary.textContent = message;
        }

        // Save to test history
        saveTestResult({
            testName: currentTest.title || currentTest.testName,
            score: result.score,
            totalQuestions: currentQuestions.length,
            accuracy: accuracy,
            duration: currentTest.duration,
            completedAt: new Date().toISOString(),
            timeTaken: timeTaken
        });
        
        // Display detailed analysis
        displaySubjectAnalysis(result);
        displayQuestionReview(result);
        
        showAlert('Test completed successfully!', 'success');
        
    } catch (error) {
        console.error('Error displaying results:', error);
        showAlert('Error displaying results', 'error');
    }
}

function saveTestResult(testResult) {
    try {
        // Save to localStorage
        const existingHistory = JSON.parse(localStorage.getItem(`testHistory_${userId}`) || '[]');
        existingHistory.unshift({
            ...testResult,
            _id: `test-${Date.now()}`
        });
        
        // Keep only last 50 results
        const trimmedHistory = existingHistory.slice(0, 50);
        localStorage.setItem(`testHistory_${userId}`, JSON.stringify(trimmedHistory));
        
        // Update global testHistory
        testHistory = trimmedHistory;
        
    } catch (error) {
        console.error('Error saving test result:', error);
    }
}

function toggleInstructions() {
    const panel = document.getElementById('instructions-panel');
    panel.classList.toggle('active');
}

function exitFullscreenTest() {
    if (confirm('Are you sure you want to exit the test? Your progress will be lost.')) {
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        isFullscreenActive = false;
        
        // Exit fullscreen if active
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        
        // Return to dashboard
        document.getElementById('fullscreen-test').style.display = 'none';
        document.getElementById('main-dashboard').style.display = 'block';
        
        // Reset test state
        currentTest = null;
        currentQuestions = [];
        userAnswers = {};
        questionStatus = {};
    }
}

// =========================
// TEST MANAGEMENT (Updated to use fullscreen)
// =========================

async function handleCreateCustomTest(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const selectedSubjects = Array.from(document.querySelectorAll('.subject-chip.selected'))
            .map(chip => chip.dataset.subject);
        const selectedTopics = Array.from(document.querySelectorAll('.topic-chip.selected'))
            .map(chip => chip.dataset.topic);

        if (selectedSubjects.length === 0) {
            showAlert('Please select at least one subject', 'error');
            return;
        }

        const testConfig = {
            title: formData.get('testName'),
            testName: formData.get('testName'),
            duration: parseInt(formData.get('duration')),
            questionCount: parseInt(formData.get('questionCount')),
            difficulty: formData.get('difficulty'),
            subjects: selectedSubjects,
            topics: selectedTopics,
            type: 'custom',
            createdBy: userId
        };

        // Validate inputs
        if (!testConfig.title || testConfig.title.trim() === '') {
            showAlert('Please enter a test name', 'error');
            return;
        }
        
        if (testConfig.duration < 5 || testConfig.duration > 180) {
            showAlert('Duration must be between 5 and 180 minutes', 'error');
            return;
        }
        
        if (testConfig.questionCount < 1 || testConfig.questionCount > 100) {
            showAlert('Question count must be between 1 and 100', 'error');
            return;
        }

        showAlert('Creating custom test...', 'info');
        
        // Generate questions for custom test
        const questions = await generateCustomTestQuestions(testConfig);
        
        if (questions.length === 0) {
            showAlert('No questions found for the selected criteria. Try different subjects or criteria.', 'error');
            return;
        }
        
        if (questions.length < testConfig.questionCount) {
            showAlert(`Only ${questions.length} questions available for selected criteria`, 'warning');
            testConfig.questionCount = questions.length;
        }

        // Start the fullscreen test
        currentTest = testConfig;
        currentQuestions = questions.slice(0, testConfig.questionCount);
        startFullscreenTest(currentTest, currentQuestions);
        
    } catch (error) {
        console.error('Error creating custom test:', error);
        showAlert(`Failed to create custom test: ${error.message}`, 'error');
    }
}

async function generateCustomTestQuestions(config) {
    try {
        let url = `${API_BASE_URL}/mcqs`;
        const params = new URLSearchParams();
        
        // Add subject filter
        if (config.subjects && config.subjects.length > 0) {
            params.append('subjects', config.subjects.join(','));
        }
        
        // Add topic filter if specified
        if (config.topics && config.topics.length > 0) {
            params.append('topics', config.topics.join(','));
        }
        
        // Add difficulty filter
        if (config.difficulty && config.difficulty !== 'mixed') {
            params.append('difficulty', config.difficulty);
        }
        
        // Get more questions than needed for better randomization
        const limitValue = Math.max(config.questionCount * 2, 50);
        params.append('limit', limitValue.toString());

        // Build final URL
        if (params.toString()) {
            url += '?' + params.toString();
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        
        const allQuestions = await response.json();
        
        if (allQuestions.length === 0) {
            return [];
        }
        
        // Shuffle and select questions
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, config.questionCount);
        
        return selected;
        
    } catch (error) {
        console.error('Error generating questions:', error);
        // Return mock questions as fallback
        return generateMockQuestions(config);
    }
}

function generateMockQuestions(config) {
    const mockQuestions = [];
    const questionTypes = [
        'Multiple choice theory question',
        'Problem-solving question', 
        'Conceptual understanding question',
        'Application-based question'
    ];
    
    for (let i = 0; i < config.questionCount; i++) {
        const subject = config.subjects[i % config.subjects.length];
        mockQuestions.push({
            _id: `mock-${i + 1}`,
            id: `mock-${i + 1}`,
            question: `Sample ${questionTypes[i % questionTypes.length]} ${i + 1} for ${subject}`,
            subject: subject,
            options: {
                A: `Option A for question ${i + 1}`,
                B: `Option B for question ${i + 1}`,
                C: `Option C for question ${i + 1}`,
                D: `Option D for question ${i + 1}`
            },
            correctAnswer: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
            explanation: `This is the explanation for question ${i + 1}`,
            difficulty: config.difficulty === 'mixed' ? 
                ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] : 
                config.difficulty
        });
    }
    
    return mockQuestions;
}

async function startTest(testId) {
    try {
        // Find the test configuration
        const testConfig = availableTests.find(t => t._id === testId);
        if (!testConfig) {
            showAlert('Test not found', 'error');
            return;
        }

        showAlert('Loading test questions...', 'info');

        // Generate questions based on test type
        let questions;
        if (testConfig.type === 'predefined') {
            questions = await generatePredefinedTestQuestions(testConfig);
        } else {
            questions = await generateCustomTestQuestions(testConfig);
        }

        if (questions.length === 0) {
            showAlert('No questions available for this test', 'error');
            return;
        }

        currentTest = testConfig;
        currentQuestions = questions.slice(0, testConfig.questionCount);
        startFullscreenTest(currentTest, currentQuestions);

    } catch (error) {
        console.error('Error starting test:', error);
        showAlert('Failed to start test', 'error');
    }
}

async function generatePredefinedTestQuestions(config) {
    try {
        let url = `${API_BASE_URL}/mcqs?limit=${config.questionCount}`;
        
        if (config.subjects && config.subjects !== 'All') {
            url += `&exam=${encodeURIComponent(config.subjects)}`;
        }

        const response = await fetch(url, {
            headers: { 'x-auth-token': token }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch test questions');
        }
        
        const questions = await response.json();
        return questions.sort(() => Math.random() - 0.5).slice(0, config.questionCount);
        
    } catch (error) {
        console.error('Error generating predefined test:', error);
        // Return mock questions as fallback
        const mockConfig = {
            ...config,
            subjects: ['General Knowledge', 'Science', 'Mathematics']
        };
        return generateMockQuestions(mockConfig);
    }
}

// =========================
// RESULTS AND ANALYSIS
// =========================

function displaySubjectAnalysis(result) {
    const container = document.getElementById('subject-analysis');
    if (!container) return;

    const subjectStats = {};
    
    currentQuestions.forEach((question, index) => {
        const subject = question.subject || 'General';
        if (!subjectStats[subject]) {
            subjectStats[subject] = { correct: 0, total: 0 };
        }
        
        subjectStats[subject].total++;
        
        const resultItem = result.results.find(r => r.id === (question._id || question.id));
        if (resultItem && resultItem.correct) {
            subjectStats[subject].correct++;
        }
    });

    const analysisHtml = Object.entries(subjectStats).map(([subject, stats]) => {
        const accuracy = Math.round((stats.correct / stats.total) * 100);
        return `
            <div class="subject-stat">
                <div class="subject-name">${subject}</div>
                <div class="subject-score">${stats.correct}/${stats.total} (${accuracy}%)</div>
                <div class="subject-bar">
                    <div class="subject-fill" style="width: ${accuracy}%"></div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="subject-analysis-grid">
            ${analysisHtml}
        </div>
    `;
}

function displayQuestionReview(result) {
    const container = document.getElementById('questions-review');
    if (!container) return;

    const reviewHtml = currentQuestions.map((question, index) => {
        const questionId = question._id || question.id;
        const resultItem = result.results.find(r => r.id === questionId) || {};
        const userAnswer = userAnswers[questionId] || 'Not answered';
        const isCorrect = resultItem.correct || false;

        return `
            <div class="question-review ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="question-review-header" onclick="toggleQuestionReview(${index})">
                    <span>Question ${index + 1} - ${isCorrect ? 'Correct' : 'Incorrect'}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="question-review-body" style="display: none;">
                    <div class="review-question">
                        <strong>Question:</strong> ${question.question}
                    </div>
                    <div class="review-answers">
                        <div class="user-answer ${isCorrect ? 'correct' : 'incorrect'}">
                            <strong>Your Answer:</strong> ${userAnswer}
                        </div>
                        <div class="correct-answer">
                            <strong>Correct Answer:</strong> ${question.correctAnswer}
                        </div>
                    </div>
                    ${question.explanation ? `
                        <div class="review-explanation">
                            <strong>Explanation:</strong> ${question.explanation}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = reviewHtml;
}

function toggleQuestionReview(index) {
    const reviewItems = document.querySelectorAll('.question-review');
    const item = reviewItems[index];
    if (!item) return;
    
    const body = item.querySelector('.question-review-body');
    const icon = item.querySelector('.fa-chevron-down');

    if (body.style.display === 'block') {
        body.style.display = 'none';
        icon.style.transform = 'rotate(0deg)';
    } else {
        body.style.display = 'block';
        icon.style.transform = 'rotate(180deg)';
    }
}

// =========================
// UTILITY FUNCTIONS
// =========================

function backToDashboard() {
    // Reset test state
    currentTest = null;
    currentQuestions = [];
    currentQuestionIndex = 0;
    userAnswers = {};
    questionStatus = {};
    testStartTime = null;
    isFullscreenActive = false;
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Show dashboard, hide others
    document.getElementById('main-dashboard').style.display = 'block';
    document.getElementById('fullscreen-test').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';

    // Reload test data
    loadAvailableTests();
    loadTestHistory();
    
    // Switch to available tests tab
    showTab('available');
}

function retakeCurrentTest() {
    if (currentTest) {
        const proceed = confirm('Are you sure you want to retake this test?');
        if (proceed) {
            startTest(currentTest._id);
        }
    } else {
        showAlert('No test available to retake', 'error');
        backToDashboard();
    }
}

function viewTestAnalytics(testId) {
    showAlert('Analytics feature coming soon!', 'info');
}

function viewDetailedResults(testId) {
    showAlert('Detailed results feature coming soon!', 'info');
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// =========================
// ADMIN FUNCTIONS (Simplified)
// =========================

function createAdminUploadForm() {
    const adminSection = document.createElement('div');
    adminSection.className = 'admin-upload-section';
    adminSection.innerHTML = `
        <h3><i class="fas fa-upload"></i> Upload Test Data</h3>
        <p>Admin features will be implemented here</p>
    `;
    return adminSection;
}

async function loadAdminTests() {
    if (!isAdmin) return;
    
    const adminContainer = document.getElementById('admin-tests');
    if (adminContainer) {
        adminContainer.innerHTML = `
            <div class="admin-section">
                <h3>Test Management</h3>
                <p>Admin features coming soon...</p>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
window.startTest = startTest;
window.handleSubjectSelection = handleSubjectSelection;
window.jumpToFullscreenQuestion = jumpToFullscreenQuestion;
window.selectFullscreenOption = selectFullscreenOption;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.saveAndNext = saveAndNext;
window.markForReviewAndNext = markForReviewAndNext;
window.clearResponse = clearResponse;
window.submitFullscreenTest = submitFullscreenTest;
// window.toggleInstructions = typeof toggleInstructions !== 'undefined' ? toggleInstructions : function() {};
// window.exitFullscreenTest = typeof exitFullscreenTest !== 'undefined' ? exitFullscreenTest : function() {};
// window.toggleQuestionReview = typeof toggleQuestionReview !== 'undefined' ? toggleQuestionReview : function() {};
// window.viewTestAnalytics = typeof viewTestAnalytics !== 'undefined' ? viewTestAnalytics : function() {};
// window.viewDetailedResults = typeof viewDetailedResults !== 'undefined' ? viewDetailedResults : function() {};