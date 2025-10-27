// JavaScript untuk interaksi sederhana
document.addEventListener('DOMContentLoaded', function() {
    // Set menu aktif berdasarkan halaman saat ini
    setActiveMenuByPage();

    // Tambahkan event listener untuk klik menu navigasi
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Hapus active dari semua menu
            navLinks.forEach(l => l.classList.remove('active'));
            // Tambahkan active ke menu yang diklik
            this.classList.add('active');
        });
    });
    
    // Animasi sederhana untuk tabel saat di-scroll
    const tables = document.querySelectorAll('table');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    tables.forEach(table => {
        table.style.opacity = '0';
        table.style.transform = 'translateY(20px)';
        table.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(table);
    });
    
    // Animasi untuk kartu profesi
    const professionCards = document.querySelectorAll('.profession-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    professionCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s, transform 0.5s';
        cardObserver.observe(card);
    });
});

// Fungsi untuk set menu aktif berdasarkan halaman
function setActiveMenuByPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Reset semua menu
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Set menu aktif berdasarkan halaman saat ini
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Handle berbagai kondisi
        if ((currentPage === '' || currentPage === 'index.html') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (currentPage === linkHref) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk redirect ke halaman chatbot dari tombol pop-up
function goToChatbotPage() {
    window.location.href = 'chatbot.html';
}