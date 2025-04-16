// Quiz state
let currentTest = null;
let currentQuestionIndex = 0;
let answers = [];
let timer = null;
let timeLeft = 30;

// DOM Elements
const testNameElement = document.getElementById('testName');
const startDateElement = document.getElementById('startDate');
const endDateElement = document.getElementById('endDate');
const emailSection = document.getElementById('emailSection');
const quizSection = document.getElementById('quizSection');
const questionTextElement = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const timerElement = document.getElementById('timer');
const nextButton = document.getElementById('nextButton');
const testForm = document.getElementById('testForm');
const userEmailInput = document.getElementById('userEmail');
const testIdInput = document.getElementById('testId');

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Get test ID and email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const testId = urlParams.get('id');
    const email = urlParams.get('email');

    if (!testId || !email) {
        window.location.href = 'index.html';
        return;
    }

    try {
        // Hide email section since we already have the email
        emailSection.style.display = 'none';
        quizSection.style.display = 'block';

        // Load test details
        currentTest = await firestoreOperations.checkTestAccess(testId, email);
        
        // Update UI with test details
        testNameElement.textContent = currentTest.name;
        startDateElement.textContent = currentTest.startDate.toLocaleString();
        endDateElement.textContent = currentTest.endDate.toLocaleString();

        // Start the quiz
        loadQuestion();
        startTimer();
    } catch (error) {
        alert('Error loading test details. Please try again.');
        window.location.href = 'index.html';
    }
});

// Load current question
function loadQuestion() {
    const question = currentTest.questions[currentQuestionIndex];
    questionTextElement.textContent = question.text;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Add new options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option.text;
        optionElement.dataset.score = option.score;
        optionElement.addEventListener('click', () => selectOption(optionElement));
        optionsContainer.appendChild(optionElement);
    });

    // Update progress
    const progress = ((currentQuestionIndex + 1) / currentTest.questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${currentTest.questions.length}`;

    // Update next button
    nextButton.textContent = currentQuestionIndex === currentTest.questions.length - 1 ? 'Submit' : 'Next Question';
    nextButton.disabled = true;
}

// Handle option selection
function selectOption(selectedOption) {
    // Remove selected class from all options
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });

    // Add selected class to clicked option
    selectedOption.classList.add('selected');
    nextButton.disabled = false;

    // Store answer
    answers[currentQuestionIndex] = {
        questionId: currentQuestionIndex,
        score: parseInt(selectedOption.dataset.score)
    };
}

// Timer functions
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerElement.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            if (currentQuestionIndex < currentTest.questions.length - 1) {
                nextQuestion();
            } else {
                submitQuiz();
            }
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    timerElement.classList.remove('warning');
    startTimer();
}

// Handle next/submit button
nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < currentTest.questions.length - 1) {
        nextQuestion();
    } else {
        submitQuiz();
    }
});

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentTest.questions.length) {
        loadQuestion();
        resetTimer();
    }
}

// Submit quiz
async function submitQuiz() {
    try {
        // Get email and testId from URL
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const testId = urlParams.get('id');

        if (!email || !testId) {
            throw new Error('Missing email or test ID');
        }

        // Initialize answers array if not already done
        if (!answers) {
            answers = [];
        }

        // Ensure answers array has the correct length
        while (answers.length < currentTest.questions.length) {
            answers.push({ questionId: answers.length, score: 0 });
        }

        // Calculate total score
        const totalScore = answers.reduce((sum, answer) => sum + (answer?.score || 0), 0);
        const maxScore = currentTest.questions.length * 8; // 8 is max score per question
        const percentage = Math.round((totalScore / maxScore) * 100);

        // Prepare results object
        const results = {
            answers: answers.map(answer => ({
                questionId: answer.questionId,
                score: answer.score || 0
            })),
            totalScore: totalScore,
            maxScore: maxScore,
            percentage: percentage,
            submittedAt: new Date()
        };

        // Save results
        await firestoreOperations.saveTestResults(testId, email, results);

        // Show completion message
        alert('Test submitted successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error submitting test:', error);
        alert('Error submitting test: ' + error.message);
    }
}

// Handle form submission
testForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = userEmailInput.value;
    const testId = testIdInput.value;

    try {
        // Check test access
        const testInfo = await firestoreOperations.checkTestAccess(testId, email);
        
        // Create confirmation page content
        const confirmationHTML = `
            <div class="card">
                <h1>${testInfo.name}</h1>
                <div class="test-info">
                    <p><strong>Start Date:</strong> ${testInfo.startDate.toLocaleString()}</p>
                    <p><strong>End Date:</strong> ${testInfo.endDate.toLocaleString()}</p>
                    <p><strong>Number of Questions:</strong> ${testInfo.numQuestions}</p>
                </div>
                <button onclick="startTest('${testId}')" class="btn-start">Start Test</button>
            </div>
        `;

        // Replace form with confirmation
        document.querySelector('.container').innerHTML = confirmationHTML;
    } catch (error) {
        alert(error.message);
    }
});

// Function to start the test
window.startTest = function(testId) {
    window.location.href = `quiz.html?id=${testId}`;
}; 