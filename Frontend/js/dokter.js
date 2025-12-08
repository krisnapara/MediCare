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

    // --- FUNGSI TOMBOL BACA REVIEW ---
    const reviewButtons = document.querySelectorAll('.btn-review');
    
    reviewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const doctorCard = this.closest('.doctor-card');
            const doctorName = doctorCard.querySelector('h3').textContent;
            const doctorSpecialty = doctorCard.querySelector('.doctor-specialty').textContent;
            const reviewCount = this.querySelector('.review-count').textContent;
            const doctorId = this.getAttribute('data-doctor');
            
            // Tampilkan modal review
            showReviewsModal(doctorName, doctorSpecialty, reviewCount, doctorId);
        });
    });

    // --- KLIK PADA CARD DOKTER (Redirect ke profil) ---
    doctorCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Pastikan tidak triggered ketika mengklik tombol review
            if (!e.target.closest('.btn-review')) {
                const doctorName = this.querySelector("h3").textContent;
                const doctorData = {
                    name: doctorName,
                    specialty: this.querySelector(".doctor-specialty").textContent,
                    experience: this.querySelector(".doctor-experience").textContent,
                    description: this.querySelector(".doctor-desc").textContent,
                    skills: Array.from(this.querySelectorAll(".skill-tag")).map(tag => tag.textContent)
                };
                
                sessionStorage.setItem('selectedDoctor', JSON.stringify(doctorData));
                window.location.href = 'profil_dokter.html';
            }
        });
    });
});

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
    }, 800 + Math.random() * 1200); // Random interval antara 800-2000ms
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
    
    // Random color (gold, silver, atau diamond)
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
// FUNGSI REVIEW MODAL
// ==================================================

// Data review untuk setiap dokter
const reviewsData = {
    'sarah-wijaya': {
        averageRating: "4.9",
        reviews: [
            {
                name: "Rina Sari",
                rating: 5,
                date: "2 hari yang lalu",
                comment: "Dr. Sarah sangat membantu dalam menangani anxiety saya. Pendekatannya sangat profesional dan membuat saya merasa nyaman. Tools yang diberikan sangat praktis untuk kehidupan sehari-hari.",
                verified: true
            },
            {
                name: "Budi Pratama",
                rating: 5,
                date: "1 minggu yang lalu",
                comment: "Sesi konsultasi yang sangat insightful. Dr. Sarah memberikan perspektif baru dalam menghadapi stres kerja. Sangat recommended untuk professional muda.",
                verified: true
            },
            {
                name: "Anita Wijaya",
                rating: 4,
                date: "2 minggu yang lalu",
                comment: "Pelayanan sangat baik, meski agak mahal. Hasilnya sepadan dengan biaya yang dikeluarkan. Proses booking juga mudah dan flexible.",
                verified: true
            },
            {
                name: "Dewi Anggraeni",
                rating: 5,
                date: "3 minggu yang lalu",
                comment: "Dr. Sarah sangat sabar dan memahami kondisi saya. Setelah 3 sesi, saya merasa lebih bisa mengendalikan anxiety saya. Terima kasih Dr. Sarah!",
                verified: true
            },
            {
                name: "Michael Tan",
                rating: 5,
                date: "1 bulan yang lalu",
                comment: "Terapis yang sangat empatik dan memahami kebutuhan pasien. Progress terapi saya sangat signifikan dalam waktu singkat.",
                verified: true
            }
        ]
    },
    'ahmad-rahman': {
        averageRating: "4.8",
        reviews: [
            {
                name: "David Lee",
                rating: 5,
                date: "3 hari yang lalu",
                comment: "Dr. Ahmad sangat berpengalaman dalam menangani kasus kompleks. Diagnosisnya akurat dan treatment plan-nya jelas. Sangat membantu keluarga saya.",
                verified: true
            },
            {
                name: "Sari Dewi",
                rating: 5,
                date: "1 minggu yang lalu",
                comment: "Pendekatan yang komprehensif dan holistik. Dr. Ahmad tidak hanya memberikan obat tapi juga terapi yang tepat. Progress anak saya sangat signifikan.",
                verified: true
            },
            {
                name: "Rudi Hartono",
                rating: 4,
                date: "2 minggu yang lalu",
                comment: "Dokter yang sangat knowledgeable. Penjelasannya detail dan mudah dimengerti. Hanya saja waiting time agak lama.",
                verified: true
            },
            {
                name: "Lisa Marbun",
                rating: 5,
                date: "3 minggu yang lalu",
                comment: "Penanganan yang sangat profesional untuk kasus bipolar saudara saya. Keluarga kami sangat berterima kasih.",
                verified: true
            }
        ]
    },
    'maya-sari': {
        averageRating: "4.7",
        reviews: [
            {
                name: "Lisa Permata",
                rating: 5,
                date: "4 hari yang lalu",
                comment: "Bu Maya sangat membantu masalah relationship saya. Pendekatannya lembut tapi efektif. Sangat cocok untuk konseling remaja dan young adult.",
                verified: true
            },
            {
                name: "Kevin Setiawan",
                rating: 4,
                date: "1 minggu yang lalu",
                comment: "Konseling karir yang sangat membantu. Bu Maya memberikan insight yang valuable untuk perkembangan karir saya.",
                verified: true
            },
            {
                name: "Diana Putri",
                rating: 5,
                date: "2 minggu yang lalu",
                comment: "Membantu anak saya yang mengalami kesulitan adaptasi di sekolah baru. Pendekatannya sangat cocok untuk remaja.",
                verified: true
            },
            {
                name: "Robert Chandra",
                rating: 4,
                date: "3 minggu yang lalu",
                comment: "Konseling pre-marital yang sangat membantu. Bu Maya memberikan perspektif yang balanced untuk kedua pihak.",
                verified: true
            }
        ]
    },
    'rina-dewi': {
        averageRating: "4.9",
        reviews: [
            {
                name: "Suryadi",
                rating: 5,
                date: "5 hari yang lalu",
                comment: "Dr. Rina sangat sabar menangani ibu saya yang mengalami dementia. Pendekatannya membuat ibu saya merasa nyaman dan dihargai.",
                verified: true
            },
            {
                name: "Martha Tilaar",
                rating: 5,
                date: "2 minggu yang lalu",
                comment: "Spesialis geriatri yang sangat langka dan kompeten. Dr. Rina memahami betul kebutuhan kesehatan mental lansia.",
                verified: true
            },
            {
                name: "Bambang S",
                rating: 5,
                date: "3 minggu yang lalu",
                comment: "Penanganan yang excellent untuk ayah saya yang depresi pasca pensiun. Kualitas hidup ayah saya meningkat signifikan.",
                verified: true
            },
            {
                name: "Sri Wahyuni",
                rating: 4,
                date: "1 bulan yang lalu",
                comment: "Dr. Rina sangat memahami kompleksitas masalah mental pada lansia. Treatment plan-nya sangat personalized.",
                verified: true
            }
        ]
    },
    'lisa-chen': {
        averageRating: "4.8",
        reviews: [
            {
                name: "Maria Wong",
                rating: 5,
                date: "3 hari yang lalu",
                comment: "Dr. Lisa amazing dengan anak-anak! Anak saya yang biasanya takut bertemu dokter, malah senang bertemu Dr. Lisa. Terapi bermainnya sangat efektif.",
                verified: true
            },
            {
                name: "Anton Susanto",
                rating: 5,
                date: "1 minggu yang lalu",
                comment: "Anak saya menunjukkan progress yang luar biasa setelah terapi dengan Dr. Lisa. Komunikasi dengan orang tua juga sangat baik.",
                verified: true
            },
            {
                name: "Grace Halim",
                rating: 4,
                date: "2 minggu yang lalu",
                comment: "Dr. Lisa sangat sabar menghadapi anak saya yang hiperaktif. Teknik terapi yang digunakan sangat kreatif dan engaging.",
                verified: true
            },
            {
                name: "William Tanoto",
                rating: 5,
                date: "3 minggu yang lalu",
                comment: "Anak kembar saya yang mengalami speech delay menunjukkan improvement yang signifikan setelah terapi dengan Dr. Lisa.",
                verified: true
            }
        ]
    },
    'budi-santoso': {
        averageRating: "4.6",
        reviews: [
            {
                name: "Andi Prabowo",
                rating: 4,
                date: "6 hari yang lalu",
                comment: "Dr. Budi sangat profesional dan empatik. Membantu saya melalui masa-masa sulit dengan pendekatan yang tepat.",
                verified: true
            },
            {
                name: "Fitriani",
                rating: 5,
                date: "2 minggu yang lalu",
                comment: "Konsultasi yang sangat membantu. Dr. Budi memberikan solusi praktis untuk mengatasi gangguan mood saya.",
                verified: true
            },
            {
                name: "Joko Widodo",
                rating: 4,
                date: "3 minggu yang lalu",
                comment: "Dokter yang mudah diajak komunikasi. Memberikan penjelasan yang jelas tentang kondisi dan treatment yang diberikan.",
                verified: true
            },
            {
                name: "Siti Aisyah",
                rating: 5,
                date: "1 bulan yang lalu",
                comment: "Penanganan untuk panic attack yang sangat efektif. Dr. Budi memberikan coping mechanism yang praktis dan mudah diterapkan.",
                verified: true
            }
        ]
    }
};

function showReviewsModal(doctorName, specialty, reviewCount, doctorId) {
    const doctorData = reviewsData[doctorId];
    
    if (!doctorData) {
        console.error('Data dokter tidak ditemukan:', doctorId);
        return;
    }
    
    const reviews = doctorData.reviews;
    const averageRating = doctorData.averageRating;
    
    // Create modal element
    const modal = document.createElement('div');
    modal.className = 'reviews-modal active';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>Review Pasien</h3>
                <button class="close-modal">&times;</button>
            </div>
            
            <div class="doctor-summary">
                <h4>${doctorName}</h4>
                <p>${specialty}</p>
                <div class="overall-rating">
                    <span class="rating-stars">${generateStars(averageRating)}</span>
                    <span class="rating-value">${averageRating}</span>
                    <span class="review-total">${reviewCount}</span>
                </div>
            </div>
            
            <div class="reviews-list">
                ${reviews.length > 0 ? 
                    reviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-info">
                                    <div class="reviewer-avatar">${getInitials(review.name)}</div>
                                    <div>
                                        <div class="reviewer-name">${review.name} ${review.verified ? '<span class="verified-badge">✓</span>' : ''}</div>
                                        <div class="review-date">${review.date}</div>
                                    </div>
                                </div>
                                <div class="review-rating">${generateStars(review.rating)}</div>
                            </div>
                            <p class="review-comment">${review.comment}</p>
                        </div>
                    `).join('') 
                    : 
                    '<div class="no-reviews">Belum ada review untuk dokter ini.</div>'
                }
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Close modal handlers
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = ''; // Restore scrolling
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Prevent modal close when clicking content
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Close modal with Escape key
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscapeKey);
        }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
}

// Helper function to generate star ratings - TANPA PECAHAN
function generateStars(rating) {
    const numericRating = parseFloat(rating);
    const fullStars = Math.floor(numericRating); // Pembulatan ke bawah
    const emptyStars = 5 - fullStars;
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '★';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '☆';
    }
    
    return stars;
}

// Helper function to get initials for avatar
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
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
}