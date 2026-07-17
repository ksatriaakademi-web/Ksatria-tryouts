/* ==========================================
   KSATRIA AKADEMI
   CERTIFICATE JS V2
   PART 1 OF 2
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){



// ==========================================
// AMBIL HASIL TRYOUT
// ==========================================

const resultData =
JSON.parse(
sessionStorage.getItem(
"ksatriaResult"
)
);



// ==========================================
// VALIDASI
// ==========================================

if(!resultData){

    alert(
        "Data sertifikat tidak ditemukan."
    );

    window.location.href =
    "index.html";

    return;

}



// ==========================================
// DATA PESERTA
// ==========================================

const participant =
resultData.participant;



// ==========================================
// TAMPILKAN DATA
// ==========================================

document.getElementById(
"participantName"
).innerText =
participant.name;



document.getElementById(
"participantSchool"
).innerText =
participant.school;



document.getElementById(
"participantProgram"
).innerText =
participant.program;



document.getElementById(
"certificateDate"
).innerText =
resultData.date;



// ==========================================
// NOMOR SERTIFIKAT
// ==========================================

const today =
new Date();



const year =
today.getFullYear();



const randomNumber =
Math.floor(
100000 + Math.random()*900000
);



const certificateNumber =
"KSA-" +
year +
"-" +
randomNumber;



document.getElementById(
"certificateNumber"
).innerText =
certificateNumber;



});
/* ==========================================
   KSATRIA AKADEMI
   CERTIFICATE JS V2
   PART 2 OF 2
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){



// ==========================================
// AMBIL HASIL TRYOUT
// ==========================================

const resultData =
JSON.parse(
sessionStorage.getItem(
"ksatriaResult"
)
);



// ==========================================
// VALIDASI
// ==========================================

if(!resultData){

    alert(
        "Data sertifikat tidak ditemukan."
    );

    window.location.href =
    "index.html";

    return;

}



// ==========================================
// DATA PESERTA
// ==========================================

const participant =
resultData.participant;



// ==========================================
// TAMPILKAN DATA
// ==========================================

document.getElementById(
"participantName"
).innerText =
participant.name;



document.getElementById(
"participantSchool"
).innerText =
participant.school;



document.getElementById(
"participantProgram"
).innerText =
participant.program;



document.getElementById(
"certificateDate"
).innerText =
resultData.date;



// ==========================================
// NOMOR SERTIFIKAT
// ==========================================

const today =
new Date();



const year =
today.getFullYear();



const randomNumber =
Math.floor(
100000 + Math.random()*900000
);



const certificateNumber =
"KSA-" +
year +
"-" +
randomNumber;



document.getElementById(
"certificateNumber"
).innerText =
certificateNumber;



// ==========================================
// DOWNLOAD PDF
// ==========================================

const downloadButton =
document.getElementById(
"downloadCertificate"
);



downloadButton.addEventListener(
"click",
function(){



const element =
document.getElementById(
"certificateArea"
);



const option = {

margin:0,

filename:
"Sertifikat-" +
participant.name +
".pdf",

image:{
type:"jpeg",
quality:1
},

html2canvas:{
scale:2,
useCORS:true
},

jsPDF:{
unit:"mm",
format:"a4",
orientation:"landscape"
}

};



html2pdf()

.set(option)

.from(element)

.save();



});



// ==========================================
// PRINT
// ==========================================

const printButton =
document.getElementById(
"printCertificate"
);



printButton.addEventListener(
"click",
function(){

window.print();

});



});
