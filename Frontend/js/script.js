// ================================== GLOBAL USER STATE MANAGEMENT ==================================
let userState = {
    isLoggedIn: false,
    isGuest: false,
    userData: null
};

// ================================== INITIALIZATION ==================================
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inisialisasi state user
    initializeUserState();
    
    // 2. Set menu aktif berdasarkan halaman saat ini
    setActiveMenuByPage();

    // 3. Setup enhanced logo handler
    setupEnhancedLogoHandler();

    // 4. Setup authentication redirect system
    setupAuthRedirectSystem();

    // 5. Setup consultation auth flow dengan guest mode
    setupConsultationAuthFlow();

    // 6. Tambahkan event listener untuk klik menu navigasi
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 7. Inisialisasi video player
    initializeVideoPlayer();

    // 8. Inisialisasi mood tracker
    initializeMoodTracker();

    // 9. Setup redirect untuk link konsultasi di mood tracker
    setupKonsultasiRedirect();

    // 10. Enhanced chatbot effects
    initializeChatbotEffects();
    enhanceChatbotColors();

    // 11. Setup newsletter functionality
    setupNewsletter();

    // 12. Cek dan tampilkan notifikasi jika ada di URL
    checkAndShowNotification();

    // 13. Cek dan handle auth redirect jika ada di storage
    checkAndHandleAuthRedirect();

    console.log('All enhanced systems initialized with guest mode support');
});

// ================================== USER STATE MANAGEMENT ==================================
function initializeUserState() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    userState = {
        isLoggedIn: !!token,
        isGuest: isGuest,
        userData: user ? JSON.parse(user) : null
    };
    
    console.log('User State Initialized:', userState);
    updateUIForUserState();
}

function updateUIForUserState() {
    const profileIcon = document.querySelector('.profile-icon');
    const profileLink = profileIcon ? profileIcon.querySelector('a') : null;
    
    if (profileIcon && profileLink) {
        if (userState.isLoggedIn) {
            // User sudah login - akses penuh
            profileIcon.style.display = 'block';
            profileLink.href = 'profil.html';
            profileLink.onclick = null;
            profileLink.style.cursor = 'pointer';
            
            // Update profile image if available
            if (userState.userData && userState.userData.profileImage) {
                const profileImg = profileLink.querySelector('img');
                if (profileImg) {
                    profileImg.src = userState.userData.profileImage;
                    profileImg.alt = userState.userData.name || 'Profil Pengguna';
                }
            }
            
        } else if (userState.isGuest) {
            // User sebagai tamu - akses terbatas
            profileIcon.style.display = 'block';
            profileLink.href = 'javascript:void(0)';
            profileLink.onclick = showGuestProfileDialog;
            profileLink.style.cursor = 'pointer';
            
            // Update guest indicator
            const profileImg = profileLink.querySelector('img');
            if (profileImg) {
                profileImg.alt = 'Guest Mode';
                profileImg.style.filter = 'grayscale(50%) opacity(0.8)';
                profileImg.title = 'Mode Tamu - Klik untuk upgrade';
            }
            
        } else {
            // User belum login dan bukan tamu
            profileIcon.style.display = 'block';
            profileLink.href = 'javascript:void(0)';
            profileLink.onclick = redirectToLogin;
            profileLink.style.cursor = 'pointer';
        }
    }
}

// ================================== GUEST MODE FUNCTIONS ==================================
function setGuestMode() {
    localStorage.setItem('isGuest', 'true');
    userState.isGuest = true;
    userState.isLoggedIn = false;
    updateUIForUserState();
    console.log('Guest mode activated');
    showNotification('Mode tamu diaktifkan. Akses fitur terbatas.', 'info');
}

function clearGuestMode() {
    localStorage.removeItem('isGuest');
    userState.isGuest = false;
    updateUIForUserState();
    console.log('Guest mode cleared');
}

function showGuestProfileDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'guest-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'guest-dialog';
    dialog.innerHTML = `
        <h3>Mode Tamu</h3>
        <p>Anda sedang mengakses sebagai tamu. Fitur yang tersedia terbatas.</p>
        <div class="guest-actions">
            <button id="btn-guest-upgrade" class="btn-primary">Buat Akun untuk Akses Penuh</button>
            <button id="btn-guest-login" class="btn-secondary">Masuk dengan Akun</button>
            <button id="btn-guest-continue" class="btn-secondary">Lanjut sebagai Tamu</button>
        </div>
        <button class="guest-close-btn">&times;</button>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Event listeners
    document.getElementById('btn-guest-upgrade').addEventListener('click', function() {
        document.body.removeChild(overlay);
        window.location.href = 'register.html?return=' + encodeURIComponent(window.location.pathname);
    });
    
    document.getElementById('btn-guest-login').addEventListener('click', function() {
        document.body.removeChild(overlay);
        window.location.href = 'login.html?return=' + encodeURIComponent(window.location.pathname);
    });
    
    document.getElementById('btn-guest-continue').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    dialog.querySelector('.guest-close-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// ================================== CONSULTATION NAVIGATION WITH GUEST MODE ==================================
// Fungsi untuk mengatur navigasi konsultasi
function handleConsultationNavigation() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // CEK: Jika sudah ada token dan data user (berarti sudah login)
    if (token && user) {
        // Langsung arahkan ke halaman konsultasi tanpa notifikasi
        window.location.href = 'konsultasi.html';
    } else {
        // Jika belum login, jalankan logika notifikasi/dialog yang sudah Anda buat
        // Ini akan memicu modal "Login Required" atau "Guest Mode" yang ada di script Anda
        showLoginRequiredDialog(); 
    }
}

function showConsultationGuestDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'consultation-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'consultation-dialog';
    dialog.innerHTML = `
        <h3>Akses Layanan Konsultasi</h3>
        <p>Untuk mengakses layanan konsultasi, Anda perlu:</p>
        <div class="consultation-options">
            <div class="option-card" id="option-login">
                <div class="option-icon">👤</div>
                <h4>Masuk ke Akun</h4>
                <p>Masuk dengan akun yang sudah ada</p>
                <small>Cepat dan Mudah</small>
            </div>
            <div class="option-card" id="option-register">
                <div class="option-icon">📝</div>
                <h4>Buat Akun Baru</h4>
                <p>Daftar gratis dalam 2 menit</p>
                <small>Rekomendasi</small>
            </div>
            <div class="option-card" id="option-guest">
                <div class="option-icon">👁️</div>
                <h4>Jelajah sebagai Tamu</h4>
                <p>Akses terbatas tanpa akun</p>
                <small>Tidak bisa konsultasi</small>
            </div>
        </div>
        <p class="dialog-note"><strong>Perhatian:</strong> Mode tamu tidak memberikan akses ke layanan konsultasi. Hanya untuk melihat konten umum.</p>
        <button class="dialog-close-btn">&times;</button>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Event listeners
    document.getElementById('option-login').addEventListener('click', function() {
        document.body.removeChild(overlay);
        const currentPage = window.location.pathname.split('/').pop();
        window.location.href = `login.html?return=${encodeURIComponent(currentPage)}`;
    });
    
    document.getElementById('option-register').addEventListener('click', function() {
        document.body.removeChild(overlay);
        const currentPage = window.location.pathname.split('/').pop();
        window.location.href = `register.html?return=${encodeURIComponent(currentPage)}`;
    });
    
    document.getElementById('option-guest').addEventListener('click', function() {
        document.body.removeChild(overlay);
        setGuestMode();
        showGuestLimitedAccessDialog();
    });
    
    dialog.querySelector('.dialog-close-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function showGuestUpgradeDialog(targetPage) {
    const overlay = document.createElement('div');
    overlay.className = 'upgrade-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'upgrade-dialog';
    dialog.innerHTML = `
        <h3>Akses Konsultasi Dibatasi</h3>
        <p>Anda sedang dalam <strong>Mode Tamu</strong>. Untuk mengakses layanan konsultasi, Anda perlu membuat akun.</p>
        <div class="upgrade-benefits">
            <h4>Keuntungan memiliki akun:</h4>
            <ul>
                <li>✓ Konsultasi langsung dengan psikolog profesional</li>
                <li>✓ Buat janji temu online kapan saja</li>
                <li>✓ Riwayat konsultasi dan progress tracking</li>
                <li>✓ Notifikasi dan pengingat janji temu</li>
                <li>✓ Akses ke semua fitur premium</li>
            </ul>
        </div>
        <div class="upgrade-actions">
            <button id="btn-upgrade-now" class="btn-primary">Buat Akun Sekarang (Gratis)</button>
            <button id="btn-login-now" class="btn-secondary">Sudah Punya Akun? Masuk</button>
            <button id="btn-stay-guest" class="btn-tertiary">Tetap sebagai Tamu</button>
        </div>
        <button class="upgrade-close-btn">&times;</button>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    document.getElementById('btn-upgrade-now').addEventListener('click', function() {
        document.body.removeChild(overlay);
        window.location.href = `register.html?return=${encodeURIComponent(targetPage)}`;
    });
    
    document.getElementById('btn-login-now').addEventListener('click', function() {
        document.body.removeChild(overlay);
        window.location.href = `login.html?return=${encodeURIComponent(targetPage)}`;
    });
    
    document.getElementById('btn-stay-guest').addEventListener('click', function() {
        document.body.removeChild(overlay);
        showGuestLimitedAccessDialog();
    });
    
    dialog.querySelector('.upgrade-close-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function showGuestLimitedAccessDialog() {
    const overlay = document.createElement('div');
    overlay.className = 'limited-access-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'limited-access-dialog';
    dialog.innerHTML = `
        <h3>Akses Terbatas - Mode Tamu</h3>
        <p>Fitur yang tersedia dalam mode tamu:</p>
        <div class="access-features">
            <div class="feature-item available">
                <span class="feature-icon">✓</span>
                <span>Melihat artikel kesehatan mental</span>
            </div>
            <div class="feature-item available">
                <span class="feature-icon">✓</span>
                <span>Menggunakan mood tracker dasar</span>
            </div>
            <div class="feature-item available">
                <span class="feature-icon">✓</span>
                <span>Menonton video edukasi</span>
            </div>
            <div class="feature-item unavailable">
                <span class="feature-icon">✗</span>
                <span>Konsultasi dengan psikolog</span>
            </div>
            <div class="feature-item unavailable">
                <span class="feature-icon">✗</span>
                <span>Membuat janji temu online</span>
            </div>
            <div class="feature-item unavailable">
                <span class="feature-icon">✗</span>
                <span>Riwayat konsultasi</span>
            </div>
        </div>
        <div class="limited-actions">
            <button id="btn-limited-upgrade" class="btn-primary">Buat Akun untuk Akses Penuh</button>
            <button id="btn-limited-ok" class="btn-secondary">Mengerti, Tetap sebagai Tamu</button>
        </div>
        <button class="limited-close-btn">&times;</button>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    document.getElementById('btn-limited-upgrade').addEventListener('click', function() {
        document.body.removeChild(overlay);
        window.location.href = 'register.html?return=' + encodeURIComponent(window.location.pathname);
    });
    
    document.getElementById('btn-limited-ok').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    dialog.querySelector('.limited-close-btn').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// ================================== SETUP CONSULTATION AUTH FLOW ==================================
// Fungsi untuk mengatur navigasi konsultasi
function handleConsultationNavigation() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // CEK: Jika sudah ada token dan data user (berarti sudah login)
    if (token && user) {
        // Langsung arahkan ke halaman konsultasi tanpa notifikasi
        window.location.href = 'konsultasi.html';
    } else {
        // Jika belum login, jalankan logika notifikasi/dialog yang sudah Anda buat
        // Ini akan memicu modal "Login Required" atau "Guest Mode" yang ada di script Anda
        showLoginRequiredDialog(); 
    }
}

// Pastikan fungsi ini dipanggil di semua link/tombol konsultasi
function setupConsultationAuthFlow() {
    const consultLinks = document.querySelectorAll('a[href*="konsultasi.html"], [onclick*="handleConsultationNavigation"]');
    
    consultLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Cek apakah user sudah login
            const isLoggedIn = localStorage.getItem('token') !== null;
            
            if (!isLoggedIn) {
                e.preventDefault(); // Cegah pindah halaman langsung
                handleConsultationNavigation();
            }
            // Jika sudah login, biarkan link berjalan normal ke konsultasi.html
        });
    });


    // Untuk tombol konsultasi di halaman beranda
    const homeConsultationButtons = document.querySelectorAll('a[href="konsultasi.html"], .btn-primary[href="konsultasi.html"]');
    homeConsultationButtons.forEach(button => {
        button.href = 'javascript:void(0);';
        button.onclick = handleConsultationNavigation;
        button.style.cursor = 'pointer';
    });

    // Untuk tombol di mood tracker
    const moodConsultationButtons = document.querySelectorAll('#btn-mood-konsultasi, .feedback-btn.primary');
    moodConsultationButtons.forEach(button => {
        button.onclick = handleConsultationNavigation;
    });
}

// ================================== REDIRECT FUNCTIONS ==================================
function redirectToLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    window.location.href = 'login.html?return=' + encodeURIComponent(currentPage);
}

// ================================== AUTHENTICATION REDIRECT SYSTEM ==================================
function setupAuthRedirectSystem() {
    console.log('Setting up auth redirect system...');

    // Setup untuk login success
    window.handleLoginSuccess = function() {
        // Clear guest mode when logging in
        clearGuestMode();
        
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || 'index.html';

        // Hapus parameter return dari URL
        urlParams.delete('return');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, document.title, newUrl);

        console.log('Login success - redirecting to:', returnUrl);
        window.location.href = returnUrl;
    };

    // Setup untuk register success
    window.handleRegisterSuccess = function() {
        // Clear guest mode when registering
        clearGuestMode();
        
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || 'konsultasi.html';

        console.log('Register success - redirecting to login with return:', returnUrl);
        window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}&notif=success&message=${encodeURIComponent('Registrasi Berhasil! Silakan Masuk.')}`;
    };

    // Handle redirect parameters from URL
    function handleUrlRedirectParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectParam = urlParams.get('redirect');

        if (redirectParam && !sessionStorage.getItem('redirectAfterAuth')) {
            sessionStorage.setItem('redirectAfterAuth', redirectParam);
        }
    }

    // Panggil fungsi untuk handle URL parameters
    handleUrlRedirectParams();
}

// ================================== NOTIFICATION SYSTEM ==================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    const body = document.querySelector('body');
    if (body) {
        body.appendChild(notification);

        // Atur posisi agar tidak mengganggu
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: ${type === 'success' ? '#4CAF50' : (type === 'info' ? '#2196F3' : '#f44336')};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 1100;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            transform: translateY(-50px);
        `;

        // Tampilkan
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 50);

        // Hilangkan setelah 3 detik
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-50px)';
            setTimeout(() => {
                body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

function checkAndShowNotification() {
    const urlParams = new URLSearchParams(window.location.search);
    const notificationType = urlParams.get('notif');
    const message = urlParams.get('message');

    if (notificationType && message) {
        // Hapus notif dari URL agar tidak muncul lagi saat refresh
        urlParams.delete('notif');
        urlParams.delete('message');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, document.title, newUrl);

        showNotification(decodeURIComponent(message), notificationType);
    }
}

// ================================== AUTH REDIRECT CHECKER ==================================
function checkAndHandleAuthRedirect() {
    // Cek jika ada redirect URL di sessionStorage
    const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
    if (redirectUrl) {
        console.log('Found redirect URL in storage:', redirectUrl);

        // Untuk halaman login/register, kita biarkan parameter return di URL yang menangani
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            console.log('On auth page - letting URL parameters handle redirect');
            return;
        }

        // Hapus dari storage
        sessionStorage.removeItem('redirectAfterAuth');
    }
}

// ================================== KONSULTASI REDIRECT FUNCTIONALITY ==================================
function setupKonsultasiRedirect() {
    const konsultasiLink = document.getElementById('mood-konsultasi-link');

    if (konsultasiLink) {
        konsultasiLink.addEventListener('click', function(e) {
            e.preventDefault();
            handleConsultationNavigation();
        });
    }
}

// ================================== SET MENU ACTIVE ==================================
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
        } else if (link.onclick && linkHref === 'javascript:void(0);' && currentPage === 'konsultasi.html') {
            link.classList.add('active');
        }
    });
}

// ================================== ENHANCED LOGO CLICK HANDLER ==================================
function setupEnhancedLogoHandler() {
    console.log('Setting up enhanced logo handler...');

    // Handle header logo
    const headerLogo = document.querySelector('.header .logo');
    if (headerLogo) {
        console.log('Header logo found, adding click handler');
        headerLogo.style.cursor = 'pointer';
        headerLogo.onclick = null;
        headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Header logo clicked - redirecting to homepage');
            redirectToHomepage();
        });
    }

    // Handle footer logo
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        console.log('Footer logo found, adding click handler');
        footerLogo.style.cursor = 'pointer';
        footerLogo.onclick = null;
        footerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Footer logo clicked - redirecting to homepage');
            redirectToHomepage();
        });
    }
}

function redirectToHomepage() {
    console.log('Redirecting to homepage...');
    window.location.href = 'index.html';
}

// ================================== MOOD TRACKER FUNCTIONS ==================================
function initializeMoodTracker() {
    const moodButtons = document.querySelectorAll('.mood-btn');

    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            showMoodFeedback(mood);
        });
    });
}

function showMoodFeedback(mood) {
    const feedbackMessages = {
        happy: {
            title: "Senang Mendengarnya! 🎉",
            message: "Luar biasa! Terus pertahankan energi positif Anda.",
            emoji: "😊"
        },
        neutral: {
            title: "Terima kasih sudah berbagi perasaan!",
            message: "Terkadang merasa biasa saja itu wajar. 😊",
            emoji: "😐"
        },
        sad: {
            title: "Kami di Sini untuk Anda 💙",
            message: "Perasaan sedih adalah bagian dari kehidupan. Anda tidak sendirian.",
            emoji: "😔"
        },
        anxious: {
            title: "Tenang, Kami Bersama Anda 🕊️",
            message: "Kecemasan bisa terasa berat, tetapi Anda lebih kuat dari yang Anda kira.",
            emoji: "😰"
        },
        angry: {
            title: "Kami Memahami Perasaan Anda 🔥",
            message: "Marah adalah emosi yang valid.",
            emoji: "😠"
        }
    };

    const feedback = feedbackMessages[mood];

    // Hapus dulu elemen yang mungkin masih ada
    closeMoodFeedback();

    // Buat overlay
    const overlay = document.createElement('div');
    overlay.className = 'mood-feedback-overlay';
    overlay.id = 'mood-feedback-overlay';

    // Buat elemen feedback
    const feedbackElement = document.createElement('div');
    feedbackElement.className = 'mood-feedback';
    feedbackElement.id = 'mood-feedback-element';
    feedbackElement.setAttribute('data-mood', mood);

    feedbackElement.innerHTML = `
        <h3>${feedback.title}</h3>
        <div class="feedback-message">
            ${feedback.message}
        </div>
        <hr>
        <p>${userState.isLoggedIn 
            ? 'Ingin berbicara dengan profesional?' 
            : 'Ingin berbicara dengan profesional tentang perasaan Anda?'}</p>
        <div class="feedback-actions">
            <button id="btn-mood-konsultasi" class="feedback-btn primary">
                ${userState.isLoggedIn ? 'Konsultasi Sekarang' : 'Akses Konsultasi'}
            </button>
            <button id="btn-mood-tamu" class="feedback-btn secondary">Tutup</button>
        </div>
    `;

    // Tambahkan ke body
    document.body.appendChild(overlay);
    document.body.appendChild(feedbackElement);

    // Event listener untuk tombol konsultasi
    const consultButton = feedbackElement.querySelector('#btn-mood-konsultasi');
    if (consultButton) {
        consultButton.addEventListener('click', function() {
            closeMoodFeedback();
            setTimeout(() => {
                handleConsultationNavigation();
            }, 300);
        });
    }

    // Event listener untuk tombol tamu
    const guestButton = feedbackElement.querySelector('#btn-mood-tamu');
    if (guestButton) {
        guestButton.addEventListener('click', function() {
            closeMoodFeedback();
        });
    }

    // Event listener untuk overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeMoodFeedback();
        }
    });

    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('show');
        feedbackElement.classList.add('show');
    }, 10);
}

function closeMoodFeedback() {
    const overlay = document.getElementById('mood-feedback-overlay');
    const feedback = document.getElementById('mood-feedback-element');
    
    // Hapus event listener ESC key
    document.removeEventListener('keydown', closeMoodFeedback);

    if (overlay) {
        overlay.classList.remove('show');
    }
    if (feedback) {
        feedback.classList.remove('show');
    }

    // Hapus elemen dari DOM setelah animasi
    setTimeout(() => {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        if (feedback && feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 300);
}

// ================================== VIDEO PLAYER FUNCTIONALITY ==================================
let currentVideoIndex = 0;
let hasVideoBeenPlayed = false;

const videos = [
    {
        src: 'assets/videos/mental1.mp4',
        poster: 'assets/images/background4.jpg'
    },
    {
        src: 'assets/videos/mental2.mp4',
        poster: 'assets/images/background4.jpg'
    },
    {
        src: 'assets/videos/mental3.mp4',
        poster: 'assets/images/background4.jpg'
    }
];

function initializeVideoPlayer() {
    const video = document.getElementById('video-player');
    const playButton = document.getElementById('play-pause-video-btn');

    if (video) {
        // Load video pertama
        loadVideo(currentVideoIndex);

        // Tambahkan Event Listener untuk menyembunyikan tombol overlay saat PLAY
        video.addEventListener('play', function() {
            hasVideoBeenPlayed = true;
            if (playButton) {
                playButton.style.display = 'none';
            }
        });

        // Event listeners untuk video
        video.addEventListener('ended', function() {
            if (playButton) {
                playButton.style.display = 'flex';
                playButton.innerHTML = '▶';
            }
        });

        video.addEventListener('pause', function() {
            if (playButton) {
                playButton.style.display = 'flex';
                playButton.innerHTML = '▶';
            }
        });
    }
}

function loadVideo(index) {
    const video = document.getElementById('video-player');
    const playButton = document.getElementById('play-pause-video-btn');

    if (!video || index < 0 || index >= videos.length) return;

    const shouldAttemptPlay = hasVideoBeenPlayed || !video.paused;

    currentVideoIndex = index;
    const currentVideo = videos[index];

    // Ganti video source dan poster
    const sourceElement = video.querySelector('source');
    if (sourceElement) {
        sourceElement.src = currentVideo.src;
    } else {
        video.src = currentVideo.src;
    }
    video.poster = currentVideo.poster;

    // Set tombol overlay terlihat secara default
    if (playButton) {
        playButton.innerHTML = '▶';
    }

    video.load();

    // LOGIKA AUTOPLAY
    if (shouldAttemptPlay) {
        video.play().catch(error => {
            console.log('Autoplay prevented:', error);
            if (playButton) {
                playButton.style.display = 'flex';
                playButton.innerHTML = '▶';
            }
        });
    } else {
        video.pause();
        if (playButton) {
             playButton.style.display = 'flex';
             playButton.innerHTML = '▶';
        }
    }

    // Update UI
    updateNavButtons();
}

function nextVideo() {
    if (currentVideoIndex < videos.length - 1) {
        loadVideo(currentVideoIndex + 1);
    }
}

function previousVideo() {
    if (currentVideoIndex > 0) {
        loadVideo(currentVideoIndex - 1);
    }
}

function updateNavButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (prevBtn) {
        prevBtn.disabled = currentVideoIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentVideoIndex === videos.length - 1;
    }
}

function playPauseVideo() {
    const video = document.getElementById('video-player');
    const button = document.getElementById('play-pause-video-btn');

    if (!video || !button) return;

    if (video.paused) {
        video.play().catch(error => {
            console.log('Autoplay prevented on click:', error);
            button.style.display = 'flex';
        });

    } else {
        video.pause();
    }
}

// ================================== CHATBOT FUNCTIONS ==================================
function initializeChatbotEffects() {
    const chatbotBtn = document.querySelector('.chatbot-toggle-btn');

    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', function(e) {
            createEnhancedRippleEffect(e);

            this.style.transform = 'scale(0.9)';
            this.style.boxShadow =
                '0 0 30px rgba(0, 123, 255, 0.8), ' +
                '0 8px 25px rgba(0, 123, 255, 0.6), ' +
                'inset 0 1px 0 rgba(255, 255, 255, 0.3)';

            setTimeout(() => {
                this.style.transform = '';
                this.style.boxShadow = '';
            }, 200);
        });
    }
}

function createEnhancedRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    const ripples = button.getElementsByClassName('ripple');
    while (ripples[0]) {
        ripples[0].remove();
    }

    button.appendChild(circle);
}

function goToChatbotPage() {
    window.location.href = 'chatbot.html';
}

// ================================== NEWSLETTER FUNCTIONS ==================================
function setupNewsletter() {
    console.log('Setting up enhanced newsletter functionality...');
    
    const newsletterBtn = document.getElementById('btn-subscribe');
    const unsubscribeBtn = document.getElementById('btn-unsubscribe');
    const newsletterEmail = document.getElementById('newsletter-email');
    
    if (!newsletterBtn || !unsubscribeBtn || !newsletterEmail) {
        console.log('Newsletter elements not found');
        return;
    }
    
    // Load saved email if exists and update UI
    updateNewsletterUI();
    
    // Handle newsletter subscription
    newsletterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleNewsletterSubscription();
    });
    
    // Handle unsubscribe
    unsubscribeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showUnsubscribeConfirmation();
    });
    
    // Handle Enter key press
    newsletterEmail.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleNewsletterSubscription();
        }
    });
    
    // Add input event to show subscribe button when email changes
    newsletterEmail.addEventListener('input', function() {
        const email = this.value.trim();
        const savedEmail = localStorage.getItem('newsletter_subscribed_email');
        
        // Jika email diubah dan berbeda dari yang tersimpan, tampilkan tombol subscribe
        if (email !== savedEmail) {
            showSubscribeButton();
        }
    });
}

function updateNewsletterUI() {
    const newsletterBtn = document.getElementById('btn-subscribe');
    const unsubscribeBtn = document.getElementById('btn-unsubscribe');
    const newsletterEmail = document.getElementById('newsletter-email');
    const statusElement = document.getElementById('newsletter-status');
    
    const savedEmail = localStorage.getItem('newsletter_subscribed_email');
    const subscribeDate = localStorage.getItem('newsletter_subscribed_date');
    
    if (savedEmail) {
        // User sudah subscribe
        newsletterEmail.value = savedEmail;
        
        // Update button states
        newsletterBtn.style.display = 'none';
        unsubscribeBtn.style.display = 'block';
        
        // Update status message
        if (statusElement) {
            const date = subscribeDate ? new Date(subscribeDate).toLocaleDateString('id-ID') : 'tidak diketahui';
            statusElement.innerHTML = `
                <div class="status-subscribed">
                    <span class="status-icon">✓</span>
                    <span class="status-text">Berlangganan aktif sejak ${date}</span>
                </div>
                <div class="status-note">Email: ${savedEmail}</div>
            `;
            statusElement.classList.add('subscribed');
        }
    } else {
        // User belum subscribe
        newsletterBtn.style.display = 'block';
        unsubscribeBtn.style.display = 'none';
        
        // Clear status message
        if (statusElement) {
            statusElement.innerHTML = '';
            statusElement.classList.remove('subscribed');
        }
    }
}

function handleNewsletterSubscription() {
    const emailInput = document.getElementById('newsletter-email');
    const subscribeBtn = document.getElementById('btn-subscribe');
    
    if (!emailInput || !subscribeBtn) return;
    
    const email = emailInput.value.trim();
    
    // Validasi email sederhana
    if (!email) {
        showNewsletterMessage('Mohon masukkan email Anda.', 'error');
        emailInput.focus();
        return;
    }
    
    if (!isValidEmail(email)) {
        showNewsletterMessage('Format email tidak valid.', 'error');
        emailInput.focus();
        return;
    }
    
    // Simpan data newsletter
    localStorage.setItem('newsletter_subscribed_email', email);
    localStorage.setItem('newsletter_subscribed_date', new Date().toISOString());
    
    // Update UI
    updateNewsletterUI();
    
    // Show success message
    showNewsletterMessage('🎉 Terima kasih! Anda telah berlangganan newsletter kami. Tips kesehatan mental akan dikirim ke email Anda.', 'success');
    
    // Clear input setelah 3 detik
    setTimeout(() => {
        emailInput.value = '';
        showNewsletterMessage('', 'clear');
    }, 3000);
}

function showNewsletterMessage(message, type = 'info') {
    // Cari atau buat elemen pesan
    let messageElement = document.getElementById('newsletter-message');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'newsletter-message';
        
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.parentNode.insertBefore(messageElement, newsletterForm.nextSibling);
        }
    }
    
    // Set pesan dan styling
    messageElement.textContent = message;
    messageElement.className = 'newsletter-message';
    
    if (type === 'success') {
        messageElement.classList.add('success');
    } else if (type === 'error') {
        messageElement.classList.add('error');
    } else if (type === 'clear') {
        messageElement.textContent = '';
        messageElement.className = 'newsletter-message';
    }
    
    // Auto-hide pesan setelah 5 detik
    if (message && type !== 'clear') {
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'newsletter-message';
        }, 5000);
    }
}

// ================================== UTILITY FUNCTIONS ==================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function enhanceChatbotColors() {
    // Function implementation
}

// ================================== GLOBAL EXPORTS ==================================
window.MediCare = {
    // Auth & Guest Functions
    initializeUserState,
    setGuestMode,
    clearGuestMode,
    handleConsultationNavigation,
    showGuestProfileDialog,
    
    // Navigation Functions
    redirectToHomepage,
    goToChatbotPage,
    
    // Mood Tracker Functions
    trackMood: showMoodFeedback,
    resetMoodTracker: closeMoodFeedback,
    
    // Video Functions
    nextVideo,
    previousVideo,
    playPauseVideo,
    
    // Notification Functions
    showNotification,
    
    // Newsletter Functions
    newsletter: {
        subscribe: handleNewsletterSubscription,
        updateUI: updateNewsletterUI
    }
};

console.log('MediCare JavaScript loaded successfully with guest mode support!');

// Error boundary
window.addEventListener('error', function(e) {
    console.error('Global error:', e);
});