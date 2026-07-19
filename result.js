/* ==========================================
   KSATRIA AKADEMI
   RESULT V2 FINAL JAVASCRIPT
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){



// ===============================
// AMBIL DATA HASIL
// ===============================


const resultData =

JSON.parse(

sessionStorage.getItem(
"ksatriaResult"
)

);



if(!resultData){


alert(
"Data hasil tidak ditemukan"
);


window.location.href =
"index.html";


return;


}



// ===============================
// DATA PESERTA
// ===============================


const participant =
resultData.participant;



document.getElementById(
"participantName"
).innerText =

participant.name || "-";



document.getElementById(
"participantSchool"
).innerText =

participant.school || "-";



document.getElementById(
"participantProgram"
).innerText =

participant.program || "-";



document.getElementById(
"examDate"
).innerText =

resultData.date || "-";






// ===============================
// NILAI
// ===============================


const result =
resultData.result;



const score =
result.score;



const correct =
result.correct;



const wrong =
result.wrong;




document.getElementById(
"score"
).innerText =
score;



document.getElementById(
"correctAnswer"
).innerText =
correct;



document.getElementById(
"wrongAnswer"
).innerText =
wrong;



document.getElementById(
"totalAnswer"
).innerText =

correct + wrong;






// ===============================
// STATUS NILAI
// ===============================


const statusElement =

document.getElementById(
"statusText"
);



if(score >= 90){


statusElement.innerText =
"Sangat Baik";


}

else if(score >=75){


statusElement.innerText =
"Baik";


}

else if(score >=60){


statusElement.innerText =
"Cukup";


}

else{


statusElement.innerText =
"Perlu Latihan";


}






// ===============================
// ANIMASI NILAI
// ===============================


let count = 0;



const animation =

setInterval(
function(){


document.getElementById(
"score"
).innerText =
count;



count++;



if(count > score){


clearInterval(animation);



document.getElementById(
"score"
).innerText =
score;



}



},
20);






// ===============================
// TOMBOL KEMBALI
// ===============================



// ===============================
// TOMBOL PEMBAHASAN
// ===============================


const discussionBtn =

document.getElementById(
"discussionBtn"
);



if(discussionBtn){


discussionBtn.onclick =
function(){


alert(
"Pembahasan akan tersedia setelah bank soal selesai."
);


};


}




});
