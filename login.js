/* ==========================================
   KSATRIA AKADEMI
   LOGIN FIREBASE
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();

        const password = document.getElementById("password").value;

        firebase.auth().signInWithEmailAndPassword(email, password)

        .then((userCredential) => {

            const user = userCredential.user;

            alert("Login berhasil!");

            window.location.href = "dashboard.html";

        })

        .catch((error) => {

            alert(error.message);

        });

    });

});
