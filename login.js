/* ===================================================
   KSATRIA AKADEMI
   LOGIN PAGE
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       SHOW / HIDE PASSWORD
    ========================== */

    const password = document.getElementById("password");
    const toggle = document.getElementById("togglePassword");

    if (password && toggle) {

        toggle.addEventListener("click", () => {

            const type = password.getAttribute("type") === "password"
                ? "text"
                : "password";

            password.setAttribute("type", type);

            toggle.innerHTML = type === "password"
                ? '<i class="bi bi-eye-fill"></i>'
                : '<i class="bi bi-eye-slash-fill"></i>';

        });

    }

    /* ==========================
       LOGIN DEMO
    ========================== */

    const form = document.querySelector("form");

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            const button = document.querySelector(".btn-login-custom");

            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1500);

        });

    }

});
