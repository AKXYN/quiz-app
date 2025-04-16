// DOM Elements
const testForm = document.getElementById('testForm');
const userEmailInput = document.getElementById('userEmail');
const testIdInput = document.getElementById('testId');

// Handle form submission
testForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = userEmailInput.value;
    const testId = testIdInput.value;

    try {
        // Check test access
        const testInfo = await firestoreOperations.checkTestAccess(testId, email);
        
        // Calculate test duration
        const totalSeconds = testInfo.numQuestions * 30;
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        const durationText = remainingSeconds === 0 ? 
            `${minutes} minutes` : 
            `${minutes} minutes ${remainingSeconds} seconds`;
        
        // Create confirmation page content
        const confirmationHTML = `
            <div class="welcome-section">
                <h1>Test Details 📋</h1>
                <div class="test-info">
                    <h2>${testInfo.name}</h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="icon">⏱️</span>
                            <div>
                                <h3>Duration</h3>
                                <p>${durationText}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="icon">📅</span>
                            <div>
                                <h3>Start Date</h3>
                                <p>${testInfo.startDate.toLocaleString()}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="icon">📅</span>
                            <div>
                                <h3>End Date</h3>
                                <p>${testInfo.endDate.toLocaleString()}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="icon">❓</span>
                            <div>
                                <h3>Questions</h3>
                                <p>${testInfo.numQuestions} questions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card instructions-card">
                <h2>Important Instructions 📝</h2>
                <div class="instructions-list">
                    <div class="instruction-item">
                        <span class="icon">⏱️</span>
                        <p>Each question has a 30-second timer</p>
                    </div>
                    <div class="instruction-item">
                        <span class="icon">🔄</span>
                        <p>Questions automatically advance when you click next or when the timer ends</p>
                    </div>
                    <div class="instruction-item">
                        <span class="icon">🎯</span>
                        <p>There are no right or wrong answers - choose what best represents you</p>
                    </div>
                    <div class="instruction-item">
                        <span class="icon">⭐</span>
                        <p>Every answer carries marks, but don't guess the highest scoring option</p>
                    </div>
                    <div class="instruction-item">
                        <span class="icon">💡</span>
                        <p>Select the option that truly reflects your values and behavior</p>
                    </div>
                </div>
            </div>

            <div class="card start-card">
                <button onclick="startTest('${testId}', '${email}')" class="start-button">
                    <span>Start Assessment</span>
                    <span class="arrow">→</span>
                </button>
            </div>
        `;

        // Replace form with confirmation
        document.querySelector('.container').innerHTML = confirmationHTML;
    } catch (error) {
        alert(error.message);
    }
});

// Function to start the test
window.startTest = function(testId, email) {
    // Use getAssetPath for the quiz URL
    const quizUrl = getAssetPath('quiz.html');
    window.location.href = `${quizUrl}?id=${testId}&email=${encodeURIComponent(email)}`;
}; 