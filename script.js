/* ===================================================
   KSATRIA AKADEMI V2
   script.js
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       NAVBAR SCROLL
    ========================== */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            navbar.style.background = "rgba(8,31,77,.96)";
            navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.25)";

        } else {

            navbar.style.background = "rgba(8,31,77,.85)";
            navbar.style.boxShadow = "none";

        }

    });

    /* ==========================
       COUNTER
    ========================== */

    const counters = document.querySelectorAll(".counter");

    const startCounter = () => {

        counters.forEach(counter => {

            const target = Number(counter.dataset.target);
            const speed = 80;

            const update = () => {

                const current = Number(counter.innerText);
                const increment = Math.ceil(target / speed);

                if (current < target) {

                    counter.innerText = current + increment;

                    setTimeout(update, 20);

                } else {

                    if (target >= 1000) {

                        counter.innerText = target.toLocaleString("id-ID") + "+";

                    } else if (target === 98) {

                        counter.innerText = target + "%";

                    } else {

                        counter.innerText = target + "+";

                    }

                }

            };

            update();

        });

    };

    const statisticSection = document.querySelector(".statistics");

    if (statisticSection) {

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    startCounter();
                    observer.disconnect();

                }

            });

        }, {
            threshold: 0.4
        });

        observer.observe(statisticSection);

    }

    /* ==========================
       BACK TO TOP
    ========================== */

    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            backToTop.style.display = "flex";
            backToTop.style.alignItems = "center";
            backToTop.style.justifyContent = "center";

        } else {

            backToTop.style.display = "none";

        }

    });

    backToTop.addEventListener("click", () => {

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    });

    /* ==========================
       ACTIVE NAV LINK
    ========================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {

        let current = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 120;

            if (window.scrollY >= sectionTop) {

                current = section.getAttribute("id");

            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href") === "#" + current) {

                link.classList.add("active");

            }

        });

    });

    /* ==========================
       FADE ANIMATION
    ========================== */

    const fadeElements = document.querySelectorAll(
        ".program-card, .feature-card, .testimonial-card, .stat-card"
    );

    const fadeObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("fade-up");

            }

        });

    }, {
        threshold: 0.15
    });

    fadeElements.forEach(item => {

        fadeObserver.observe(item);

    });

});
