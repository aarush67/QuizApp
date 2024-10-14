document.getElementById('joinQuizBtn').addEventListener('click', function() {
    const quizId = document.getElementById('quizIdInput').value;
    
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        if (doc.exists) {
            window.location.href = `playQuiz.html?id=${quizId}`;
        } else {
            alert("Quiz not found!");
        }
    }).catch(function(error) {
        console.error("Error fetching quiz:", error);
    });
});
