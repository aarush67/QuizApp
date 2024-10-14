const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');

db.collection('quizzes').doc(quizId).get().then(function(doc) {
    const quizData = doc.data();
    document.getElementById('quizTitle').textContent = quizData.title;

    let currentQuestionIndex = 0;
    let score = 0;

    function displayQuestion(index) {
        const questionContainer = document.getElementById('questionContainer');
        questionContainer.innerHTML = '';

        if (index < quizData.questions.length) {
            const question = quizData.questions[index];
            questionContainer.innerHTML = `
                <h2>${question.question}</h2>
                <input type="text" id="answerInput" placeholder="Your answer">
                <button id="submitAnswerBtn">Submit Answer</button>
                <div id="feedback"></div>
            `;

            document.getElementById('submitAnswerBtn').addEventListener('click', function() {
                const userAnswer = document.getElementById('answerInput').value.trim();
                if (userAnswer.toLowerCase() === question.answer.toLowerCase()) {
                    score++;
                    document.getElementById('feedback').textContent = "Correct!";
                } else {
                    document.getElementById('feedback').textContent = `Incorrect! The correct answer is: ${question.answer}`;
                }

                // Wait for a moment before moving to the next question
                setTimeout(function() {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                }, 2000); // 2 seconds delay
            });
        } else {
            questionContainer.innerHTML = `<h2>Quiz completed!</h2><h3>Your score: ${score}/${quizData.questions.length}</h3>`;
            document.getElementById('nextQuestionBtn').style.display = 'none'; // Hide the next button
        }
    }

    displayQuestion(currentQuestionIndex);
}).catch(function(error) {
    console.error("Error fetching quiz data:", error);
});
