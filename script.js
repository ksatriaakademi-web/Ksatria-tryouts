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
