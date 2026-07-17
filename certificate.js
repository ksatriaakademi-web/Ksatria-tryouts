/* ==========================================
   KSATRIA AKADEMI
   CERTIFICATE
========================================== */

document.addEventListener(
"DOMContentLoaded",
function(){


/* ==========================================
   Ambil Data
========================================== */

const resultData =
JSON.parse(
sessionStorage.getItem(
"ksatriaResult"
));


if(!resultData){

alert(
"Data sertifikat tidak ditemukan."
);

window.location.href="index.html";

return;

}


/* ==========================================
   Shortcut
========================================== */

const participant =
resultData.participant;


/* ==========================================
   Isi Data Sertifikat
========================================== */

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


/* ==========================================
   Nomor Sertifikat
========================================== */

const today =
new Date();


const year =
today.getFullYear();


const month =
String(
today.getMonth()+1
).padStart(2,"0");


const random =
Math.floor(
1000 +
Math.random()*9000
);


document.getElementById(
"certificateNumber"
).innerText =
`CERT/${year}/${month}/${random}`;


/* ==========================================
   Download PDF
========================================== */

const downloadBtn =
document.getElementById(
"downloadCertificate"
);


if(downloadBtn){

downloadBtn.addEventListener(
"click",
function(){

window.print();

});

}


/* ==========================================
   Kembali
========================================== */

const backBtn =
document.getElementById(
"goHome"
);


if(backBtn){

backBtn.addEventListener(
"click",
function(){

window.location.href=
"index.html";

});

}


});
