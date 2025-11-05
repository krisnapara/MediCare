// JavaScript for Online Counseling Form

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counselingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const appointmentResult = document.getElementById('appointmentResult');
    
    // VARIABEL INI TIDAK DIGUNAKAN, JADI SAYA HAPUS
    // const mainContent = document.querySelector('.online-counseling-page');

    let currentStep = 1;

    const today = new Date().toISOString().split('T')[0];

    // Ambil elemen input tanggal
    const birthDateInput = document.getElementById('birthDate');
    const consultDateInput = document.getElementById('consultDate');

    // Pastikan Flatpickr tersedia sebelum inisialisasi
    if (typeof flatpickr !== 'undefined') {
        
        // 1. Inisialisasi Flatpickr untuk Tanggal Lahir (Birth Date)
        flatpickr(birthDateInput, {
            dateFormat: "Y-m-d", 
            enableTime: false,
            
            // OPSI KUNCI 1: Dropdown Tahun & Batas Mundur Jauh (1900)
            yearSelectorType: "dropdown", 
            minDate: "1900-01-01", 
            maxDate: today,       // Batas maksimal hari ini
            
            locale: "id", 
            disableMobile: true 
        });
        
        // 2. Inisialisasi Flatpickr untuk Tanggal Konsultasi (Consult Date)
        flatpickr(consultDateInput, {
            dateFormat: "Y-m-d",
            enableTime: false,
            
            // OPSI KUNCI 2: Dropdown Tahun untuk Konsultasi
            yearSelectorType: "dropdown", 
            
            minDate: today, // Minimal hari ini
            
            // OPSI KRITIS: Menetapkan batas maksimal yang sangat jauh di masa depan
            maxDate: "2100-01-01", 
            
            locale: "id",
            disableMobile: true
        });

    } else {
        // Fallback jika Flatpickr gagal dimuat
        if (birthDateInput) {
             birthDateInput.setAttribute('max', today);
             birthDateInput.setAttribute('min', '1900-01-01');
        }
        if (consultDateInput) {
             consultDateInput.setAttribute('max', '2100-01-01');
             consultDateInput.setAttribute('min', today);
        }
    }
    
    // --- AKHIR PENGATURAN KALENDER ---
    
    function getTelegramHandle(doctorName) {
        const myTelegramUsername = "johnismyuncle"; // GANTI INI DENGAN USERNAME TELEGRAM ANDA
        
        const doctorHandles = {
            "dr. Sinta Maharani, M.Psi": myTelegramUsername,
            "dr. Andi Pratama, M.Psi": myTelegramUsername,
            "dr. Ade Muliadi, Sp.KJ": myTelegramUsername,
            "dr. Gede Danendra Suputra, Sp.KJ": myTelegramUsername
        };
        
        return doctorHandles[doctorName] || myTelegramUsername;
    }

    // Initialize the form
    showStep(currentStep);

    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                currentStep = nextStep;
                updateProgress();
                showStep(currentStep);
            }
        });
    });

    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); 
            const prevStep = parseInt(this.getAttribute('data-prev'));
            currentStep = prevStep;
            updateProgress();
            showStep(currentStep);
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            const formData = collectFormData();
            displayAppointmentResult(formData);
        }
    });

    // Function to show the current step
    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

    // Function to update the progress indicator
    function updateProgress() {
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
            }
        });
    }

    // Function to validate the current step
    function validateStep(stepNumber) {
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (!currentStepElement) return false;
        
        const inputs = currentStepElement.querySelectorAll('input[required]:not([type="radio"]), select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            let inputValid = true;

            if (!input.value.trim()) {
                inputValid = false;
            }

            if (!inputValid) {
                isValid = false;
                highlightError(input);
            } else {
                removeErrorHighlight(input);
                
                if (input.type === 'email' && input.value) {
                    if (!isValidEmail(input.value)) {
                        isValid = false;
                        highlightError(input, 'Format email tidak valid');
                    }
                }
                
                if (input.id === 'nik' && input.value) {
                    if (!isValidNIK(input.value)) {
                        isValid = false;
                        highlightError(input, 'Format NIK tidak valid (harus 16 digit)');
                    }
                }
            }
        });
        
        const radioGroups = currentStepElement.querySelectorAll('.radio-group');
        radioGroups.forEach(group => {
            const radios = group.querySelectorAll('input[type="radio"]');
            
            if (radios.length > 0 && radios[0].hasAttribute('required')) {
                const groupName = radios[0].name;
                if (!document.querySelector(`input[name="${groupName}"]:checked`)) {
                    isValid = false;
                    const label = group.previousElementSibling;
                    if(label) highlightError(label, 'Pilihan ini wajib diisi');
                } else {
                    const label = group.previousElementSibling;
                    if(label) removeErrorHighlight(label);
                }
            }
        });
        
        return isValid;
    }

    // Helper function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to validate NIK format (16 digits)
    function isValidNIK(nik) {
        const nikRegex = /^\d{16}$/;
        return nikRegex.test(nik);
    }

    // Function to highlight input errors
    function highlightError(input, message = 'Field ini wajib diisi') {
        let parentNode = input.parentNode;
        
        const existingError = parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (input.tagName === 'LABEL') {
             input.style.color = '#dc3545';
        } else {
             input.style.borderColor = '#dc3545';
        }
       
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        parentNode.appendChild(errorElement);
    }

    // Function to remove error highlighting
    function removeErrorHighlight(input) {
        let parentNode = input.parentNode;
        
        if (input.tagName === 'LABEL') {
             input.style.color = '';
        } else {
             input.style.borderColor = '';
        }
        
        const existingError = parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Function to collect all form data
    function collectFormData() {
        const formData = {
            // Step 1: Data Diri
            fullName: document.getElementById('fullName').value,
            nik: document.getElementById('nik').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            
            // Step 2: Kondisi & Tujuan
            feeling: document.getElementById('feeling').value,
            frequency: document.getElementById('frequency').value,
            goal: document.getElementById('goal').value,
            previousConsultation: document.querySelector('input[name="previousConsultation"]:checked')?.value || '',
            
            // Step 3: Jadwal & Konsultasi
            doctor: document.getElementById('doctor').value,
            consultDate: document.getElementById('consultDate').value,
            consultTime: document.getElementById('consultTime').value,
            consultType: document.getElementById('consultType').value,
            
            // Metadata
            appointmentNumber: generateAppointmentNumber(),
            appointmentDate: new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            appointmentTime: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
        
        return formData;
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const correctedDate = new Date(date.getTime() + (offset * 60 * 1000));
        
        return correctedDate.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Helper function to generate appointment number
    function generateAppointmentNumber() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `APT-${timestamp}${random}`;
    }

    // Function to display appointment result
    function displayAppointmentResult(formData) {
        // Hide form and progress
        form.style.display = 'none';
        document.querySelector('.steps-progress').style.display = 'none';
        document.querySelector('.consult-hero').style.display = 'none';
        
        // Update result elements with form data
        document.getElementById('resultName').textContent = formData.fullName;
        document.getElementById('resultEmail').textContent = formData.email;
        document.getElementById('resultPhone').textContent = formData.phone;
        document.getElementById('resultBirthDate').textContent = formatDate(formData.birthDate);
        document.getElementById('resultDoctor').textContent = formData.doctor;
        document.getElementById('resultDate').textContent = formatDate(formData.consultDate);
        document.getElementById('resultTime').textContent = formData.consultTime;
        document.getElementById('resultType').textContent = formData.consultType;
        
        const telegramHandle = getTelegramHandle(formData.doctor);
        const doctorShortName = formData.doctor.split(',')[0].trim();
        const telegramNote = document.getElementById('telegramNote');

        if (telegramNote) {
            // Langsung isi kontainer 'telegramNote' dengan HTML yang sudah jadi.
            telegramNote.innerHTML = `Untuk memulai konsultasi dengan ${doctorShortName}, silahkan klik link berikut: <a href="https://t.me/${telegramHandle}" id="resultTelegramLink" target="_blank" rel="noopener noreferrer">Hubungi via Telegram</a>. Pastikan Anda sudah menginstal aplikasi Telegram terlebih dahulu.`;
        }
        

        // Show appointment result
        appointmentResult.style.display = 'flex';
        
        // Update progress steps to completed
        updateStepProgressToCompleted();
        
        // Add event listeners to buttons
        document.querySelector('.btn-download').addEventListener('click', simulateDownload);
        document.querySelector('.btn-print').addEventListener('click', printPage);
        
        document.querySelector('.btn-back').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    
    function updateStepProgressToCompleted() {
        progressSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
    }

    function simulateDownload() {
        const downloadBtn = document.querySelector('.btn-download');
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Mengunduh...';
        downloadBtn.disabled = true;
        
        setTimeout(() => {
            downloadBtn.textContent = originalText;
            downloadBtn.disabled = false;
            alert('File PDF berhasil diunduh!');
        }, 2000);
    }

    function printPage() {
        window.print();
    }
});