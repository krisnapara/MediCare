document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counselingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const appointmentResult = document.getElementById('appointmentResult');
    // Ambil elemen actionsArea untuk ditampilkan/disembunyikan
    const actionsArea = document.querySelector('.appointment-actions'); 
    
    let currentStep = 1;
    let currentFormData = null;

    // --- FUNGSI UNTUK DROPDOWN TANGGAL LAHIR ---
    function initializeBirthDateDropdowns() {
        const birthYearSelect = document.getElementById('birthYear');
        const birthMonthSelect = document.getElementById('birthMonth');
        const birthDaySelect = document.getElementById('birthDay');
        const birthDateInput = document.getElementById('birthDate');
        
        const currentYear = new Date().getFullYear();
        const startYear = 1900;
        
        // ===== DROPDOWN TANGGAL (dd) =====
        const dayPlaceholder = document.createElement('option');
        dayPlaceholder.value = "";
        dayPlaceholder.textContent = "dd";
        dayPlaceholder.hidden = true;
        dayPlaceholder.disabled = true;
        birthDaySelect.appendChild(dayPlaceholder);
        
        for (let day = 1; day <= 31; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            birthDaySelect.appendChild(option);
        }
        
        birthDaySelect.value = "";
        
        // ===== DROPDOWN BULAN (mm) =====
        const monthPlaceholder = document.createElement('option');
        monthPlaceholder.value = "";
        monthPlaceholder.textContent = "mm";
        monthPlaceholder.hidden = true;
        monthPlaceholder.disabled = true;
        birthMonthSelect.appendChild(monthPlaceholder);
        
        const months = [
            { value: "01", text: "Januari" },
            { value: "02", text: "Februari" },
            { value: "03", text: "Maret" },
            { value: "04", text: "April" },
            { value: "05", text: "Mei" },
            { value: "06", text: "Juni" },
            { value: "07", text: "Juli" },
            { value: "08", text: "Agustus" },
            { value: "09", text: "September" },
            { value: "10", text: "Oktober" },
            { value: "11", text: "November" },
            { value: "12", text: "Desember" }
        ];
        
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month.value;
            option.textContent = month.text;
            birthMonthSelect.appendChild(option);
        });
        
        birthMonthSelect.value = "";
        
        // ===== DROPDOWN TAHUN (yyyy) =====
        const yearPlaceholder = document.createElement('option');
        yearPlaceholder.value = "";
        yearPlaceholder.textContent = "yyyy";
        yearPlaceholder.hidden = true;
        yearPlaceholder.disabled = true;
        birthYearSelect.appendChild(yearPlaceholder);
        
        for (let year = currentYear; year >= startYear; year--) {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            birthYearSelect.appendChild(option);
        }
        
        birthYearSelect.value = "";
        
        birthDaySelect.classList.add('placeholder-active');
        birthMonthSelect.classList.add('placeholder-active');
        birthYearSelect.classList.add('placeholder-active');
        
        updateBirthDateInput();
        
        birthDaySelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('placeholder-active');
            } else {
                this.classList.add('placeholder-active');
            }
            updateBirthDateInput();
        });
        
        birthMonthSelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('placeholder-active');
            } else {
                this.classList.add('placeholder-active');
            }
            updateDaysDropdown(birthYearSelect.value, birthMonthSelect.value);
            updateBirthDateInput();
        });
        
        birthYearSelect.addEventListener('change', function() {
            if (this.value) {
                this.classList.remove('placeholder-active');
            } else {
                this.classList.add('placeholder-active');
            }
            updateDaysDropdown(birthYearSelect.value, birthMonthSelect.value);
            updateBirthDateInput();
        });
    }
    
    function updateDaysDropdown(year, month) {
        const birthDaySelect = document.getElementById('birthDay');
        const selectedDay = birthDaySelect.value;
        
        if (!year || !month) {
            if (!birthDaySelect.value) {
                birthDaySelect.classList.add('placeholder-active');
            }
            updateBirthDateInput();
            return;
        }
        
        const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
        const currentSelectedDay = birthDaySelect.value;
        
        const existingOptions = Array.from(birthDaySelect.options);
        const validDays = existingOptions.filter(option => {
            if (!option.value) return true;
            const dayNum = parseInt(option.value);
            return dayNum <= daysInMonth;
        });
        
        if (validDays.length === existingOptions.length) {
            if (currentSelectedDay && parseInt(currentSelectedDay) > daysInMonth) {
                birthDaySelect.value = "";
                birthDaySelect.classList.add('placeholder-active');
            }
            updateBirthDateInput();
            return;
        }
        
        birthDaySelect.innerHTML = '';
        
        const placeholder = document.createElement('option');
        placeholder.value = "";
        placeholder.textContent = "dd";
        placeholder.hidden = true;
        placeholder.disabled = true;
        birthDaySelect.appendChild(placeholder);
        
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day.toString().padStart(2, '0');
            option.textContent = day;
            birthDaySelect.appendChild(option);
        }
        
        if (currentSelectedDay && parseInt(currentSelectedDay) <= daysInMonth) {
            birthDaySelect.value = currentSelectedDay;
            birthDaySelect.classList.remove('placeholder-active');
        } else {
            birthDaySelect.value = "";
            birthDaySelect.classList.add('placeholder-active');
        }
        
        updateBirthDateInput();
    }
    
    function updateBirthDateInput() {
        const birthDay = document.getElementById('birthDay').value;
        const birthMonth = document.getElementById('birthMonth').value;
        const birthYear = document.getElementById('birthYear').value;
        const birthDateInput = document.getElementById('birthDate');
        
        if (birthDay && birthMonth && birthYear) {
            const fullDate = `${birthYear}-${birthMonth}-${birthDay}`;
            birthDateInput.value = fullDate;
        } else {
            birthDateInput.value = '';
        }
    }

    // Inisialisasi dropdown tanggal lahir
    initializeBirthDateDropdowns();

    const today = new Date().toISOString().split('T')[0];
    const consultDateInput = document.getElementById('consultDate');

    // Inisialisasi Flatpickr untuk tanggal konsultasi
    if (typeof flatpickr !== 'undefined') {
        flatpickr(consultDateInput, {
            dateFormat: "Y-m-d",
            enableTime: false,
            minDate: today,
            maxDate: "2100-01-01",
            locale: "id",
            disableMobile: true
        });
    } else {
        if (consultDateInput) {
            consultDateInput.setAttribute('type', 'date');
            consultDateInput.setAttribute('max', '2100-01-01');
            consultDateInput.setAttribute('min', today);
        }
    }

    function getTelegramHandle(doctorName) {
        // Ganti dengan username Telegram yang valid
        const myTelegramUsername = "johnismyuncle"; 
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
            currentFormData = collectFormData();
            displayAppointmentResult(currentFormData);
        }
    });

    function showStep(stepNumber) {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }

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

    function validateStep(stepNumber) {
        const currentStepElement = document.getElementById(`step${stepNumber}`);
        if (!currentStepElement) return false;
        
        const inputs = currentStepElement.querySelectorAll('input[required]:not([type="radio"]):not([type="hidden"]), select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
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
        
        // Validasi khusus untuk tanggal lahir
        const birthDay = document.getElementById('birthDay').value;
        const birthMonth = document.getElementById('birthMonth').value;
        const birthYear = document.getElementById('birthYear').value;
        const birthDateInput = document.getElementById('birthDate');
        
        if (document.getElementById('step1') && stepNumber === 1) { // Hanya validasi di Step 1
            if (!birthDay || !birthMonth || !birthYear) {
                isValid = false;
                const birthDateContainer = document.querySelector('.birth-date-container');
                highlightError(birthDateContainer, 'Tanggal lahir wajib diisi');
            } else {
                const birthDateContainer = document.querySelector('.birth-date-container');
                removeErrorHighlight(birthDateContainer);
                
                birthDateInput.value = `${birthYear}-${birthMonth}-${birthDay}`;
            }
        }
        
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

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidNIK(nik) {
        const nikRegex = /^\d{16}$/;
        return nikRegex.test(nik);
    }

    function highlightError(input, message = 'Field ini wajib diisi') {
        let parentNode = input.parentNode;
        
        const existingError = parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        if (input.tagName === 'LABEL') {
             input.style.color = '#dc3545';
        } else if (input.classList.contains('birth-date-container')) {
            // Untuk kontainer tanggal lahir, beri highlight pada select
            const selects = input.querySelectorAll('select');
            selects.forEach(select => {
                select.style.borderColor = '#dc3545';
            });
            // Gunakan parentNode dari kontainer untuk pesan error
            parentNode = input.closest('.form-group'); 
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

    function removeErrorHighlight(input) {
        let parentNode = input.parentNode;
        
        if (input.tagName === 'LABEL') {
             input.style.color = '';
        } else if (input.classList.contains('birth-date-container')) {
            const selects = input.querySelectorAll('select');
            selects.forEach(select => {
                select.style.borderColor = '';
            });
            parentNode = input.closest('.form-group');
        } else {
             input.style.borderColor = '';
        }
        
        const existingError = parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    function collectFormData() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            nik: document.getElementById('nik').value,
            birthDay: document.getElementById('birthDay').value,
            birthMonth: document.getElementById('birthMonth').value,
            birthYear: document.getElementById('birthYear').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            feeling: document.getElementById('feeling').value,
            frequency: document.getElementById('frequency').value,
            goal: document.getElementById('goal').value,
            previousConsultation: document.querySelector('input[name="previousConsultation"]:checked')?.value || '',
            doctor: document.getElementById('doctor').value,
            consultDate: document.getElementById('consultDate').value,
            consultTime: document.getElementById('consultTime').value,
            consultType: document.getElementById('consultType').value,
            appointmentNumber: generateAppointmentNumber(),
            appointmentDate: new Date().toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            }),
            appointmentTime: new Date().toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
            })
        };
        return formData;
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    function formatDateShort(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    function generateAppointmentNumber() {
        const timestamp = new Date().getTime().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `APT-${timestamp}${random}`;
    }

    // ==================== FUNGSI PDF (MENCIPTAKAN DOKUMEN BARU) ====================
    // CATATAN: Fungsi ini telah diubah untuk TIDAK menyertakan Catatan konsultasi.
    function generatePDF(formData) {
        const { jsPDF } = window.jspdf;
        
        // Setup Dokumen A4 Portrait
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        
        // === BINGKAI UTAMA ===
        doc.setDrawColor(0, 123, 255); // Biru Medicare
        doc.setLineWidth(1);
        doc.rect(margin, margin, contentWidth, 260); 

        // === HEADER ===
        doc.setFillColor(0, 123, 255);
        doc.rect(margin, margin, contentWidth, 35, 'F');
        
        // Judul
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('BUKTI PENDAFTARAN', margin + 10, margin + 15);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('KONSELING ONLINE MEDICARE', margin + 10, margin + 22);

        // Appointment Number di Kanan Atas
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255); // Putih
        doc.setFont('helvetica', 'normal');
        doc.text('No. Appointment:', pageWidth - margin - 10, margin + 12, { align: 'right' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.appointmentNumber, pageWidth - margin - 10, margin + 18, { align: 'right' });

        let yPosition = margin + 45;

        // === JUDUL KONTEN ===
        doc.setTextColor(0, 123, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KONSULTASI BERHASIL DIJADWALKAN', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;

        // === KOTAK 1: INFORMASI PASIEN ===
        doc.setFillColor(248, 249, 250); // Abu-abu sangat muda
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.rect(margin + 5, yPosition, contentWidth - 10, 55, 'FD');

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMASI PASIEN', margin + 10, yPosition + 8);
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.line(margin + 10, yPosition + 10, margin + 50, yPosition + 10);

        // Data Pasien Grid
        const startDataY = yPosition + 20;
        
        // Kolom Kiri
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text('Nama Lengkap', margin + 10, startDataY);
        doc.text('NIK', margin + 10, startDataY + 10);
        doc.text('Jenis Kelamin', margin + 10, startDataY + 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.fullName, margin + 10, startDataY + 5);
        doc.text(formData.nik, margin + 10, startDataY + 15);
        doc.text(formData.gender, margin + 10, startDataY + 25);

        // Kolom Kanan
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text('Email', margin + 90, startDataY);
        doc.text('No. Telepon', margin + 90, startDataY + 10);
        doc.text('Tanggal Lahir', margin + 90, startDataY + 20);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.email, margin + 90, startDataY + 5);
        doc.text(formData.phone, margin + 90, startDataY + 15);
        doc.text(formatDateShort(formData.birthDate), margin + 90, startDataY + 25);

        yPosition += 65;

        // === KOTAK 2: DETAIL JADWAL ===
        doc.setFillColor(235, 245, 255); // Biru sangat muda
        doc.setDrawColor(180, 210, 255);
        doc.rect(margin + 5, yPosition, contentWidth - 10, 50, 'FD');

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('DETAIL JADWAL KONSULTASI', margin + 10, yPosition + 8);
        doc.setDrawColor(0, 123, 255);
        doc.line(margin + 10, yPosition + 10, margin + 70, yPosition + 10);

        const scheduleY = yPosition + 20;

        // Baris 1: Dokter
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text('Psikolog / Psikiater:', margin + 10, scheduleY);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.doctor, margin + 50, scheduleY);

        // Baris 2: Waktu
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text('Waktu:', margin + 10, scheduleY + 10);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${formatDateShort(formData.consultDate)} | Pukul ${formData.consultTime}`, margin + 50, scheduleY + 10);

        // Baris 3: Metode
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text('Metode:', margin + 10, scheduleY + 20);
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.consultType, margin + 50, scheduleY + 20);

        yPosition += 60;

        // === KOTAK 3: TELEGRAM INFO (PENTING) ===
        const telegramHandle = getTelegramHandle(formData.doctor);
        
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.setLineDash([3, 3], 0); // Garis putus-putus
        doc.rect(margin + 5, yPosition, contentWidth - 10, 35);
        doc.setLineDash([]); // Reset ke garis solid

        doc.setFontSize(10);
        doc.setTextColor(0, 123, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('INSTRUKSI MENGHUBUNGI DOKTER', margin + 10, yPosition + 8);

        doc.setTextColor(50, 50, 50);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Silahkan hubungi dokter melalui Telegram pada waktu yang ditentukan:`, margin + 10, yPosition + 15);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Username: @${telegramHandle}`, margin + 10, yPosition + 22);
        
        doc.setFontSize(9);
        doc.setTextColor(0, 123, 255);
        doc.text(`Link: https://t.me/${telegramHandle}`, margin + 10, yPosition + 28);

        // === FOOTER & CATATAN ===
        const footerY = 260;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Dicetak secara otomatis oleh sistem MediCare', pageWidth - margin - 5, footerY, { align: 'right' });
        doc.text(`Tanggal Cetak: ${formData.appointmentDate}`, pageWidth - margin - 5, footerY + 4, { align: 'right' });

        return doc;
    }

    function downloadPDF(formData) {
        try {
            const doc = generatePDF(formData);
            const fileName = `Tiket_Konsultasi_${formData.appointmentNumber}.pdf`;
            doc.save(fileName);
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Terjadi kesalahan saat mengunduh PDF.');
            return false;
        }
    }

    function printAppointmentResult() {
        // CSS @media print di konsultasi.css akan menyembunyikan semua kecuali #appointmentResult
        window.print();
    }

    // =========================================================================

    function displayAppointmentResult(formData) {
        // Sembunyikan form dan progress
        const mainElement = document.querySelector('.online-counseling-page');
        if (mainElement) {
             mainElement.style.display = 'none';
        }
        
        // Tampilkan area tombol aksi (Fix: memastikan tombol terlihat)
        if (actionsArea) {
            actionsArea.style.display = 'flex';
        }
        
        // Update result elements
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
            telegramNote.innerHTML = `Untuk memulai konsultasi dengan ${doctorShortName}, silahkan klik link berikut: <a href="https://t.me/${telegramHandle}" id="resultTelegramLink" target="_blank" rel="noopener noreferrer">Hubungi via Telegram</a>.`;
        }

        // Tampilkan Kartu Hasil (Fix: memastikan kartu terlihat)
        appointmentResult.style.display = 'flex';
        
        updateStepProgressToCompleted();
        
        // PERBAIKAN: Gulirkan halaman ke atas untuk menampilkan hasil konsultasi dari awal
        window.scrollTo(0, 0); 
    }
    
    function updateStepProgressToCompleted() {
        progressSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
    }

    // Pindah event listeners tombol ke sini agar terpasang setelah DOMContentLoaded
    if (actionsArea) {
        const downloadBtn = document.querySelector('.btn-download');
        const downloadPDFHandler = function() {
            const originalText = this.textContent;
            this.textContent = 'Mengunduh...';
            this.disabled = true;
            setTimeout(() => {
                // Pastikan currentFormData sudah terisi sebelum download
                if (currentFormData) { 
                   downloadPDF(currentFormData);
                }
                this.textContent = originalText;
                this.disabled = false;
            }, 500);
        };
        downloadBtn.addEventListener('click', downloadPDFHandler);

        const printBtn = document.querySelector('.btn-print');
        printBtn.addEventListener('click', printAppointmentResult);
        
        const backBtn = document.querySelector('.btn-back');
        backBtn.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }
});