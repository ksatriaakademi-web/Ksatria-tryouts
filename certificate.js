/* ===================================================
   KSATRIA AKADEMI
   CERTIFICATE.JS
   FINAL VERSION
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       AMBIL DATA HASIL
    ========================================== */

    const resultData = JSON.parse(
        sessionStorage.getItem("ksatriaResult")
    );

    if (!resultData) {

        alert("Data sertifikat tidak ditemukan.");

        window.location.href = "index.html";

        return;

    }

    const participant = resultData.participant || {};

    /* ==========================================
       TAMPILKAN DATA
    ========================================== */

    const participantName = document.getElementById("participantName");
    const participantSchool = document.getElementById("participantSchool");
    const participantProgram = document.getElementById("participantProgram");
    const certificateDate = document.getElementById("certificateDate");
    const certificateNumber = document.getElementById("certificateNumber");

    if (participantName)
        participantName.textContent = participant.name || "-";

    if (participantSchool)
        participantSchool.textContent = participant.school || "-";

    if (participantProgram)
        participantProgram.textContent = participant.program || "-";

    if (certificateDate)
        certificateDate.textContent = resultData.date || "-";

    if (certificateNumber)
        certificateNumber.textContent =
            resultData.certificateNumber || "-";

    /* ==========================================
       DOWNLOAD PDF
    ========================================== */

    const downloadButton =
        document.getElementById("downloadCertificate");

    if (downloadButton) {

        downloadButton.addEventListener("click", () => {

            const certificate =
                document.getElementById("certificateArea");

            if (!certificate) {

                alert("Area sertifikat tidak ditemukan.");

                return;

            }

            const safeName = (participant.name || "Peserta")
                .replace(/[^\w\s-]/g, "")
                .trim();

            html2pdf()
                .set({

                    margin: 0,

                    filename:
                        `Sertifikat-${safeName}.pdf`,

                    image: {

                        type: "jpeg",

                        quality: 1

                    },

                    html2canvas: {

                        scale: 2,

                        useCORS: true

                    },

                    jsPDF: {

                        unit: "mm",

                        format: "a4",

                        orientation: "landscape"

                    }

                })

                .from(certificate)

                .save();

        });

    }

    /* ==========================================
       PRINT
    ========================================== */

    const printButton =
        document.getElementById("printCertificate");

    if (printButton) {

        printButton.addEventListener("click", () => {

            window.print();

        });

    }

    console.log("✅ Certificate berhasil dimuat.");

});
