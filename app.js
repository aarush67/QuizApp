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

// Load quiz when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    if (quizId) {
        loadQuiz(quizId);
    } else {
        document.getElementById('playOptionsContainer').innerHTML = '<p>No quiz selected!</p>';
    }
});

// Load quiz data
function loadQuiz(quizId) {
    db.collection('quizzes').doc(quizId).get().then(function(doc) {
        if (doc.exists) {
            const quizData = doc.data();
            displayQuizOptions(quizData);
        } else {
            document.getElementById('playOptionsContainer').innerHTML = '<p>Quiz not found!</p>';
        }
    }).catch(function(error) {
        console.error("Error fetching quiz data:", error);
        document.getElementById('playOptionsContainer').innerHTML = '<p>Error loading quiz data.</p>';
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
        alert('Multiplayer mode is not yet implemented!');
    });
}

// Start solo quiz
function startSoloQuiz(quizData) {
    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = ''; // Clear previous content
    displayQuestion(quizData.questions[0], 0, quizData);
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
