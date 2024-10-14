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

// Join Quiz
document.getElementById("joinQuizBtn").onclick = function() {
    const quizId = document.getElementById("quizId").value;
    db.collection("quizzes").doc(quizId).get().then((doc) => {
        if (doc.exists) {
            const quizData = doc.data();
            alert(`Joined quiz: ${quizData.title}`);
            // Proceed to quiz logic (e.g., start quiz, display questions, etc.)
        } else {
            alert("No quiz found with that ID.");
        }
    }).catch((error) => {
        console.error("Error joining quiz:", error);
        alert("Error joining quiz.");
    });
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

