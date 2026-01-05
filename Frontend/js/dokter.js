document.addEventListener("DOMContentLoaded", function() {
    // --- INISIALISASI EFEK BERKILAU OTOMATIS ---
    initializeAutoGlitterEffects();

    // --- LOGIKA FILTER DOKTER ---
    const filterButtons = document.querySelectorAll(".filter-btn");
    const doctorCards = document.querySelectorAll(".doctor-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.getAttribute("data-filter");

            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            doctorCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (filter === "all" || cardCategory === filter) {
                    card.style.display = "";
                    card.classList.add("animate-in");
                } else {
                    card.style.display = "none";
                    card.classList.remove("animate-in");
                }
            });
        });
    });

    // --- EVENT LISTENER UNTUK TOMBOL LIHAT PROFIL ---
    const profileButtons = document.querySelectorAll('.doctor-profile-btn');
    
    profileButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const doctorId = this.getAttribute('onclick') ? 
                this.getAttribute('onclick').match(/'([^']+)'/)[1] : 
                'sarah-wijaya';
            
            // Tampilkan popup profil dokter
            showDoctorProfilePopup(doctorId);
        });
    });

    // --- KLIK PADA CARD DOKTER (untuk klik di luar tombol) ---
    doctorCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Pastikan tidak triggered ketika mengklik tombol profil
            if (!e.target.closest('.doctor-profile-btn')) {
                const doctorBtn = this.querySelector('.doctor-profile-btn');
                if (doctorBtn) {
                    const doctorId = doctorBtn.getAttribute('onclick').match(/'([^']+)'/)[1];
                    
                    // Tampilkan popup profil dokter
                    showDoctorProfilePopup(doctorId);
                }
            }
        });
    });
});

// ==================================================
// FUNGSI POPUP PROFIL DOKTER (DESAIN SESUAI GAMBAR)
// ==================================================

function showDoctorProfilePopup(doctorId) {
    // Hapus popup yang sudah ada
    const existingPopup = document.querySelector('.doctor-profile-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Data dokter berdasarkan ID
    const doctorsData = {
        'sarah-wijaya': {
            name: "Dr. Sarah Wijaya, M.Psi.",
            specialty: "Psikolog Klinis",
            experience: "8 Tahun Pengalaman",
            about: "Spesialis dalam terapi kognitif-perilaku dan penanganan gangguan kecemasan dengan pendekatan holistik. Berpengalaman membantu pasien mengatasi berbagai masalah psikologis dengan pendekatan yang personal dan efektif.",
            education: [
                "S2 Psikologi Klinis, Universitas Gadjah Mada",
                "Sertifikasi Terapi Perilaku Kognitif (CBT)",
                "Sertifikasi Mindfulness Based Stress Reduction (MBSR)",
                "Pelatihan Psikoterapi Integratif"
            ],
            treatments: ["Kecemasan", "Depresi", "Bipolar"],
            image: "assets/images/dokter1.jpg"
        },
        'ahmad-rahman': {
            name: "Dr. Ahmad Rahman, Sp.KJ",
            specialty: "Psikiater",
            experience: "12 Tahun Pengalaman",
            about: "Ahli dalam diagnosis dan pengobatan gangguan mental kompleks dengan pendekatan holistik dan farmakoterapi. Berdedikasi memberikan perawatan yang komprehensif untuk berbagai kondisi psikiatri.",
            education: [
                "Spesialis Kedokteran Jiwa, Universitas Indonesia",
                "Sertifikasi Psikofarmakologi",
                "Fellowship di National Institute of Mental Health",
                "Pelatihan Neuropsikiatri"
            ],
            treatments: ["OCD", "Gangguan Psikotik", "ADHD"],
            image: "assets/images/dokter2.jpg"
        },
        'maya-sari': {
            name: "Maya Sari, S.Psi.",
            specialty: "Psikolog Konseling",
            experience: "6 Tahun Pengalaman",
            about: "Berpengalaman dalam konseling remaja, masalah hubungan interpersonal, dan perkembangan karir. Pendekatan yang empatik dan solutif untuk membantu klien mencapai kesejahteraan mental.",
            education: [
                "S1 Psikologi, Universitas Padjadjaran",
                "Sertifikasi Konseling Keluarga",
                "Pelatihan Terapi Pasangan",
                "Workship Interpersonal Skills"
            ],
            treatments: ["Remaja", "Keluarga", "Relationship"],
            image: "assets/images/dokter3.jpg"
        },
        'rina-dewi': {
            name: "Dr. Rina Dewi, Sp.KJ",
            specialty: "Psikiater Geriatri",
            experience: "15 Tahun Pengalaman",
            about: "Ahli dalam penanganan masalah mental pada lansia, dementia care, dan kesehatan mental usia lanjut. Fokus pada kualitas hidup dan kesejahteraan mental pasien usia senja.",
            education: [
                "Spesialis Kedokteran Jiwa Geriatri, Universitas Airlangga",
                "Sertifikasi Dementia Care Specialist",
                "Pelatihan Neuropsikiatri Lansia",
                "Fellowship Geriatric Psychiatry"
            ],
            treatments: ["Lansia", "Dementia", "Geriatri"],
            image: "assets/images/dokter4.jpg"
        },
        'lisa-chen': {
            name: "Dr. Lisa Chen, M.Psi.",
            specialty: "Psikolog Anak & Remaja",
            experience: "9 Tahun Pengalaman",
            about: "Spesialis dalam perkembangan anak, masalah psikologis remaja, dan terapi bermain untuk anak-anak. Pendekatan yang menyenangkan dan efektif untuk membantu anak dan remaja.",
            education: [
                "S2 Psikologi Anak & Remaja, Universitas Indonesia",
                "Sertifikasi Terapi Bermain",
                "Pelatihan Assesmen Perkembangan Anak",
                "Workshop Parenting Skills"
            ],
            treatments: ["Anak", "Remaja", "Perkembangan"],
            image: "assets/images/dokter5.jpg"
        },
        'budi-santoso': {
            name: "Dr. Budi Santoso, Sp.KJ",
            specialty: "Psikiater Umum",
            experience: "10 Tahun Pengalaman",
            about: "Berpengalaman menangani berbagai gangguan mental dengan pendekatan biopsikososial yang komprehensif. Kombinasi terapi dan pendekatan holistik untuk hasil optimal.",
            education: [
                "Spesialis Kedokteran Jiwa, Universitas Gadjah Mada",
                "Sertifikasi Psikoterapi Integratif",
                "Pelatihan Kesehatan Mental Komunitas",
                "Advance Psychopharmacology"
            ],
            treatments: ["Gangguan Mood", "Psikosis"],
            image: "assets/images/dokter6.jpg"
        }
    };
    
    // Ambil data dokter berdasarkan ID atau gunakan data default
    const doctorData = doctorsData[doctorId] || doctorsData['sarah-wijaya'];
    
    // Buat elemen popup
    const popup = document.createElement('div');
    popup.className = 'doctor-profile-popup active';
    popup.innerHTML = `
        <div class="popup-overlay"></div>
        <div class="popup-content">
            <button class="popup-close">&times;</button>
            
            <div class="doctor-popup-header">
                <div class="doctor-popup-image">
                    <img src="${doctorData.image}" alt="${doctorData.name}">
                </div>
                <div class="doctor-popup-info">
                    <h2>${doctorData.name}</h2>
                    <p class="popup-specialty">${doctorData.specialty}</p>
                    <p class="popup-experience">${doctorData.experience}</p>
                </div>
            </div>
            
            <div class="popup-sections">
                <div class="popup-section">
                    <h3><i class="fas fa-user-md"></i> Tentang Dokter</h3>
                    <p>${doctorData.about}</p>
                </div>
                
                <div class="popup-section">
                    <h3><i class="fas fa-graduation-cap"></i> Pendidikan & Sertifikasi</h3>
                    <ul class="education-list">
                        ${doctorData.education.map(item => 
                            `<li><i class="fas fa-certificate"></i> ${item}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="popup-section">
                    <h3><i class="fas fa-stethoscope"></i> Fokus Penanganan</h3>
                    <div class="treatment-focus">
                        ${doctorData.treatments.map(item => 
                            `<span class="treatment-tag">${item}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    // Event listener untuk tombol close
    const closeBtn = popup.querySelector('.popup-close');
    const overlay = popup.querySelector('.popup-overlay');
    
    const closePopup = () => {
        popup.classList.remove('active');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.remove();
            }
            document.body.style.overflow = '';
        }, 300);
    };
    
    closeBtn.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
    
    // Prevent popup close when clicking content
    popup.querySelector('.popup-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close popup with Escape key
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closePopup();
            document.removeEventListener('keydown', handleEscapeKey);
        }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
}

// ==================================================
// FUNGSI EFEK BERKILAU OTOMATIS
// ==================================================

function initializeAutoGlitterEffects() {
    const doctorCards = document.querySelectorAll('.doctor-card');
    
    doctorCards.forEach((card, index) => {
        // Inisialisasi elemen efek berkilau
        initializeCardGlitterElements(card);
        
        // Set delay berbeda untuk setiap card
        const delay = index * 0.3;
        card.style.setProperty('--glitter-delay', `${delay}s`);
        
        // Mulai efek random particles
        startContinuousRandomParticles(card);
    });
}

function initializeCardGlitterElements(card) {
    const effects = [
        { className: 'auto-sparkle-container', tag: 'div' },
        { className: 'auto-diamond-dust', tag: 'div' },
        { className: 'auto-floating-glitter', tag: 'div' },
        { className: 'pulse-glow', tag: 'div' }
    ];
    
    effects.forEach(effect => {
        if (!card.querySelector(`.${effect.className}`)) {
            const element = document.createElement(effect.tag);
            element.className = effect.className;
            
            if (effect.className === 'auto-sparkle-container') {
                // Tambahkan sparkle particles
                for (let i = 0; i < 8; i++) {
                    const sparkle = document.createElement('div');
                    sparkle.className = 'auto-sparkle';
                    element.appendChild(sparkle);
                }
            }
            
            if (effect.className === 'auto-floating-glitter') {
                // Tambahkan glitter specks
                for (let i = 0; i < 6; i++) {
                    const speck = document.createElement('div');
                    speck.className = 'auto-glitter-speck';
                    element.appendChild(speck);
                }
            }
            
            card.appendChild(element);
        }
    });
}

function startContinuousRandomParticles(card) {
    const container = card.querySelector('.auto-sparkle-container');
    
    // Mulai interval untuk random particles
    setInterval(() => {
        createAutoGlitterParticle(card, container);
    }, 800 + Math.random() * 1200);
}

function createAutoGlitterParticle(card, container) {
    const particle = document.createElement('div');
    particle.className = 'auto-glitter-particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = 2 + Math.random() * 3;
    
    // Random animation duration
    const duration = 2 + Math.random() * 2;
    
    // Random color
    const colors = ['#FFD700', '#C0C0C0', '#B9F2FF', '#FFFFFF', '#FFA500'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
        position: absolute;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        animation: autoRandomGlitter ${duration}s ease-out;
        box-shadow: 0 0 ${size * 2}px ${size}px ${color}40;
        pointer-events: none;
        z-index: 3;
    `;
    
    container.appendChild(particle);
    
    // Hapus particle setelah animation selesai
    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, duration * 1000);
}

// ==================================================
// FUNGSI UNTUK REDIRECT DAN LAINNYA
// ==================================================

function setDoctorProfile(doctorId) {
    showDoctorProfilePopup(doctorId);
}

// Fungsi untuk redirect dengan authentication check
function authRedirect(url) {
    // Simulasi check authentication
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    
    if (isLoggedIn) {
        window.location.href = url;
    } else {
        // Redirect ke login page dengan return url
        sessionStorage.setItem('returnUrl', url);
        window.location.href = 'login.html';
    }
}

// Fungsi untuk chatbot
function goToChatbotPage() {
    window.location.href = 'chatbot.html';
}

// Export functions for global access
if (typeof window !== 'undefined') {
    window.authRedirect = authRedirect;
    window.goToChatbotPage = goToChatbotPage;
    window.setDoctorProfile = setDoctorProfile;
    window.showDoctorProfilePopup = showDoctorProfilePopup;
}