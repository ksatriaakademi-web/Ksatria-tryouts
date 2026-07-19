/* ===================================================
   KSATRIA AKADEMI
   DASHBOARD V3
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
       ANIMASI PROGRESS BAR
    ========================================== */

    document.querySelectorAll(".progress-bar").forEach(bar => {

        const width = bar.style.width;

        bar.style.width = "0";

        setTimeout(() => {

            bar.style.width = width;

        }, 300);

    });

    /* ==========================================
       MENU ACTIVE
    ========================================== */

    document.querySelectorAll(".menu li").forEach(item => {

        item.addEventListener("click", () => {

            document.querySelectorAll(".menu li")
                .forEach(i => i.classList.remove("active"));

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

    document.querySelectorAll(".dashboard-card, .stats-card")
        .forEach(card => {

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

            const doc = await db.collection("users")
                .doc(user.uid)
                .get();

            if (!doc.exists) {

                alert("Data peserta tidak ditemukan.");
                return;

            }

            const data = doc.data();

            const userName = document.getElementById("userName");
            const userProgram = document.getElementById("userProgram");

            if (userName) {

                userName.textContent = data.fullname;

            }

            if (userProgram) {

                userProgram.textContent = data.program;

            }

            // lanjut ke Part 2
                   /* ==========================================
               HISTORY TRYOUT
            ========================================== */

            const historyTable = document.getElementById("historyBody");

            if (historyTable) {

                historyTable.innerHTML = "";

                try {

                    const snapshot = await db.collection("results")
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

                        snapshot.forEach(resultDoc => {

                            const result = resultDoc.data();

                            const status =
                                result.score >= 80
                                    ? "Lulus"
                                    : "Proses";

                            const badge =
                                result.score >= 80
                                    ? "bg-success"
                                    : "bg-warning text-dark";

                            const tanggal =
                                result.createdAt
                                    ? result.createdAt.toDate().toLocaleDateString("id-ID")
                                    : "-";

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

                    console.error("History Error :", error);

                }

            }

            /* ==========================================
               START TRYOUT
            ========================================== */

            const startButton =
                document.getElementById("startTryout");

            if (startButton) {

                startButton.onclick = () => {

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

                };

            }

            // lanjut ke Part 3
               } catch (error) {

            console.error("Dashboard Error :", error);

            alert("Terjadi kesalahan saat memuat dashboard.");

        }

    });

});
