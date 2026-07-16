/* ===================================================
   KSATRIA AKADEMI
   LOGIN.JS
=================================================== */

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (password && togglePassword) {

    togglePassword.addEventListener("click", function () {

        const icon = this.querySelector("i");

        if (password.type === "password") {

            password.type = "text";
            icon.classList.remove("bi-eye-fill");
            icon.classList.add("bi-eye-slash-fill");

        } else {

            password.type = "password";
            icon.classList.remove("bi-eye-slash-fill");
            icon.classList.add("bi-eye-fill");

        }

    });

}
