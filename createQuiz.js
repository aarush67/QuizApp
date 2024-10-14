// Firebase Configuration (same as before)
const firebaseConfig = {
    apiKey: "AIzaSyB5seWslRsU0fUh5pZRF9_qfEYTtFWp9No",
    authDomain: "quizapp-1400d.firebaseapp.com",
    projectId: "quizapp-1400d",
    storageBucket: "quizapp-1400d.appspot.com",
    messagingSenderId: "656449627953",
    appId: "1:656449627953:web:db32a3c03c8c76dfa13210"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Save Quiz to Firestore
document.getElementById("saveQuizBtn").onclick = function() {
    const quizTitle = document.getElementById("quizTitle").value;
    if (quizTitle) {
        db.collection("quizzes").add({
            title: quizTitle
        }).then(() => {
            document.getElementById("feedback").innerText = "Quiz saved successfully!";
            document.getElementById("quizTitle").value = ''; // Clear input
        }).catch((error) => {
            console.error("Error saving quiz:", error);
            document.getElementById("feedback").innerText = "Error saving quiz.";
        });
    } else {
        alert("Please enter a quiz title.");
    }
};

// Sign Out
document.getElementById("signOutBtn").onclick = function() {
    firebase.auth().signOut().then(() => {
        console.log("User signed out");
        location.href = 'index.html'; // Redirect to home page
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
};

