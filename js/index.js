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
        
        // Create confirmation page content
        const confirmationHTML = `
            <div class="card">
                <h1>${testInfo.name}</h1>
                <div class="test-info">
                    <p><strong>Start Date:</strong> ${testInfo.startDate.toLocaleString()}</p>
                    <p><strong>End Date:</strong> ${testInfo.endDate.toLocaleString()}</p>
                    <p><strong>Number of Questions:</strong> ${testInfo.numQuestions}</p>
                </div>
                <button onclick="startTest('${testId}', '${email}')" class="btn-start">Start Test</button>
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