/* ===================================================
   KSATRIA AKADEMI
   DASHBOARD V2
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================================
       ANIMASI ANGKA STATISTIK
    ========================================== */

    const statNumbers = document.querySelectorAll(".stats-content h3");

    statNumbers.forEach(item => {

        const text = item.textContent.trim();

        if (!/^\d+$/.test(text)) return;

        const target = parseInt(text, 10);

        let current = 0;

        const increment = Math.max(1, Math.ceil(target / 40));

        const counter = setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(counter);

            }

            item.textContent = current;

        }, 30);

    });

    /* ==========================================
       PROGRESS BAR ANIMATION
    ========================================== */

    const progressBars = document.querySelectorAll(".progress-bar");

    progressBars.forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.width = width;

        }, 300);

    });

    /* ==========================================
       SIDEBAR ACTIVE MENU
    ========================================== */

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

        });

    });

    /* ==========================================
       NOTIFICATION BUTTON
    ========================================== */

    const notification = document.querySelector(".notification-btn");

    if (notification) {

        notification.addEventListener("click", () => {

            alert(
                "🔔 Tidak ada notifikasi baru."
            );

        });

    }

    /* ==========================================
       LOGOUT
    ========================================== */

    const logoutLink = document.querySelector('a[href="index.html"]');

    if (logoutLink) {

        logoutLink.addEventListener("click", function (e) {

            const confirmLogout = confirm(
                "Apakah Anda yakin ingin keluar?"
            );

            if (!confirmLogout) {

                e.preventDefault();

            }

        });

    }

    /* ==========================================
       HOVER CARD
    ========================================== */

    const cards = document.querySelectorAll(
        ".dashboard-card, .stats-card"
    );

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-6px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

    console.log("✅ Dashboard KSATRIA AKADEMI berhasil dimuat.");

   /* ==========================================
   LOAD USER DATA
========================================== */

auth.onAuthStateChanged(async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    try {

        const doc = await db.collection("users").doc(user.uid).get();

        if (doc.exists) {

            const data = doc.data();

            document.getElementById("userName").textContent =
                data.fullname;

            document.getElementById("userProgram").textContent =
                data.program;
const startButton = document.getElementById("startTryout");

startButton.addEventListener("click", () => {

    if (data.program === "TNI") {

        window.location.href = "cbt.html";

    } else if (data.program === "POLRI") {

        window.location.href = "cbt.html";

    } else if (data.program === "SKD") {

        window.location.href = "cbt.html";

    } else if (data.program === "SNBT") {

        window.location.href = "cbt.html";

    } else {

        alert("Program belum tersedia.");

    }

});
        }

    } catch (error) {

        console.error(error);

    }

});

});
