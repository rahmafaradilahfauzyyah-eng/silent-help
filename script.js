document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // FUNGSI GLOBAL UBAH STATUS
    // ==========================================
    window.ubahStatus = function(nomorLaporan, statusBaru) {
        let semuaLaporan = JSON.parse(localStorage.getItem("semuaLaporan")) || [];

        semuaLaporan.forEach((laporan) => {
            if (laporan.nomor === nomorLaporan) {
                laporan.status = statusBaru;
            }
        });

        localStorage.setItem("semuaLaporan", JSON.stringify(semuaLaporan));
        alert("Status berhasil diperbarui");
        location.reload();
    };

    // =========================
    // ELEMENT TARGET
    // =========================
    const logo = document.getElementById("logo-utama");
    const infoBox = document.getElementById("data-laporan-rahasia");
    const formLaporan = document.getElementById("formLaporan");
    const btnPanic = document.getElementById("btnPanic");

    // DEKLARASI ELEMENT KATEGORI LAINNYA
    const kategoriLainnya = document.getElementById("kategoriLainnya");
    const inputKategoriLainnya = document.getElementById("inputKategoriLainnya");

    // LOGIKA EVENT LISTENER TAMPIL/SEMBUNYI INPUT KATEGORI LAINNYA
    if (kategoriLainnya && inputKategoriLainnya) {
        kategoriLainnya.addEventListener("change", () => {
            if (kategoriLainnya.checked) {
                inputKategoriLainnya.style.display = "block";
                inputKategoriLainnya.required = true; 
            } else {
                inputKategoriLainnya.style.display = "none";
                inputKategoriLainnya.required = false;
                inputKategoriLainnya.value = "";
            }
        });
    }

    // =========================
    // VARIABEL KLIK LOGO (RAHASIA)
    // =========================
    let klik = 0;
    let timer;

    // =========================
    // NOMOR ADMIN WHATSAPP
    // =========================
    const nomorAdmin = "6282171946345";

    // =========================
    // TRIGGER LOGO 3x (Pindah Mode)
    // =========================
    if (logo) {
        logo.addEventListener("click", () => {
            klik++;
            clearTimeout(timer);
            timer = setTimeout(() => {
                klik = 0;
            }, 1200);

            if (klik >= 3) {
                klik = 0;
                const mode = prompt(
                    "Pilih Mode\n\n" +
                    "1 = Pelapor\n" +
                    "2 = Admin"
                );

                if (mode === "1") {
                    window.location.href = "silent_help.html";
                } else if (mode === "2") {
                    const password = prompt("Masukkan Password Admin");
                    if (password === "admin123") {
                        sessionStorage.setItem("modeAdmin", "true");
                        window.location.href = "admin.html";
                    } else {
                        alert("Password salah");
                    }
                }
            }
        });
    }

    // =========================
    // UTILITY: KIRIM WHATSAPP (Dioptimalkan agar Bypass Pop-up Blocker)
    // =========================
    function kirimWhatsApp(pesan) {
        const waURL = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
        // Menggunakan location.href jauh lebih aman daripada window.open yang sering diblokir browser
        window.location.href = waURL;
    }

    // =========================
    // UTILITY: SIMPAN LOCALSTORAGE
    // =========================
    function simpanLaporan(data) {
        let semuaLaporan = JSON.parse(localStorage.getItem("semuaLaporan")) || [];
        semuaLaporan.push(data);
        localStorage.setItem("semuaLaporan", JSON.stringify(semuaLaporan));
        localStorage.setItem("laporanSilentHelp", JSON.stringify(data));
    }

    // =========================
    // SUBMIT FORM LAPORAN (USER)
    // =========================
    if (formLaporan) {
        formLaporan.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!navigator.geolocation) {
                alert("Browser tidak mendukung GPS");
                return;
            }

            let nama = document.getElementById("nama").value;
            const anonim = document.getElementById("anonim").checked;

            if (anonim) {
                nama = "ANONIM";
            }

            const deskripsi = document.getElementById("deskripsi").value;
            const alamat = document.getElementById("alamat").value;
            const detailAlamat = document.getElementById("detail_alamat").value;

            const kategori = [];
            document.querySelectorAll('input[name="kategori"]:checked').forEach((item) => {
                if (item.value === "Lainnya") {
                    const isiLainnya = document.getElementById("inputKategoriLainnya").value.trim();
                    if (isiLainnya !== "") {
                        kategori.push(isiLainnya);
                    }
                } else {
                    kategori.push(item.value);
                }
            });

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const nomor = "SH-" + Date.now();

                    const data = {
                        nomor: nomor,
                        nama: nama,
                        anonim: anonim,
                        deskripsi: deskripsi,
                        kategori: kategori,
                        alamat: alamat,
                        detailAlamat: detailAlamat,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        waktu: new Date().toISOString(),
                        status: "Menunggu"
                    };

                    simpanLaporan(data);

                    // PERBAIKAN: Memperbaiki format pemanggilan variabel koordinat ${data.lat}
                    const mapsURL = `https://www.google.com/maps?q=${data.lat},${data.lng}`;

                    const pesan = `🚨 SILENT HELP 🚨\n\nNo Laporan:\n${data.nomor}\n\nNama:\n${data.nama}\n\nDeskripsi:\n${data.deskripsi}\n\nKategori:\n${data.kategori.join(", ")}\n\nAlamat:\n${data.alamat}\n\nDetail:\n${data.detailAlamat}\n\nLokasi:\n${mapsURL}\n\nWaktu:\n${data.waktu}`;

                    alert("Laporan berhasil diproses. Mengalihkan ke WhatsApp...");
                    kirimWhatsApp(pesan);
                },
                (error) => {
                    console.log(error);
                    alert("GPS gagal diakses. Pastikan izin lokasi browser Anda aktif.");
                }
            );
        });
    }

    // ==========================================
    // TOMBOL DARURAT (PANIC BUTTON)
    // ==========================================
    if (btnPanic) {
        btnPanic.addEventListener("click", () => {
            if (!navigator.geolocation) {
                alert("Browser tidak mendukung GPS");
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const nomor = "PANIC-" + Date.now();

                    const panicData = {
                        nomor: nomor,
                        nama: "DARURAT",
                        deskripsi: "Panic Button Active",
                        kategori: ["DARURAT"],
                        alamat: "Lokasi GPS",
                        detailAlamat: "-",
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                        waktu: new Date().toLocaleString(),
                        status: "DARURAT",
                        prioritas: true
                    };

                    localStorage.setItem("panicData", JSON.stringify(panicData));

                    let semuaLaporan = JSON.parse(localStorage.getItem("semuaLaporan")) || [];
                    semuaLaporan.push(panicData);
                    localStorage.setItem("semuaLaporan", JSON.stringify(semuaLaporan));

                    // PERBAIKAN: Memperbaiki format pemanggilan variabel koordinat ${panicData.lat}
                    const mapsURL = `https://www.google.com/maps?q=${panicData.lat},${panicData.lng}`;

                    const pesanPanic = `🚨 PANIC BUTTON AKTIF 🚨\n\nID:\n${panicData.nomor}\n\nLokasi:\n${mapsURL}\n\nWaktu:\n${panicData.waktu}`;

                    alert("Sinyal darurat terkirim. Mengalihkan ke WhatsApp...");
                    kirimWhatsApp(pesanPanic);
                },
                (error) => {
                    console.log(error);
                    alert("GPS gagal diakses. Aktifkan lokasi perangkat Anda.");
                }
            );
        });
    }

    // =========================
    // HALAMAN KONFIRMASI (USER)
    // =========================
    function tampilkanKonfirmasi() {
        if (infoBox) {
            infoBox.innerHTML = "";
        }
    }

    if (window.location.pathname.includes("konfirmasi.html")) {
        tampilkanKonfirmasi();
    }
});