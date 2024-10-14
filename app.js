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
document.getElementById('googleSignUpBtn').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
        console.log("User signed up with Google:", result.user);
        enableQuizCreation();
    }).catch(function(error) {
        console.log("Error:", error);
    });
});

// Separate Google Sign-In
document.getElementById('googleSignInBtn').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
        console.log("User signed in with Google:", result.user);
        enableQuizCreation();
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
        enableQuizCreation();
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
        enableQuizCreation();
    }).catch(function(error) {
        console.log("Error:", error);
    });
});

// Sign Out
document.getElementById('signOutBtn').addEventListener('click', function() {
    auth.signOut().then(function() {
        console.log("User signed out");
        document.getElementById('signOutBtn').style.display = 'none';
        document.getElementById('createQuizNav').style.display = 'none';
    });
});

// Enable Quiz Creation
function enableQuizCreation() {
    document.getElementById('signOutBtn').style.display = 'block';
    document.getElementById('createQuizNav').style.display = 'block';
}

// Create Quiz Logic
document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const quizTitle = document.getElementById('quizTitle').value;
    const questions = document.querySelectorAll('.question');

    const quizData = {
        title: quizTitle,
        questions: []
    };

    questions.forEach(function(question) {
        const questionText = question.querySelector('.questionText').value;
        const options = question.querySelectorAll('.optionText');
        const correctAnswer = question.querySelector('.correctAnswer').value;

        const questionData = {
            question: questionText,
            options: [],
            correctAnswer: parseInt(correctAnswer)
        };

        options.forEach(function(option) {
            questionData.options.push(option.value);
        });

        quizData.questions.push(questionData);
    });

    db.collection('quizzes').add(quizData).then(function(docRef) {
        console.log("Quiz created with ID:", docRef.id);
        alert("Quiz created successfully!");
        document.getElementById('quizForm').reset(); // Reset the form after submission
    }).catch(function(error) {
        console.error("Error adding quiz:", error);
    });
});

// Join Quiz Logic
document.getElementById('joinQuizBtn').addEventListener('click', function() {
    const quizCode = document.getElementById('quizCode').value;

    // Code to retrieve and validate quiz code
    db.collection('quizzes').doc(quizCode).get().then(function(doc) {
        if (doc.exists) {
            console.log("Joining quiz:", doc.data());
            // Add logic to start the quiz or navigate to the quiz page
            alert("Joining quiz: " + doc.data().title);
            // Here, you could redirect the user to a quiz-playing page.
        } else {
            console.log("No such quiz!");
            alert("Quiz not found. Please check the code.");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
});

// Fetch Quizzes to Display on Home Page
function fetchQuizzes() {
    db.collection("quizzes").get().then((querySnapshot) => {
        const quizList = document.getElementById('quizList');
        quizList.innerHTML = ''; // Clear previous quiz list
        querySnapshot.forEach((doc) => {
            const quizItem = document.createElement('div');
            quizItem.textContent = doc.data().title;
            quizList.appendChild(quizItem);
        });
    });
}
fetchQuizzes();
