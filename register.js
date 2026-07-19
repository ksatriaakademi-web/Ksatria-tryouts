/* ===================================================
   KSATRIA AKADEMI
   REGISTER PAGE
=================================================== */
const auth = firebase.auth();
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    function togglePassword(buttonId, inputId){

        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);

        if(!button || !input) return;

        button.addEventListener("click", () => {

            const isPassword = input.type === "password";

            input.type = isPassword ? "text" : "password";

            button.innerHTML = isPassword
                ? '<i class="bi bi-eye-slash-fill"></i>'
                : '<i class="bi bi-eye-fill"></i>';

        });

    }

    togglePassword("togglePassword", "password");
    togglePassword("toggleConfirmPassword", "confirmPassword");

    /* ==========================================
       REGISTER FORM
    ========================================== */

    const form = document.getElementById("registerForm");

    if(form){

        form.addEventListener("submit", function(e){

            e.preventDefault();

            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const program = document.getElementById("program").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const agree = document.getElementById("agree").checked;

            if(!fullname || !email || !phone || !program){

                alert("Mohon lengkapi seluruh data.");
                return;

            }

            if(password.length < 8){

                alert("Password minimal 8 karakter.");
                return;

            }

            if(password !== confirmPassword){

                alert("Konfirmasi password tidak sama.");
                return;

            }

            if(!agree){

                alert("Anda harus menyetujui syarat dan ketentuan.");
                return;

            }

            const button = document.querySelector(".btn-register-custom");

            button.disabled = true;

            button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2"></span>Mendaftarkan...';

            auth.createUserWithEmailAndPassword(email, password)

.then(async (userCredential) => {

    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({

        fullname: fullname,
        email: email,
        phone: phone,
        program: program,
        role: "siswa",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    });

    alert("Pendaftaran berhasil!");

    window.location.href = "login.html";

})

.catch((error) => {

    alert(error.message);

})

.finally(() => {

    button.disabled = false;

    button.innerHTML = `
        <i class="bi bi-person-plus-fill me-2"></i>
        Daftar Sekarang
    `;

});

        });

    }

});
