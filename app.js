var firebaseConfig = {
    apiKey: "AIzaSyB5seWslRsU0fUh5pZRF9_qfEYTtFWp9No",
    authDomain: "quizapp-1400d.firebaseapp.com",
    projectId: "quizapp-1400d",
    storageBucket: "quizapp-1400d.appspot.com",
    messagingSenderId: "656449627953",
    appId: "1:656449627953:web:db32a3c03c8c76dfa13210"
  };

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

// Google Sign-Up/Sign-In
document.getElementById('googleSignInBtn').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
        console.log("User signed in:", result.user);
        document.getElementById('signOutBtn').style.display = 'block';
        loadQuizzes();
    }).catch(function(error) {
        console.log("Error:", error);
    });
});

// Sign Out
document.getElementById('signOutBtn').addEventListener('click', function() {
    auth.signOut().then(function() {
        console.log("User signed out");
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('quizList').innerHTML = '';
    });
});

// Save quiz to Firestore
document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const quizTitle = document.getElementById('quizTitle').value;
    const questions = [];
    
    document.querySelectorAll('.question').forEach(function(questionElement) {
        const questionText = questionElement.querySelector('.questionText').value;
        const answerOptions = [];
        questionElement.querySelectorAll('.answerOption').forEach(function(optionElement) {
            answerOptions.push(optionElement.value);
        });
        const correctAnswer = parseInt(questionElement.querySelector('.correctAnswer').value);

        questions.push({ questionText, answerOptions, correctAnswer });
    });

    db.collection('quizzes').add({
        title: quizTitle,
        questions: questions
    }).then(function() {
        alert('Quiz created successfully!');
    }).catch(function(error) {
        console.error('Error creating quiz:', error);
    });
});

// Load quizzes for playing
function loadQuizzes() {
    db.collection('quizzes').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const quiz = doc.data();
            const quizItem = `<div class="quiz-item" data-id="${doc.id}">
                                  <h3>${quiz.title}</h3>
                                  <button class="playQuizBtn">Play Quiz</button>
                              </div>`;
            document.getElementById('quizList').insertAdjacentHTML('beforeend', quizItem);
        });

        document.querySelectorAll('.playQuizBtn').forEach(function(button) {
            button.addEventListener('click', function() {
                const quizId = this.parentElement.getAttribute('data-id');
                playQuiz(quizId);
            });
        });
    });
}

// Play quiz
function playQuiz(quizId) {
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        if (doc.exists) {
            const quiz = doc.data();
            alert('Start playing: ' + quiz.title);
            // Logic to display questions and allow users to answer
        }
    }).catch(function(error) {
        console.error('Error getting quiz:', error);
    });
}
