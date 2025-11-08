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

    // Inisialisasi video player
    initializeVideoPlayer();
    
    // Inisialisasi mood tracker
    initializeMoodTracker();
    
    // Setup redirect untuk link konsultasi di mood tracker
    setupKonsultasiRedirect();
    
    console.log('All systems initialized');
    
    // Cek dan tampilkan notifikasi jika ada di URL (misalnya dari login)
    checkAndShowNotification();
});

// ================================== NOTIFICATION SYSTEM ==================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const body = document.querySelector('body');
    if (body) {
        body.appendChild(notification);
        
        // Atur posisi agar tidak mengganggu (misalnya di atas)
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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

// ================================== AUTHENTICATION REDIRECT SYSTEM ==================================
function authRedirect(targetPage) {
    // Custom confirm dialog dengan tombol Sudah/Belum
    showCustomAuthDialog(targetPage);
}

// ================================== SIMPLE AUTH HANDLERS ==================================
function handleRegister() {
    // ALUR BARU: Tampilkan notifikasi dan redirect ke login dengan notif sukses
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return');
    
    // Siapkan notifikasi sukses registrasi untuk halaman login
    const successMessage = encodeURIComponent('Registrasi Berhasil! Silakan Masuk.');
    
    if (returnUrl) {
        window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}&notif=success&message=${successMessage}`;
    } else {
        window.location.href = `login.html?notif=success&message=${successMessage}`;
    }
}

function handleLogin() {
    // ALUR BARU: Tampilkan notifikasi dan redirect ke halaman tujuan
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return');
    
    // Tampilkan notifikasi sukses login
    const successMessage = encodeURIComponent('Berhasil Masuk! Anda diarahkan ke halaman konsultasi.');
    
    // Redirect ke halaman tujuan (konsultasi.html) dengan notif sukses login
    if (returnUrl) {
        window.location.href = `${returnUrl}?notif=success&message=${successMessage}`;
    } else {
        window.location.href = `index.html?notif=success&message=${successMessage}`;
    }
}

// ================================== KONSULTASI REDIRECT FUNCTIONALITY ==================================
function setupKonsultasiRedirect() {
    const konsultasiLink = document.getElementById('mood-konsultasi-link');
    
    if (konsultasiLink) {
        konsultasiLink.addEventListener('click', function(e) {
            e.preventDefault();
            redirectToKonsultasi();
        });
    }
}

function redirectToKonsultasi() {
    authRedirect('konsultasi.html');
}

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

// ================================== MOOD TRACKER FUNCTIONALITY ==================================
function initializeMoodTracker() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            const mood = this.getAttribute('data-mood');
            trackMood(mood);
        });
    });
}

function trackMood(mood) {
    const feedback = document.getElementById('mood-feedback');
    if (!feedback) {
        console.error('Mood feedback element not found');
        return;
    }
    
    const moodData = {
        'happy': {
            message: 'Senang mendengar Anda merasa bahagia! 😊 Terus pertahankan energi positif ini.',
            color: '#e6ffe7',
            border: '#00ff2f'
        },
        'neutral': {
            message: 'Terkadang merasa biasa saja itu wajar. 😐 Jika butuh teman bicara, kami di sini untuk Anda.',
            color: '#f5f5f5',
            border: '#a0a0a0'
        },
        'sad': {
            message: 'Maaf Anda merasa sedih. 😔 Ingat, perasaan ini sementara. Mau cerita tentang apa yang terjadi?',
            color: '#fff7e6',
            border: '#ffd700',
        },
        'anxious': {
            message: 'Kecemasan bisa sangat melelahkan. 😰 Coba tarik napas dalam dan ingat - Anda lebih kuat dari yang Anda kira.',
            color: '#fff4e6',
            border: '#ffa500'
        },
        'angry': {
            message: 'Marah adalah emosi yang valid. 😠 Coba luangkan waktu sejenak untuk menenangkan diri sebelum mengambil tindakan.',
            color: '#ffe6e6',
            border: '#ff4444'
        }
    };
    
    const selectedMood = moodData[mood];
    if (!selectedMood) {
        console.error('Mood data not found for:', mood);
        return;
    }
    
    // Update feedback dengan link yang memiliki ID
    feedback.innerHTML = `
        <h4>Terima kasih sudah berbagi perasaan!</h4>
        <p>${selectedMood.message}</p>
        <small>Ingin <a href="#" id="mood-konsultasi-link" style="color: #007bff; text-decoration: underline;">berbicara dengan profesional</a> tentang perasaan Anda?</small>
        <br><br>
        <button class="btn-guest-reset" onclick="resetMoodTracker()">Ingin Menjadi Tamu Saja</button>
    `;
    
    // Styling feedback berdasarkan mood
    feedback.style.background = selectedMood.color;
    feedback.style.borderLeft = `4px solid ${selectedMood.border}`;
    
    // Show feedback dengan animasi
    feedback.classList.add('show');
    
    // Setup event listener untuk link konsultasi yang baru dibuat
    setTimeout(() => {
        setupKonsultasiRedirect();
    }, 100);
    
    // Update button states
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.style.background = 'white';
        btn.style.border = '2px solid #e0e0e0';
        btn.style.transform = 'translateY(0)';
    });
    
    // Highlight selected mood
    const clickedButton = document.querySelector(`.mood-btn[data-mood="${mood}"]`);
    if (clickedButton) {
        clickedButton.style.background = selectedMood.color;
        clickedButton.style.border = `2px solid ${selectedMood.border}`;
        clickedButton.style.transform = 'translateY(-2px)';
    }
}

// Fungsi untuk reset mood tracker (guest mode)
function resetMoodTracker() {
    const feedback = document.getElementById('mood-feedback');
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    // Reset semua tombol mood ke state normal
    moodButtons.forEach(btn => {
        btn.style.background = 'white';
        btn.style.border = '2px solid #e0e0e0';
        btn.style.transform = 'translateY(0)';
    });
    
    // Sembunyikan feedback dengan animasi
    if (feedback) {
        feedback.classList.remove('show');
        setTimeout(() => {
            feedback.innerHTML = '';
            feedback.style.background = '';
            feedback.style.borderLeft = '';
        }, 500);
    }
}

// ================================== CUSTOM CONFIRM DIALOG ==================================
function showCustomAuthDialog(targetPage) {
    // Buat overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    // Buat dialog box
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        max-width: 400px;
        width: 90%;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">Akses Konsultasi</h3>
        <p style="margin-bottom: 25px; color: #666; line-height: 1.5;">
            Untuk mengakses konsultasi, Anda perlu memiliki akun.<br>
            Apakah Anda sudah memiliki akun?
        </p>
        <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="btn-sudah" style="
                padding: 12px 25px;
                background: grey;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                min-width: 100px;
            ">Sudah</button>
            <button id="btn-belum" style="
                padding: 12px 25px;
                background: grey;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                min-width: 100px;
            ">Belum</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Event listeners untuk tombol
    document.getElementById('btn-sudah').addEventListener('click', function() {
        document.body.removeChild(overlay);
        // Jika sudah punya akun, langsung ke Login dengan return ke targetPage (konsultasi.html)
        window.location.href = `login.html?return=${encodeURIComponent(targetPage)}`;
    });
    
    document.getElementById('btn-belum').addEventListener('click', function() {
        document.body.removeChild(overlay);
        // Jika belum punya akun, langsung ke Register dengan return ke targetPage (konsultasi.html)
        window.location.href = `register.html?return=${encodeURIComponent(targetPage)}`;
    });
    
    // Close ketika klik overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// ================================== SIMPLE REDIRECT FOR OTHER PAGES ==================================
// Fungsi sederhana untuk redirect ke konsultasi dari tombol lain
function redirectToKonsultasiSimple() {
    authRedirect('konsultasi.html');
}

// Error handling untuk video
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'VIDEO') {
        console.error('Video error:', e);
        const videoTitleElement = document.getElementById('video-title');
        if (videoTitleElement) {
            videoTitleElement.textContent = 'Video tidak dapat dimuat. Silakan refresh halaman.';
        }
    }
});

// Event listeners untuk dokter popup
document.addEventListener('DOMContentLoaded', function() {
    
    const consultButton = document.querySelector('.btn-consult');
    if (consultButton) {
        consultButton.addEventListener('click', function() {
            authRedirect('konsultasi.html');
            closeDoctorPopup();
        });
    }
});

// ================================== DOCTOR POPUP FUNCTIONALITY ==================================
function showDoctorPopup(doctorId) {
    const popup = document.getElementById('doctor-popup');
    const popupContent = document.querySelector('.popup-content');
    
    if (!popup || !popupContent) return;
    
    const doctor = doctors[doctorId];
    if (!doctor) return;
    
    // Update konten popup
    popupContent.querySelector('img').src = doctor.image;
    popupContent.querySelector('img').alt = doctor.name;
    popupContent.querySelector('h3').textContent = doctor.name;
    popupContent.querySelector('.specialty').textContent = doctor.specialty;
    popupContent.querySelector('.experience').textContent = `Pengalaman: ${doctor.experience}`;
    popupContent.querySelector('.education').textContent = doctor.education;
    popupContent.querySelector('.description').textContent = doctor.description;
    
    // Tampilkan popup
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function debugFooterClick() {
    console.log('Footer consultation link clicked');
    console.log('Available functions:', {
        authRedirect: typeof authRedirect,
        redirectToKonsultasi: typeof redirectToKonsultasi,
        checkLoginStatusForConsultation: typeof checkLoginStatusForConsultation
    });
}


function closeDoctorPopup() {
    const popup = document.getElementById('doctor-popup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling again
    }
}