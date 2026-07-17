/* ==========================================
   KSATRIA AKADEMI
   CBT V2 JAVASCRIPT
   PART 1
========================================== */



document.addEventListener(
    "DOMContentLoaded",
    function(){



// ==========================================
// Ambil Data Peserta
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
// Data Ujian
// ==========================================


let currentQuestion = 0;


let answers = [];


let totalQuestion = 5;


// Demo soal awal
// Nanti diganti bank soal PDF


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




// ==========================================
// Set Total Soal
// ==========================================


document.getElementById(
    "totalQuestion"
).innerText =
totalQuestion;



// ==========================================
// Tampilkan Soal
// ==========================================


function loadQuestion(){



const data =
questions[currentQuestion];



document.getElementById(
    "currentNumber"
).innerText =
currentQuestion + 1;



document.getElementById(
    "questionText"
).innerText =
data.question;



const answerArea =
document.querySelector(
    ".answer-list"
);



answerArea.innerHTML = "";



const letters =
[
"A",
"B",
"C",
"D"
];



data.options.forEach(
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



// Jalankan soal pertama

loadQuestion();



});
// ==========================================
// Simpan Jawaban
// ==========================================


function saveAnswer(){


    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );


    if(selected){

        answers[currentQuestion] =
            selected.value;

    }


}





// ==========================================
// Tombol Berikutnya
// ==========================================


const nextBtn =
document.getElementById(
    "nextBtn"
);



nextBtn.addEventListener(
"click",
function(){



    saveAnswer();



    if(currentQuestion < totalQuestion - 1){


        currentQuestion++;


        loadQuestion();


    }else{


        alert(
            "Ini adalah soal terakhir."
        );


    }



});





// ==========================================
// Tombol Sebelumnya
// ==========================================


const previousBtn =
document.getElementById(
    "previousBtn"
);



previousBtn.addEventListener(
"click",
function(){



    saveAnswer();



    if(currentQuestion > 0){


        currentQuestion--;


        loadQuestion();


    }



});





// ==========================================
// Update Status Nomor Soal
// ==========================================


function updateQuestionNumber(){


const numbers =
document.querySelectorAll(
    ".number-item"
);



numbers.forEach(
function(item,index){


    item.classList.remove(
        "active"
    );


    if(index === currentQuestion){


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
// ==========================================
// TIMER UJIAN
// ==========================================


let timeLeft = 50 * 60; // 50 menit


const timerElement =
document.getElementById(
    "timer"
);



function startTimer(){


    const timer =
    setInterval(function(){



        let minutes =
        Math.floor(timeLeft / 60);



        let seconds =
        timeLeft % 60;



        seconds =
        seconds < 10
        ? "0" + seconds
        : seconds;



        timerElement.innerText =
        minutes + ":" + seconds;



        timeLeft--;



        if(timeLeft < 0){


            clearInterval(timer);


            finishExam();


        }



    },1000);



}



startTimer();





// ==========================================
// HITUNG NILAI
// ==========================================


function calculateScore(){



let correct = 0;



questions.forEach(
function(question,index){



    if(
        answers[index] === question.answer
    ){

        correct++;

    }



});



let score =
Math.round(
    (correct / totalQuestion) * 100
);



return {


    correct:correct,


    wrong:
    totalQuestion - correct,


    score:score



};



}





// ==========================================
// SELESAI UJIAN
// ==========================================


const finishBtn =
document.getElementById(
    "finishBtn"
);



finishBtn.addEventListener(
"click",
function(){



    let confirmFinish =
    confirm(
        "Apakah kamu yakin ingin menyelesaikan ujian?"
    );



    if(confirmFinish){


        finishExam();


    }



});





function finishExam(){



    const result =
    calculateScore();




    const finalResult = {



        participant:
        participantData,



        result:result,



        answers:answers,



        date:
        new Date()
        .toLocaleDateString("id-ID")



    };




    sessionStorage.setItem(

        "ksatriaResult",

        JSON.stringify(finalResult)

    );





    window.location.href =
    "result.html";



}

