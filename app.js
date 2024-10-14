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
                playQuiz(quizId);
            });
        });
    }).catch(function(error) {
        console.error("Error loading quizzes:", error);
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

// Create quiz
document.getElementById('quizForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const quizTitle = document.getElementById('quizTitle').value;
    const questions = [];

    const questionElements = document.querySelectorAll('.question');
    questionElements.forEach(questionElement => {
        const questionText = questionElement.querySelector('.questionText').value;
        const options = [];
        const optionElements = questionElement.querySelectorAll('.optionText');
        
        optionElements.forEach(option => {
            options.push(option.value);
        });

        const correctAnswer = questionElement.querySelector('.correctAnswer').value;

        questions.push({
            question: questionText,
            options: options,
            correctAnswer: parseInt(correctAnswer, 10) // Convert to number
        });
    });

    // Create the quiz object
    const quizData = {
        title: quizTitle,
        questions: questions
    };

    try {
        const docRef = await db.collection('quizzes').add(quizData);
        console.log('Quiz created with ID:', docRef.id);
        alert("Quiz created successfully!");
        document.getElementById('quizForm').reset(); // Clear the form
    } catch (error) {
        console.error('Error adding quiz:', error);
        alert("Error creating quiz. Please try again.");
    }
});

// Logic to add another question dynamically
document.getElementById('addQuestionBtn').addEventListener('click', () => {
    const questionHTML = `
        <div class="question">
            <input type="text" class="questionText" placeholder="Question" required><br>
            <input type="text" class="optionText" placeholder="Option 1" required><br>
            <input type="text" class="optionText" placeholder="Option 2" required><br>
            <input type="text" class="optionText" placeholder="Option 3" required><br>
            <input type="text" class="optionText" placeholder="Option 4" required><br>
            <input type="number" class="correctAnswer" placeholder="Correct Option Number (1-4)" min="1" max="4" required><br>
        </div>
    `;
    document.getElementById('questionsContainer').insertAdjacentHTML('beforeend', questionHTML);
});
