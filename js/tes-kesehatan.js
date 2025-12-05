const questionsData = [
    {
        id: 'q1',
        text: 'Seberapa sering Anda merasa sedih, murung, atau putus asa?',
    },
    {
        id: 'q2',
        text: 'Seberapa sering Anda kehilangan minat atau kesenangan dalam melakukan sesuatu?',
    },
    {
        id: 'q3',
        text: 'Seberapa sering Anda merasa cemas, khawatir, atau tegang secara berlebihan?',
    }
];

const optionsData = [
    { text: 'Tidak sama sekali', value: 0 },
    { text: 'Beberapa hari', value: 1 },
    { text: 'Lebih dari separuh waktu', value: 2 },
    { text: 'Hampir setiap hari', value: 3 }
];

const totalQuestions = questionsData.length;

function startTest() {
    const introLayer = document.getElementById('intro-layer');
    const testLayer = document.getElementById('test-layer');

    if (introLayer && testLayer) {
        introLayer.classList.add('hidden');
        testLayer.classList.remove('hidden');

        testLayer.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.error("Error: Elemen layer tidak ditemukan.");
    }
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = ''; 

    questionsData.forEach((question, index) => {
        const questionHtml = `
            <div class="question-card" data-id="${question.id}">
                <p class="question-text">${index + 1}. ${question.text}</p>
                <div class="options-group">
                    ${optionsData.map(option => `
                        <label>
                            <input type="radio" name="${question.id}" value="${option.value}" required>
                            <span>${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML += questionHtml;
    });
}
function checkAllAnswered() {
    const form = document.getElementById('mental-health-test-form');
    const submitButton = document.getElementById('submit-test-btn');
    
    const answeredCount = Array.from(form.querySelectorAll('.question-card')).filter(card => 
        card.querySelector('input:checked')
    ).length;

    if (answeredCount === totalQuestions) {
        submitButton.removeAttribute('disabled');
        submitButton.classList.remove('btn-primary');
        submitButton.classList.add('btn-secondary'); 
    } else {
        submitButton.setAttribute('disabled', 'true');
        submitButton.classList.remove('btn-secondary');
        submitButton.classList.add('btn-primary');
    }
}

function calculateAndShowResult(e) {
    e.preventDefault();

    const form = e.target;
    let totalScore = 0;

    questionsData.forEach(question => {
        const selected = form.querySelector(`input[name="${question.id}"]:checked`);
        if (selected) {
            totalScore += parseInt(selected.value);
        }
    });

    displayResult(totalScore);
}

function displayResult(score) {
    const modal = document.getElementById('result-modal');
    const title = document.getElementById('result-title');
    const feedback = document.getElementById('result-feedback');
    const finalScore = document.getElementById('final-score');
    const icon = document.getElementById('result-icon');
    
    modal.classList.remove('high', 'medium', 'low');
    finalScore.textContent = score;

    // Logika Penilaian (Total Skor Maksimal: 9)
    if (score >= 7) {
        title.textContent = 'Indikasi Gejala Signifikan 🚨';
        feedback.textContent = 'Skor Anda tinggi. Kami sangat menyarankan Anda untuk segera mencari **konsultasi tatap muka atau online** dengan profesional kesehatan mental.';
        icon.className = 'fas fa-exclamation-circle';
        modal.classList.add('high');
    } else if (score >= 4) {
        title.textContent = 'Indikasi Gejala Ringan hingga Sedang 💡';
        feedback.textContent = 'Skor Anda menunjukkan Anda mungkin sedang menghadapi tantangan emosional. Pertimbangkan untuk **mulai berbicara dengan profesional** atau mencari dukungan terdekat.';
        icon.className = 'fas fa-lightbulb';
        modal.classList.add('medium');
    } else {
        title.textContent = 'Kondisi Mental Relatif Baik ✅';
        feedback.textContent = 'Skor Anda rendah, yang menunjukkan Anda dalam kondisi mental yang baik. Tetap pertahankan pola hidup sehat dan tingkatkan self-care Anda!';
        icon.className = 'fas fa-heart';
        modal.classList.add('low');
    }

    modal.style.display = 'block';
}

/**
 * Fungsi untuk menutup modal hasil.
 */
function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

// ====================================================================
// C. EVENT LISTENERS
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render pertanyaan
    renderQuestions();

    // 2. Listener untuk tombol MULAI TES
    const startBtn = document.getElementById('start-test-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startTest);
    }
    
    // 3. Listener untuk perubahan radio button
    const form = document.getElementById('mental-health-test-form');
    form.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const questionCard = e.target.closest('.question-card');
            questionCard.classList.add('answered'); 
        }
        checkAllAnswered();
    });

    // 4. Listener untuk submit form (Tombol Selesaikan Tes)
    form.addEventListener('submit', calculateAndShowResult); 

    // 5. Menutup modal jika user klik di luar area modal
    window.onclick = function(event) {
        const modal = document.getElementById('result-modal');
        if (event.target == modal) {
            closeModal();
        }
    }
});