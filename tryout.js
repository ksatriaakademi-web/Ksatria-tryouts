/* ==========================================
   KSATRIA AKADEMI
   TRYOUT V2
   TRYOUT FORM CONTROL
========================================== */


document.addEventListener("DOMContentLoaded", function () {


    const tryoutForm = document.getElementById("tryoutForm");


    if (!tryoutForm) {
        return;
    }



    tryoutForm.addEventListener("submit", function (event) {


        event.preventDefault();



        // =========================
        // Ambil Data Form
        // =========================


        const name =
            document
            .getElementById("fullName")
            .value
            .trim();


        const school =
            document
            .getElementById("school")
            .value
            .trim();


        const program =
            document
            .querySelector('input[name="program"]:checked')
            .value;


        const agreement =
            document
            .getElementById("agreement")
            .checked;




        // =========================
        // Validasi
        // =========================


        if (name === "") {

            alert(
                "Silakan masukkan nama lengkap."
            );

            return;

        }



        if (school === "") {

            alert(
                "Silakan masukkan asal sekolah."
            );

            return;

        }



        if (!agreement) {

            alert(
                "Silakan menyetujui aturan tryout terlebih dahulu."
            );

            return;

        }




        // =========================
        // Simpan Data Peserta
        // =========================


        const participant = {


            name: name,


            school: school,


            program: program,


            package: "Demo Gratis",


            totalQuestion: 50,


            duration: 50,


            startTime: new Date().getTime()


        };




        sessionStorage.setItem(

            "ksatriaParticipant",

            JSON.stringify(participant)

        );





        // =========================
        // Loading Button
        // =========================


        const button =
            document.querySelector(".start-btn");



        button.disabled = true;



        button.innerHTML = `

            <i class="bi bi-hourglass-split"></i>

            Menyiapkan Ujian...

        `;





        // =========================
        // Redirect CBT
        // =========================


        setTimeout(function () {


            window.location.href =
                "cbt.html";


        }, 1500);




    });



});
