/* ==========================================
   TRYOUT GRATIS
   tryout.js
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("tryoutForm");

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const fullname = document.getElementById("fullname").value.trim();
        const school = document.getElementById("school").value.trim();
        const program = document.getElementById("program").value;

        if (!fullname || !school || !program) {

            alert("Silakan lengkapi seluruh data.");
            return;

        }

        const participant = {

            id: "GST-" + Date.now(),

            name: fullname,

            school: school,

            program: program,

            type: "guest",

            startTime: Date.now(),

            createdAt: new Date().toISOString()

        };

        sessionStorage.setItem(
            "ksatriaParticipant",
            JSON.stringify(participant)
        );

        window.location.href = "cbt.html";

    });

});
