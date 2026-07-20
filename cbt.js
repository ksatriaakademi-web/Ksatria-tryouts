/* ==========================================
   KSATRIA AKADEMI
   CBT V4 FINAL
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const auth = firebase.auth();
    const db = firebase.firestore();

    /* ==========================================
       DATA PESERTA
    ========================================== */

    const participantData = JSON.parse(
        sessionStorage.getItem("ksatriaParticipant")
    );

    if (!participantData) {

        alert("Data peserta tidak ditemukan.");

        window.location.href = "tryout.html";

        return;

    }

    /* ==========================================
   DATABASE SOAL FIRESTORE
========================================== */

let questions = [];
/* ==========================================
   LOAD SOAL DARI FIRESTORE
========================================== */

async function loadQuestions() {

    try {

        const snapshot = await db
            .collection("questions")
            .get();

        questions = [];

        snapshot.forEach(doc => {

            const data = doc.data();

            questions.push({

                id: doc.id,

                program: data.program,

                category: data.category,

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

        });

        if (questions.length === 0) {

            alert("Belum ada soal di Firestore.");

            return;

        }

        totalQuestion = questions.length;

        totalNumber.textContent = totalQuestion;

        createQuestionNumbers();

        loadQuestion();

    }

    catch (error) {

        console.error(error);

        alert("Gagal memuat soal.");

    }

}
    /* ==========================================
       VARIABEL
    ========================================== */

    let currentQuestion = 0;

    let answers = [];

    let timeLeft = 50 * 60;

    let examFinished = false;

    const totalQuestion = questions.length;

    /* ==========================================
       ELEMENT HTML
    ========================================== */

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

    totalNumber.textContent = totalQuestion;

    /* ==========================================
       MEMBUAT NOMOR SOAL
    ========================================== */

    for (let i = 0; i < totalQuestion; i++) {

        const button = document.createElement("button");

        button.className = "number-item";

        button.textContent = i + 1;

        button.addEventListener("click", () => {

            saveAnswer();

            currentQuestion = i;

            loadQuestion();

        });

        questionNumbers.appendChild(button);

    }
       /* ==========================================
       TAMPILKAN SOAL
    ========================================== */

    function loadQuestion() {

        const data = questions[currentQuestion];

        currentNumber.textContent = currentQuestion + 1;

        answerArea.innerHTML = "";

        questionText.textContent = data.question;

        const letters = ["A", "B", "C", "D"];

        data.options.forEach((option, index) => {

            const checked =
                answers[currentQuestion] === letters[index]
                    ? "checked"
                    : "";

            answerArea.innerHTML += `
                <label class="answer-item">

                    <input
                        type="radio"
                        name="answer"
                        value="${letters[index]}"
                        ${checked}>

                    <span class="option-letter">
                        ${letters[index]}
                    </span>

                    <span class="option-text">
                        ${option}
                    </span>

                </label>
            `;

        });

        document
            .querySelectorAll('input[name="answer"]')
            .forEach(radio => {

                radio.addEventListener("change", () => {

                    saveAnswer();

                    updateNumber();

                });

            });

        updateNumber();

    }

    /* ==========================================
       SIMPAN JAWABAN
    ========================================== */

    function saveAnswer() {

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );

        if (selected) {

            answers[currentQuestion] =
                selected.value;

        }

    }

    /* ==========================================
       UPDATE STATUS NOMOR SOAL
    ========================================== */

    function updateNumber() {

        const numbers =
            document.querySelectorAll(".number-item");

        numbers.forEach((item, index) => {

            item.classList.remove("active");
            item.classList.remove("answered");

            if (index === currentQuestion) {

                item.classList.add("active");

            }

            if (answers[index]) {

                item.classList.add("answered");

            }

        });

        const status =
            document.querySelector(".question-status");

        if (!status) return;

        if (answers[currentQuestion]) {

            status.innerHTML = `
                <i class="bi bi-check-circle-fill"></i>
                Sudah Dijawab
            `;

        } else {

            status.innerHTML = `
                <i class="bi bi-pencil-square"></i>
                Belum Dijawab
            `;

        }

    }

    /* ==========================================
       BUTTON NEXT
    ========================================== */

    nextBtn.addEventListener("click", () => {

        saveAnswer();

        if (currentQuestion < totalQuestion - 1) {

            currentQuestion++;

            loadQuestion();

        }

    });

    /* ==========================================
       BUTTON PREVIOUS
    ========================================== */

    previousBtn.addEventListener("click", () => {

        saveAnswer();

        if (currentQuestion > 0) {

            currentQuestion--;

            loadQuestion();

        }

    });
       /* ==========================================
       TIMER
    ========================================== */

    const timer = setInterval(() => {

        if (examFinished) {

            clearInterval(timer);

            return;

        }

        const minute = Math.floor(timeLeft / 60);

        const second = String(timeLeft % 60).padStart(2, "0");

        timerElement.textContent = `${minute}:${second}`;

        timeLeft--;

        if (timeLeft < 0) {

            clearInterval(timer);

            finishExam();

        }

    }, 1000);

    /* ==========================================
       HITUNG NILAI
    ========================================== */

    function calculateScore() {

        let correct = 0;

        questions.forEach((item, index) => {

            if (answers[index] === item.answer) {

                correct++;

            }

        });

        return {

            correct,

            wrong: totalQuestion - correct,

            score: Math.round(
                (correct / totalQuestion) * 100
            )

        };

    }

    /* ==========================================
       BUTTON SELESAI
    ========================================== */

    finishBtn.addEventListener("click", () => {

        saveAnswer();

        const confirmFinish = confirm(
            "Yakin ingin menyelesaikan ujian?"
        );

        if (confirmFinish) {

            finishExam();

        }

    });

    /* ==========================================
       SELESAI UJIAN
    ========================================== */

    async function finishExam() {

        if (examFinished) return;

        examFinished = true;

        clearInterval(timer);

        finishBtn.disabled = true;
        nextBtn.disabled = true;
        previousBtn.disabled = true;

        const result = calculateScore();

        const year = new Date().getFullYear();

        const runningNumber =
            String(Date.now()).slice(-6);

        const certificateNumber =
            `KSA-TRYOUT-${year}-${runningNumber}`;

        const finalResult = {

            participant: participantData,

            result: result,

            answers: answers,

            date: new Date().toLocaleDateString("id-ID"),

            certificateNumber: certificateNumber

        };

        const user = auth.currentUser;

        try {

            if (user) {

                await db.collection("results").add({

                    uid: user.uid,

                    fullname: participantData.name,

                    school: participantData.school,

                    program: participantData.program,

                    score: result.score,

                    correct: result.correct,

                    wrong: result.wrong,

                    certificateNumber: certificateNumber,

                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp()

                });

                console.log(
                    "✅ Hasil berhasil disimpan ke Firestore"
                );

            }
                       sessionStorage.setItem(
                "ksatriaResult",
                JSON.stringify(finalResult)
            );

            window.location.href = "result.html";

        } catch (error) {

            console.error(
                "Firestore Error:",
                error
            );

            alert(
                "Terjadi kesalahan saat menyimpan hasil tryout.\nSilakan coba lagi."
            );

            finishBtn.disabled = false;
            nextBtn.disabled = false;
            previousBtn.disabled = false;

            examFinished = false;

        }

    }

    /* ==========================================
       MULAI CBT
    ========================================== */

    loadQuestion();

});
