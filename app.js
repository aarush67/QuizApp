// Firebase Configuration
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
        console.error("Error:", error);
    });
});

// Email Sign-Up
document.getElementById('emailSignUpBtn').addEventListener('click', function() {
    var email = prompt("Enter your email:");
    var password = prompt("Enter your password:");

    auth.createUserWithEmailAndPassword(email, password).then(function(userCredential) {
        console.log("User signed up:", userCredential.user);
        loadQuizzes();
    }).catch(function(error) {
        console.error("Error:", error);
    });
});

// Email Sign-In
document.getElementById('emailSignInBtn').addEventListener('click', function() {
    var email = prompt("Enter your email:");
    var password = prompt("Enter your password:");

    auth.signInWithEmailAndPassword(email, password).then(function(userCredential) {
        console.log("User signed in:", userCredential.user);
        document.getElementById('signOutBtn').style.display = 'block';
        loadQuizzes();
    }).catch(function(error) {
        console.error("Error:", error);
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

// Load quizzes
function loadQuizzes() {
    db.collection('quizzes').get().then(function(querySnapshot) {
        document.getElementById('quizList').innerHTML = '';
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
                window.location.href = `quizPlay.html?id=${quizId}`;
            });
        });
    }).catch(function(error) {
        console.error("Error loading quizzes:", error);
    });
}

// Solo or Multiplayer Mode
document.getElementById('soloModeBtn').addEventListener('click', function() {
    const quizId = new URLSearchParams(window.location.search).get('id');
    startSoloQuiz(quizId);
});

document.getElementById('multiPlayerModeBtn').addEventListener('click', function() {
    // Implement multiplayer logic, e.g., generate a code and allow joining
    alert("Multiplayer mode not implemented yet.");
});

// Start Solo Quiz
function startSoloQuiz(quizId) {
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        const quizData = doc.data();
        displayQuestion(quizData);
    }).catch(function(error) {
        console.error("Error fetching quiz data:", error);
    });
}

// Display questions for solo mode
function displayQuestion(quizData) {
    let currentQuestionIndex = 0;
    let score = 0;

    function showQuestion() {
        if (currentQuestionIndex < quizData.questions.length) {
            const question = quizData.questions[currentQuestionIndex];
            const questionContainer = document.getElementById('questionContainer');
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

                currentQuestionIndex++;
                setTimeout(showQuestion, 2000); // Show next question after 2 seconds
            });
        } else {
            document.getElementById('questionContainer').innerHTML = `
                <h2>Quiz completed!</h2>
                <h3>Your score: ${score}/${quizData.questions.length}</h3>
            `;
        }
    }

    showQuestion();
}

// Load the quizzes on page load
window.onload = loadQuizzes;
