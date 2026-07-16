/* ===================================================
   KSATRIA AKADEMI
   REGISTER.JS
=================================================== */

function togglePassword(inputId, buttonId){

    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);

    if(!input || !button) return;

    button.addEventListener("click", function(){

        const icon = this.querySelector("i");

        if(input.type === "password"){

            input.type = "text";
            icon.classList.remove("bi-eye-fill");
            icon.classList.add("bi-eye-slash-fill");

        }else{

            input.type = "password";
            icon.classList.remove("bi-eye-slash-fill");
            icon.classList.add("bi-eye-fill");

        }

    });

}

togglePassword("password","togglePassword");
togglePassword("confirmPassword","toggleConfirmPassword");
