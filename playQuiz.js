const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');

db.collection('quizzes').doc(quizId).get().then(function(doc) {
    const quizData = doc.data();
    document.getElementById('quizTitle').textContent = quizData.title;

    let currentQuestionIndex = 0;

    function displayQuestion(index) {
        const questionContainer = document.getElementById('questionContainer');
        questionContainer.innerHTML = '';

        if (index < quizData.questions.length) {
            const question = quizData.questions[index];
            questionContainer.innerHTML = `
                <h2>${question.question}</h2>
                <input type="text" placeholder="Your answer">
            `;
        } else {
            questionContainer.innerHTML = '<h2>Quiz completed!</h2>';
        }
    }

    document.getElementById('nextQuestionBtn').addEventListener('click', function() {
        currentQuestionIndex++;
        displayQuestion(currentQuestionIndex);
    });

    displayQuestion(currentQuestionIndex);
}).catch(function(error) {
    console.error("Error fetching quiz data:", error);
});
