// JavaScript untuk halaman chatbot sederhana
document.addEventListener('DOMContentLoaded', function() {
    initializeSimpleChatbot();
});

function initializeSimpleChatbot() {
    const chatInput = document.querySelector('.chat-input-simple input');
    const sendBtn = document.querySelector('.send-btn-simple');
    
    if (chatInput && sendBtn) {
        // Event listener untuk tombol kirim
        sendBtn.addEventListener('click', function() {
            handleChatMessage();
        });
        
        // Event listener untuk tombol Enter
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleChatMessage();
            }
        });
        
        // Auto-focus pada input ketika halaman dimuat
        chatInput.focus();
    }
}

function handleChatMessage() {
    const chatInput = document.querySelector('.chat-input-simple input');
    const message = chatInput.value.trim();
    
    if (message) {
        // Simpan pertanyaan untuk ditampilkan di halaman FAQ jika diperlukan
        localStorage.setItem('lastChatQuestion', message);
        
        // Tampilkan pesan konfirmasi
        showMessageConfirmation(message);
        
        // Kosongkan input
        chatInput.value = '';
        
        // Tetap fokus pada input
        chatInput.focus();
    }
}

function showMessageConfirmation(message) {
    // Buat elemen konfirmasi sementara
    const confirmation = document.createElement('div');
    confirmation.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 123, 255, 0.9);
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        text-align: center;
        animation: fadeInOut 3s ease-in-out;
    `;
    
    confirmation.innerHTML = `
        <p style="margin: 0; font-size: 1rem;">
            <strong>Pertanyaan terkirim:</strong><br>
            "${message}"
        </p>
        <p style="margin: 10px 0 0 0; font-size: 0.9rem; opacity: 0.9;">
            Tim Medicare akan segera membalas Anda
        </p>
    `;
    
    // Tambahkan style untuk animasi
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(confirmation);
    
    // Hapus elemen konfirmasi setelah 3 detik
    setTimeout(() => {
        if (confirmation.parentNode) {
            confirmation.parentNode.removeChild(confirmation);
        }
        if (style.parentNode) {
            style.parentNode.removeChild(style);
        }
    }, 3000);
}

// Fungsi untuk redirect ke halaman chatbot (jika diperlukan dari halaman lain)
function goToChatbotPage() {
    window.location.href = 'chatbot.html';
}