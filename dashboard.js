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

        const target = parseInt(text);

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
       PROGRESS BAR
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
       SIDEBAR ACTIVE
    ========================================== */

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(i => i.classList.remove("active"));

            item.classList.add("active");

        });

    });

    /* ==========================================
       NOTIFICATION
    ========================================== */

    const notification = document.querySelector(".notification-btn");

    if (notification) {

        notification.addEventListener("click", () => {

            alert("🔔 Tidak ada notifikasi baru.");

        });

    }

    /* ==========================================
       LOGOUT
    ========================================== */

    const logoutLink = document.querySelector('a[href="index.html"]');

    if (logoutLink) {

        logoutLink.addEventListener("click", function (e) {

            const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");

            if (!confirmLogout) {

                e.preventDefault();

            } else {

                auth.signOut();

            }

        });

    }

    /* ==========================================
       HOVER CARD
    ========================================== */

    const cards = document.querySelectorAll(".dashboard-card, .stats-card");

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
       LOAD USER
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

                const userName = document.getElementById("userName");
                const userProgram = document.getElementById("userProgram");

                if (userName) {

                    userName.textContent = data.fullname;

                }

                if (userProgram) {

                    userProgram.textContent = data.program;

                }

            }

        } catch (error) {

            console.error(error);

        }

    });

    /* ==========================================
       START TRYOUT
    ========================================== */

    const startButton = document.getElementById("startTryout");

    if (startButton) {

        startButton.addEventListener("click", async () => {

            const user = auth.currentUser;

            if (!user) {

                window.location.href = "login.html";
                return;

            }
/* ==========================================
   HISTORY TRYOUT
========================================== */

const historyTable = document.getElementById("historyBody");

if (historyTable) {

    auth.onAuthStateChanged(async (user) => {

        if (!user) return;

        try {

            const snapshot = await db.collection("results")
                .where("uid", "==", user.uid)
                .orderBy("createdAt", "desc")
                .get();

            historyTable.innerHTML = "";

            if (snapshot.empty) {

                historyTable.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">
                            Belum ada riwayat tryout.
                        </td>
                    </tr>
                `;

                return;

            }

            snapshot.forEach(doc => {

                const data = doc.data();

                let status = "Proses";

                if (data.score >= 80) {

                    status = "Lulus";

                }

                historyTable.innerHTML += `
                    <tr>
                        <td>${data.program}</td>
                        <td>${data.createdAt.toDate().toLocaleDateString("id-ID")}</td>
                        <td>${data.score}</td>
                        <td>
                            <span class="badge ${status === "Lulus" ? "bg-success" : "bg-warning text-dark"}">
                                ${status}
                            </span>
                        </td>
                    </tr>
                `;

            });

        } catch (error) {

            console.error(error);

        }

    });

}
            try {

                const doc = await db.collection("users").doc(user.uid).get();

                if (!doc.exists) {

                    alert("Data peserta tidak ditemukan.");
                    return;

                }

                const data = doc.data();

                const participantData = {

                    name: data.fullname,
                    school: data.school || "-",
                    program: data.program

                };

                sessionStorage.setItem(
                    "ksatriaParticipant",
                    JSON.stringify(participantData)
                );

                window.location.href = "cbt.html";

            } catch (error) {

                console.error(error);
                alert("Terjadi kesalahan.");

            }

        });

    }

});
