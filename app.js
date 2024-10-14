// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyB5seWslRsU0fUh5pZRF9_qfEYTtFWp9No",
    authDomain: "quizapp-1400d.firebaseapp.com",
    projectId: "quizapp-1400d",
    storageBucket: "quizapp-1400d.appspot.com",
    messagingSenderId: "656449627953",
    appId: "1:656449627953:web:db32a3c03c8c76dfa13210"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var auth = firebase.auth();

// Listen for auth state changes
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById("welcomeMessage").innerText = `Welcome, ${user.email}!`;
        loadQuizzes();
    } else {
        document.getElementById("loginContainer").style.display = "block";
    }
});

// Load quizzes from Firestore
function loadQuizzes() {
    db.collection('quizzes').get().then(snapshot => {
        const quizzesList = document.getElementById('quizzesList');
        quizzesList.innerHTML = ''; // Clear previous quizzes

        snapshot.forEach(doc => {
            const quizData = doc.data();
            const quizItem = document.createElement('div');
            quizItem.className = 'quiz-item';
            quizItem.innerHTML = `
                <h3>${quizData.title}</h3>
                <button class="play-button" onclick="playQuiz('${doc.id}')">Play Quiz</button>
            `;
            quizzesList.appendChild(quizItem);
        });
    }).catch(error => {
        console.error("Error loading quizzes:", error);
    });
}

// Function to play a quiz
function playQuiz(quizId) {
    window.location.href = `playQuiz.html?id=${quizId}`;
}

// Login function
function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    auth.signInWithEmailAndPassword(email, password).then(() => {
        document.getElementById('loginContainer').style.display = 'none';
    }).catch(error => {
        console.error("Login Error:", error);
        alert(error.message);
    });
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('welcomeMessage').innerText = '';
    }).catch(error => {
        console.error("Logout Error:", error);
    });
}

// Sign-up function
function signUp() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    auth.createUserWithEmailAndPassword(email, password).then(() => {
        alert('Account created successfully!');
    }).catch(error => {
        console.error("Signup Error:", error);
        alert(error.message);
    });
}

// Load quiz when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');
    if (quizId) {
        loadQuiz(quizId);
    }
});

// Load quiz data
function loadQuiz(quizId) {
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        if (doc.exists) {
            const quizData = doc.data();
            document.getElementById('quizTitle').innerText = quizData.title;
            displayQuizOptions(quizData);
        } else {
            document.getElementById('playOptionsContainer').innerHTML = '<p>Quiz not found!</p>';
        }
    }).catch(function(error) {
        console.error("Error fetching quiz data:", error);
    });
}

// Display options to play quiz
function displayQuizOptions(quizData) {
    const playOptionsContainer = document.getElementById('playOptionsContainer');
    playOptionsContainer.innerHTML = `
        <button id="playSoloBtn" class="button">Play Solo</button>
        <button id="playMultiplayerBtn" class="button">Play Multiplayer</button>
    `;

    // Solo mode button event listener
    document.getElementById('playSoloBtn').addEventListener('click', function() {
        startSoloQuiz(quizData);
    });

    // Multiplayer mode button event listener
    document.getElementById('playMultiplayerBtn').addEventListener('click', function() {
        alert('Multiplayer mode is not yet implemented!'); // Placeholder for multiplayer functionality
    });
}

// Start solo quiz
function startSoloQuiz(quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear previous content
    document.getElementById('playOptionsContainer').style.display = 'none'; // Hide options
    displayQuestion(quizData.questions[0], 0, quizData); // Show the first question
}

// Display question and options for quiz
function displayQuestion(question, index, quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<h3>${question.text}</h3>`;
    
    question.options.forEach((option, idx) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'answer-button';
        optionBtn.innerText = option.text;
        optionBtn.onclick = () => {
            checkAnswer(option.isCorrect, quizData, index);
        };
        questionContainer.appendChild(optionBtn);
    });
}

// Check the selected answer
function checkAnswer(isCorrect, quizData, index) {
    if (isCorrect) {
        alert('Correct answer!');
    } else {
        alert('Wrong answer. Try again!');
    }
    
    // Logic to go to the next question
    if (index + 1 < quizData.questions.length) {
        displayQuestion(quizData.questions[index + 1], index + 1, quizData);
    } else {
        document.getElementById('questionContainer').innerHTML = '<h2>Quiz Complete!</h2>'; // End of quiz message
    }
}
