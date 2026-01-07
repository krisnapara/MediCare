document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const welcomeSection = document.getElementById('welcomeSection');
    const messagesContainer = document.getElementById('messagesContainer');
    const suggestionCards = document.querySelectorAll('.suggestion-card');
    const resetButton = document.getElementById('resetButton');
    const chatSuggestions = document.getElementById('chatSuggestions');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');

    const N8N_WEBHOOK_URL = 'https://pabafim.app.n8n.cloud/webhook/website-chatbot';

    let isFirstMessage = true;
    let sessionId = 'session_' + Math.random().toString(36).substr(2, 9);

    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        sendButton.disabled = this.value.trim() === '';
    });

    function startNewChat() {
        chatMessages.innerHTML = '';
        welcomeSection.style.display = 'flex'; // Ubah ke flex
        welcomeSection.style.overflowY = 'auto'; // Biarkan scroll
        messagesContainer.style.display = 'none';
        chatSuggestions.style.display = 'none';
        isFirstMessage = true;
        sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
        userInput.value = '';
        userInput.style.height = 'auto';
        userInput.focus();
        
        // Hapus overflow hidden dari body/html
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    function addMessage(text, isUser = false) {
        if (isFirstMessage) {
            welcomeSection.style.display = 'none';
            messagesContainer.style.display = 'flex'; // Ubah ke flex
            messagesContainer.style.overflowY = 'auto';
            chatSuggestions.style.display = 'flex';
            isFirstMessage = false;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const safeText = text ? text.replace(/\n/g, '<br>') : "...";

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${isUser ? '👤' : '<img src="assets/images/muliadi.jpg" alt="Bot">'}
            </div>
            <div class="message-content">
                <div class="message-bubble">
                    ${safeText}
                </div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Scroll ke bawah untuk melihat pesan baru
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'message bot-message';
        indicator.innerHTML = `
            <div class="message-avatar"><img src="assets/images/profil.jpg" alt="Bot"></div>
            <div class="message-content"><div class="message-bubble typing-dots"><span></span><span></span><span></span></div></div>
        `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';
        userInput.style.height = 'auto';
        sendButton.disabled = true;

        showTypingIndicator();

        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    message: message, 
                    sessionId: sessionId
                })
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            hideTypingIndicator();

            const botResponse = data.output || data.text || data.answer || "Maaf, saya tidak menerima respon yang valid.";
            addMessage(botResponse, false);

        } catch (error) {
            console.error('Error details:', error);
            hideTypingIndicator();
            addMessage("Maaf, terjadi kesalahan koneksi. Pastikan Webhook n8n aktif dan pengaturan CORS sudah diizinkan.", false);
        } finally {
            sendButton.disabled = userInput.value.trim() === '';
        }
    }

    function sendSuggestionMessage(message) {
        userInput.value = message;
        sendMessage();
    }

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);

    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    resetButton.addEventListener('click', startNewChat);

    suggestionCards.forEach(card => {
        card.addEventListener('click', function() {
            sendSuggestionMessage(this.getAttribute('data-message'));
        });
    });

    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            sendSuggestionMessage(this.getAttribute('data-message'));
        });
    });

    // Initialize - jangan set overflow hidden
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    
    // Jalankan chat awal
    startNewChat();
});