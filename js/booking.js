document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('multiStepForm');
    const stepContents = document.querySelectorAll('.step-content');
    const stepIndicators = document.querySelectorAll('.step-indicator .step');
    let currentStep = 1;

    // --- FUNGSI INTERNAL UNTUK STEP FORM (Dibuat global) ---
    window.showStep = function(step) { 
        // 1. Mengubah Tampilan Konten Form
        stepContents.forEach(content => {
            content.classList.remove('active');
            if (parseInt(content.dataset.step) === step) {
                content.classList.add('active');
            }
        });
        
        // 2. Mengubah Tampilan Indikator (Progress Bar)
        stepIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            if (parseInt(indicator.dataset.step) <= step) {
                 indicator.classList.add('active');
            }
        });
        currentStep = step;
    }
    
    // --- FUNGSI VALIDASI SEDERHANA ---
    function validateStep(step) {
        const currentContent = document.querySelector(`.step-content[data-step="${step}"]`);
        
        if (step === 1) {
            const specialtySelected = currentContent.querySelector('input[name="specialty"]:checked');
            if (!specialtySelected) {
                alert("Mohon pilih salah satu Spesialisasi terlebih dahulu.");
                return false;
            }
        }
        
        if (step === 2) {
            const psychologistSelected = currentContent.querySelector('input[name="psychologist"]:checked');
            if (!psychologistSelected) {
                alert("Mohon pilih salah satu Psikolog terlebih dahulu.");
                return false;
            }
        }
        return true;
    }

    // --- EVENT HANDLER UNTUK TOMBOL NEXT/PREV ---
    form.addEventListener('click', function(e) {
        if (e.target.classList.contains('next-step-btn')) {
            const nextStep = parseInt(e.target.dataset.next);
            if (validateStep(currentStep)) {
                showStep(nextStep);
            }
        } else if (e.target.classList.contains('prev-step-btn')) {
            const prevStep = parseInt(e.target.dataset.prev);
            showStep(prevStep);
        }
    });

    // --- EVENT HANDLER UNTUK SUBMIT FINAL ---
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const dateInput = document.getElementById('date').value;
        const timeSelected = form.querySelector('input[name="time"]:checked');
        const paymentSelect = document.getElementById('payment').value;
        
        if (!dateInput || !timeSelected || !paymentSelect) {
            alert("Mohon lengkapi Tanggal, Waktu, dan Metode Pembayaran.");
            return;
        }
        alert("Janji Konseling Berhasil Dibuat! Silakan lanjutkan ke pembayaran.");
    });
});