/* ==========================================
   KSATRIA AKADEMI
   TRYOUT.JS - Form Peserta Tamu (Guest)
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("tryoutForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const name = document.getElementById("fullname").value.trim();
        const school = document.getElementById("school").value.trim();
        const program = document.getElementById("program").value;

        if (!name || !school || !program) {
            alert("Mohon lengkapi seluruh data terlebih dahulu.");
            return;
        }

        const participantData = {
            name: name,
            school: school,
            program: program
        };

        sessionStorage.setItem(
            "ksatriaParticipant",
            JSON.stringify(participantData)
        );

        window.location.href = "cbt.html";

    });

});
