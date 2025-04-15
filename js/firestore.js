// Firestore operations
const firestoreOperations = {
    // Check if email is authorized for the test
    async checkTestAccess(testId, email) {
        try {
            console.log('Checking access for test:', testId, 'email:', email);
            
            // Create document reference
            const testRef = doc(window.db, 'tests', testId);
            console.log('Document reference created:', testRef);
            
            // Get document
            const testDoc = await getDoc(testRef);
            console.log('Document fetched:', testDoc);
            
            if (!testDoc.exists()) {
                console.log('Document does not exist');
                throw new Error('Test not found');
            }

            const testData = testDoc.data();
            console.log('Test data:', testData);
            
            // Check if test is active based on status
            if (testData.status !== 'active') {
                console.log('Test is not active:', testData.status);
                throw new Error('This test is not currently active');
            }

            // Check if email is in students array
            if (!testData.students || !testData.students.includes(email)) {
                console.log('Email not in students array:', email, 'Students:', testData.students);
                throw new Error('You are not authorized to take this test');
            }

            // Check if student has already taken the test (checking results)
            if (testData.results && testData.results[email]) {
                console.log('Student has already taken the test');
                throw new Error('You have already taken this test');
            }

            return {
                name: testData.name,
                startDate: testData.start_date.toDate(),
                endDate: testData.end_date.toDate(),
                numQuestions: testData.questions.length,
                questions: testData.questions
            };
        } catch (error) {
            console.error('Error checking test access:', error);
            throw error;
        }
    },

    // Get test details by ID
    async getTestDetails(testId) {
        try {
            const doc = await window.db.collection('tests').doc(testId).get();
            if (doc.exists) {
                return doc.data();
            }
            throw new Error('Test not found');
        } catch (error) {
            console.error('Error getting test details:', error);
            throw error;
        }
    },

    // Update test status
    async updateTestStatus(testId, email, status) {
        try {
            // Update the test document to add the student's status
            await window.db.collection('tests').doc(testId).update({
                [`student_status.${email}`]: {
                    status,
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            console.error('Error updating test status:', error);
            throw error;
        }
    },

    // Save test results and update completion status
    async saveTestResults(testId, email, results) {
        try {
            // Get current test document
            const testDoc = await getDoc(doc(window.db, 'tests', testId));
            const testData = testDoc.data();
            
            // Prepare the completed student entry
            const completedStudent = {
                email,
                completed_time: new Date(),
                score: results.totalScore,
                percentage: results.percentage
            };

            // Update the test document
            await updateDoc(doc(window.db, 'tests', testId), {
                [`results.${email}`]: {
                    answers: results.answers,
                    totalScore: results.totalScore,
                    maxScore: results.maxScore,
                    percentage: results.percentage,
                    submittedAt: new Date()
                },
                completed: arrayUnion(completedStudent)
            });

            console.log('Test results saved successfully:', {
                testId,
                email,
                results
            });
        } catch (error) {
            console.error('Error saving test results:', error);
            throw error;
        }
    }
};

// Export the operations
window.firestoreOperations = firestoreOperations; 