// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuRBnVEgZ4EVFi6ZvIthFm_IUsLxD22bc",
    authDomain: "corevaluesapp-9ca55.firebaseapp.com",
    projectId: "corevaluesapp-9ca55",
    storageBucket: "corevaluesapp-9ca55.firebasestorage.app",
    messagingSenderId: "894079508319",
    appId: "1:894079508319:web:8c7cc5a0389b87939d20ea"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Export the database instance
window.db = db; 