/* ==========================================
   KSATRIA AKADEMI
   CBT DEMO ENGINE
   DATABASE VERSION TEST
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){


// ==========================================
// LOAD DATABASE SOAL
// ==========================================

fetch("database/skd_demo.json")

.then(response => response.json())

.then(data => {



const questions = data.questions;



// ==========================================
// VARIABEL UJIAN
// ==========================================


let currentQuestion = 0;


let answers = [];


let timeLeft = data.duration * 60;


const totalQuestion =
questions.length;




// ==========================================
// ELEMENT
// ==========================================


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



// ==========================================
// LOAD SOAL
// ==========================================


function loadQuestion(){


const item =
questions[currentQuestion];


currentNumber.innerText =
currentQuestion + 1;


questionText.innerText =
item.question;


answerArea.innerHTML="";


const letters =
["A","B","C","D"];



item.options.forEach(
function(option,index){


answerArea.innerHTML += `

<label class="answer-item">

<input type="radio"

name="answer"

value="${letters[index]}">


<span class="option-letter">

${letters[index]}

</span>


<span class="option-text">

${option}

</span>


</label>

`;

});


}



// ==========================================
// SIMPAN JAWABAN
// ==========================================


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



// ==========================================
// NEXT
// ==========================================


document.getElementById(
"nextBtn"
).onclick = function(){


saveAnswer();


if(currentQuestion < totalQuestion-1){

currentQuestion++;

loadQuestion();

}


};




// ==========================================
// PREVIOUS
// ==========================================


document.getElementById(
"previousBtn"
).onclick = function(){


saveAnswer();


if(currentQuestion > 0){

currentQuestion--;

loadQuestion();

}


};




// ==========================================
// TIMER
// ==========================================


const timerElement =
document.getElementById(
"timer"
);



setInterval(
function(){


let minute =
Math.floor(timeLeft / 60);


let second =
timeLeft % 60;



if(second < 10){

second =
"0" + second;

}



timerElement.innerText =
minute + ":" + second;



timeLeft--;


},
1000
);




// ==========================================
// MULAI
// ==========================================


loadQuestion();



})


.catch(error => {


console.error(
"Database soal gagal dimuat:",
error
);


alert(
"Database soal tidak ditemukan"
);


});


});
