import firebase from 'firebase'

 
 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyB_htbzZ9R5InPTMF8JQxE2w0QP6uYjAmU",
    authDomain: "tech-career-hub-final.firebaseapp.com",
    databaseURL: "https://tech-career-hub-final.firebaseio.com",
    projectId: "tech-career-hub-final",
    storageBucket: "tech-career-hub-final.appspot.com",
    messagingSenderId: "1092039076642",
    appId: "1:1092039076642:web:3588a90617196395fa537b",
    measurementId: "G-3D1J2VF8CG"
  };
  // Initialize Firebase
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebaseApp.firestore()

 