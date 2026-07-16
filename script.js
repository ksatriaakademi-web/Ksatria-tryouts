/*==================================================
KSATRIA AKADEMI
SCRIPT.JS V1
==================================================*/

document.addEventListener("DOMContentLoaded", function () {

    /*=====================================
    NAVBAR SCROLL
    =====================================*/

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 60) {

            navbar.classList.add("navbar-scroll");

        } else {

            navbar.classList.remove("navbar-scroll");

        }

    });

});
/*==================================================
COUNTER ANIMATION
==================================================*/

const statsSection = document.querySelector("#stats");
const counters = document.querySelectorAll(".counter");

let counterStarted = false;

function startCounter() {

    if (counterStarted) return;

    counterStarted = true;

    counters.forEach(counter => {

        const target = parseInt(counter.dataset.target);

        let current = 0;

        const increment = Math.ceil(target / 100);

        function updateCounter() {

            current += increment;

            if (current >= target) {

                counter.innerText = target.toLocaleString("id-ID") + "+";

            } else {

                counter.innerText = current.toLocaleString("id-ID");

                requestAnimationFrame(updateCounter);

            }

        }

        updateCounter();

    });

}

window.addEventListener("scroll", () => {

    if (!statsSection) return;

    const position = statsSection.getBoundingClientRect().top;

    if (position < window.innerHeight - 100) {

        startCounter();

    }

});
/*==================================================
SCROLL REVEAL
==================================================*/

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    reveals.forEach(item=>{

        const top = item.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if(top < windowHeight - 100){

            item.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();
