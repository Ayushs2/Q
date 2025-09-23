// document.addEventListener('DOMContentLoaded', async () => {
//     // Check if the user is authenticated before doing anything
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (!token || !userId) {
//         alert('You must be logged in to view the dashboard.');
//         window.location.href = 'auth.html';
//         return; // Stop the script here
//     }

//     const progressTableBody = document.getElementById('progress-table').querySelector('tbody');
//     const leaderboardTableBody = document.getElementById('leaderboard-table').querySelector('tbody');
//     const bookmarksContainer = document.getElementById('bookmarks-container');

//     // Function to fetch and display user progress
//     async function fetchUserProgress() {
//         try {
//             const response = await fetch(`http://localhost:3000/api/user/progress/${userId}`, {
//                 headers: {
//                     'x-auth-token': token
//                 }
//             });
//             if (!response.ok) throw new Error('Could not fetch user progress.');
//             const data = await response.json();
//             data.forEach(item => {
//                 const row = progressTableBody.insertRow();
//                 row.insertCell(0).textContent = new Date(item.date).toLocaleDateString();
//                 row.insertCell(1).textContent = `${item.score} / ${item.totalQuestions}`;
//                 row.insertCell(2).textContent = item.totalQuestions;
//             });
//         } catch (error) {
//             console.error('Error fetching progress:', error);
//             progressTableBody.innerHTML = '<tr><td colspan="3">Failed to load progress.</td></tr>';
//         }
//     }

//     // Function to fetch and display leaderboard
//     async function fetchLeaderboard() {
//         try {
//             const response = await fetch('http://localhost:3000/api/leaderboard');
//             if (!response.ok) throw new Error('Could not fetch leaderboard.');
//             const data = await response.json();
//             data.forEach((item, index) => {
//                 const row = leaderboardTableBody.insertRow();
//                 row.insertCell(0).textContent = index + 1;
//                 row.insertCell(1).textContent = item._id;
//                 row.insertCell(2).textContent = item.totalScore;
//                 row.insertCell(3).textContent = item.totalTests;
//             });
//         } catch (error) {
//             console.error('Error fetching leaderboard:', error);
//             leaderboardTableBody.innerHTML = '<tr><td colspan="4">Failed to load leaderboard.</td></tr>';
//         }
//     }

//     // Function to fetch and display bookmarks
//     async function fetchBookmarks() {
//         try {
//             const response = await fetch('http://localhost:3000/api/bookmarks', {
//                 headers: {
//                     'x-auth-token': token
//                 }
//             });
//             if (!response.ok) throw new Error('Could not fetch bookmarks.');
            
//             const bookmarks = await response.json();
//             bookmarksContainer.innerHTML = '';
//             if (bookmarks.length === 0) {
//                 bookmarksContainer.innerHTML = '<p>No bookmarked questions yet.</p>';
//                 return;
//             }

//             bookmarks.forEach(bookmark => {
//                 const question = bookmark.mcqId;
//                 const questionDiv = document.createElement('div');
//                 questionDiv.innerHTML = `
//                     <p><strong>Q:</strong> ${question.question}</p>
//                     <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
//                     <hr>
//                 `;
//                 bookmarksContainer.appendChild(questionDiv);
//             });
//         } catch (error) {
//             console.error('Error fetching bookmarks:', error);
//             bookmarksContainer.innerHTML = '<p>Failed to load bookmarks.</p>';
//         }
//     }

//     fetchUserProgress();
//     fetchLeaderboard();
//     fetchBookmarks();
// });

// document.addEventListener('DOMContentLoaded', async () => {
//     // Check if the user is authenticated before doing anything
//     const token = localStorage.getItem('token');
//     const userId = localStorage.getItem('userId');
//     if (!token || !userId) {
//         alert('You must be logged in to view the dashboard.');
//         window.location.href = 'auth.html';
//         return;
//     }

//     const progressTableBody = document.getElementById('progress-table').querySelector('tbody');
//     const leaderboardTableBody = document.getElementById('leaderboard-table').querySelector('tbody');
//     const bookmarksContainer = document.getElementById('bookmarks-container');

//     // Function to fetch and display user progress
//     async function fetchUserProgress() {
//         try {
//             // Note: Your server route is GET /api/user/progress (uses token for userId)
//             // not GET /api/user/progress/:userId
//             const response = await fetch(`http://localhost:3000/api/user/progress`, {
//                 headers: {
//                     'x-auth-token': token
//                 }
//             });
//             if (!response.ok) throw new Error('Could not fetch user progress.');
//             const data = await response.json();
            
//             // Clear existing rows
//             progressTableBody.innerHTML = '';
            
//             if (data.length === 0) {
//                 progressTableBody.innerHTML = '<tr><td colspan="3">No test history yet. Take a test to see your progress!</td></tr>';
//                 return;
//             }
            
//             data.forEach(item => {
//                 const row = progressTableBody.insertRow();
//                 row.insertCell(0).textContent = new Date(item.date).toLocaleDateString();
//                 row.insertCell(1).textContent = `${item.score} / ${item.totalQuestions}`;
//                 row.insertCell(2).textContent = item.totalQuestions;
//             });
//         } catch (error) {
//             console.error('Error fetching progress:', error);
//             progressTableBody.innerHTML = '<tr><td colspan="3">Failed to load progress.</td></tr>';
//         }
//     }

//     // Function to fetch and display leaderboard
//     async function fetchLeaderboard() {
//         try {
//             const response = await fetch('http://localhost:3000/api/leaderboard');
//             if (!response.ok) throw new Error('Could not fetch leaderboard.');
//             const data = await response.json();
            
//             // Clear existing rows
//             leaderboardTableBody.innerHTML = '';
            
//             if (data.length === 0) {
//                 leaderboardTableBody.innerHTML = '<tr><td colspan="4">No leaderboard data available.</td></tr>';
//                 return;
//             }
            
//             data.forEach((item, index) => {
//                 const row = leaderboardTableBody.insertRow();
//                 row.insertCell(0).textContent = index + 1;
//                 row.insertCell(1).textContent = item._id || 'Anonymous';
//                 row.insertCell(2).textContent = item.totalScore;
//                 row.insertCell(3).textContent = item.totalTests;
//             });
//         } catch (error) {
//             console.error('Error fetching leaderboard:', error);
//             leaderboardTableBody.innerHTML = '<tr><td colspan="4">Failed to load leaderboard.</td></tr>';
//         }
//     }

//     // Function to fetch and display bookmarks
//     async function fetchBookmarks() {
//         try {
//             console.log('Fetching bookmarks...'); // Debug log
            
//             const response = await fetch('http://localhost:3000/api/bookmarks', {
//                 headers: {
//                     'x-auth-token': token,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('Bookmark response status:', response.status); // Debug log
            
//             if (!response.ok) {
//                 const errorText = await response.text();
//                 console.error('Bookmark fetch error:', errorText);
//                 throw new Error(`HTTP ${response.status}: Could not fetch bookmarks`);
//             }
            
//             const bookmarks = await response.json();
//             console.log('Received bookmarks:', bookmarks); // Debug log
            
//             displayBookmarks(bookmarks);
            
//         } catch (error) {
//             console.error('Error fetching bookmarks:', error);
//             bookmarksContainer.innerHTML = `
//                 <div style="padding: 2rem; text-align: center; color: #dc3545;">
//                     <i class="fa-solid fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
//                     <p><strong>Failed to load bookmarks</strong></p>
//                     <p style="font-size: 0.9rem; opacity: 0.8;">${error.message}</p>
//                     <button onclick="location.reload()" class="btn" style="margin-top: 1rem;">
//                         <i class="fa-solid fa-refresh"></i> Retry
//                     </button>
//                 </div>
//             `;
//         }
//     }

//     // Function to display bookmarks with better styling
//     function displayBookmarks(bookmarks) {
//     bookmarksContainer.innerHTML = '';
    
//     if (!bookmarks || bookmarks.length === 0) {
//         bookmarksContainer.innerHTML = `
//             <div style="text-align: center; padding: 3rem; color: #666;">
//                 <i class="fa-solid fa-bookmark" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
//                 <h3 style="margin-bottom: 0.5rem;">No Bookmarks Yet</h3>
//                 <p style="margin-bottom: 1.5rem;">Questions you bookmark will appear here for easy access.</p>
//                 <a href="mcq.html" class="btn">
//                     <i class="fa-solid fa-search"></i> Browse Questions
//                 </a>
//             </div>
//         `;
//         return;
//     }

//     const bookmarksHtml = bookmarks.map((bookmark, index) => {
//         const question = bookmark.mcqId;
        
//         if (!question) {
//             console.warn('MCQ data missing for bookmark:', bookmark);
//             return '';
//         }

//         // Format exam and year
//         const examYearDisplay = formatExamYear(question.exam, question.year);

//         return `
//             <div class="card bookmark-item" style="margin-bottom: 1rem; padding: 1.5rem;">
//                 <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
//                     <span style="font-weight: bold; color: #666;">Q${index + 1}</span>
//                     <button onclick="removeBookmark('${question._id}')" 
//                             style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.9rem;">
//                         <i class="fa-solid fa-trash"></i> Remove
//                     </button>
//                 </div>
                
//                 <div class="bookmark-question-content">
//                     <div style="margin-bottom: 1rem; font-size: 1.1rem; line-height: 1.5;">
//                         <strong>Question:</strong> ${question.question}
//                     </div>
                    
//                     ${question.questionImage?.url ? `
//                         <div class="bookmark-question-image" style="margin: 1rem 0; text-align: center;">
//                             <img src="${question.questionImage.url}" 
//                                  alt="${question.questionImage.description || 'Question image'}" 
//                                  class="bookmark-mcq-image"
//                                  loading="lazy"
//                                  onclick="openImageModal('${question.questionImage.url}', '${question.questionImage.description || 'Question image'}')">
//                             <div class="image-expand-hint" style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">
//                                 <i class="fa-solid fa-expand"></i> Click to enlarge
//                             </div>
//                         </div>
//                     ` : ''}
//                 </div>
                
//                 <div style="display: grid; gap: 0.5rem; margin-bottom: 1rem;">
//                     ${Object.entries(question.options || {}).map(([key, value]) => `
//                         <div class="bookmark-option" style="padding: 0.75rem; border-radius: 4px; background: ${key === question.correctAnswer ? '#d4edda' : '#f8f9fa'}; border-left: 3px solid ${key === question.correctAnswer ? '#28a745' : '#dee2e6'};">
//                             <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
//                                 <span style="font-weight: bold; margin-right: 0.5rem; min-width: 20px;">${key}.</span>
//                                 <div style="flex: 1;">
//                                     <span>${value}</span>
//                                     ${key === question.correctAnswer ? '<span style="color: #28a745; font-weight: bold; margin-left: 0.5rem;">✓ Correct</span>' : ''}
                                    
//                                     ${question.optionImages?.[key]?.url ? `
//                                         <div class="bookmark-option-image" style="margin-top: 0.5rem;">
//                                             <img src="${question.optionImages[key].url}" 
//                                                  alt="${question.optionImages[key].description || `Option ${key} image`}" 
//                                                  class="bookmark-mcq-image option-img"
//                                                  loading="lazy"
//                                                  onclick="openImageModal('${question.optionImages[key].url}', '${question.optionImages[key].description || `Option ${key} image`}')">
//                                         </div>
//                                     ` : ''}
//                                 </div>
//                             </div>
//                         </div>
//                     `).join('')}
//                 </div>
                
//                 ${question.explanation ? `
//                     <div style="background: #e7f3ff; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;">
//                         <div style="font-weight: bold; margin-bottom: 0.5rem;">
//                             <i class="fa-solid fa-lightbulb"></i> Explanation
//                         </div>
//                         <div>${question.explanation}</div>
                        
//                         ${question.explanationImage?.url ? `
//                             <div class="bookmark-explanation-image" style="margin-top: 1rem; text-align: center;">
//                                 <img src="${question.explanationImage.url}" 
//                                      alt="${question.explanationImage.description || 'Explanation image'}" 
//                                      class="bookmark-mcq-image"
//                                      loading="lazy"
//                                      onclick="openImageModal('${question.explanationImage.url}', '${question.explanationImage.description || 'Explanation image'}')">
//                             </div>
//                         ` : ''}
//                     </div>
//                 ` : ''}
                
//                 <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.9rem; color: #666;">
//                     <span><i class="fa-solid fa-book"></i> ${question.subject || 'Unknown Subject'}</span>
//                     <span><i class="fa-solid fa-tag"></i> ${question.topic || 'Unknown Topic'}</span>
//                     ${examYearDisplay ? `<span><i class="fa-solid fa-calendar-check"></i> ${examYearDisplay}</span>` : ''}
//                 </div>
//             </div>
//         `;
//         }).filter(html => html !== '').join('');

//         bookmarksContainer.innerHTML = bookmarksHtml;
//     }

//     // Function to remove bookmark
//     window.removeBookmark = async function(questionId) {
//         if (!confirm('Are you sure you want to remove this bookmark?')) {
//             return;
//         }

//         try {
//             console.log('Removing bookmark for question:', questionId); // Debug log
            
//             const response = await fetch(`http://localhost:3000/api/bookmarks/${questionId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'x-auth-token': token,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             console.log('Delete response status:', response.status); // Debug log
            
//             const result = await response.json();
            
//             if (response.ok) {
//                 alert(result.message || 'Bookmark removed successfully!');
//                 fetchBookmarks(); // Reload bookmarks
//             } else {
//                 alert(result.message || 'Failed to remove bookmark.');
//             }
//         } catch (error) {
//             console.error('Remove bookmark error:', error);
//             alert('Failed to remove bookmark. Please try again.');
//         }
//     };

//     // Helper function to format exam and year
//     function formatExamYear(exam, year) {
//         if (exam && year) {
//             return `${exam} ${year}`;
//         } else if (exam) {
//             return exam;
//         } else if (year) {
//             return year.toString();
//         }
//         return '';
//     }

//     // Initialize dashboard
//     fetchUserProgress();
//     fetchLeaderboard();
//     fetchBookmarks();
// });

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        alert('You must be logged in to view the dashboard.');
        window.location.href = 'auth.html';
        return;
    }

    // Fixed API URL configuration (same as auth.js)
    const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/api'
        : 'https://your-domain.com/api';

    console.log('Dashboard API Base URL:', API_BASE_URL);

    // Update user greeting
    updateUserGreeting();

    // Get DOM elements
    const recentTestsContainer = document.getElementById('recent-tests');
    const leaderboardContainer = document.getElementById('leaderboard-container');
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const studyRecommendations = document.getElementById('study-recommendations');

    // Stat elements
    const totalQuestionsEl = document.getElementById('total-questions');
    const totalScoreEl = document.getElementById('total-score');
    const avgAccuracyEl = document.getElementById('avg-accuracy');
    const totalTestsEl = document.getElementById('total-tests');

    // Update user greeting
    function updateUserGreeting() {
        const userNameEl = document.getElementById('user-name');
        const firstName = localStorage.getItem('firstName');
        const fullName = localStorage.getItem('fullName');
        const username = localStorage.getItem('username');
        
        const displayName = firstName || fullName || username || 'Student';
        if (userNameEl) {
            userNameEl.textContent = displayName;
        }
    }

    // Fetch user test history (replaces old progress function)
    async function fetchUserTestHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/user/test-history`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Could not fetch test history`);
            }

            const testHistory = await response.json();
            console.log('Test history:', testHistory);
            
            displayRecentTests(testHistory);
            updateStatsFromHistory(testHistory);
            updatePerformanceChart(testHistory);
            
        } catch (error) {
            console.error('Error fetching test history:', error);
            if (recentTestsContainer) {
                recentTestsContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load test history</p>
                        <button onclick="location.reload()" class="btn-sm">Retry</button>
                    </div>
                `;
            }
        }
    }

    // Display recent tests
    function displayRecentTests(tests) {
        if (!recentTestsContainer) return;

        if (!tests || tests.length === 0) {
            recentTestsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No tests taken yet</p>
                    <a href="test.html" class="btn-sm">Take Your First Test</a>
                </div>
            `;
            return;
        }

        const recentTests = tests.slice(0, 5); // Show last 5 tests
        
        const testsHtml = recentTests.map(test => `
            <div class="test-item">
                <div class="test-info">
                    <h4>${test.testName}</h4>
                    <div class="test-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(test.completedAt)}</span>
                        <span><i class="fas fa-clock"></i> ${formatTime(test.timeTaken || 0)}</span>
                    </div>
                </div>
                <div class="test-results">
                    <div class="score">${test.score}/${test.totalQuestions}</div>
                    <div class="accuracy ${getAccuracyClass(test.accuracy)}">${test.accuracy}%</div>
                </div>
            </div>
        `).join('');

        recentTestsContainer.innerHTML = testsHtml;
    }

    // Update statistics from test history
    function updateStatsFromHistory(tests) {
        if (!tests || tests.length === 0) return;

        const totalTests = tests.length;
        const totalQuestions = tests.reduce((sum, test) => sum + test.totalQuestions, 0);
        const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
        const avgAccuracy = tests.reduce((sum, test) => sum + test.accuracy, 0) / totalTests;

        // Update stat cards
        if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;
        if (totalScoreEl) totalScoreEl.textContent = totalScore;
        if (avgAccuracyEl) avgAccuracyEl.textContent = Math.round(avgAccuracy) + '%';
        if (totalTestsEl) totalTestsEl.textContent = totalTests;
    }

    // Fetch leaderboard
    async function fetchLeaderboard() {
        try {
            const response = await fetch(`${API_BASE_URL}/leaderboard`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Could not fetch leaderboard`);
            }

            const leaderboard = await response.json();
            console.log('Leaderboard:', leaderboard);
            
            displayLeaderboard(leaderboard);
            
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            if (leaderboardContainer) {
                leaderboardContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load leaderboard</p>
                    </div>
                `;
            }
        }
    }

    // Display leaderboard
    function displayLeaderboard(leaderboard) {
        if (!leaderboardContainer) return;

        if (!leaderboard || leaderboard.length === 0) {
            leaderboardContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <p>No leaderboard data yet</p>
                </div>
            `;
            return;
        }

        const leaderboardHtml = leaderboard.slice(0, 10).map((entry, index) => `
            <div class="leaderboard-item ${index < 3 ? 'top-' + (index + 1) : ''}">
                <div class="rank">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${entry.username || entry.fullName || 'Anonymous'}</div>
                    <div class="player-stats">
                        ${entry.totalTests} tests • ${entry.avgAccuracy}% avg
                    </div>
                </div>
                <div class="score">${entry.totalScore}</div>
            </div>
        `).join('');

        leaderboardContainer.innerHTML = leaderboardHtml;
    }

    // Fetch bookmarks
    async function fetchBookmarks() {
        try {
            console.log('Fetching bookmarks...');
            
            const response = await fetch(`${API_BASE_URL}/bookmarks`, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Could not fetch bookmarks`);
            }
            
            const bookmarks = await response.json();
            console.log('Received bookmarks:', bookmarks);
            
            displayBookmarks(bookmarks);
            
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            if (bookmarksContainer) {
                bookmarksContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Failed to load bookmarks</p>
                        <small>${error.message}</small>
                    </div>
                `;
            }
        }
    }

    // Display bookmarks (simplified for dashboard)
    function displayBookmarks(bookmarks) {
        if (!bookmarksContainer) return;
        
        if (!bookmarks || bookmarks.length === 0) {
            bookmarksContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bookmark"></i>
                    <p>No bookmarks yet</p>
                    <a href="mcq.html" class="btn-sm">Browse Questions</a>
                </div>
            `;
            return;
        }

        // Show only first 3 bookmarks with summary
        const recentBookmarks = bookmarks.slice(0, 3);
        
        const bookmarksHtml = recentBookmarks.map((bookmark, index) => {
            const question = bookmark.mcqId;
            if (!question) return '';
            
            return `
                <div class="bookmark-preview">
                    <div class="bookmark-number">Q${index + 1}</div>
                    <div class="bookmark-content">
                        <div class="bookmark-question">${truncateText(question.question, 100)}</div>
                        <div class="bookmark-meta">
                            <span>${question.subject || 'Unknown'}</span>
                            ${question.topic ? `• ${question.topic}` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).filter(html => html !== '').join('');

        const viewAllLink = bookmarks.length > 3 ? 
            `<div class="view-all"><a href="bookmarks.html">View all ${bookmarks.length} bookmarks</a></div>` : '';

        bookmarksContainer.innerHTML = bookmarksHtml + viewAllLink;
    }

    // Generate study recommendations
    function generateStudyRecommendations(tests) {
        if (!studyRecommendations) return;
        
        if (!tests || tests.length === 0) {
            studyRecommendations.innerHTML = `
                <div class="recommendation">
                    <i class="fas fa-play-circle"></i>
                    <div>
                        <h4>Get Started</h4>
                        <p>Take your first practice test to get personalized recommendations.</p>
                        <a href="test.html" class="btn-sm">Start Testing</a>
                    </div>
                </div>
            `;
            return;
        }

        const avgAccuracy = tests.reduce((sum, test) => sum + test.accuracy, 0) / tests.length;
        const recentTests = tests.slice(0, 5);
        const recentAvg = recentTests.reduce((sum, test) => sum + test.accuracy, 0) / recentTests.length;

        let recommendations = [];

        if (avgAccuracy < 60) {
            recommendations.push({
                icon: 'fa-book',
                title: 'Focus on Fundamentals',
                description: 'Your accuracy is below 60%. Review basic concepts and take more practice tests.',
                action: 'Browse Questions',
                link: 'mcq.html'
            });
        } else if (avgAccuracy < 80) {
            recommendations.push({
                icon: 'fa-target',
                title: 'Improve Accuracy',
                description: 'You\'re doing well! Focus on areas where you make mistakes most often.',
                action: 'Take Mock Test',
                link: 'test.html'
            });
        } else {
            recommendations.push({
                icon: 'fa-trophy',
                title: 'Challenge Yourself',
                description: 'Excellent work! Try timed tests and advanced topics to stay sharp.',
                action: 'Advanced Tests',
                link: 'test.html'
            });
        }

        if (recentAvg < avgAccuracy - 10) {
            recommendations.push({
                icon: 'fa-chart-line',
                title: 'Review Recent Mistakes',
                description: 'Your recent performance has declined. Review your bookmarked questions.',
                action: 'View Bookmarks',
                link: 'bookmarks.html'
            });
        }

        const recommendationsHtml = recommendations.map(rec => `
            <div class="recommendation">
                <i class="fas ${rec.icon}"></i>
                <div>
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <a href="${rec.link}" class="btn-sm">${rec.action}</a>
                </div>
            </div>
        `).join('');

        studyRecommendations.innerHTML = recommendationsHtml;
    }

    // Update performance chart
    function updatePerformanceChart(tests) {
        const canvas = document.getElementById('performance-chart');
        if (!canvas || !tests || tests.length === 0) return;

        const ctx = canvas.getContext('2d');
        
        // Get last 10 tests for the chart
        const recentTests = tests.slice(-10).reverse();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: recentTests.map((_, index) => `Test ${recentTests.length - index}`),
                datasets: [{
                    label: 'Accuracy %',
                    data: recentTests.map(test => test.accuracy),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }

    function getAccuracyClass(accuracy) {
        if (accuracy >= 80) return 'excellent';
        if (accuracy >= 60) return 'good';
        return 'needs-improvement';
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // Initialize dashboard
    try {
        await Promise.all([
            fetchUserTestHistory(),
            fetchLeaderboard(),
            fetchBookmarks()
        ]);
        
        // Generate recommendations after test history is loaded
        const tests = await fetch(`${API_BASE_URL}/user/test-history`, {
            headers: { 'x-auth-token': token }
        }).then(r => r.json()).catch(() => []);
        
        generateStudyRecommendations(tests);
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
    }
});