/* ==========================================
   KSATRIA AKADEMI
   RESULT V2 JAVASCRIPT
   PART 1
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){



// ==========================================
// Ambil Data Hasil CBT
// ==========================================


const resultData =

JSON.parse(

sessionStorage.getItem(
"ksatriaResult"
)

);





if(!resultData){


    alert(
        "Data hasil ujian tidak ditemukan."
    );


    window.location.href =
    "index.html";


    return;


}





// ==========================================
// Data Peserta
// ==========================================


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





// ==========================================
// Tanggal Ujian
// ==========================================


document.getElementById(
"examDate"
).innerText =

resultData.date;





// ==========================================
// Statistik Nilai
// ==========================================


const scoreData =
resultData.result;



document.getElementById(
"score"
).innerText =

scoreData.score;



document.getElementById(
"correctAnswer"
).innerText =

scoreData.correct;



document.getElementById(
"wrongAnswer"
).innerText =

scoreData.wrong;



document.getElementById(
"totalAnswer"
).innerText =

scoreData.correct +
scoreData.wrong;



// ==========================================
// Status Nilai
// ==========================================


const statusText =

document.getElementById(
"statusText"
);



if(scoreData.score >= 90){


    statusText.innerText =
    "Sangat Baik";


}

else if(scoreData.score >= 75){


    statusText.innerText =
    "Baik";


}

else if(scoreData.score >= 60){


    statusText.innerText =
    "Cukup";


}

else{


    statusText.innerText =
    "Perlu Latihan";


}




});
// ==========================================
// Animasi Nilai
// ==========================================


const scoreElement =
document.getElementById(
    "score"
);


let finalScore =
Number(scoreData.score);



let counter = 0;



const scoreAnimation =

setInterval(function(){



    scoreElement.innerText =
    counter;



    counter++;



    if(counter > finalScore){


        clearInterval(
            scoreAnimation
        );


        scoreElement.innerText =
        finalScore;


    }



},20);






// ==========================================
// Tombol Pembahasan
// ==========================================


const discussionBtn =

document.getElementById(
"discussionBtn"
);



discussionBtn.addEventListener(
"click",
function(){



    alert(

    "Pembahasan soal akan tersedia setelah sistem bank soal selesai."

    );


});






// ==========================================
// Efek Card Masuk
// ==========================================


const card =

document.querySelector(
".result-card"
);



card.style.opacity = "0";

card.style.transform =
"translateY(30px)";



setTimeout(function(){


    card.style.transition =
    "0.6s ease";


    card.style.opacity =
    "1";


    card.style.transform =
    "translateY(0)";



},100);





});
