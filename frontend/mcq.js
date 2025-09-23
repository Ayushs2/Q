
// document.addEventListener("DOMContentLoaded", async () => {
//   const mcqContainer = document.getElementById("mcq-container");
//   const subjectFilter = document.getElementById("subject-filter");
//   const topicFilter = document.getElementById("topic-filter");
//   const examFilter = document.getElementById("exam-filter");
//   const yearRange = document.getElementById("year-range");
//   const yearLabel = document.getElementById("year-label");
//   const yearMinLabel = document.getElementById("year-min-label");
//   const yearMaxLabel = document.getElementById("year-max-label");
//   const sortFilter = document.getElementById("sort-filter");
//   const searchBox = document.getElementById("search-box");
//   const filterResults = document.getElementById("filter-results");

//   let allQuestions = [];
//   let filteredQuestions = [];
//   let availableYears = { min: 2000, max: 2025 };

//   // Toggle filter panel
//   document.querySelector(".filter-toggle").addEventListener("click", () => {
//     document.getElementById("filter-panel").classList.toggle("hidden");
//   });

//   // Fetch all questions from backend
//   async function fetchQuestions() {
//     try {
//       showLoadingState();
      
//       const response = await fetch("http://localhost:3000/api/mcqs");
//       if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
//       allQuestions = await response.json();
      
//       // Log the data structure for debugging
//       console.log("Sample question structure:", allQuestions[0]);
      
//       populateFilters(allQuestions);
//       applyFilters();
      
//     } catch (err) {
//       console.error("Fetch error:", err);
//       showErrorState("Failed to load questions. Please check your connection and try again.");
//     }
//   }

//   // Fetch filter metadata (exams and year ranges)
//   async function fetchFilterMetadata() {
//     try {
//       const response = await fetch("http://localhost:3000/api/exams-meta");
//       if (response.ok) {
//         const metadata = await response.json();
//         return metadata;
//       }
//     } catch (err) {
//       console.warn("Could not fetch metadata:", err);
//     }
//     return null;
//   }

//   // Populate filter dropdowns
//   function populateFilters(questions) {
//     function fillSelect(select, values, defaultText) {
//       // Keep only the first default option
//       select.innerHTML = `<option value="">${defaultText}</option>`;
//       [...new Set(values)].sort().forEach((value) => {
//         if (value) { // Only add non-empty values
//           const opt = document.createElement("option");
//           opt.value = value;
//           opt.textContent = value;
//           select.appendChild(opt);
//         }
//       });
//     }

//     // Extract unique values
//     const subjects = questions.map(q => q.subject).filter(Boolean);
//     const topics = questions.map(q => q.topic).filter(Boolean);
//     const exams = questions.map(q => q.exam).filter(Boolean);
//     const years = questions.map(q => q.year).filter(Boolean);

//     // Populate dropdowns
//     fillSelect(subjectFilter, subjects, "All Subjects");
//     fillSelect(topicFilter, topics, "All Topics");
//     fillSelect(examFilter, exams, "All Exams");

//     // Setup year range slider
//     if (years.length > 0) {
//       availableYears.min = Math.min(...years);
//       availableYears.max = Math.max(...years);
      
//       yearRange.min = availableYears.min;
//       yearRange.max = availableYears.max;
//       yearRange.value = availableYears.max;
      
//       if (yearMinLabel) yearMinLabel.textContent = availableYears.min;
//       if (yearMaxLabel) yearMaxLabel.textContent = availableYears.max;
//       yearLabel.textContent = `Up to ${availableYears.max}`;
//     } else {
//       // Fallback if no years available
//       yearRange.min = 2000;
//       yearRange.max = 2025;
//       yearRange.value = 2025;
//       if (yearMinLabel) yearMinLabel.textContent = "2000";
//       if (yearMaxLabel) yearMaxLabel.textContent = "2025";
//       yearLabel.textContent = "Up to 2025";
//     }
//   }

//   // Apply all filters
//   function applyFilters() {
//     const filters = {
//       subject: subjectFilter.value,
//       topic: topicFilter.value,
//       exam: examFilter.value,
//       yearMax: parseInt(yearRange.value),
//       search: searchBox.value.toLowerCase().trim(),
//       sort: sortFilter.value
//     };

//     // Update year label
//     yearLabel.textContent = `Up to ${filters.yearMax}`;

//     // Filter questions
//     filteredQuestions = allQuestions.filter((question) => {
//       // Subject filter
//       if (filters.subject && question.subject !== filters.subject) {
//         return false;
//       }

//       // Topic filter
//       if (filters.topic && question.topic !== filters.topic) {
//         return false;
//       }

//       // Exam filter
//       if (filters.exam && question.exam !== filters.exam) {
//         return false;
//       }

//       // Year filter
//       if (question.year && question.year > filters.yearMax) {
//         return false;
//       }

//       // Search filter
//       if (filters.search) {
//         const searchableText = [
//           question.question,
//           question.explanation,
//           question.subject,
//           question.topic,
//           question.exam,
//           ...Object.values(question.options || {})
//         ].join(' ').toLowerCase();

//         if (!searchableText.includes(filters.search)) {
//           return false;
//         }
//       }

//       return true;
//     });

//     // Apply sorting
//     applySorting(filters.sort);

//     // Update display
//     displayQuestions(filteredQuestions);
//     updateFilterStats();
//   }

//   // Apply sorting to filtered questions
//   function applySorting(sortType) {
//     switch (sortType) {
//       case 'oldest':
//         filteredQuestions.sort((a, b) => (a.year || 0) - (b.year || 0));
//         break;
//       case 'year:desc':
//         filteredQuestions.sort((a, b) => (b.year || 0) - (a.year || 0));
//         break;
//       case 'year:asc':
//         filteredQuestions.sort((a, b) => (a.year || 0) - (b.year || 0));
//         break;
//       case 'subject:asc':
//         filteredQuestions.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
//         break;
//       case 'exam:asc':
//         filteredQuestions.sort((a, b) => (a.exam || '').localeCompare(b.exam || ''));
//         break;
//       case 'random':
//         filteredQuestions.sort(() => Math.random() - 0.5);
//         break;
//       case 'newest':
//       default:
//         filteredQuestions.sort((a, b) => (b.year || 9999) - (a.year || 9999));
//         break;
//     }
//   }

//   // Render questions in the container
//   function displayQuestions(questions) {
//     if (!questions.length) {
//       showEmptyState();
//       return;
//     }

//     const token = localStorage.getItem("token");
//     const questionsHtml = questions.map((question, index) => 
//       createQuestionHtml(question, index + 1, token)
//     ).join('');

//     mcqContainer.innerHTML = questionsHtml;
//     setupQuestionInteractions();
    
//     // Re-render MathJax for equations
//     if (window.MathJax && window.MathJax.typesetPromise) {
//       MathJax.typesetPromise([mcqContainer]).catch(err => {
//         console.warn('MathJax typeset failed:', err.message);
//       });
//     }
//   }

//   // REPLACE your current createQuestionHtml function with this enhanced version:

// function createQuestionHtml(question, questionNumber, token) {
//   const examYearDisplay = formatExamYear(question.exam, question.year);
  
//   return `
//     <div class="card question-card" data-question-id="${question._id}">
//       <div class="question-header">
//         <span class="question-number">Q${questionNumber}</span>
//       </div>
      
//       <div class="question-content">
//         <div class="question-text">
//           ${question.question}
//         </div>
//         ${question.questionImage?.url ? `
//           <div class="question-image">
//             <img src="${question.questionImage.url}" 
//                  alt="${question.questionImage.description || 'Question image'}" 
//                  class="mcq-image"
//                  loading="lazy"
//                  onclick="openImageModal('${question.questionImage.url}', '${question.questionImage.description || 'Question image'}')">
//             <div class="image-expand-hint">
//               <i class="fa-solid fa-expand"></i> Click to enlarge
//             </div>
//           </div>
//         ` : ''}
//       </div>
      
//       <ul class="options-list" data-question-id="${question._id}">
//         ${Object.entries(question.options || {}).map(([key, value]) => `
//           <li class="option" data-option="${key}" data-question-id="${question._id}">
//             <div class="option-content">
//               <span class="option-letter">${key}.</span>
//               <div class="option-text-container">
//                 <span class="option-text">${value}</span>
//                 ${question.optionImages?.[key]?.url ? `
//                   <div class="option-image">
//                     <img src="${question.optionImages[key].url}" 
//                          alt="${question.optionImages[key].description || `Option ${key} image`}" 
//                          class="mcq-image option-img"
//                          loading="lazy"
//                          onclick="openImageModal('${question.optionImages[key].url}', '${question.optionImages[key].description || `Option ${key} image`}')">
//                   </div>
//                 ` : ''}
//               </div>
//             </div>
//           </li>
//         `).join('')}
//       </ul>
      
//       <div class="explanation" style="display: none;">
//         <div class="explanation-header">
//           <i class="fa-solid fa-lightbulb"></i>
//           <strong>Explanation</strong>
//         </div>
//         <div class="explanation-content">
//           ${question.explanation || 'No explanation provided.'}
//           ${question.explanationImage?.url ? `
//             <div class="explanation-image">
//               <img src="${question.explanationImage.url}" 
//                    alt="${question.explanationImage.description || 'Explanation image'}" 
//                    class="mcq-image"
//                    loading="lazy"
//                    onclick="openImageModal('${question.explanationImage.url}', '${question.explanationImage.description || 'Explanation image'}')">
//             </div>
//           ` : ''}
//         </div>
//       </div>
      
//       <div class="question-meta">
//         <span class="meta-tag">
//           <i class="fa-solid fa-book"></i> ${question.subject || 'Unknown Subject'}
//         </span>
//         <span class="meta-tag">
//           <i class="fa-solid fa-tag"></i> ${question.topic || 'Unknown Topic'}
//         </span>
//         ${examYearDisplay ? `
//           <span class="meta-tag exam-year-tag">
//             <i class="fa-solid fa-calendar-check"></i> ${examYearDisplay}
//           </span>
//         ` : ''}
//       </div>
      
//       <div class="q-footer">
//         ${token ? `
//           <button class="bookmark-button" onclick="bookmarkQuestion('${question._id}')">
//             <i class="fa-solid fa-bookmark"></i> Bookmark
//           </button>
//         ` : ''}
//       </div>
//     </div>
//   `;
// }

//   // Format exam and year for display
//   function formatExamYear(exam, year) {
//     if (exam && year) {
//       return `${exam} ${year}`;
//     } else if (exam) {
//       return exam;
//     } else if (year) {
//       return year.toString();
//     }
//     return '';
//   }

//   // Setup click interactions for questions
//   function setupQuestionInteractions() {
//     const options = document.querySelectorAll('.option');
    
//     options.forEach(option => {
//       option.addEventListener('click', function() {
//         const questionId = this.dataset.questionId;
//         const selectedOption = this.dataset.option;
//         const question = allQuestions.find(q => q._id === questionId);
        
//         if (!question) {
//           console.error('Question not found:', questionId);
//           return;
//         }
        
//         handleOptionClick(this, question, selectedOption);
//       });
//     });
//   }

//   // Handle option click and show result
//   function handleOptionClick(clickedOption, question, selectedOption) {
//     const questionCard = clickedOption.closest('.question-card');
//     const optionsList = questionCard.querySelector('.options-list');
//     const allOptions = optionsList.querySelectorAll('.option');
//     const explanationDiv = questionCard.querySelector('.explanation');
    
//     // Disable further clicks on this question
//     allOptions.forEach(opt => {
//       opt.style.pointerEvents = 'none';
//       opt.classList.remove('correct', 'incorrect', 'selected');
//     });
    
//     // Mark selected option
//     clickedOption.classList.add('selected');
    
//     // Show correct/incorrect results
//     if (selectedOption === question.correctAnswer) {
//       clickedOption.classList.add('correct');
//     } else {
//       clickedOption.classList.add('incorrect');
      
//       // Highlight the correct answer
//       const correctOption = optionsList.querySelector(`[data-option="${question.correctAnswer}"]`);
//       if (correctOption) {
//         correctOption.classList.add('correct');
//       }
//     }
    
//     // Show explanation
//     explanationDiv.style.display = 'block';
    
//     // Re-render MathJax for the explanation
//     if (window.MathJax && window.MathJax.typesetPromise) {
//       MathJax.typesetPromise([explanationDiv]).catch(err => {
//         console.warn('MathJax typeset failed:', err.message);
//       });
//     }
//   }

//   // Bookmark a question
//   window.bookmarkQuestion = async function(questionId) {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login to bookmark questions.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/api/bookmarks", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-auth-token": token,
//         },
//         body: JSON.stringify({ mcqId: questionId }),
//       });

//       const result = await response.json();
      
//       if (response.ok) {
//         alert(result.message || "Question bookmarked successfully!");
//       } else {
//         alert(result.message || "Failed to bookmark question.");
//       }
//     } catch (error) {
//       console.error("Bookmark error:", error);
//       alert("Failed to bookmark question. Please try again.");
//     }
//   };

//   // Update filter statistics
//   function updateFilterStats() {
//     if (!filterResults) return;
    
//     const total = allQuestions.length;
//     const filtered = filteredQuestions.length;
    
//     if (filtered === total) {
//       filterResults.textContent = `Showing all ${total} questions`;
//     } else {
//       filterResults.textContent = `Showing ${filtered} of ${total} questions`;
//     }
//   }

//   // Show loading state
//   function showLoadingState() {
//     mcqContainer.innerHTML = `
//       <div class="card">
//         <p class="hint">
//           <i class="fa-solid fa-spinner fa-spin"></i> Loading questions...
//         </p>
//       </div>
//     `;
//   }

//   // Show empty state when no questions match filters
//   function showEmptyState() {
//     mcqContainer.innerHTML = `
//       <div class="card">
//         <p class="hint">
//           <i class="fa-solid fa-search"></i> No questions found matching your filters.
//           <br><small>Try adjusting your search criteria or clearing some filters.</small>
//         </p>
//       </div>
//     `;
//   }

//   // Show error state
//   function showErrorState(message) {
//     mcqContainer.innerHTML = `
//       <div class="card">
//         <p class="hint" style="color: var(--danger, #dc3545);">
//           <i class="fa-solid fa-exclamation-triangle"></i> ${message}
//           <br><button onclick="location.reload()" class="btn" style="margin-top: 1rem;">
//             <i class="fa-solid fa-refresh"></i> Retry
//           </button>
//         </p>
//       </div>
//     `;
//   }

//   // Event listeners for filters
//   [subjectFilter, topicFilter, examFilter, sortFilter].forEach(element => {
//     if (element) {
//       element.addEventListener("change", applyFilters);
//     }
//   });

//   if (yearRange) {
//     yearRange.addEventListener("input", applyFilters);
//   }

//   if (searchBox) {
//     // Debounce search input
//     let searchTimeout;
//     searchBox.addEventListener("input", () => {
//       clearTimeout(searchTimeout);
//       searchTimeout = setTimeout(applyFilters, 300);
//     });
//   }

//   // Initialize the app
//   fetchQuestions();
// });

// // Image modal functionality
// function openImageModal(imageUrl, description) {
//   let modal = document.getElementById('image-modal');
//   if (!modal) {
//     modal = document.createElement('div');
//     modal.id = 'image-modal';
//     modal.className = 'image-modal';
//     modal.innerHTML = `
//       <div class="image-modal-overlay" onclick="closeImageModal()">
//         <div class="image-modal-content" onclick="event.stopPropagation()">
//           <button class="image-modal-close" onclick="closeImageModal()">&times;</button>
//           <img class="image-modal-img" alt="">
//           <div class="image-modal-description"></div>
//           <div class="image-modal-controls">
//             <button onclick="downloadImage()" class="image-modal-btn">
//               <i class="fa-solid fa-download"></i> Download
//             </button>
//             <button onclick="closeImageModal()" class="image-modal-btn">
//               <i class="fa-solid fa-times"></i> Close
//             </button>
//           </div>
//         </div>
//       </div>
//     `;
//     document.body.appendChild(modal);
//   }
  
//   const img = modal.querySelector('.image-modal-img');
//   const desc = modal.querySelector('.image-modal-description');
  
//   img.src = imageUrl;
//   img.alt = description;
//   desc.textContent = description;
  
//   modal.style.display = 'flex';
//   document.body.style.overflow = 'hidden';
  
//   modal.currentImageUrl = imageUrl;
// }

// function closeImageModal() {
//   const modal = document.getElementById('image-modal');
//   if (modal) {
//     modal.style.display = 'none';
//     document.body.style.overflow = '';
//   }
// }

// function downloadImage() {
//   const modal = document.getElementById('image-modal');
//   if (modal && modal.currentImageUrl) {
//     const link = document.createElement('a');
//     link.href = modal.currentImageUrl;
//     link.download = 'mcq-image.jpg';
//     link.click();
//   }
// }


// // Close modal on Escape key
// document.addEventListener('keydown', function(e) {
//   if (e.key === 'Escape') {
//     closeImageModal();
//   }
// });

document.addEventListener("DOMContentLoaded", async () => {
  // Fixed API URL configuration (same as auth.js and dashboard.js)
  const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:3000/api'
      : 'https://your-domain.com/api';

  console.log('MCQ API Base URL:', API_BASE_URL);

  const mcqContainer = document.getElementById("mcq-container");
  const subjectFilter = document.getElementById("subject-filter");
  const topicFilter = document.getElementById("topic-filter");
  const examFilter = document.getElementById("exam-filter");
  const yearRange = document.getElementById("year-range");
  const yearLabel = document.getElementById("year-label");
  const yearMinLabel = document.getElementById("year-min-label");
  const yearMaxLabel = document.getElementById("year-max-label");
  const sortFilter = document.getElementById("sort-filter");
  const searchBox = document.getElementById("search-box");
  const filterResults = document.getElementById("filter-results");

  let allQuestions = [];
  let filteredQuestions = [];
  let availableYears = { min: 2000, max: 2025 };

  // Toggle filter panel
  document.querySelector(".filter-toggle").addEventListener("click", () => {
    document.getElementById("filter-panel").classList.toggle("hidden");
  });

  // Fetch all questions from backend
  async function fetchQuestions() {
    try {
      showLoadingState();
      
      const response = await fetch(`${API_BASE_URL}/mcqs`);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      allQuestions = await response.json();
      
      // Log the data structure for debugging
      console.log("Fetched questions:", allQuestions.length);
      if (allQuestions.length > 0) {
        console.log("Sample question structure:", allQuestions[0]);
      }
      
      populateFilters(allQuestions);
      applyFilters();
      
    } catch (err) {
      console.error("Fetch error:", err);
      showErrorState("Failed to load questions. Please check your connection and try again.");
    }
  }

  // Fetch filter metadata (exams and year ranges)
  async function fetchFilterMetadata() {
    try {
      const response = await fetch(`${API_BASE_URL}/exams-meta`);
      if (response.ok) {
        const metadata = await response.json();
        return metadata;
      }
    } catch (err) {
      console.warn("Could not fetch metadata:", err);
    }
    return null;
  }

  // Populate filter dropdowns
  function populateFilters(questions) {
    function fillSelect(select, values, defaultText) {
      // Keep only the first default option
      select.innerHTML = `<option value="">${defaultText}</option>`;
      [...new Set(values)].sort().forEach((value) => {
        if (value) { // Only add non-empty values
          const opt = document.createElement("option");
          opt.value = value;
          opt.textContent = value;
          select.appendChild(opt);
        }
      });
    }

    // Extract unique values
    const subjects = questions.map(q => q.subject).filter(Boolean);
    const topics = questions.map(q => q.topic).filter(Boolean);
    const exams = questions.map(q => q.exam).filter(Boolean);
    const years = questions.map(q => q.year).filter(Boolean);

    // Populate dropdowns
    fillSelect(subjectFilter, subjects, "All Subjects");
    fillSelect(topicFilter, topics, "All Topics");
    fillSelect(examFilter, exams, "All Exams");

    // Setup year range slider
    if (years.length > 0) {
      availableYears.min = Math.min(...years);
      availableYears.max = Math.max(...years);
      
      yearRange.min = availableYears.min;
      yearRange.max = availableYears.max;
      yearRange.value = availableYears.max;
      
      if (yearMinLabel) yearMinLabel.textContent = availableYears.min;
      if (yearMaxLabel) yearMaxLabel.textContent = availableYears.max;
      yearLabel.textContent = `Up to ${availableYears.max}`;
    } else {
      // Fallback if no years available
      yearRange.min = 2000;
      yearRange.max = 2025;
      yearRange.value = 2025;
      if (yearMinLabel) yearMinLabel.textContent = "2000";
      if (yearMaxLabel) yearMaxLabel.textContent = "2025";
      yearLabel.textContent = "Up to 2025";
    }
  }

  // Apply all filters
  function applyFilters() {
    const filters = {
      subject: subjectFilter.value,
      topic: topicFilter.value,
      exam: examFilter.value,
      yearMax: parseInt(yearRange.value),
      search: searchBox.value.toLowerCase().trim(),
      sort: sortFilter.value
    };

    // Update year label
    yearLabel.textContent = `Up to ${filters.yearMax}`;

    // Filter questions
    filteredQuestions = allQuestions.filter((question) => {
      // Subject filter
      if (filters.subject && question.subject !== filters.subject) {
        return false;
      }

      // Topic filter
      if (filters.topic && question.topic !== filters.topic) {
        return false;
      }

      // Exam filter
      if (filters.exam && question.exam !== filters.exam) {
        return false;
      }

      // Year filter
      if (question.year && question.year > filters.yearMax) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchableText = [
          question.question,
          question.explanation,
          question.subject,
          question.topic,
          question.exam,
          ...Object.values(question.options || {})
        ].join(' ').toLowerCase();

        if (!searchableText.includes(filters.search)) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    applySorting(filters.sort);

    // Update display
    displayQuestions(filteredQuestions);
    updateFilterStats();
  }

  // Apply sorting to filtered questions
  function applySorting(sortType) {
    switch (sortType) {
      case 'oldest':
        filteredQuestions.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'year:desc':
        filteredQuestions.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'year:asc':
        filteredQuestions.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'subject:asc':
        filteredQuestions.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
        break;
      case 'exam:asc':
        filteredQuestions.sort((a, b) => (a.exam || '').localeCompare(b.exam || ''));
        break;
      case 'random':
        filteredQuestions.sort(() => Math.random() - 0.5);
        break;
      case 'newest':
      default:
        filteredQuestions.sort((a, b) => (b.year || 9999) - (a.year || 9999));
        break;
    }
  }

  // Render questions in the container
  function displayQuestions(questions) {
    if (!questions.length) {
      showEmptyState();
      return;
    }

    const token = localStorage.getItem("token");
    const questionsHtml = questions.map((question, index) => 
      createQuestionHtml(question, index + 1, token)
    ).join('');

    mcqContainer.innerHTML = questionsHtml;
    setupQuestionInteractions();
    
    // Re-render MathJax for equations
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([mcqContainer]).catch(err => {
        console.warn('MathJax typeset failed:', err.message);
      });
    }
  }

  // Enhanced createQuestionHtml function with image support
  function createQuestionHtml(question, questionNumber, token) {
    const examYearDisplay = formatExamYear(question.exam, question.year);
    
    return `
      <div class="card question-card" data-question-id="${question._id}">
        <div class="question-header">
          <span class="question-number">Q${questionNumber}</span>
        </div>
        
        <div class="question-content">
          <div class="question-text">
            ${question.question}
          </div>
          ${question.questionImage?.url ? `
            <div class="question-image">
              <img src="${question.questionImage.url}" 
                   alt="${question.questionImage.description || 'Question image'}" 
                   class="mcq-image"
                   loading="lazy"
                   onclick="openImageModal('${question.questionImage.url}', '${question.questionImage.description || 'Question image'}')">
              <div class="image-expand-hint">
                <i class="fa-solid fa-expand"></i> Click to enlarge
              </div>
            </div>
          ` : ''}
        </div>
        
        <ul class="options-list" data-question-id="${question._id}">
          ${Object.entries(question.options || {}).map(([key, value]) => `
            <li class="option" data-option="${key}" data-question-id="${question._id}">
              <div class="option-content">
                <span class="option-letter">${key}.</span>
                <div class="option-text-container">
                  <span class="option-text">${value}</span>
                  ${question.optionImages?.[key]?.url ? `
                    <div class="option-image">
                      <img src="${question.optionImages[key].url}" 
                           alt="${question.optionImages[key].description || `Option ${key} image`}" 
                           class="mcq-image option-img"
                           loading="lazy"
                           onclick="openImageModal('${question.optionImages[key].url}', '${question.optionImages[key].description || `Option ${key} image`}')">
                    </div>
                  ` : ''}
                </div>
              </div>
            </li>
          `).join('')}
        </ul>
        
        <div class="explanation" style="display: none;">
          <div class="explanation-header">
            <i class="fa-solid fa-lightbulb"></i>
            <strong>Explanation</strong>
          </div>
          <div class="explanation-content">
            ${question.explanation || 'No explanation provided.'}
            ${question.explanationImage?.url ? `
              <div class="explanation-image">
                <img src="${question.explanationImage.url}" 
                     alt="${question.explanationImage.description || 'Explanation image'}" 
                     class="mcq-image"
                     loading="lazy"
                     onclick="openImageModal('${question.explanationImage.url}', '${question.explanationImage.description || 'Explanation image'}')">
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="question-meta">
          <span class="meta-tag">
            <i class="fa-solid fa-book"></i> ${question.subject || 'Unknown Subject'}
          </span>
          <span class="meta-tag">
            <i class="fa-solid fa-tag"></i> ${question.topic || 'Unknown Topic'}
          </span>
          ${examYearDisplay ? `
            <span class="meta-tag exam-year-tag">
              <i class="fa-solid fa-calendar-check"></i> ${examYearDisplay}
            </span>
          ` : ''}
          <span class="meta-tag difficulty-${question.difficulty || 'medium'}">
            <i class="fa-solid fa-signal"></i> ${(question.difficulty || 'medium').charAt(0).toUpperCase() + (question.difficulty || 'medium').slice(1)}
          </span>
          <span class="meta-tag marks-tag">
            <i class="fa-solid fa-star"></i> ${question.marks || 1} Mark${(question.marks || 1) !== 1 ? 's' : ''}
</span>
        </div>
        
        <div class="q-footer">
          ${token ? `
            <button class="bookmark-button" onclick="bookmarkQuestion('${question._id}')">
              <i class="fa-solid fa-bookmark"></i> Bookmark
            </button>
          ` : `
            <small class="login-hint">
              <a href="auth.html">Login</a> to bookmark questions
            </small>
          `}
        </div>
      </div>
    `;
  }

  // Format exam and year for display
  function formatExamYear(exam, year) {
    if (exam && year) {
      return `${exam} ${year}`;
    } else if (exam) {
      return exam;
    } else if (year) {
      return year.toString();
    }
    return '';
  }

  // Setup click interactions for questions
  function setupQuestionInteractions() {
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        const questionId = this.dataset.questionId;
        const selectedOption = this.dataset.option;
        const question = allQuestions.find(q => q._id === questionId);
        
        if (!question) {
          console.error('Question not found:', questionId);
          return;
        }
        
        handleOptionClick(this, question, selectedOption);
      });
    });
  }

  // Handle option click and show result
  function handleOptionClick(clickedOption, question, selectedOption) {
    const questionCard = clickedOption.closest('.question-card');
    const optionsList = questionCard.querySelector('.options-list');
    const allOptions = optionsList.querySelectorAll('.option');
    const explanationDiv = questionCard.querySelector('.explanation');
    
    // Disable further clicks on this question
    allOptions.forEach(opt => {
      opt.style.pointerEvents = 'none';
      opt.classList.remove('correct', 'incorrect', 'selected');
    });
    
    // Mark selected option
    clickedOption.classList.add('selected');
    
    // Show correct/incorrect results
    if (selectedOption === question.correctAnswer) {
      clickedOption.classList.add('correct');
    } else {
      clickedOption.classList.add('incorrect');
      
      // Highlight the correct answer
      const correctOption = optionsList.querySelector(`[data-option="${question.correctAnswer}"]`);
      if (correctOption) {
        correctOption.classList.add('correct');
      }
    }
    
    // Show explanation
    explanationDiv.style.display = 'block';
    
    // Re-render MathJax for the explanation
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([explanationDiv]).catch(err => {
        console.warn('MathJax typeset failed:', err.message);
      });
    }
  }

  // Bookmark a question (fixed API URL)
  window.bookmarkQuestion = async function(questionId) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to bookmark questions.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bookmarks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ mcqId: questionId }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message || "Question bookmarked successfully!");
        
        // Update the bookmark button to show it's bookmarked
        const button = document.querySelector(`button[onclick="bookmarkQuestion('${questionId}')"]`);
        if (button) {
          button.innerHTML = '<i class="fa-solid fa-check"></i> Bookmarked';
          button.style.background = '#28a745';
          button.style.pointerEvents = 'none';
        }
      } else {
        alert(result.message || "Failed to bookmark question.");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Failed to bookmark question. Please try again.");
    }
  };

  // Update filter statistics
  function updateFilterStats() {
    if (!filterResults) return;
    
    const total = allQuestions.length;
    const filtered = filteredQuestions.length;
    
    if (filtered === total) {
      filterResults.textContent = `Showing all ${total} questions`;
    } else {
      filterResults.textContent = `Showing ${filtered} of ${total} questions`;
    }
  }

  // Show loading state
  function showLoadingState() {
    mcqContainer.innerHTML = `
      <div class="card">
        <p class="hint">
          <i class="fa-solid fa-spinner fa-spin"></i> Loading questions...
        </p>
      </div>
    `;
  }

  // Show empty state when no questions match filters
  function showEmptyState() {
    mcqContainer.innerHTML = `
      <div class="card">
        <p class="hint">
          <i class="fa-solid fa-search"></i> No questions found matching your filters.
          <br><small>Try adjusting your search criteria or clearing some filters.</small>
        </p>
      </div>
    `;
  }

  // Show error state
  function showErrorState(message) {
    mcqContainer.innerHTML = `
      <div class="card">
        <p class="hint" style="color: var(--danger, #dc3545);">
          <i class="fa-solid fa-exclamation-triangle"></i> ${message}
          <br><button onclick="location.reload()" class="btn" style="margin-top: 1rem;">
            <i class="fa-solid fa-refresh"></i> Retry
          </button>
        </p>
      </div>
    `;
  }

  // Event listeners for filters
  [subjectFilter, topicFilter, examFilter, sortFilter].forEach(element => {
    if (element) {
      element.addEventListener("change", applyFilters);
    }
  });

  if (yearRange) {
    yearRange.addEventListener("input", applyFilters);
  }

  if (searchBox) {
    // Debounce search input
    let searchTimeout;
    searchBox.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(applyFilters, 300);
    });
  }

  // Initialize the app
  fetchQuestions();
});

// Image modal functionality
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
          <div class="image-modal-controls">
            <button onclick="downloadImage()" class="image-modal-btn">
              <i class="fa-solid fa-download"></i> Download
            </button>
            <button onclick="closeImageModal()" class="image-modal-btn">
              <i class="fa-solid fa-times"></i> Close
            </button>
          </div>
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
  
  modal.currentImageUrl = imageUrl;
}

function closeImageModal() {
  const modal = document.getElementById('image-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function downloadImage() {
  const modal = document.getElementById('image-modal');
  if (modal && modal.currentImageUrl) {
    const link = document.createElement('a');
    link.href = modal.currentImageUrl;
    link.download = 'mcq-image.jpg';
    link.click();
  }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeImageModal();
  }
});

