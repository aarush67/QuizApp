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
                // Redirect to the quiz play selection page
                window.location.href = `playQuiz.html?id=${quizId}`;
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
        // Call function to display quiz options
        displayQuizOptions(quizData);
    }).catch(function(error) {
        console.error("Error fetching quiz data:", error);
    });
}

// Display options to play quiz
function displayQuizOptions(quizData) {
    const playOptionsContainer = document.getElementById('playOptionsContainer');
    playOptionsContainer.innerHTML = `
        <h2>${quizData.title}</h2>
        <button id="playSoloBtn" class="button">Play Solo</button>
        <button id="playMultiplayerBtn" class="button">Play Multiplayer</button>
    `;

    // Solo mode button event listener
    document.getElementById('playSoloBtn').addEventListener('click', function() {
        startSoloQuiz(quizData);
    });

    // Multiplayer mode button event listener
    document.getElementById('playMultiplayerBtn').addEventListener('click', function() {
        startMultiplayerQuiz(quizData);
    });
}

// Start solo quiz
function startSoloQuiz(quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear previous content
    displayQuestion(quizData.questions[0], 0, quizData);
}

// Start multiplayer quiz (implement multiplayer logic here)
function startMultiplayerQuiz(quizData) {
    alert('Multiplayer mode is not yet implemented!');
}

// Display question and options for quiz
function displayQuestion(question, index, quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<h3>${question.text}</h3>`;
    
    question.options.forEach((option) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'answer-button';
        optionBtn.innerText = option.text;
        optionBtn.onclick = () => {
            // Logic for checking the answer goes here
            alert('You selected: ' + option.text);
            // Logic to go to the next question
            if (index + 1 < quizData.questions.length) {
                displayQuestion(quizData.questions[index + 1], index + 1, quizData);
            } else {
                questionContainer.innerHTML = '<h2>Quiz Complete!</h2>'; // End of quiz message
            }
        };
        questionContainer.appendChild(optionBtn);
    });
}

// Check URL for quiz ID and load quiz
const urlParams = new URLSearchParams(window.location.search);
const quizId = urlParams.get('id');
if (quizId) {
    loadQuiz(quizId);
}
