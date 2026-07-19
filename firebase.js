/* ==========================================
   KSATRIA AKADEMI
   FIREBASE CONFIG
========================================== */

const firebaseConfig = {

  apiKey: "AIzaSyBOx-jMsZi3byv9wmh7Yrr8IjpS0HiB0-o",

  authDomain: "ksatria-akademi.firebaseapp.com",

  projectId: "ksatria-akademi",

  storageBucket: "ksatria-akademi.firebasestorage.app",

  messagingSenderId: "225142450955",

  appId: "1:225142450955:web:e352e8f237aa7a4ca3100e"

};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = firebase.firestore();
