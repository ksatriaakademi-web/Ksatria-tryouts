/* ==========================================
   KSATRIA AKADEMI
   ADMIN PANEL
   PART 1
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // FIREBASE
    // ==========================================

    const auth = firebase.auth();
    const db = firebase.firestore();

    // ==========================================
    // ELEMENT HTML
    // ==========================================

    const totalQuestions =
        document.getElementById("totalQuestions");

    const totalParticipants =
        document.getElementById("totalParticipants");

    const totalResults =
        document.getElementById("totalResults");

    const averageScore =
        document.getElementById("averageScore");

    const questionTable =
        document.getElementById("questionTable");

    const participantTable =
        document.getElementById("participantTable");

    const resultTable =
        document.getElementById("resultTable");

    const questionForm =
        document.getElementById("questionForm");

    const statisticsCanvas =
        document.getElementById("statisticsChart");

    const addQuestionBtn =
        document.getElementById("addQuestionBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    // ==========================================
    // VARIABEL GLOBAL
    // ==========================================

    let chart = null;

    let editingQuestionId = null;

    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    async function loadDashboard() {

        try {

            const questionSnapshot =
                await db.collection("questions").get();

            const participantSnapshot =
                await db.collection("users").get();

            const resultSnapshot =
                await db.collection("results").get();

            totalQuestions.textContent =
                questionSnapshot.size;

            totalParticipants.textContent =
                participantSnapshot.size;

            totalResults.textContent =
                resultSnapshot.size;

            let totalScore = 0;

            resultSnapshot.forEach(doc => {

                totalScore += doc.data().score || 0;

            });

            const average =
                resultSnapshot.size === 0
                ? 0
                : Math.round(
                    totalScore / resultSnapshot.size
                );

            averageScore.textContent = average;

            loadStatistics(

                questionSnapshot.size,

                participantSnapshot.size,

                resultSnapshot.size

            );

        }

        catch (error) {

            console.error(
                "Dashboard Error :",
                error
            );

        }

    }

    // ==========================================
    // CHART STATISTIK
    // ==========================================

    function loadStatistics(

        questionCount,

        participantCount,

        resultCount

    ) {

        if (chart) {

            chart.destroy();

        }

        chart = new Chart(statisticsCanvas, {

            type: "bar",

            data: {

                labels: [

                    "Soal",

                    "Peserta",

                    "Tryout"

                ],

                datasets: [{

                    label: "Statistik",

                    data: [

                        questionCount,

                        participantCount,

                        resultCount

                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

    }
       // ==========================================
    // LOAD SOAL
    // ==========================================

    async function loadQuestions() {

        try {

            questionTable.innerHTML = "";

            const snapshot = await db
                .collection("questions")
                .orderBy("program")
                .orderBy("number")
                .get();

            snapshot.forEach(doc => {

                const data = doc.data();

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>${data.number || "-"}</td>

                    <td>${data.program || "-"}</td>

                    <td>${data.category || "-"}</td>

                    <td>${data.question || "-"}</td>

                    <td>${data.answer || "-"}</td>

                    <td>

                        <span class="badge ${data.isActive ? "bg-success" : "bg-secondary"}">

                            ${data.isActive ? "Aktif" : "Nonaktif"}

                        </span>

                    </td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm edit-question"
                            data-id="${doc.id}">

                            <i class="bi bi-pencil"></i>

                        </button>

                        <button
                            class="btn btn-danger btn-sm delete-question"
                            data-id="${doc.id}">

                            <i class="bi bi-trash"></i>

                        </button>

                    </td>

                `;

                questionTable.appendChild(row);

            });

            registerQuestionButtons();

        }

        catch (error) {

            console.error(
                "Load Question Error :",
                error
            );

        }

    }

    // ==========================================
    // REGISTER BUTTON EDIT & DELETE
    // ==========================================

    function registerQuestionButtons() {

        document
            .querySelectorAll(".edit-question")
            .forEach(button => {

                button.onclick = () => {

                    editQuestion(button.dataset.id);

                };

            });

        document
            .querySelectorAll(".delete-question")
            .forEach(button => {

                button.onclick = () => {

                    deleteQuestion(button.dataset.id);

                };

            });

    }

    // ==========================================
    // EDIT SOAL
    // ==========================================

    async function editQuestion(id) {

        try {

            const doc = await db
                .collection("questions")
                .doc(id)
                .get();

            if (!doc.exists) return;

            const data = doc.data();

            editingQuestionId = id;

            document.getElementById("number").value =
                data.number || "";

            document.getElementById("program").value =
                data.program || "";

            document.getElementById("category").value =
                data.category || "";

            document.getElementById("question").value =
                data.question || "";

            document.getElementById("optionA").value =
                data.optionA || "";

            document.getElementById("optionB").value =
                data.optionB || "";

            document.getElementById("optionC").value =
                data.optionC || "";

            document.getElementById("optionD").value =
                data.optionD || "";

            document.getElementById("optionE").value =
                data.optionE || "";

            document.getElementById("answer").value =
                data.answer || "";

            document.getElementById("isActive").checked =
                data.isActive === true;

            const modal = new bootstrap.Modal(
                document.getElementById("questionModal")
            );

            modal.show();

        }

        catch (error) {

            console.error(
                "Edit Question Error :",
                error
            );

        }

    }

    // ==========================================
    // HAPUS SOAL
    // ==========================================

    async function deleteQuestion(id) {

        const confirmDelete = confirm(
            "Yakin ingin menghapus soal ini?"
        );

        if (!confirmDelete) return;

        try {

            await db
                .collection("questions")
                .doc(id)
                .delete();

            await loadQuestions();

            await loadDashboard();

            alert("Soal berhasil dihapus.");

        }

        catch (error) {

            console.error(
                "Delete Question Error :",
                error
            );

            alert("Gagal menghapus soal.");

        }

    }
       // ==========================================
    // SIMPAN / UPDATE SOAL
    // ==========================================

    questionForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const questionData = {

            number: Number(document.getElementById("number").value),

            program: document.getElementById("program").value,

            category: document.getElementById("category").value,

            question: document.getElementById("question").value,

            optionA: document.getElementById("optionA").value,

            optionB: document.getElementById("optionB").value,

            optionC: document.getElementById("optionC").value,

            optionD: document.getElementById("optionD").value,

            optionE: document.getElementById("optionE").value,

            answer: document.getElementById("answer").value,

            isActive: document.getElementById("isActive").checked

        };

        try {

            if (editingQuestionId) {

                await db
                    .collection("questions")
                    .doc(editingQuestionId)
                    .update(questionData);

                alert("Soal berhasil diperbarui.");

            } else {

                await db
                    .collection("questions")
                    .add(questionData);

                alert("Soal berhasil ditambahkan.");

            }

            editingQuestionId = null;

            questionForm.reset();

            bootstrap.Modal
                .getInstance(
                    document.getElementById("questionModal")
                )
                .hide();

            await loadQuestions();

            await loadDashboard();

        }

        catch (error) {

            console.error(
                "Save Question Error :",
                error
            );

            alert("Gagal menyimpan soal.");

        }

    });

    // ==========================================
    // LOAD PESERTA
    // ==========================================

    async function loadParticipants() {

        participantTable.innerHTML = "";

        try {

            const snapshot = await db
                .collection("users")
                .orderBy("fullname")
                .get();

            snapshot.forEach(doc => {

                const data = doc.data();

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>${data.fullname || "-"}</td>

                    <td>${data.school || "-"}</td>

                    <td>${data.program || "-"}</td>

                    <td>${data.email || "-"}</td>

                `;

                participantTable.appendChild(row);

            });

        }

        catch (error) {

            console.error(
                "Load Participant Error :",
                error
            );

        }

    }

    // ==========================================
    // LOAD HASIL TRYOUT
    // ==========================================

    async function loadResults() {

        resultTable.innerHTML = "";

        try {

            const snapshot = await db
                .collection("results")
                .orderBy("createdAt", "desc")
                .get();

            snapshot.forEach(doc => {

                const data = doc.data();

                let tanggal = "-";

                if (data.createdAt) {

                    tanggal = data.createdAt
                        .toDate()
                        .toLocaleDateString("id-ID");

                }

                const row = document.createElement("tr");

                row.innerHTML = `

                    <td>${data.fullname || "-"}</td>

                    <td>${data.program || "-"}</td>

                    <td>${data.score || 0}</td>

                    <td>${data.correct || 0}</td>

                    <td>${data.wrong || 0}</td>

                    <td>${tanggal}</td>

                `;

                resultTable.appendChild(row);

            });

        }

        catch (error) {

            console.error(
                "Load Result Error :",
                error
            );

        }

    }
      // ==========================================
    // BUTTON TAMBAH SOAL
    // ==========================================

    if (addQuestionBtn) {

        addQuestionBtn.addEventListener("click", () => {

            editingQuestionId = null;

            questionForm.reset();

            document.getElementById("isActive").checked = true;

            const modal = new bootstrap.Modal(
                document.getElementById("questionModal")
            );

            modal.show();

        });

    }

    // ==========================================
    // LOGOUT ADMIN
    // ==========================================

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            const keluar = confirm(
                "Yakin ingin logout?"
            );

            if (!keluar) return;

            try {

                await auth.signOut();

                window.location.href = "login.html";

            }

            catch (error) {

                console.error(
                    "Logout Error :",
                    error
                );

                alert("Logout gagal.");

            }

        });

    }

    // ==========================================
    // INISIALISASI ADMIN
    // ==========================================

    async function initializeAdmin() {

        await loadDashboard();

        await loadQuestions();

        await loadParticipants();

        await loadResults();

    }

    // ==========================================
    // CEK LOGIN ADMIN
    // ==========================================

    auth.onAuthStateChanged(async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        try {

            const userDoc = await db
                .collection("users")
                .doc(user.uid)
                .get();

            if (!userDoc.exists) {

                alert("Data pengguna tidak ditemukan.");

                await auth.signOut();

                return;

            }

            const userData = userDoc.data();

            if (userData.role !== "admin") {

                alert("Akses ditolak. Halaman ini hanya untuk Admin.");

                await auth.signOut();

                return;

            }

            console.log(
                "Admin Login :",
                userData.fullname
            );

            await initializeAdmin();

        }

        catch (error) {

            console.error(
                "Admin Init Error :",
                error
            );

            alert(
                "Gagal memuat Dashboard Admin."
            );

        }

    });

}); 
