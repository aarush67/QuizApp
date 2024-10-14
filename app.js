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

// Email Sign-Up
document.getElementById('emailSignUpBtn').addEventListener('click', function() {
    var email = prompt("Enter your email:");
    var password = prompt("Enter your password:");
    
    auth.createUserWithEmailAndPassword(email, password).then(function(userCredential) {
        console.log("User signed up:", userCredential.user);
        loadQuizzes();
    }).catch(function(error) {
        console.log("Error:", error);
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
