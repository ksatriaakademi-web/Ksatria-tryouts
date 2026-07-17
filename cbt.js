/* ==========================================
   KSATRIA AKADEMI
   CBT V2 FINAL JAVASCRIPT
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){



// ===============================
// DATA PESERTA
// ===============================


const participantData =

JSON.parse(

sessionStorage.getItem(
"ksatriaParticipant"
)

);



if(!participantData){


alert(
"Data peserta tidak ditemukan"
);


window.location.href =
"tryout.html";


return;


}



// ===============================
// DATABASE SOAL
// ===============================


const questions = [


{
question:
"Indonesia merdeka pada tanggal?",

options:[
"17 Agustus 1945",
"20 Mei 1908",
"28 Oktober 1928",
"1 Juni 1945"
],

answer:"A"

},


{
question:
"Lambang negara Indonesia adalah?",

options:[
"Garuda Pancasila",
"Burung Merpati",
"Rajawali",
"Bintang"
],

answer:"A"

},


{
question:
"Jumlah sila dalam Pancasila adalah?",

options:[
"3",
"4",
"5",
"6"
],

answer:"C"

},


{
question:
"Ibu kota Indonesia saat ini adalah?",

options:[
"Bandung",
"Jakarta",
"Surabaya",
"Medan"
],

answer:"B"

},


{
question:
"Proklamasi kemerdekaan dibacakan oleh?",

options:[
"Soekarno",
"Ahmad Dahlan",
"Ki Hajar Dewantara",
"Jenderal Sudirman"
],

answer:"A"

}


];





// ===============================
// VARIABEL UJIAN
// ===============================


let currentQuestion = 0;


let answers = [];


let timeLeft = 50 * 60;


const totalQuestion =
questions.length;





// ===============================
// ELEMENT HTML
// ===============================


const questionText =
document.getElementById(
"questionText"
);


const answerArea =
document.querySelector(
".answer-list"
);


const currentNumber =
document.getElementById(
"currentNumber"
);


const totalNumber =
document.getElementById(
"totalQuestion"
);





totalNumber.innerText =
totalQuestion;





// ===============================
// TAMPILKAN SOAL
// ===============================


function loadQuestion(){



const data =
questions[currentQuestion];



currentNumber.innerText =
currentQuestion + 1;



questionText.innerText =
data.question;



answerArea.innerHTML="";



const letters =
["A","B","C","D"];



data.options.forEach(
function(option,index){


let checked="";


if(
answers[currentQuestion]
===
letters[index]
){

checked="checked";

}



answerArea.innerHTML += `


<label class="answer-item">


<input type="radio"

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



updateNumber();


}





// ===============================
// SIMPAN JAWABAN
// ===============================


function saveAnswer(){


const selected =

document.querySelector(
'input[name="answer"]:checked'
);



if(selected){


answers[currentQuestion]
=
selected.value;


}



}






// ===============================
// NOMOR SOAL
// ===============================


function updateNumber(){


const numbers =

document.querySelectorAll(
".number-item"
);



numbers.forEach(
function(item,index){



item.classList.remove(
"active"
);



item.classList.remove(
"answered"
);



if(index===currentQuestion){


item.classList.add(
"active"
);


}



if(answers[index]){


item.classList.add(
"answered"
);


}



});



}






// Klik nomor soal


document
.querySelectorAll(
".number-item"
)
.forEach(
function(item,index){


item.addEventListener(
"click",
function(){


saveAnswer();


currentQuestion=index;


loadQuestion();


});


});






// ===============================
// BUTTON NEXT
// ===============================


const nextBtn =

document.getElementById(
"nextBtn"
);



nextBtn.onclick =
function(){


saveAnswer();



if(currentQuestion <
totalQuestion-1){


currentQuestion++;


loadQuestion();


}



};






// ===============================
// BUTTON PREVIOUS
// ===============================


const previousBtn =

document.getElementById(
"previousBtn"
);



previousBtn.onclick =
function(){


saveAnswer();



if(currentQuestion>0){


currentQuestion--;


loadQuestion();


}



};







// ===============================
// TIMER
// ===============================


const timerElement =

document.getElementById(
"timer"
);



const timer =

setInterval(
function(){


let minute =
Math.floor(timeLeft/60);



let second =
timeLeft%60;



if(second<10){

second="0"+second;

}



timerElement.innerText =

minute + ":" + second;



timeLeft--;



if(timeLeft<0){


clearInterval(timer);


finishExam();


}



},
1000);








// ===============================
// HITUNG NILAI
// ===============================


function calculateScore(){



let correct=0;



questions.forEach(
function(item,index){



if(
answers[index]
===
item.answer
){

correct++;

}



});



return {


correct:correct,


wrong:
totalQuestion-correct,


score:

Math.round(
(correct/totalQuestion)*100
)


};


}







// ===============================
// SELESAI UJIAN
// ===============================


const finishBtn =

document.getElementById(
"finishBtn"
);



finishBtn.onclick =
function(){


let confirmTest =

confirm(
"Yakin ingin menyelesaikan ujian?"
);



if(confirmTest){


finishExam();


}


};







function finishExam(){

    const result =
    calculateScore();



    // ==========================================
    // NOMOR SERTIFIKAT
    // ==========================================

    const year =
    new Date().getFullYear();

    const runningNumber =
    String(Date.now()).slice(-6);

    const certificateNumber =
    `KSA-TRYOUT-${year}-${runningNumber}`;



    // ==========================================
    // DATA HASIL
    // ==========================================

    const finalResult = {

        participant:
        participantData,

        result:
        result,

        answers:
        answers,

        date:
        new Date()
        .toLocaleDateString("id-ID"),

        certificateNumber:
        certificateNumber

    };



    sessionStorage.setItem(

        "ksatriaResult",

        JSON.stringify(finalResult)

    );



    window.location.href =
    "result.html";

}






// MULAI CBT


loadQuestion();



});
