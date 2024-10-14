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

// Load quizzes from Firestore
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
                window.location.href = `playQuiz.html?id=${quizId}`; // Redirect to playQuiz page
            });
        });
    }).catch(function(error) {
        console.error("Error loading quizzes:", error);
    });
}

// Load quiz for playing
function loadQuiz(quizId) {
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        const quizData = doc.data();
        // Display the first question
        displayQuestion(quizData);
    }).catch(function(error) {
        console.error("Error fetching quiz data:", error);
    });
}

// Display question and options for quiz
function displayQuestion(quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear previous questions

    quizData.questions.forEach((question, index) => {
        const questionItem = document.createElement('div');
        questionItem.innerHTML = `<h3>${question.text}</h3>`;
        
        question.options.forEach((option) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'answer-button';
            optionBtn.innerText = option.text;
            optionBtn.onclick = () => {
                // Logic for checking the answer goes here
                alert('You selected: ' + option.text);
                // Add functionality to go to the next question or finish quiz
            };
            questionItem.appendChild(optionBtn);
        });
        questionContainer.appendChild(questionItem);
    });
}

// Check URL for quiz ID and load quiz
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');
if (quizId) {
    loadQuiz(quizId);
}
