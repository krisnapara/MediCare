// JavaScript untuk interaksi sederhana
document.addEventListener('DOMContentLoaded', function() {
    // Tambahkan kelas aktif ke menu navigasi saat di klik
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
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


function goToChatbotPage() {
    window.location.href = 'chatbot.html';
}