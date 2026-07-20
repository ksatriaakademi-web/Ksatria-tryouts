/* ==========================================
   KSATRIA AKADEMI
   ADMIN PANEL
   PART 1
========================================== */

document.addEventListener("DOMContentLoaded", async () => {

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

    // ==========================================
    // VARIABEL GLOBAL
    // ==========================================

    let chart = null;

    let editingQuestionId = null;

    // ==========================================
    // LOGIN ADMIN
    // ==========================================

    auth.onAuthStateChanged(async (user) => {

        if (!user) {

            alert("Silakan login terlebih dahulu.");

            window.location.href = "login.html";

            return;

        }

        try {

            const doc = await db
                .collection("users")
                .doc(user.uid)
                .get();

            if (!doc.exists) {

                alert("Data user tidak ditemukan.");

                auth.signOut();

                return;

            }

            const userData = doc.data();

            if (userData.role !== "admin") {

                alert("Akses ditolak.");

                auth.signOut();

                return;

            }

            console.log("Admin Login :", userData.fullname);

            loadDashboard();

        }

        catch(error){

            console.error(error);

            alert("Gagal memverifikasi akun.");

        }

    });

    // ==========================================
    // LOAD DASHBOARD
    // ==========================================

    async function loadDashboard(){

        try{

            const questionSnap =
                await db.collection("questions").get();

            const participantSnap =
                await db.collection("users").get();

            const resultSnap =
                await db.collection("results").get();

            totalQuestions.textContent =
                questionSnap.size;

            totalParticipants.textContent =
                participantSnap.size;

            totalResults.textContent =
                resultSnap.size;

            let totalScore = 0;

            resultSnap.forEach(doc=>{

                totalScore += doc.data().score || 0;

            });

            const average =
                resultSnap.size === 0
                ? 0
                : Math.round(totalScore / resultSnap.size);

            averageScore.textContent =
                average;

            loadStatistics(
                questionSnap.size,
                participantSnap.size,
                resultSnap.size
            );

        }

        catch(error){

            console.error(error);

        }

    }

    // ==========================================
    // CHART
    // ==========================================

    function loadStatistics(
        questionCount,
        participantCount,
        resultCount
    ){

        if(chart){

            chart.destroy();

        }

        chart = new Chart(statisticsCanvas,{

            type:"bar",

            data:{

                labels:[
                    "Soal",
                    "Peserta",
                    "Tryout"
                ],

                datasets:[{

                    label:"Statistik",

                    data:[
                        questionCount,
                        participantCount,
                        resultCount
                    ]

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false

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

                const tr = document.createElement("tr");

                tr.innerHTML = `

                    <td>${data.number}</td>

                    <td>${data.program}</td>

                    <td>${data.category}</td>

                    <td>${data.question}</td>

                    <td>${data.answer}</td>

                    <td>

                        <span class="badge bg-${data.isActive ? 'success' : 'secondary'}">

                            ${data.isActive ? 'Aktif' : 'Nonaktif'}

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

                questionTable.appendChild(tr);

            });

            registerQuestionButton();

        }

        catch(error){

            console.error("Load Question :", error);

        }

    }

    // ==========================================
    // REGISTER BUTTON
    // ==========================================

    function registerQuestionButton(){

        document
            .querySelectorAll(".edit-question")
            .forEach(button=>{

                button.onclick=()=>{

                    editQuestion(button.dataset.id);

                };

            });

        document
            .querySelectorAll(".delete-question")
            .forEach(button=>{

                button.onclick=()=>{

                    deleteQuestion(button.dataset.id);

                };

            });

    }

    // ==========================================
    // EDIT SOAL
    // ==========================================

    async function editQuestion(id){

        try{

            const doc = await db
                .collection("questions")
                .doc(id)
                .get();

            if(!doc.exists) return;

            const data = doc.data();

            editingQuestionId = id;

            document.getElementById("number").value =
                data.number;

            document.getElementById("program").value =
                data.program;

            document.getElementById("category").value =
                data.category;

            document.getElementById("question").value =
                data.question;

            document.getElementById("optionA").value =
                data.optionA;

            document.getElementById("optionB").value =
                data.optionB;

            document.getElementById("optionC").value =
                data.optionC;

            document.getElementById("optionD").value =
                data.optionD;

            document.getElementById("optionE").value =
                data.optionE;

            document.getElementById("answer").value =
                data.answer;

            document.getElementById("isActive").checked =
                data.isActive;

            new bootstrap.Modal(
                document.getElementById("questionModal")
            ).show();

        }

        catch(error){

            console.error(error);

        }

    }

    // ==========================================
    // HAPUS SOAL
    // ==========================================

    async function deleteQuestion(id){

        const yes = confirm(
            "Hapus soal ini?"
        );

        if(!yes) return;

        try{

            await db
                .collection("questions")
                .doc(id)
                .delete();

            alert("Soal berhasil dihapus.");

            loadQuestions();

            loadDashboard();

        }

        catch(error){

            console.error(error);

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

        try{

            if(editingQuestionId){

                await db
                    .collection("questions")
                    .doc(editingQuestionId)
                    .update(questionData);

                alert("Soal berhasil diperbarui.");

            }else{

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

            loadQuestions();

            loadDashboard();

        }

        catch(error){

            console.error(error);

            alert("Gagal menyimpan soal.");

        }

    });

    // ==========================================
    // LOAD PESERTA
    // ==========================================

    async function loadParticipants(){

        participantTable.innerHTML = "";

        const snapshot = await db
            .collection("users")
            .orderBy("fullname")
            .get();

        snapshot.forEach(doc=>{

            const data = doc.data();

            participantTable.innerHTML += `

                <tr>

                    <td>${data.fullname || "-"}</td>

                    <td>${data.school || "-"}</td>

                    <td>${data.program || "-"}</td>

                    <td>${data.email || "-"}</td>

                </tr>

            `;

        });

    }

    // ==========================================
    // LOAD HASIL TRYOUT
    // ==========================================

    async function loadResults(){

        resultTable.innerHTML = "";

        const snapshot = await db
            .collection("results")
            .orderBy("createdAt","desc")
            .get();

        snapshot.forEach(doc=>{

            const data = doc.data();

            let tanggal = "-";

            if(data.createdAt){

                tanggal =
                    data.createdAt
                    .toDate()
                    .toLocaleDateString("id-ID");

            }

            resultTable.innerHTML += `

                <tr>

                    <td>${data.fullname}</td>

                    <td>${data.program}</td>

                    <td>${data.score}</td>

                    <td>${data.correct}</td>

                    <td>${data.wrong}</td>

                    <td>${tanggal}</td>

                </tr>

            `;

        });

    });
    // ==========================================
    // BUTTON TAMBAH SOAL
    // ==========================================

    const addQuestionBtn =
        document.getElementById("addQuestionBtn");

    if (addQuestionBtn) {

        addQuestionBtn.addEventListener("click", () => {

            editingQuestionId = null;

            questionForm.reset();

            const modal = new bootstrap.Modal(
                document.getElementById("questionModal")
            );

            modal.show();

        });

    }

    // ==========================================
    // LOGOUT
    // ==========================================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", async () => {

            const keluar = confirm(
                "Yakin ingin logout?"
            );

            if (!keluar) return;

            try {

                await auth.signOut();

                window.location.href = "login.html";

            } catch (error) {

                console.error(error);

                alert("Logout gagal.");

            }

        });

    }

    // ==========================================
    // INISIALISASI
    // ==========================================

    async function initializeAdmin() {

        await loadDashboard();

        await loadQuestions();

        await loadParticipants();

        await loadResults();

    }

    // ==========================================
    // JALANKAN ADMIN PANEL
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

                alert("Data admin tidak ditemukan.");

                await auth.signOut();

                return;

            }

            const userData = userDoc.data();

            if (userData.role !== "admin") {

                alert("Akses ditolak.");

                await auth.signOut();

                return;

            }

            console.log(
                "Admin Login:",
                userData.fullname
            );

            initializeAdmin();

        }

        catch (error) {

            console.error(error);

            alert("Gagal memuat dashboard admin.");

        }

    });

});
