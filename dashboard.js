/* ===================================================
   KSATRIA AKADEMI
   DASHBOARD V4 FINAL
=================================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ Dashboard KSATRIA AKADEMI dimuat.");

    /* ==========================================
       ANIMASI STATISTIK
    ========================================== */

    const statNumbers = document.querySelectorAll(".stats-content h3");

    statNumbers.forEach(item => {

        const originalText = item.textContent.trim();

        const target = parseInt(originalText.replace(/\D/g, ""), 10);

        if (isNaN(target)) return;

        const prefix = originalText.startsWith("#") ? "#" : "";
        const suffix = originalText.endsWith("%") ? "%" : "";

        let current = 0;

        const increment = Math.max(1, Math.ceil(target / 40));

        const counter = setInterval(() => {

            current += increment;

            if (current >= target) {

                current = target;

                clearInterval(counter);

            }

            item.textContent = prefix + current + suffix;

        }, 30);

    });

    /* ==========================================
       ANIMASI PROGRESS BAR
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
       MENU ACTIVE
    ========================================== */

    const menuItems = document.querySelectorAll(".menu li");

    menuItems.forEach(item => {

        item.addEventListener("click", () => {

            menuItems.forEach(menu => {

                menu.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

    /* ==========================================
       NOTIFIKASI
    ========================================== */

    const notificationBtn = document.querySelector(".notification-btn");

    if (notificationBtn) {

        notificationBtn.addEventListener("click", () => {

            alert("🔔 Tidak ada notifikasi baru.");

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

    /* ==========================================
       LOGOUT
    ========================================== */

    const logoutLink = document.querySelector('a[href="index.html"]');

    if (logoutLink) {

        logoutLink.addEventListener("click", async function (e) {

            e.preventDefault();

            const confirmLogout = confirm(
                "Apakah Anda yakin ingin keluar?"
            );

            if (!confirmLogout) return;

            try {

                await auth.signOut();

                window.location.href = "login.html";

            } catch (error) {

                console.error(error);

                alert("Logout gagal.");

            }

        });

    }

    /* ==========================================
       AUTH
    ========================================== */

    auth.onAuthStateChanged(async (user) => {

        if (!user) {

            window.location.href = "login.html";

            return;

        }

        try {

            const userDoc = await db
                .collection("users")
                .doc(user.uid)
                .get();

            if (!userDoc.exists) {

                alert("Data peserta tidak ditemukan.");

                return;

            }

            const data = userDoc.data();
                       /* ==========================================
               TAMPILKAN DATA USER
            ========================================== */

            const userName = document.getElementById("userName");
            const userProgram = document.getElementById("userProgram");

            if (userName) {

                userName.textContent = data.fullname;

            }

            if (userProgram) {

                userProgram.textContent = data.program;

            }

            /* ==========================================
               HISTORY TRYOUT
            ========================================== */

            const historyTable =
                document.getElementById("historyTable");

            if (historyTable) {

                historyTable.innerHTML = "";

                try {

                    const snapshot = await db
                        .collection("results")
                        .where("uid", "==", user.uid)
                        .orderBy("createdAt", "desc")
                        .get();

                    if (snapshot.empty) {

                        historyTable.innerHTML = `
                            <tr>
                                <td colspan="4" class="text-center">
                                    Belum ada riwayat tryout.
                                </td>
                            </tr>
                        `;

                    } else {

                        snapshot.forEach(doc => {

                            const result = doc.data();

                            const tanggal =
                                result.createdAt
                                    ? result.createdAt
                                        .toDate()
                                        .toLocaleDateString("id-ID")
                                    : "-";

                            const status =
                                result.score >= 80
                                    ? "Lulus"
                                    : "Proses";

                            const badge =
                                result.score >= 80
                                    ? "bg-success"
                                    : "bg-warning text-dark";

                            historyTable.innerHTML += `
                                <tr>
                                    <td>${result.program}</td>
                                    <td>${tanggal}</td>
                                    <td>${result.score}</td>
                                    <td>
                                        <span class="badge ${badge}">
                                            ${status}
                                        </span>
                                    </td>
                                </tr>
                            `;

                        });

                    }

                } catch (error) {

                    console.error(
                        "History Error:",
                        error
                    );

                }

            }

            /* ==========================================
               START TRYOUT
            ========================================== */

            const startButton =
                document.getElementById("startTryout");

            if (startButton) {

                startButton.addEventListener("click", () => {

                    const participantData = {

                        uid: user.uid,

                        name: data.fullname,

                        school: data.school || "-",

                        program: data.program

                    };

                    sessionStorage.setItem(
                        "ksatriaParticipant",
                        JSON.stringify(participantData)
                    );

                    window.location.href = "cbt.html";

                });

            }
                   } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            alert(
                "Terjadi kesalahan saat memuat dashboard."
            );

        }

    });

});
