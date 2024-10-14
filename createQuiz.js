document.getElementById('addQuestionBtn').addEventListener('click', function() {
    const questionsContainer = document.getElementById('questionsContainer');
    const questionDiv = document.createElement('div');
    questionDiv.innerHTML = `
        <label>Question:</label>
        <input type="text" placeholder="Enter question" required>
        <label>Answer:</label>
        <input type="text" placeholder="Enter answer" required>
        <button class="removeQuestionBtn">Remove Question</button>
    `;
    questionsContainer.appendChild(questionDiv);
    
    questionDiv.querySelector('.removeQuestionBtn').addEventListener('click', function() {
        questionsContainer.removeChild(questionDiv);
    });
});

document.getElementById('saveQuizBtn').addEventListener('click', function() {
    const title = document.getElementById('quizTitle').value;
    const questions = Array.from(document.getElementById('questionsContainer').children).map(q => ({
        question: q.querySelector('input[type="text"]').value,
        answer: q.querySelectorAll('input[type="text"]')[1].value,
    }));

    db.collection('quizzes').add({
        title: title,
        questions: questions
    }).then(function() {
        alert('Quiz saved successfully!');
        window.location.href = 'index.html';
    }).catch(function(error) {
        console.error('Error saving quiz:', error);
    });
});
