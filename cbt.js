/* ==========================================
   KSATRIA AKADEMI
   CBT V5 FINAL
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // FIREBASE
    // ==========================================

    const auth = firebase.auth();
    const db = firebase.firestore();

    // ==========================================
    // DATA PESERTA
    // ==========================================

    const participantData = JSON.parse(
        sessionStorage.getItem("ksatriaParticipant")
    );

    if (!participantData) {

        alert("Data peserta tidak ditemukan.");

        window.location.href = "tryout.html";

        return;

    }

    // ==========================================
    // VARIABEL
    // ==========================================

    let questions = [];
    let currentQuestion = 0;
    let answers = [];
    let totalQuestion = 0;
    let timeLeft = 50 * 60;
    let examFinished = false;

    // ==========================================
    // ELEMENT HTML
    // ==========================================

    const questionText =
        document.getElementById("questionText");

    const answerArea =
        document.querySelector(".answer-list");

    const currentNumber =
        document.getElementById("currentNumber");

    const totalNumber =
        document.getElementById("totalQuestion");

    const questionNumbers =
        document.getElementById("questionNumbers");

    const timerElement =
        document.getElementById("timer");

    const nextBtn =
        document.getElementById("nextBtn");

    const previousBtn =
        document.getElementById("previousBtn");

    const finishBtn =
        document.getElementById("finishBtn");

    // ==========================================
    // LOAD SOAL FIRESTORE
    // ==========================================

    async function loadQuestions() {

        try {

            /*
             * Query dibuat sederhana agar
             * TIDAK membutuhkan Composite Index.
             */

            const snapshot = await db
                .collection("questions")
                .orderBy("number")
                .get();

            questions = [];

            snapshot.forEach(doc => {

                const data = doc.data();

                // Filter manual
                if (
                    data.program === participantData.program &&
                    data.isActive === true
                ) {

                    questions.push({

                        id: doc.id,

                        number: data.number,

                        category: data.category,

                        program: data.program,

                        question: data.question,

                        options: [

                            data.optionA,
                            data.optionB,
                            data.optionC,
                            data.optionD,
                            data.optionE

                        ],

                        answer: data.answer

                    });

                }

            });

            if (questions.length === 0) {

                alert("Belum ada soal untuk program ini.");

                return;

            }

            totalQuestion = questions.length;

            totalNumber.textContent = totalQuestion;

            createQuestionNumbers();

            loadQuestion();

        }

        catch (error) {

            console.error("Load Question Error :", error);

            alert("Gagal memuat soal dari Firestore.");

        }

    }
   
