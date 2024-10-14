// Firebase Config (Replace with your Firebase Config from Step 1)
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  var db = firebase.firestore();
  var auth = firebase.auth();
  
  // Handle Google Sign-In
  document.getElementById('googleSignInBtn').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(function(result) {
      console.log("User signed in: ", result.user);
      showQuizCreation();
    }).catch(function(error) {
      console.log("Error: ", error);
    });
  });
  
  // Handle Email Sign-Up
  document.getElementById('signUpBtn').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    
    auth.createUserWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        console.log("User signed up: ", userCredential.user);
        showQuizCreation();
      })
      .catch(function(error) {
        console.error("Error signing up: ", error);
      });
  });
  
  // Handle Login
  document.getElementById('loginBtn').addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        console.log("User logged in: ", userCredential.user);
        showQuizCreation();
      })
      .catch(function(error) {
        console.error("Error logging in: ", error);
      });
  });
  
  // Handle Logout
  document.getElementById('logoutBtn').addEventListener('click', function() {
    auth.signOut().then(function() {
      console.log("User signed out.");
      document.getElementById('create-quiz-section').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'none';
    });
  });
  
  // Show Quiz Creation Section After Login
  function showQuizCreation() {
    document.getElementById('create-quiz-section').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'inline';
  }
  
  // Save Quiz to Firestore
  document.getElementById('saveQuizBtn').addEventListener('click', function() {
    var title = document.getElementById('quizTitle').value;
    var question = document.getElementById('quizQuestion').value;
    var answer1 = document.getElementById('quizAnswer1').value;
    var answer2 = document.getElementById('quizAnswer2').value;
    
    db.collection("quizzes").add({
      title: title,
      question: question,
      answers: [answer1, answer2]
    })
    .then(function(docRef) {
      console.log("Quiz saved with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding quiz: ", error);
    });
  });
  