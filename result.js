/* ==========================================
   KSATRIA AKADEMI
   RESULT V3 FINAL
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       AMBIL DATA HASIL
    ========================================== */

    const resultData = JSON.parse(
        sessionStorage.getItem("ksatriaResult")
    );

    if (!resultData) {

        alert("Data hasil tidak ditemukan.");

        window.location.href = "dashboard.html";

        return;

    }

    /* ==========================================
       DATA PESERTA
    ========================================== */

    const participant = resultData.participant || {};

    document.getElementById("participantName").textContent =
        participant.name || "-";

    document.getElementById("participantSchool").textContent =
        participant.school || "-";

    document.getElementById("participantProgram").textContent =
        participant.program || "-";

    document.getElementById("examDate").textContent =
        resultData.date || "-";
       /* ==========================================
       DATA NILAI
    ========================================== */

    const result = resultData.result || {};

    const score = result.score || 0;

    const correct = result.correct || 0;

    const wrong = result.wrong || 0;

    document.getElementById("correctAnswer").textContent =
        correct;

    document.getElementById("wrongAnswer").textContent =
        wrong;

    document.getElementById("totalAnswer").textContent =
        correct + wrong;

    /* ==========================================
       STATUS NILAI
    ========================================== */

    const statusElement =
        document.getElementById("statusText");

    if (score >= 90) {

        statusElement.textContent = "Sangat Baik";

    } else if (score >= 75) {

        statusElement.textContent = "Baik";

    } else if (score >= 60) {

        statusElement.textContent = "Cukup";

    } else {

        statusElement.textContent = "Perlu Latihan";

    }

    /* ==========================================
       ANIMASI NILAI
    ========================================== */

    const scoreElement =
        document.getElementById("score");

    let currentScore = 0;

    const animation = setInterval(() => {

        scoreElement.textContent = currentScore;

        currentScore++;

        if (currentScore > score) {

            clearInterval(animation);

            scoreElement.textContent = score;

        }

    }, 20);
       /* ==========================================
       TOMBOL LIHAT SERTIFIKAT
    ========================================== */

    const certificateBtn =
        document.getElementById("certificateBtn");

    if (certificateBtn) {

        certificateBtn.addEventListener("click", () => {

            window.location.href = "certificate.html";

        });

    }

    /* ==========================================
       TOMBOL ULANGI TRYOUT
    ========================================== */

    const retryBtn =
        document.getElementById("retryBtn");

    if (retryBtn) {

        retryBtn.addEventListener("click", () => {

            window.location.href = "dashboard.html";

        });

    }

    /* ==========================================
       TOMBOL PEMBAHASAN
    ========================================== */

    const discussionBtn =
        document.getElementById("discussionBtn");

    if (discussionBtn) {

        discussionBtn.addEventListener("click", () => {

            alert(
                "Pembahasan akan tersedia setelah seluruh bank soal selesai dikembangkan."
            );

        });

    }

    console.log(
        "✅ Result berhasil dimuat."
    );

});
