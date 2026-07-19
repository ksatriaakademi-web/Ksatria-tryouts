/* ==========================================
   KSATRIA AKADEMI
   CBT DEMO ENGINE FINAL
   DATABASE VERSION
========================================== */


document.addEventListener(
"DOMContentLoaded",
function(){


// ==========================================
// AMBIL DATA PESERTA
// ==========================================

const participantData =

JSON.parse(

sessionStorage.getItem(
"ksatriaParticipant"
)

);



if(!participantData){


alert(
"Data peserta tidak ditemukan."
);


window.location.href =
"tryout.html";


return;


}




// ==========================================
// LOAD DATABASE SOAL
// ==========================================


fetch(
"database/skd_demo.json"
)


.then(
response => response.json()
)


.then(
data => {



const questions =
data.questions;



let currentQuestion = 0;


let answers = [];



let timeLeft =
data.duration * 60;



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
// BUAT PANEL NOMOR SOAL (DINAMIS)
// ==========================================

function renderNumberPanel(){

const panel =
document.getElementById(
"questionNumbers"
);

if(!panel) return;

panel.innerHTML =
questions.map(function(_, i){
return `<button class="number-item" data-index="${i}">${i + 1}</button>`;
}).join("");

Array.from(
panel.querySelectorAll(".number-item")
).forEach(function(btn){

btn.addEventListener("click", function(){

saveAnswer();

currentQuestion = parseInt(btn.dataset.index, 10);

loadQuestion();

});

});

}

renderNumberPanel();




// ==========================================
// TAMPIL SOAL
// ==========================================


function loadQuestion(){



const item =
questions[currentQuestion];



currentNumber.innerText =
currentQuestion + 1;



questionText.innerText =
item.question;



answerArea.innerHTML =
"";



const letters =
[
"A",
"B",
"C",
"D"
];



item.options.forEach(
function(option,index){



let checked = "";



if(
answers[currentQuestion]
===
letters[index]
){

checked =
"checked";

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





// ==========================================
// NOMOR SOAL
// ==========================================


function updateNumber(){


const numberItems =

document.querySelectorAll(
".number-item"
);



numberItems.forEach(
function(item,index){



item.classList.remove(
"active"
);



item.classList.remove(
"answered"
);



if(
index === currentQuestion
){

item.classList.add(
"active"
);

}



if(
answers[index]
){

item.classList.add(
"answered"
);

}



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
// BUTTON NEXT
// ==========================================


const nextBtn =
document.getElementById(
"nextBtn"
);



if(nextBtn){


nextBtn.onclick =
function(){


saveAnswer();



if(
currentQuestion <
totalQuestion - 1
){


currentQuestion++;


loadQuestion();


}



};


}





// ==========================================
// BUTTON PREVIOUS
// ==========================================


const previousBtn =
document.getElementById(
"previousBtn"
);



if(previousBtn){


previousBtn.onclick =
function(){


saveAnswer();



if(
currentQuestion > 0
){


currentQuestion--;


loadQuestion();


}



};


}





// ==========================================
// TIMER
// ==========================================


const timerElement =
document.getElementById(
"timer"
);



const timer =

setInterval(
function(){



let minute =
Math.floor(
timeLeft / 60
);



let second =
timeLeft % 60;



if(
second < 10
){

second =
"0" + second;

}



timerElement.innerText =
minute + ":" + second;



timeLeft--;



if(
timeLeft < 0
){


clearInterval(timer);


finishExam();


}



},
1000
);





// ==========================================
// HITUNG NILAI
// ==========================================


function calculateScore(){


let correct = 0;



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


correct:

correct,


wrong:

totalQuestion - correct,


score:

Math.round(

(correct / totalQuestion)

* 100

)


};



}





// ==========================================
// SELESAI UJIAN
// ==========================================


const finishBtn =
document.getElementById(
"finishBtn"
);



if(finishBtn){


finishBtn.onclick =
function(){



const confirmFinish =

confirm(
"Yakin ingin menyelesaikan tryout?"
);



if(confirmFinish){


saveAnswer();


finishExam();


}



};


}





function finishExam(){



clearInterval(timer);



const result =
calculateScore();




const year =
new Date()
.getFullYear();



const runningNumber =

String(Date.now())
.slice(-6);



const certificateNumber =

"KSA-SKD-" +
year +
"-" +
runningNumber;




const finalResult = {



participant:

participantData,



result:

result,



answers:

answers,



date:

new Date()
.toLocaleDateString(
"id-ID"
),



certificateNumber:

certificateNumber



};





sessionStorage.setItem(

"ksatriaResult",

JSON.stringify(
finalResult
)

);





window.location.href =
"result.html";



}





// ==========================================
// MULAI
// ==========================================


loadQuestion();



}


)


.catch(
error => {


console.error(
error
);


alert(
"Database soal gagal dimuat."
);


});


});
