/* ==========================================
   KSATRIA AKADEMI
   FIREBASE CONFIG
========================================== */

import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
getAuth
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
getFirestore
}
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {

apiKey: "ISI_DARI_FIREBASE",

authDomain: "ISI_DARI_FIREBASE",

projectId: "ISI_DARI_FIREBASE",

storageBucket: "ISI_DARI_FIREBASE",

messagingSenderId: "ISI_DARI_FIREBASE",

appId: "ISI_DARI_FIREBASE"

};

const app =
initializeApp(firebaseConfig);

const auth =
getAuth(app);

const db =
getFirestore(app);

export {

auth,

db

};
