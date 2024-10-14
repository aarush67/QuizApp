var firebaseConfig = {
    apiKey: "AIzaSyB5seWslRsU0fUh5pZRF9_qfEYTtFWp9No",
    authDomain: "quizapp-1400d.firebaseapp.com",
    projectId: "quizapp-1400d",
    storageBucket: "quizapp-1400d.appspot.com",
    messagingSenderId: "656449627953",
    appId: "1:656449627953:web:db32a3c03c8c76dfa13210"
  };

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Sign Up with Google
document.getElementById("googleSignUpBtn").onclick = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log("User signed up with Google:", result.user);
        // Hide buttons after sign in
        document.getElementById("createQuizNav").style.display = "block";
        document.getElementById("signOutBtn").style.display = "block";
        fetchQuizzes();
    }).catch((error) => {
        console.error("Error during Google sign-up:", error);
    });
};

// Sign In with Google
document.getElementById("googleSignInBtn").onclick = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((result) => {
        console.log("User signed in with Google:", result.user);
        document.getElementById("createQuizNav").style.display = "block";
        document.getElementById("signOutBtn").style.display = "block";
        fetchQuizzes();
    }).catch((error) => {
        console.error("Error during Google sign-in:", error);
    });
};

// Sign Up with Email
document.getElementById("emailSignUpBtn").onclick = function() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    auth.createUserWithEmailAndPassword(email, password).then((userCredential) => {
        console.log("User signed up with email:", userCredential.user);
        document.getElementById("createQuizNav").style.display = "block";
        document.getElementById("signOutBtn").style.display = "block";
        fetchQuizzes();
    }).catch((error) => {
        console.error("Error during email sign-up:", error);
    });
};

// Sign In with Email
document.getElementById("emailSignInBtn").onclick = function() {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
        console.log("User signed in with email:", userCredential.user);
        document.getElementById("createQuizNav").style.display = "block";
        document.getElementById("signOutBtn").style.display = "block";
        fetchQuizzes();
    }).catch((error) => {
        console.error("Error during email sign-in:", error);
    });
};

// Sign Out
document.getElementById("signOutBtn").onclick = function() {
    auth.signOut().then(() => {
        console.log("User signed out");
        document.getElementById("createQuizNav").style.display = "none";
        document.getElementById("signOutBtn").style.display = "none";
        fetchQuizzes(); // Refresh quizzes
    }).catch((error) => {
        console.error("Error signing out:", error);
    });
};

// Fetch Quizzes to Display on Home Page
function fetchQuizzes() {
    db.collection("quizzes").get().then((querySnapshot) => {
        const quizList = document.getElementById('quizList');
        quizList.innerHTML = ''; // Clear previous quiz list
        querySnapshot.forEach((doc) => {
            const quizData = doc.data();
            const quizItem = document.createElement('div');
            quizItem.textContent = quizData.title;
            quizItem.className = 'quiz-item'; // Add class for styling
            quizList.appendChild(quizItem);
        });
    }).catch((error) => {
        console.error("Error fetching quizzes:", error);
    });
}

// Update UI on Auth State Change
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user);
        document.getElementById("createQuizNav").style.display = "block";
        document.getElementById("signOutBtn").style.display = "block";
        fetchQuizzes();
    } else {
        console.log("No user is signed in");
        document.getElementById("createQuizNav").style.display = "none";
        document.getElementById("signOutBtn").style.display = "none";
    }
});
