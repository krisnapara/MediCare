document.addEventListener('DOMContentLoaded', function() {
    // Set menu aktif berdasarkan halaman saat ini
    setActiveMenuByPage();

    // Setup enhanced logo handler - HARUS DIPANGGIL PERTAMA
    setupEnhancedLogoHandler();

    // Setup authentication redirect system
    setupAuthRedirectSystem();

    // Setup consultation auth flow
    setupConsultationAuthFlow();

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

    // Enhanced chatbot effects
    initializeChatbotEffects();
    enhanceChatbotColors();

    // Setup newsletter functionality - TAMBAHAN BARU
    setupNewsletter();

    console.log('All enhanced systems initialized');

    // Cek dan tampilkan notifikasi jika ada di URL (misalnya dari login)
    checkAndShowNotification();

    // Cek dan handle auth redirect jika ada di storage
    checkAndHandleAuthRedirect();
});


// ================================== ENHANCED LOGO CLICK HANDLER ==================================
function setupEnhancedLogoHandler() {
    console.log('Setting up enhanced logo handler...');

    // Handle header logo
    const headerLogo = document.querySelector('.header .logo');
    if (headerLogo) {
        console.log('Header logo found, adding click handler');
        headerLogo.style.cursor = 'pointer';

        // Remove any existing click handlers to avoid duplicates
        headerLogo.onclick = null;

        // Add event listener
        headerLogo.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Header logo clicked - redirecting to homepage');
            redirectToHomepage();
        });

        // Also make child elements clickable
        const headerLogoImg = headerLogo.querySelector('img');
        const headerLogoText = headerLogo.querySelector('.logo-text');

        if (headerLogoImg) {
            headerLogoImg.style.cursor = 'pointer';
            headerLogoImg.onclick = null;
            headerLogoImg.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Header logo image clicked - redirecting to homepage');
                redirectToHomepage();
            });
        }

        if (headerLogoText) {
            headerLogoText.style.cursor = 'pointer';
            headerLogoText.onclick = null;
            headerLogoText.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Header logo text clicked - redirecting to homepage');
                redirectToHomepage();
            });
        }
    } else {
        console.log('Header logo not found');
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

        // Also make child elements clickable
        const footerLogoImg = footerLogo.querySelector('img');
        const footerLogoText = footerLogo.querySelector('.logo-text');

        if (footerLogoImg) {
            footerLogoImg.style.cursor = 'pointer';
            footerLogoImg.onclick = null;
            footerLogoImg.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Footer logo image clicked - redirecting to homepage');
                redirectToHomepage();
            });
        }

        if (footerLogoText) {
            footerLogoText.style.cursor = 'pointer';
            footerLogoText.onclick = null;
            footerLogoText.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('Footer logo text clicked - redirecting to homepage');
                redirectToHomepage();
            });
        }
    } else {
        console.log('Footer logo not found');
    }
}

function redirectToHomepage() {
    console.log('Redirecting to homepage...');
    window.location.href = 'index.html';
}

// ================================== ENHANCED NEWSLETTER FUNCTIONALITY ==================================
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

function showSubscribeButton() {
    const newsletterBtn = document.getElementById('btn-subscribe');
    const unsubscribeBtn = document.getElementById('btn-unsubscribe');
    const statusElement = document.getElementById('newsletter-status');
    
    newsletterBtn.style.display = 'block';
    unsubscribeBtn.style.display = 'none';
    
    if (statusElement) {
        statusElement.innerHTML = '';
        statusElement.classList.remove('subscribed');
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
    
    // Simulasi pengiriman email konfirmasi
    simulateNewsletterConfirmation(email);
    
    // Log aktivitas
    logNewsletterActivity(email, 'subscribe');
    
    // Clear input setelah 3 detik
    setTimeout(() => {
        emailInput.value = '';
        showNewsletterMessage('', 'clear');
    }, 3000);
}

function showUnsubscribeConfirmation() {
    const savedEmail = localStorage.getItem('newsletter_subscribed_email');
    
    if (!savedEmail) {
        showNewsletterMessage('Anda belum berlangganan newsletter.', 'error');
        return;
    }
    
    // Buat dialog konfirmasi
    const overlay = document.createElement('div');
    overlay.className = 'newsletter-dialog-overlay';
    overlay.id = 'unsubscribe-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'newsletter-dialog';
    dialog.innerHTML = `
        <h3>Berhenti Berlangganan</h3>
        <p>Apakah Anda yakin ingin berhenti berlangganan newsletter?</p>
        <p class="dialog-email">Email: <strong>${savedEmail}</strong></p>
        <div class="dialog-actions">
            <button id="dialog-cancel" class="dialog-btn secondary">Batal</button>
            <button id="dialog-confirm" class="dialog-btn primary">Ya, Berhenti</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Event listeners untuk dialog
    document.getElementById('dialog-cancel').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    document.getElementById('dialog-confirm').addEventListener('click', function() {
        handleUnsubscribe();
        document.body.removeChild(overlay);
    });
    
    // Close ketika klik overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    
    // Close dengan ESC key
    const closeOnEsc = function(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);
}

function handleUnsubscribe() {
    const email = localStorage.getItem('newsletter_subscribed_email');
    
    if (!email) {
        showNewsletterMessage('Anda belum berlangganan newsletter.', 'error');
        return;
    }
    
    // Hapus data dari localStorage
    localStorage.removeItem('newsletter_subscribed_email');
    localStorage.removeItem('newsletter_subscribed_date');
    
    // Update UI
    updateNewsletterUI();
    
    // Show success message
    showNewsletterMessage('✅ Anda telah berhenti berlangganan newsletter. Email: ' + email, 'success');
    
    // Log aktivitas
    logNewsletterActivity(email, 'unsubscribe');
    
    // Simulasi konfirmasi unsubscription
    setTimeout(() => {
        showNewsletterMessage('', 'clear');
    }, 3000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    
    // Auto-hide pesan setelah 5 detik (kecuali pesan kosong)
    if (message && type !== 'clear') {
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'newsletter-message';
        }, 5000);
    }
}

function simulateNewsletterConfirmation(email) {
    console.log('Simulating newsletter confirmation for:', email);
    
    // Di implementasi nyata, ini akan mengirim request ke server
    // Simulasi delay server
    setTimeout(() => {
        console.log('Newsletter subscription confirmed for:', email);
    }, 1000);
}

function logNewsletterActivity(email, action) {
    // Simpan riwayat newsletter di localStorage
    let newsletterHistory = JSON.parse(localStorage.getItem('newsletter_history')) || [];
    
    const activity = {
        email: email,
        date: new Date().toISOString(),
        action: action,
        timestamp: Date.now()
    };
    
    newsletterHistory.push(activity);
    
    // Simpan maksimal 20 entri terakhir
    if (newsletterHistory.length > 20) {
        newsletterHistory = newsletterHistory.slice(-20);
    }
    
    localStorage.setItem('newsletter_history', JSON.stringify(newsletterHistory));
    console.log('Newsletter activity logged:', activity);
}

// Function to check subscription status
function checkNewsletterSubscription() {
    const email = localStorage.getItem('newsletter_subscribed_email');
    return {
        isSubscribed: !!email,
        email: email,
        subscribedDate: localStorage.getItem('newsletter_subscribed_date')
    };
}

// Function to manually reset newsletter (developer tool)
function resetNewsletter() {
    if (confirm('Reset semua data newsletter? Ini akan menghapus semua data langganan.')) {
        localStorage.removeItem('newsletter_subscribed_email');
        localStorage.removeItem('newsletter_subscribed_date');
        localStorage.removeItem('newsletter_history');
        
        // Reset UI
        updateNewsletterUI();
        
        showNewsletterMessage('✅ Semua data newsletter telah direset.', 'success');
        
        setTimeout(() => {
            showNewsletterMessage('', 'clear');
        }, 3000);
        
        return true;
    }
    return false;
}

// ================================== KONSULTASI REDIRECT WITH REGISTER FIRST ==================================
function redirectToKonsultasiWithRegister() {
    // Set redirect URL untuk setelah register dan login
    setRedirectUrl('konsultasi.html');

    // Langsung arahkan ke halaman register
    window.location.href = `register.html?return=${encodeURIComponent('konsultasi.html')}`;
}

// Fungsi untuk handle konsultasi dari header navigation DENGAN NOTIFIKASI
function handleConsultationNavigation() {
    showConsultationAuthDialog('konsultasi.html'); // Memanggil fungsi baru dengan target page
}

// Fungsi untuk setup consultation auth flow
function setupConsultationAuthFlow() {
    console.log('Setting up consultation auth flow...');

    // Untuk tombol konsultasi di header
    const consultationLinks = document.querySelectorAll('nav a[href="konsultasi.html"]');
    consultationLinks.forEach(link => {
        link.href = 'javascript:void(0);';
        link.onclick = handleConsultationNavigation;
        link.style.cursor = 'pointer';
    });

    // *PENAMBAHAN BARU: Handle tombol konsultasi di halaman beranda (index.html)*
    // Cari semua tombol dengan kelas 'btn-primary' yang digunakan untuk konsultasi di home/hero
    const homeConsultationButtons = document.querySelectorAll('.hero-section .btn-primary, .services-section .btn-primary');
    homeConsultationButtons.forEach(button => {
        // Pastikan tombol ini tidak memiliki onclick lain yang menimpa
        button.onclick = null;
        button.addEventListener('click', function(e) {
            e.preventDefault();
            authRedirect('konsultasi.html');
        });
    });
}

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

// ================================== AUTHENTICATION REDIRECT SYSTEM ==================================
function setupAuthRedirectSystem() {
    console.log('Setting up auth redirect system...');

    // Setup untuk login success
    window.handleLoginSuccess = function() {
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
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || sessionStorage.getItem('redirectAfterAuth') || 'konsultasi.html';

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

// Fungsi untuk set redirect URL (digunakan di chatbot)
function setRedirectUrl(url) {
    sessionStorage.setItem('redirectAfterAuth', url);
    console.log('Redirect URL set to:', url);
}

function authRedirect(targetPage) {
    // Set redirect URL di sessionStorage
    setRedirectUrl(targetPage);
    // Tampilkan custom dialog
    showConsultationAuthDialog(targetPage); // Menggunakan fungsi dialog konsultasi yang baru
}

function handleLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return') || sessionStorage.getItem('redirectAfterAuth') || 'index.html';

    // Hapus redirect URL dari storage setelah digunakan
    if (sessionStorage.getItem('redirectAfterAuth')) {
        sessionStorage.removeItem('redirectAfterAuth');
    }

    // Tampilkan notifikasi sukses login
    const successMessage = encodeURIComponent('Berhasil Masuk! Anda diarahkan ke halaman tujuan.');

    console.log('Login successful - redirecting to:', returnUrl);
    window.location.href = `${returnUrl}?notif=success&message=${successMessage}`;
}

function handleRegister() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return') || sessionStorage.getItem('redirectAfterAuth') || 'konsultasi.html';

    // Tetap simpan redirect URL untuk digunakan setelah login
    if (!sessionStorage.getItem('redirectAfterAuth')) {
        setRedirectUrl(returnUrl);
    }

    console.log('Register successful - redirecting to login with return:', returnUrl);
    window.location.href = `login.html?return=${encodeURIComponent(returnUrl)}&notif=success&message=${encodeURIComponent('Registrasi Berhasil! Silakan Masuk.')}`;
}

// ================================== AUTH REDIRECT CHECKER ==================================
function checkAndHandleAuthRedirect() {
    // Cek jika ada redirect URL di sessionStorage (misalnya dari chatbot)
    const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
    if (redirectUrl) {
        console.log('Found redirect URL in storage:', redirectUrl);

        // Untuk halaman login/register, kita biarkan parameter return di URL yang menangani
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            console.log('On auth page - letting URL parameters handle redirect');
            return;
        }

        // Untuk halaman lain, jika user sudah login (dalam real app, cek session/token)
        // Di sini kita asumsikan jika ada redirectUrl, maka perlu diarahkan
        // Dalam implementasi real, Anda akan cek status login terlebih dahulu
        console.log('Redirect URL found but not on auth page - clearing storage');
        sessionStorage.removeItem('redirectAfterAuth');
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
        } else if (link.onclick && linkHref === 'javascript:void(0);' && currentPage === 'konsultasi.html') {
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
            showMoodFeedback(mood);
        });
    });
}

function showMoodFeedback(mood) {
    const feedbackMessages = {
        happy: {
            title: "Senang Mendengarnya! 🎉",
            message: "Luar biasa! Terus pertahankan energi positif Anda. Jika ingin berbagi kebahagiaan lebih lanjut, kami siap mendengarkan.",
            emoji: "😊"
        },
        neutral: {
            title: "Terima kasih sudah berbagi perasaan!",
            message: "Terkadang merasa biasa saja itu wajar. 😊 Jika butuh teman bicara, kami di sini untuk Anda.",
            emoji: "😐"
        },
        sad: {
            title: "Kami di Sini untuk Anda 💙",
            message: "Perasaan sedih adalah bagian dari kehidupan. Anda tidak sendirian. Mari bicarakan apa yang Anda rasakan.",
            emoji: "😔"
        },
        anxious: {
            title: "Tenang, Kami Bersama Anda 🕊️",
            message: "Kecemasan bisa terasa berat, tetapi Anda lebih kuat dari yang Anda kira. Mari kita atasi bersama.",
            emoji: "😰"
        },
        angry: {
            title: "Kami Memahami Perasaan Anda 🔥",
            message: "Marah adalah emosi yang valid. Mari kita cari cara sehat untuk mengekspresikannya.",
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
        <p>Ingin berbicara dengan profesional tentang perasaan Anda?</p>
        <div class="feedback-actions">
            <button id="btn-mood-konsultasi" class="feedback-btn primary">Konsultasi Sekarang</button>
            <button id="btn-mood-tamu" class="feedback-btn secondary">Ingin Menjadi Tamu Saja</button>
        </div>
    `;

    // Tambahkan ke body
    document.body.appendChild(overlay);
    document.body.appendChild(feedbackElement);

    // Event listener untuk tombol konsultasi
    const consultButton = feedbackElement.querySelector('#btn-mood-konsultasi');
    if (consultButton) {
        consultButton.addEventListener('click', function() {
            redirectToKonsultasiFromMood();
        });
    }

    // Event listener untuk tombol tamu - PERBAIKAN: langsung panggil close
    const guestButton = feedbackElement.querySelector('#btn-mood-tamu');
    if (guestButton) {
        guestButton.addEventListener('click', function() {
            closeMoodFeedback(); // Langsung tutup tanpa delay
        });
    }

    // Event listener untuk overlay - tutup saat klik di luar
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeMoodFeedback();
        }
    });

    // Event listener untuk ESC key
    const closeOnEsc = function(e) {
        if (e.key === 'Escape') {
            closeMoodFeedback();
            document.removeEventListener('keydown', closeOnEsc);
        }
    };
    document.addEventListener('keydown', closeOnEsc);

    // Trigger animation
    setTimeout(() => {
        overlay.classList.add('show');
        feedbackElement.classList.add('show');
    }, 10);
}

// PERBAIKAN FUNGSI CLOSE - lebih agresif dalam menghapus
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

// Fungsi untuk redirect ke konsultasi dari mood tracker
function redirectToKonsultasiFromMood() {
    closeMoodFeedback();
    // Tampilkan dialog auth untuk konsultasi
    setTimeout(() => {
        authRedirect('konsultasi.html');
    }, 300);
}

// Fungsi lama untuk kompatibilitas
function trackMood(mood) {
    showMoodFeedback(mood);
}

// Fungsi untuk reset mood tracker (guest mode)
function resetMoodTracker() {
    closeMoodFeedback();
}

// ================================== CONSULTATION AUTH DIALOG (UNTUK SEMUA TOMBOL KONSULTASI) ==================================
function showConsultationAuthDialog(targetPage = 'konsultasi.html') {
    // Buat overlay
    const overlay = document.createElement('div');
    // Menggunakan kelas untuk styling dari auth.css
    overlay.className = 'auth-dialog-overlay';

    // Buat dialog box
    const dialog = document.createElement('div');
    // Menggunakan kelas untuk styling dari auth.css
    dialog.className = 'consultation-auth-dialog';

    // TAMBAHKAN TOMBOL CLOSE (X) DI POJOK KANAN ATAS
    const closeButton = document.createElement('button');
    closeButton.className = 'auth-dialog-close-btn';
    closeButton.innerHTML = '&times;'; // Tanda silang
    closeButton.setAttribute('aria-label', 'Tutup dialog');
    
    // Fungsi untuk menutup dialog
    closeButton.addEventListener('click', function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
    });

    // HILANGKAN ICON KUNCI - Dihapus dari sini
    // Icon Kunci dihapus sesuai permintaan

    // Isi Konten Dialog
    dialog.innerHTML = `
        <h3 class="auth-dialog-title">Akses Konsultasi</h3>
        <p class="auth-dialog-message">
            Untuk mengakses layanan konsultasi, Anda perlu memiliki akun terlebih dahulu.<br>
            Apakah Anda sudah memiliki akun?
        </p>
        <div class="auth-dialog-actions">
            <button id="btn-sudah-punya" class="auth-btn-primary">Sudah Punya Akun</button>
            <button id="btn-belum-punya" class="auth-btn-primary">Belum Punya Akun</button>
        </div>
    `;

    // TAMBAHKAN TOMBOL CLOSE KE DIALOG
    dialog.appendChild(closeButton);

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    // Event listeners untuk tombol
    document.getElementById('btn-sudah-punya').addEventListener('click', function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        // Redirect ke Login dengan return ke targetPage
        window.location.href = `login.html?return=${encodeURIComponent(targetPage)}`;
    });

    document.getElementById('btn-belum-punya').addEventListener('click', function() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        // Redirect ke Register dengan return ke targetPage
        window.location.href = `register.html?return=${encodeURIComponent(targetPage)}`;
    });

    // Close ketika klik overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }
    });

    // Close dengan ESC key
    document.addEventListener('keydown', function closeOnEsc(e) {
        if (e.key === 'Escape') {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
            document.removeEventListener('keydown', closeOnEsc);
        }
    });
}

// ================================== CHATBOT EFFECTS ==================================
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

// Enhanced ripple effect function
function createEnhancedRippleEffect(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add('ripple');

    // Remove existing ripples
    const ripples = button.getElementsByClassName('ripple');
    while (ripples[0]) {
        ripples[0].remove();
    }

    button.appendChild(circle);
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



// ================================== ADDITIONAL UTILITY FUNCTIONS ==================================
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getRandomBlueShade() {
    const shades = [
        '#007bff', '#0066cc', '#0056b3', '#004494', '#003366',
        '#0088ff', '#0077e6', '#0066cc', '#0055b3', '#004499'
    ];
    return shades[Math.floor(Math.random() * shades.length)];
}

// ================================== INITIALIZE ALL EFFECTS ==================================
// Initialize additional effects after a short delay
setTimeout(() => {

    // Add loading state to chatbot button
    const chatbotBtn = document.querySelector('.chatbot-toggle-btn');
    if (chatbotBtn) {
        setTimeout(() => {
            chatbotBtn.style.opacity = '1';
            chatbotBtn.style.transform = 'scale(1)';
        }, 500);
    }
}, 1000);

// Export functions for global access (if needed)
window.MediCare = {
    authRedirect,
    redirectToKonsultasi,
    redirectToKonsultasiWithRegister,
    handleConsultationNavigation,
    showConsultationAuthDialog,
    showNotification,
    initializeChatbotEffects,
    goToChatbotPage,
    trackMood,
    resetMoodTracker,
    showMoodFeedback,
    closeMoodFeedback,
    redirectToKonsultasiFromMood,
    goToBerandaAsGuest,
    redirectToHomepage,
    setupEnhancedLogoHandler,
    handleLoginSuccess,
    handleRegisterSuccess,
    setRedirectUrl,
    showDoctorPopup, 
    closeDoctorPopup,
    // Newsletter functions
    newsletter: {
        subscribe: handleNewsletterSubscription,
        unsubscribe: handleUnsubscribe,
        checkSubscription: checkNewsletterSubscription,
        showMessage: showNewsletterMessage,
        reset: resetNewsletter,
        updateUI: updateNewsletterUI
    }
};

console.log('MediCare JavaScript loaded successfully!');

// Error boundary for chatbot effects
window.addEventListener('error', function(e) {
    if (e.target && e.target.classList && e.target.classList.contains('chatbot-toggle-btn')) {
        console.error('Chatbot effect error:', e);
        // Fallback: ensure button remains functional
        const chatbotBtn = document.querySelector('.chatbot-toggle-btn');
        if (chatbotBtn) {
            chatbotBtn.onclick = goToChatbotPage;
        }
    }
});

// Tambahkan event listener untuk ESC key untuk mood feedback
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMoodFeedback();
    }
});

function enhanceChatbotColors() {
    // Function implementation
}

function addChatbotInteractionEffects() {
    // Function implementation
}

function optimizeChatbotPerformance() {
    // Function implementation
}