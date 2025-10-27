// JavaScript for Online Counseling Form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counselingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    let currentStep = 1;

    // Initialize the form
    showStep(currentStep);

    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding
            if (validateStep(currentStep)) {
                currentStep = nextStep;
                updateProgress();
                showStep(currentStep);
            }
        });
    });

    // Previous button functionality
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
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
            // Collect all form data
            const formData = collectFormData();
            
            // Show appointment result card
            showAppointmentResult(formData);
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
        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                highlightError(input);
            } else {
                removeErrorHighlight(input);
                
                // Additional validation for specific fields
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
        input.style.borderColor = '#dc3545';
        
        // Remove existing error message if any
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        input.parentNode.appendChild(errorElement);
    }

    // Function to remove error highlighting
    function removeErrorHighlight(input) {
        input.style.borderColor = '';
        
        // Remove error message if exists
        const existingError = input.parentNode.querySelector('.error-message');
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
            birthDate: formatDate(document.getElementById('birthDate').value),
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
            consultDate: formatDate(document.getElementById('consultDate').value),
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
        return date.toLocaleDateString('id-ID', {
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

    // Function to show appointment result card
    function showAppointmentResult(formData) {
        // Hide form
        form.style.display = 'none';
        
        // Create appointment result card
        const appointmentCard = document.createElement('div');
        appointmentCard.className = 'appointment-result';
        appointmentCard.innerHTML = `
            <div class="appointment-header">
                <div class="appointment-success-icon">✓</div>
                <h2>Janji Konseling Berhasil Dibuat!</h2>
                <p>Terima kasih telah membuat janji konseling online. Berikut adalah detail janji Anda:</p>
            </div>
            
            <div class="appointment-details">
                <div class="detail-section">
                    <h3>Informasi Janji</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Nomor Janji:</span>
                            <span class="detail-value">${formData.appointmentNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tanggal Dibuat:</span>
                            <span class="detail-value">${formData.appointmentDate}, ${formData.appointmentTime}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Psikolog:</span>
                            <span class="detail-value">${formData.doctor}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tanggal Konsultasi:</span>
                            <span class="detail-value">${formData.consultDate}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Waktu:</span>
                            <span class="detail-value">${formData.consultTime}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Jenis Konsultasi:</span>
                            <span class="detail-value">${formData.consultType}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Data Pasien</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Nama Lengkap:</span>
                            <span class="detail-value">${formData.fullName}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">NIK:</span>
                            <span class="detail-value">${formData.nik}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tanggal Lahir:</span>
                            <span class="detail-value">${formData.birthDate}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Jenis Kelamin:</span>
                            <span class="detail-value">${formData.gender}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${formData.email}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Telepon:</span>
                            <span class="detail-value">${formData.phone}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Informasi Tambahan</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Kondisi Perasaan:</span>
                            <span class="detail-value">${formData.feeling}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Frekuensi:</span>
                            <span class="detail-value">${formData.frequency}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Tujuan Konsultasi:</span>
                            <span class="detail-value">${formData.goal}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Konsultasi Sebelumnya:</span>
                            <span class="detail-value">${formData.previousConsultation}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="appointment-instructions">
                <div class="detail-section">
                    <h3>Instruksi Penting</h3>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff;">
                        <p style="margin-bottom: 10px; color: #333;">
                            <strong>Sebelum sesi konseling:</strong>
                        </p>
                        <ul style="color: #555; margin-bottom: 15px; padding-left: 20px;">
                            <li>Pastikan koneksi internet stabil</li>
                            <li>Siapkan ruangan yang nyaman dan privat</li>
                            <li>Gunakan perangkat dengan kamera dan mikrofon (untuk video call)</li>
                            <li>Login 5-10 menit sebelum sesi dimulai</li>
                        </ul>
                        <p style="color: #666; font-size: 0.9rem;">
                            <strong>Catatan:</strong> Psikolog akan mengirimkan link sesi melalui email 1 jam sebelum konsultasi dimulai.
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="appointment-actions">
                <button class="btn-download" onclick="downloadAppointment()">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Download PDF
                </button>
                <button class="btn-print" onclick="printAppointment()">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/>
                        <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/>
                    </svg>
                    Print
                </button>
                <a href="konsultasi.html" class="btn-back">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                    </svg>
                    Kembali ke Konsultasi
                </a>
            </div>
        `;
        
        document.querySelector('.counseling-steps-section .main-container').appendChild(appointmentCard);
    }
});

// Function to download appointment as PDF (placeholder)
function downloadAppointment() {
    alert('Fitur download PDF akan segera tersedia. Untuk sementara, Anda dapat menggunakan fitur print.');
}

// Function to print appointment
function printAppointment() {
    window.print();
}