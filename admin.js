/* ============================================================
   KSATRIA AKADEMI
   ADMIN PANEL V2
   PART 1
   Inisialisasi + Global + UI
============================================================ */

/* ============================================================
   FIREBASE
============================================================ */

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

/* ============================================================
   GLOBAL STATE
============================================================ */

let questionList = [];
let participantList = [];
let resultList = [];

let filteredQuestions = [];

let currentPage = 1;
let pageSize = 10;

let editingQuestionId = null;

/* ============================================================
   DOM ELEMENT
============================================================ */

const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");

const toastElement = document.getElementById("liveToast");
const toastMessage = document.getElementById("toastMessage");

const scrollTopBtn = document.getElementById("scrollTopBtn");

/* Dashboard */

const totalQuestions = document.getElementById("totalQuestions");
const totalParticipants = document.getElementById("totalParticipants");
const totalResults = document.getElementById("totalResults");
const averageScore = document.getElementById("averageScore");

const activeQuestions = document.getElementById("activeQuestions");
const inactiveQuestions = document.getElementById("inactiveQuestions");
const favoriteProgram = document.getElementById("favoriteProgram");
const todayTryout = document.getElementById("todayTryout");

/* ============================================================
   BOOTSTRAP
============================================================ */

const toast = new bootstrap.Toast(toastElement);

/* ============================================================
   TOAST
============================================================ */

function showToast(message) {

    toastMessage.textContent = message;

    toast.show();

}

/* ============================================================
   LOADING
============================================================ */

function showLoading(message = "Memproses...") {

    loadingText.textContent = message;

    loadingOverlay.classList.remove("d-none");

}

function hideLoading() {

    loadingOverlay.classList.add("d-none");

}

/* ============================================================
   FORMAT NILAI
============================================================ */

function formatNumber(number) {

    return new Intl.NumberFormat("id-ID").format(number);

}

/* ============================================================
   FORMAT TANGGAL
============================================================ */

function formatDate(date) {

    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID");

}

/* ============================================================
   SCROLL TO TOP
============================================================ */

window.addEventListener("scroll", () => {

    if (window.scrollY > 250) {

        scrollTopBtn.style.display = "block";

    } else {

        scrollTopBtn.style.display = "none";

    }

});

scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/* ============================================================
   NAVIGATION
============================================================ */

const menuLinks = document.querySelectorAll(".sidebar-menu a");

const sections = document.querySelectorAll(".content-section");

menuLinks.forEach(link => {

    link.addEventListener("click", function(e) {

        const href = this.getAttribute("href");

        if (!href.startsWith("#")) return;

        e.preventDefault();

        menuLinks.forEach(item => {

            item.parentElement.classList.remove("active");

        });

        this.parentElement.classList.add("active");

        sections.forEach(section => {

            section.classList.remove("active");

        });

        const target = document.querySelector(href);

        if (target) {

            target.classList.add("active");

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }

    });

});

/* ============================================================
   AUTH CHECK
============================================================ */

auth.onAuthStateChanged(user => {

    if (!user) {

        window.location.href = "login.html";

        return;

    }

    console.log("Login :", user.email);

});

/* ============================================================
   START
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Admin V2 Loaded");

    showToast("Dashboard Admin siap.");

});
/* ============================================================
   ADMIN PANEL V2
   PART 2
   DASHBOARD REALTIME
============================================================ */

/* ============================================================
   LOAD DASHBOARD
============================================================ */

async function loadDashboard() {

    try {

        showLoading("Memuat Dashboard...");

        /* ==========================
           QUESTIONS
        ========================== */

        const questionSnapshot = await db
            .collection("questions")
            .get();

        questionList = [];

        questionSnapshot.forEach(doc => {

            questionList.push({

                id: doc.id,

                ...doc.data()

            });

        });

        /* ==========================
           PARTICIPANTS
        ========================== */

        const participantSnapshot = await db
            .collection("participants")
            .get();

        participantList = [];

        participantSnapshot.forEach(doc => {

            participantList.push({

                id: doc.id,

                ...doc.data()

            });

        });

        /* ==========================
           RESULTS
        ========================== */

        const resultSnapshot = await db
            .collection("results")
            .get();

        resultList = [];

        resultSnapshot.forEach(doc => {

            resultList.push({

                id: doc.id,

                ...doc.data()

            });

        });

        updateDashboard();

        hideLoading();

    } catch (error) {

        console.error(error);

        hideLoading();

        showToast("Gagal memuat Dashboard.");

    }

}

/* ============================================================
   UPDATE DASHBOARD
============================================================ */

function updateDashboard() {

    /* ==========================
       TOTAL
    ========================== */

    totalQuestions.textContent =
        formatNumber(questionList.length);

    totalParticipants.textContent =
        formatNumber(participantList.length);

    totalResults.textContent =
        formatNumber(resultList.length);

    /* ==========================
       ACTIVE
    ========================== */

    const active =
        questionList.filter(item =>
            item.status === "active"
        ).length;

    activeQuestions.textContent =
        formatNumber(active);

    /* ==========================
       INACTIVE
    ========================== */

    const inactive =
        questionList.filter(item =>
            item.status === "inactive"
        ).length;

    inactiveQuestions.textContent =
        formatNumber(inactive);

    /* ==========================
       RATA-RATA NILAI
    ========================== */

    let totalScore = 0;

    resultList.forEach(item => {

        totalScore += Number(item.score || 0);

    });

    const avg =

        resultList.length > 0

            ? Math.round(totalScore / resultList.length)

            : 0;

    averageScore.textContent = avg;

    /* ==========================
       PROGRAM FAVORIT
    ========================== */

    const counter = {};

    participantList.forEach(item => {

        const program = item.program || "-";

        counter[program] =

            (counter[program] || 0) + 1;

    });

    let favProgram = "-";

    let highest = 0;

    Object.keys(counter).forEach(program => {

        if (counter[program] > highest) {

            highest = counter[program];

            favProgram = program;

        }

    });

    favoriteProgram.textContent = favProgram;

    /* ==========================
       TRYOUT HARI INI
    ========================== */

    const today =

        new Date().toLocaleDateString("id-ID");

    const todayCount =

        resultList.filter(item => {

            if (!item.createdAt) return false;

            const date =

                new Date(item.createdAt)

                    .toLocaleDateString("id-ID");

            return date === today;

        }).length;

    todayTryout.textContent =

        formatNumber(todayCount);

}

/* ============================================================
   REALTIME LISTENER
============================================================ */

function startRealtimeDashboard() {

    db.collection("questions")

        .onSnapshot(() => {

            loadDashboard();

        });

    db.collection("participants")

        .onSnapshot(() => {

            loadDashboard();

        });

    db.collection("results")

        .onSnapshot(() => {

            loadDashboard();

        });

}

/* ============================================================
   START DASHBOARD
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadDashboard();

    startRealtimeDashboard();

});
/* ============================================================
   ADMIN PANEL V2
   PART 3
   LOAD QUESTION
============================================================ */

/* ============================================================
   GLOBAL
============================================================ */

let currentSort = "number";
let currentProgram = "";
let currentCategory = "";
let currentKeyword = "";

/* ============================================================
   ELEMENT
============================================================ */

const questionTable =
    document.getElementById("questionTable");

const searchQuestion =
    document.getElementById("searchQuestion");

const filterProgram =
    document.getElementById("filterProgram");

const filterCategory =
    document.getElementById("filterCategory");

const sortQuestion =
    document.getElementById("sortQuestion");

const refreshQuestionBtn =
    document.getElementById("refreshQuestionBtn");

const pageSizeSelect =
    document.getElementById("pageSize");

const pagination =
    document.getElementById("questionPagination");

/* ============================================================
   LOAD QUESTION
============================================================ */

async function loadQuestions() {

    try {

        showLoading("Memuat soal...");

        const snapshot =
            await db.collection("questions")
            .orderBy("number")
            .get();

        questionList = [];

        snapshot.forEach(doc => {

            questionList.push({

                id: doc.id,

                ...doc.data()

            });

        });

        buildCategoryFilter();

        applyQuestionFilter();

        hideLoading();

    }

    catch(error){

        console.error(error);

        hideLoading();

        showToast("Gagal memuat soal.");

    }

}

/* ============================================================
   CATEGORY
============================================================ */

function buildCategoryFilter(){

    const categories = [];

    questionList.forEach(item=>{

        if(
            item.category &&
            !categories.includes(item.category)
        ){

            categories.push(item.category);

        }

    });

    categories.sort();

    filterCategory.innerHTML =

        `<option value="">Semua Kategori</option>`;

    categories.forEach(category=>{

        filterCategory.innerHTML +=

        `<option value="${category}">
            ${category}
        </option>`;

    });

}

/* ============================================================
   FILTER
============================================================ */

function applyQuestionFilter(){

    filteredQuestions =

        questionList.filter(item=>{

            const keywordMatch =

                item.question
                ?.toLowerCase()
                .includes(currentKeyword.toLowerCase());

            const programMatch =

                currentProgram === "" ||

                item.program === currentProgram;

            const categoryMatch =

                currentCategory === "" ||

                item.category === currentCategory;

            return (

                keywordMatch &&

                programMatch &&

                categoryMatch

            );

        });

    sortQuestions();

}

/* ============================================================
   SORT
============================================================ */

function sortQuestions(){

    filteredQuestions.sort((a,b)=>{

        switch(currentSort){

            case "program":

                return (a.program || "")
                .localeCompare(b.program || "");

            case "category":

                return (a.category || "")
                .localeCompare(b.category || "");

            default:

                return Number(a.number)-Number(b.number);

        }

    });

    renderQuestionTable();

}

/* ============================================================
   TABLE
============================================================ */

function renderQuestionTable(){

    questionTable.innerHTML="";

    const start =

        (currentPage-1)*pageSize;

    const end =

        start+pageSize;

    const data =

        filteredQuestions.slice(start,end);

    data.forEach(question=>{

        questionTable.innerHTML +=

        `
<tr>

<td>

<input
type="checkbox"
class="question-check"
value="${question.id}">

</td>

<td>${question.number ?? "-"}</td>

<td>${question.program ?? "-"}</td>

<td>${question.category ?? "-"}</td>

<td>

${question.question ?? "-"}

</td>

<td>

<span class="badge bg-${
question.status==="inactive"
?"danger":"success"}">

${question.status ?? "active"}

</span>

</td>

<td>

<button

class="btn btn-sm btn-warning edit-btn"

data-id="${question.id}">

<i class="bi bi-pencil"></i>

</button>

<button

class="btn btn-sm btn-danger delete-btn"

data-id="${question.id}">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

    });

    renderPagination();

}

/* ============================================================
   PAGINATION
============================================================ */

function renderPagination(){

    pagination.innerHTML="";

    const totalPage =

        Math.ceil(

            filteredQuestions.length/pageSize

        );

    for(let i=1;i<=totalPage;i++){

        pagination.innerHTML+=

        `

<li class="page-item ${

i===currentPage

?

"active"

:

""

}">

<a

href="#"

class="page-link"

onclick="gotoPage(${i})">

${i}

</a>

</li>

`;

    }

}

/* ============================================================
   GOTO PAGE
============================================================ */

function gotoPage(page){

    currentPage = page;

    renderQuestionTable();

}

/* ============================================================
   EVENT
============================================================ */

searchQuestion.addEventListener("input",()=>{

    currentKeyword =

        searchQuestion.value;

    currentPage=1;

    applyQuestionFilter();

});

filterProgram.addEventListener("change",()=>{

    currentProgram=

        filterProgram.value;

    currentPage=1;

    applyQuestionFilter();

});

filterCategory.addEventListener("change",()=>{

    currentCategory=

        filterCategory.value;

    currentPage=1;

    applyQuestionFilter();

});

sortQuestion.addEventListener("change",()=>{

    currentSort=

        sortQuestion.value;

    sortQuestions();

});

pageSizeSelect.addEventListener("change",()=>{

    pageSize=

        Number(pageSizeSelect.value);

    currentPage=1;

    renderQuestionTable();

});

refreshQuestionBtn.addEventListener("click",()=>{

    loadQuestions();

});

/* ============================================================
   START
============================================================ */

document.addEventListener("DOMContentLoaded",()=>{

    loadQuestions();

});
/* ============================================================
   IMPORT SOAL (XLSX -> FIRESTORE)
   MODUL PERBAIKAN - GANTI SELURUH BLOK
   "IMPORT SOAL V3" (SEND 4A, 4B, 4C) DI admin.js DENGAN INI
============================================================ */

let importQuestions = [];
let isImporting = false;

/* ============================================================
   INIT - DIPASANG SETELAH DOM SIAP
   (Ini kemungkinan besar penyebab upload tidak jalan:
   kalau elemen #confirmImportBtn belum ada di DOM saat
   admin.js pertama kali dieksekusi -- misalnya karena ada
   di dalam modal yang dirender belakangan -- maka
   document.getElementById() akan mengembalikan null dan
   event listener-nya tidak pernah terpasang sama sekali.
   Dengan membungkus semua query + listener di dalam
   DOMContentLoaded, ini dijamin terpasang.)
============================================================ */

document.addEventListener("DOMContentLoaded", initImportModule);

function initImportModule() {

    const questionFile = document.getElementById("pdfFile");
    const parseQuestionBtn = document.getElementById("parseQuestionBtn");
    const confirmImportBtn = document.getElementById("confirmImportBtn");

    if (!questionFile || !parseQuestionBtn || !confirmImportBtn) {
        console.warn("Elemen import soal tidak ditemukan di DOM. Cek ID: pdfFile, parseQuestionBtn, confirmImportBtn.");
        return;
    }

    /* ==========================================
       KLIK: PILIH & BACA FILE EXCEL
    ========================================== */

    parseQuestionBtn.addEventListener("click", () => {

        if (!questionFile.files.length) {
            alert("Pilih file terlebih dahulu.");
            return;
        }

        const file = questionFile.files[0];
        const ext = file.name.split(".").pop().toLowerCase();

        if (ext !== "xlsx" && ext !== "xls") {
            alert("Gunakan file Excel (.xlsx atau .xls)");
            return;
        }

        importExcel(file);

    });

    /* ==========================================
       KLIK: UPLOAD KE FIRESTORE
    ========================================== */

    confirmImportBtn.addEventListener("click", () => {

        if (isImporting) return;

        uploadQuestionsToFirestore(confirmImportBtn);

    });

}

/* ============================================================
   HELPER: AMBIL NILAI KOLOM EXCEL DENGAN AMAN
   (trim spasi, biar "  A  " tetap dianggap valid)
============================================================ */

function readCell(row, key) {

    const value = row[key];

    if (value === undefined || value === null) return "";

    return String(value).trim();

}

/* ==========================================
   BACA FILE EXCEL
========================================== */

async function importExcel(file) {

    showLoading("Membaca file Excel...");

    try {

        const buffer = await file.arrayBuffer();

        const workbook = XLSX.read(buffer, {
            type: "array"
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(sheet, {
            defval: ""
        });

        importQuestions = rows.map(row => ({
            number: readCell(row, "number"),
            program: readCell(row, "program") || "TKD",
            category: readCell(row, "category") || "Umum",
            question: readCell(row, "question"),
            optionA: readCell(row, "optionA"),
            optionB: readCell(row, "optionB"),
            optionC: readCell(row, "optionC"),
            optionD: readCell(row, "optionD"),
            optionE: readCell(row, "optionE"),
            answer: readCell(row, "answer").toUpperCase(),
            discussion: readCell(row, "discussion")
        }));

        hideLoading();

        previewImport();

    } catch (err) {

        console.error(err);
        hideLoading();
        alert("Gagal membaca file Excel: " + err.message);

    }

}

/* ==========================================
   PREVIEW
========================================== */

function previewImport() {

    const tbody = document.getElementById("previewTable");
    tbody.innerHTML = "";

    let valid = 0;
    let invalid = 0;

    importQuestions.forEach((q, index) => {

        const ready =
            q.question &&
            q.optionA &&
            q.optionB &&
            q.optionC &&
            q.optionD &&
            q.answer &&
            ["A", "B", "C", "D", "E"].includes(q.answer);

        if (ready) {
            valid++;
        } else {
            invalid++;
        }

        tbody.innerHTML += `
<tr>
<td>${index + 1}</td>
<td>${q.program || "TKD"}</td>
<td>${q.category || "-"}</td>
<td>
<span class="badge bg-${ready ? "success" : "danger"}">
${ready ? "Siap" : "Error"}
</span>
</td>
</tr>
`;

    });

    document.getElementById("previewTotal").textContent = importQuestions.length;
    document.getElementById("previewValid").textContent = valid;
    document.getElementById("previewInvalid").textContent = invalid;
    document.getElementById("previewReady").textContent = valid;

    document.getElementById("uploadProgress").style.width = "0%";
    document.getElementById("uploadProgress").textContent = "0%";

    document.getElementById("uploadStatus").textContent =
        `${valid} soal siap diupload, ${invalid} soal error (dilewati saat upload).`;

    showToast(valid + " soal berhasil dibaca.");

}

/* ==========================================
   UPLOAD KE FIRESTORE (BATCH, DENGAN PROGRESS BAR ASLI)
========================================== */

async function uploadQuestionsToFirestore(confirmImportBtn) {

    const readyQuestions = importQuestions.filter(q =>
        q.question &&
        q.optionA &&
        q.optionB &&
        q.optionC &&
        q.optionD &&
        q.answer &&
        ["A", "B", "C", "D", "E"].includes(q.answer)
    );

    if (!readyQuestions.length) {
        alert("Tidak ada soal valid yang bisa diupload. Cek kembali kolom question/optionA-D/answer di file Excel.");
        return;
    }

    const progressBar = document.getElementById("uploadProgress");
    const status = document.getElementById("uploadStatus");

    isImporting = true;
    confirmImportBtn.disabled = true;

    showLoading("Mengupload soal...");

    /* Firestore batch v8 maksimal 500 operasi per batch.
       Dipecah per 20 supaya progress bar terlihat berjalan halus
       dan kalau salah satu batch gagal, batch sebelumnya
       tetap sudah tersimpan (tidak semua hilang). */
    const CHUNK_SIZE = 20;
    const chunks = [];

    for (let i = 0; i < readyQuestions.length; i += CHUNK_SIZE) {
        chunks.push(readyQuestions.slice(i, i + CHUNK_SIZE));
    }

    let uploaded = 0;

    try {

        for (const chunk of chunks) {

            const batch = db.batch();

            chunk.forEach((q, idx) => {

                const docRef = db.collection("questions").doc();

                batch.set(docRef, {
                    number: Number(q.number) || (uploaded + idx + 1),
                    program: q.program || "TKD",
                    category: q.category || "Umum",
                    question: q.question || "",
                    optionA: q.optionA || "",
                    optionB: q.optionB || "",
                    optionC: q.optionC || "",
                    optionD: q.optionD || "",
                    optionE: q.optionE || "",
                    answer: q.answer || "",
                    discussion: q.discussion || "",
                    status: "active",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

            });

            await batch.commit();

            uploaded += chunk.length;

            const percent = Math.round((uploaded / readyQuestions.length) * 100);

            progressBar.style.width = percent + "%";
            progressBar.textContent = percent + "%";

            status.textContent = `Mengupload ${uploaded} / ${readyQuestions.length} soal...`;

        }

        hideLoading();

        await finishImport(uploaded);

    } catch (err) {

        console.error(err);
        hideLoading();

        /* Tampilkan pesan error asli dari Firestore, misalnya
           "Missing or insufficient permissions" kalau rules
           yang memblokir write, supaya gampang didiagnosis. */
        alert("Upload gagal: " + err.message);

        status.textContent = "Upload gagal: " + err.message;

    } finally {

        isImporting = false;
        confirmImportBtn.disabled = false;

    }

}

/* ==========================================
   RESET SETELAH IMPORT SELESAI
========================================== */

async function finishImport(uploadedCount) {

    try {

        document.getElementById("previewTable").innerHTML = "";
        document.getElementById("previewTotal").textContent = "0";
        document.getElementById("previewReady").textContent = "0";
        document.getElementById("previewValid").textContent = "0";
        document.getElementById("previewInvalid").textContent = "0";

        document.getElementById("uploadProgress").style.width = "0%";
        document.getElementById("uploadProgress").textContent = "0%";

        document.getElementById("uploadStatus").textContent = "Import selesai.";

        const questionFile = document.getElementById("pdfFile");
        if (questionFile) questionFile.value = "";

        importQuestions = [];

        await loadQuestions();
        await loadDashboard();

        showToast(`${uploadedCount} soal berhasil diupload.`);

    } catch (err) {

        console.error(err);

    }

}
