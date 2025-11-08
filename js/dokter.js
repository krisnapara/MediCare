document.addEventListener("DOMContentLoaded", function() {

    // --- LOGIKA FILTER DOKTER ---

    // 1. Ambil semua tombol filter
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    // 2. Ambil semua kartu dokter
    const doctorCards = document.querySelectorAll(".doctor-card");

    // 3. Tambahkan event click ke setiap tombol filter
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Ambil kategori filter dari atribut data-filter
            const filter = button.getAttribute("data-filter");

            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove("active"));
            
            // Tambahkan kelas 'active' ke tombol yang baru diklik
            button.classList.add("active");

            // 4. Logika untuk menampilkan atau menyembunyikan kartu dokter
            doctorCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                // Jika filter adalah "all" ATAU kategori kartu cocok dengan filter
                if (filter === "all" || cardCategory === filter) {
                    card.style.display = ""; // Tampilkan kartu
                    card.classList.add("animate-in"); // Tambahkan animasi (opsional)
                } else {
                    card.style.display = "none"; // Sembunyikan kartu
                    card.classList.remove("animate-in");
                }
            });
        });
    });
});