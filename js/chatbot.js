// chatbot.js - Simplified Version with Left-Aligned Input
document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const welcomeSection = document.getElementById('welcomeSection');
    const messagesContainer = document.getElementById('messagesContainer');
    const suggestionCards = document.querySelectorAll('.suggestion-card');

    let isFirstMessage = true;

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button
        sendButton.disabled = this.value.trim() === '';
    });

    // Focus pada input saat halaman dimuat
    userInput.focus();

    // Fungsi untuk memulai chat baru
    function startNewChat() {
        chatMessages.innerHTML = '';
        welcomeSection.style.display = 'flex';
        messagesContainer.style.display = 'none';
        isFirstMessage = true;
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;
    }

    // Fungsi untuk menambahkan pesan ke chat
    function addMessage(message, isUser = false) {
        if (isFirstMessage) {
            welcomeSection.style.display = 'none';
            messagesContainer.style.display = 'block';
            isFirstMessage = false;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const time = new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        if (isUser) {
            // User message di sebelah kanan
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${time}</span>
                </div>
                <div class="message-avatar">
                    <img src="assets/images/profil.jpg" alt="Anda" onerror="this.style.display='none'; this.parentNode.innerHTML='Anda'">
                </div>
            `;
        } else {
            // Bot message di sebelah kiri
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="assets/images/muliadi.jpg" alt="MediCare Bot" onerror="this.style.display='none'; this.parentNode.innerHTML='MC'">
                </div>
                <div class="message-content">
                    <p>${message}</p>
                    <span class="message-time">${time}</span>
                </div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Fungsi untuk menampilkan typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <img src="assets/images/muliadi.jpg" alt="MediCare Bot" onerror="this.style.display='none'; this.parentNode.innerHTML='MC'">
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Fungsi untuk menghilangkan typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Fungsi untuk scroll ke bawah
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Fungsi untuk mendapatkan respon bot
    function getBotResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();

        // HTML untuk tombol konsultasi
        const consultationButtonHtml = `
            <div style="margin-top: 15px; text-align: left;">
                <a href="konsultasi.html" target="_blank" class="chat-button">
                    Lihat Pilihan Konsultasi
                </a>
            </div>
        `;
        
        // Response logic berdasarkan kata kunci (Prioritas 1: Paling Spesifik/Darurat)
        
        // 1. Bantuan Darurat
        if (message.includes('darurat') || message.includes('urgent') || message.includes('emergency') || message.includes('krisis') || message.includes('bantuan darurat')) {
            return '🚨 **BANTUAN DARURAT** 🚨\n\nJika Anda mengalami krisis kesehatan mental:\n\n📞 **Hotline Darurat:**\n• 119 (Ext. 8) - Kemenkes RI\n• 112 - Emergency Services\n• 0811-222-333 - MediCare Crisis\n\n🏥 **Tindakan Segera:**\n1. Hubungi hotline di atas\n2. Pergi ke IGD rumah sakit terdekat\n3. Hubungi orang terdekat yang dipercaya\n\n💝 **Ingat:**\n• Anda tidak sendirian\n• Bantuan profesional tersedia\n• Semua perasaan adalah valid\n\n**JANGAN MENUNGGU - CARI BANTUAN SEKARANG**';
        } 

        // 2. Informasi Biaya (Harusnya mengatasi masalah Anda)
        else if (message.includes('biaya') || message.includes('harga') || message.includes('tarif') || message.includes('berapa biaya')) {
            return '💰 **Informasi Biaya:**\n\n👥 **Konsultasi Psikolog dan Psikiater**\n• Tidak ada sepeserpun biaya terpungut\n• Jika ada indikasi atau percakapan mengenai biaya apapun itu, silahkan hubungi customer service agar oknum bisa langsung dimutilasi.';
        } 
        
        // 3. Tes Kesehatan Mental
        else if (message.includes('tes kesehatan mental') || message.includes('assessment') || message.includes('cek mental')) {
            return '🧠 **Tes Kesehatan Mental MediCare:**\n\nKami menyediakan berbagai tes assessment yang divalidasi:\n\n• **Stress Test** - Tingkat stres harian\n• **Anxiety Test** - Deteksi kecemasan\n• **Depression Test** - Skrining depresi\n• **Burnout Test** - Assess kelelahan kerja\n• **General Mental Health** - Kesehatan mental umum\n\n📊 **Fitur Tes Kami:**\n• Hasil instan dengan analisis\n• Rekomendasi tindakan\n• Bisa konsultasi lanjutan\n• Kerahasiaan terjamin\n\nMau saya arahkan ke halaman tes?';
        } 
        
        // 4. Konsultasi/Psikolog (Respons yang memiliki tombol)
        else if (message.includes('konsultasi') || message.includes('psikolog') || message.includes('psikiater') || message.includes('cara konsultasi')) {
            return `Untuk konsultasi dengan profesional MediCare:\n\n📋 **Cara Mendaftar:**\n1. Kunjungi halaman "Konsultasi" di website\n2. Isi formulir data diri\n
            3. Pilih tanggal & waktu yang tersedia\n4. Pilih jenis layanan (Video Call/Chat/Telepon)\n\n👥 **Jenis Profesional:**\n• Psikolog Klinis\n• Psikiater\n• Konselor\n\n💡 **Tips:** Pilih waktu yang tenang dan siapkan pertanyaan sebelumnya.\n\nMau saya bantu informasi lebih detail?${consultationButtonHtml}`;
        } 
        
        // 5. Layanan Umum
        else if (message.includes('layanan') || message.includes('service') || message.includes('fasilitas') || message.includes('apa saja layanan')) {
            return '🏥 **Layanan MediCare:**\n\n🎯 **Konsultasi Profesional**\n• Psikolog & Psikiater\n• Berbagai metode: Video, Chat, Telepon\n• Konsultasi darurat 24/7\n\n📚 **Edukasi & Support**\n• Artikel kesehatan mental\n• Tes assessment online\n• Grup dukungan\n• Webinar & workshop\n\n🛡️ **Layanan Tambahan**\n• Second opinion\n• Terapi berkelanjutan\n• Monitoring progress\n\nSemua layanan kami menjaga kerahasiaan dan profesionalitas.';
        } 
        
        // 6. Sapaan
        else if (message.includes('halo') || message.includes('hai') || message.includes('hi') || message.includes('hello')) {
            return 'Halo! Saya MediCare Assistant, asisten virtual untuk membantu Anda dengan informasi kesehatan mental dan layanan MediCare. Ada yang bisa saya bantu hari ini?';
        } 
        
        // 7. Ucapan Terima Kasih
        else if (message.includes('terima kasih') || message.includes('thanks')) {
            return 'Sama-sama! 😊 \n\nSenang bisa membantu Anda. Jaga selalu kesehatan mental Anda dan ingat, mencari bantuan adalah tanda kekuatan, bukan kelemahan.\n\nJika ada yang else yang perlu ditanyakan, saya siap membantu!';
        }
        
        // 8. Default/Fallback
        else {
            return 'Maaf, saya belum sepenuhnya memahami pertanyaan Anda. Saya adalah asisten virtual MediCare yang khusus membantu dengan:\n\n• Informasi layanan konsultasi\n• Jadwal dan biaya\n• Bantuan darurat\n• Tes kesehatan mental\n• Artikel dan edukasi\n\nBisa coba tanyakan dengan kata kunci di atas atau pilih salah satu opsi yang disarankan?';
        }
    }

// ... kode setelah ini tetap sama

    // Fungsi untuk mengirim pesan
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            userInput.style.height = 'auto';
            sendButton.disabled = true;
            
            // Tampilkan typing indicator
            showTypingIndicator();
            
            // Simulasi delay respon bot
            setTimeout(() => {
                hideTypingIndicator();
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 1500);
        }
    }

    // Event listener untuk tombol kirim
    sendButton.addEventListener('click', sendMessage);

    // Event listener untuk enter key (tanpa shift)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Event listener untuk suggestion cards
    suggestionCards.forEach(card => {
        card.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            addMessage(message, true);
            
            // Tampilkan typing indicator
            showTypingIndicator();
            
            // Respon untuk suggestion
            setTimeout(() => {
                hideTypingIndicator();
                const botResponse = getBotResponse(message);
                addMessage(botResponse, false);
            }, 1200);
        });
    });

    // Inisialisasi chat
    startNewChat();
});