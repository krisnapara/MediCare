document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('counselingForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const appointmentResult = document.getElementById('appointmentResult');
    const actionsArea = document.querySelector('.appointment-actions');
    
    let currentStep = 1;
    let currentFormData = null;

    // ==================== FUNGSI UTAMA ====================

    // --- FUNGSI UNTUK DROPDOWN TANGGAL LAHIR ---
    function initializeBirthDateDropdowns() {
        const birthYearSelect = document.getElementById('birthYear');
        const birthMonthSelect = document.getElementById('birthMonth');
        const birthDaySelect = document.getElementById('birthDay');
        const birthDateInput = document.getElementById('birthDate');
        
        const currentYear = new Date().getFullYear();
        const startYear = 1900;
        
        // DROPDOWN TANGGAL (dd)
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
        
        // DROPDOWN BULAN (mm)
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
        
        // DROPDOWN TAHUN (yyyy)
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

    // --- FUNGSI UNTUK AUTHENTIKASI ---
    function getAuthToken() {
        return localStorage.getItem('token');
    }

    function checkLoginStatus() {
        const token = getAuthToken();
        if (!token) {
            alert('Anda harus login terlebih dahulu. Akan dialihkan ke halaman login.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
            return false;
        }
        return true;
    }

    // --- FUNGSI UNTUK LOAD DATA DOKTER DARI API ---
    async function loadDoctors(date) {
        try {
            const response = await fetch(`http://localhost:5055/api/doctors?date=${date}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading doctors:', error);
            // Fallback ke data dokter statis jika API error
            return getStaticDoctors();
        }
    }

    function getStaticDoctors() {
        return [
            {
                doctor_id: 2,
                name: "Dr. Sarah Wijaya, M.Psi",
                profession: "Psikolog Klinik",
                quota: 19,
                remaining_quota: 10
            },
            {
                doctor_id: 3,
                name: "Dr. Ahmad Rahman, Sp.KJ",
                profession: "Psikiater",
                quota: 19,
                remaining_quota: 8
            },
            {
                doctor_id: 4,
                name: "Dr. Ade Muliadi, Sp.KJ",
                profession: "Psikolog Konseling",
                quota: 20,
                remaining_quota: 15
            },
            {
                doctor_id: 5,
                name: "Dr. Gede Danendra Suputra, Sp.KJ",
                profession: "Psikolog Anak & Remaja",
                quota: 20,
                remaining_quota: 12
            }
        ];
    }

    async function populateDoctorDropdown() {
        const today = new Date().toISOString().split('T')[0];
        const consultDate = document.getElementById('consultDate').value || today;
        const doctors = await loadDoctors(consultDate);
        const doctorSelect = document.getElementById('doctor');
        
        // Simpan nilai yang dipilih sebelumnya
        const previouslySelected = doctorSelect.value;
        
        // Clear existing options except the first one
        doctorSelect.innerHTML = '<option value="">Pilih Psikolog dan Psikiater</option>';
        
        if (doctors.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Tidak ada dokter tersedia untuk tanggal ini";
            option.disabled = true;
            doctorSelect.appendChild(option);
            return;
        }
        
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.doctor_id;
            option.textContent = `${doctor.name} - ${doctor.profession} (Tersedia: ${doctor.remaining_quota}/${doctor.quota})`;
            option.dataset.name = doctor.name;
            doctorSelect.appendChild(option);
        });
        
        // Kembalikan pilihan sebelumnya jika masih ada
        if (previouslySelected && Array.from(doctorSelect.options).some(opt => opt.value === previouslySelected)) {
            doctorSelect.value = previouslySelected;
        }
    }

    function getAvailableTimes() {
        return [
            "08:00 - 09:00",
            "09:30 - 10:30", 
            "11:00 - 12:00",
            "13:00 - 14:00",
            "14:30 - 15:30",
            "16:00 - 17:00"
        ];
    }

    // --- FUNGSI UNTUK CREATE RESERVASI KE API ---
    async function createReservation(reservationData) {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Token tidak ditemukan. Silakan login ulang.');
            }

            // Parse waktu dari format "08:00 - 09:00" menjadi "08:00:00"
            const timePart = reservationData.consultTime.split(' - ')[0];
            const formattedTime = timePart + ':00';

            const apiData = {
                doctor_id: parseInt(reservationData.doctor_id),
                nama_lengkap: reservationData.fullName,
                NIK_ktp: reservationData.nik,
                tanggal_lahir: reservationData.birthDate,
                jenis_kelamin: reservationData.gender,
                reservation_date: reservationData.consultDate,
                reservation_time: formattedTime
            };

            console.log('Sending reservation data:', apiData);

            const response = await fetch('http://localhost:5055/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });

            const result = await response.json();
            console.log('Reservation response:', result);
            
            if (!response.ok) {
                throw new Error(result.message || 'Gagal membuat reservasi');
            }

            return {
                success: true,
                reservation_id: result.reservation_id,
                message: result.message
            };
        } catch (error) {
            console.error('Error creating reservation:', error);
            return {
                success: false,
                message: error.message || 'Terjadi kesalahan saat membuat reservasi'
            };
        }
    }

    // --- FUNGSI UNTUK SAVE ANSWERS KE API ---
    async function saveAnswers(reservationId, answers) {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Token tidak ditemukan');
            }

            const response = await fetch('http://localhost:5055/api/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reservation_id: reservationId,
                    answers: answers
                })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Gagal menyimpan jawaban');
            }

            return result;
        } catch (error) {
            console.error('Error saving answers:', error);
            return null;
        }
    }

    // ==================== FUNGSI VALIDASI ====================

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
                
                // Validasi khusus untuk waktu konsultasi
                if (input.id === 'consultTime' && stepNumber === 3) {
                    const consultDate = document.getElementById('consultDate').value;
                    if (consultDate) {
                        const selectedDate = new Date(consultDate);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        
                        if (selectedDate < today) {
                            isValid = false;
                            highlightError(document.getElementById('consultDate'), 'Tanggal tidak boleh kurang dari hari ini');
                        }
                    }
                }
            }
        });
        
        // Validasi khusus untuk tanggal lahir
        const birthDay = document.getElementById('birthDay').value;
        const birthMonth = document.getElementById('birthMonth').value;
        const birthYear = document.getElementById('birthYear').value;
        const birthDateInput = document.getElementById('birthDate');
        
        if (document.getElementById('step1') && stepNumber === 1) {
            if (!birthDay || !birthMonth || !birthYear) {
                isValid = false;
                const birthDateContainer = document.querySelector('.birth-date-container');
                highlightError(birthDateContainer, 'Tanggal lahir wajib diisi');
            } else {
                const birthDateContainer = document.querySelector('.birth-date-container');
                removeErrorHighlight(birthDateContainer);
                
                // Validasi tanggal lahir tidak boleh di masa depan
                const birthDate = new Date(`${birthYear}-${birthMonth}-${birthDay}`);
                const today = new Date();
                if (birthDate > today) {
                    isValid = false;
                    highlightError(birthDateContainer, 'Tanggal lahir tidak boleh di masa depan');
                }
                
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
            const selects = input.querySelectorAll('select');
            selects.forEach(select => {
                select.style.borderColor = '#dc3545';
            });
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

    // ==================== FUNGSI DATA ====================

    function collectFormData() {
        const doctorSelect = document.getElementById('doctor');
        const selectedOption = doctorSelect.options[doctorSelect.selectedIndex];
        const doctorName = selectedOption.dataset.name || selectedOption.text.split(' - ')[0];
        
        const formData = {
            // Data untuk reservasi
            fullName: document.getElementById('fullName').value,
            nik: document.getElementById('nik').value,
            birthDate: document.getElementById('birthDate').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            doctor_id: document.getElementById('doctor').value,
            doctor_name: doctorName,
            consultDate: document.getElementById('consultDate').value,
            consultTime: document.getElementById('consultTime').value,
            consultType: document.getElementById('consultType').value,
            
            // Data untuk jawaban kuesioner
            feeling: document.getElementById('feeling').value,
            frequency: document.getElementById('frequency').value,
            goal: document.getElementById('goal').value,
            previousConsultation: document.querySelector('input[name="previousConsultation"]:checked')?.value || '',
            
            // Metadata
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

    // ==================== FUNGSI PDF ====================

    function getTelegramHandle(doctorName) {
        const myTelegramUsername = "johnismyuncle"; 
        const doctorHandles = {
            "dr. Sarah Wijaya, M.Psi": myTelegramUsername,
            "dr. Ahmad Rahman, Sp.KJ": myTelegramUsername,
            "dr. Ade Muliadi, Sp.KJ": myTelegramUsername,
            "dr. Gede Danendra Suputra, Sp.KJ": myTelegramUsername
        };
        return doctorHandles[doctorName] || myTelegramUsername;
    }

    function generatePDF(formData) {
        const { jsPDF } = window.jspdf;
        
        // Setup Dokumen A4 Portrait
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;
        const contentWidth = pageWidth - (2 * margin);
        
        // BINGKAI UTAMA
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(1);
        doc.rect(margin, margin, contentWidth, 260);

        // HEADER
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

        // Appointment Number
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');
        doc.text('No. Appointment:', pageWidth - margin - 10, margin + 12, { align: 'right' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(formData.appointmentNumber, pageWidth - margin - 10, margin + 18, { align: 'right' });

        let yPosition = margin + 45;

        // JUDUL KONTEN
        doc.setTextColor(0, 123, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('KONSULTASI BERHASIL DIJADWALKAN', pageWidth / 2, yPosition, { align: 'center' });
        
        yPosition += 10;

        // KOTAK 1: INFORMASI PASIEN
        doc.setFillColor(248, 249, 250);
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

        // KOTAK 2: DETAIL JADWAL
        doc.setFillColor(235, 245, 255);
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
        doc.text(formData.doctor_name, margin + 50, scheduleY);

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

        // KOTAK 3: TELEGRAM INFO
        const telegramHandle = getTelegramHandle(formData.doctor_name);
        
        doc.setDrawColor(0, 123, 255);
        doc.setLineWidth(0.5);
        doc.setLineDash([3, 3], 0);
        doc.rect(margin + 5, yPosition, contentWidth - 10, 35);
        doc.setLineDash([]);

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

        // FOOTER
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
        window.print();
    }

    // ==================== FUNGSI TAMPILAN HASIL ====================

    async function displayAppointmentResult(formData) {
        // 1. Cek login status
        if (!checkLoginStatus()) {
            return;
        }
        
        // 2. Tampilkan loading
        const submitBtn = document.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Menyimpan...';
        submitBtn.disabled = true;
        
        try {
            // 3. Simpan reservasi ke database
            const reservationResult = await createReservation(formData);
            
            if (!reservationResult.success) {
                throw new Error(reservationResult.message);
            }
            
            // 4. Siapkan data jawaban
            const answers = [
                {
                    question_id: 1,
                    answer_text: formData.feeling
                },
                {
                    question_id: 2,
                    answer_text: formData.frequency
                },
                {
                    question_id: 3,
                    answer_text: formData.goal
                },
                {
                    question_id: 4,
                    answer_text: formData.previousConsultation
                }
            ];
            
            // 5. Simpan jawaban ke database
            await saveAnswers(reservationResult.reservation_id, answers);
            
            // 6. Simpan reservation_id ke formData
            formData.reservation_id = reservationResult.reservation_id;
            formData.appointmentNumber = `RSV-${reservationResult.reservation_id.toString().padStart(6, '0')}`;
            
            // 7. Sembunyikan form
            const mainElement = document.querySelector('.online-counseling-page');
            if (mainElement) {
                mainElement.style.display = 'none';
            }
            
            // 8. Tampilkan area tombol aksi
            if (actionsArea) {
                actionsArea.style.display = 'flex';
            }
            
            // 9. Update result elements
            document.getElementById('resultName').textContent = formData.fullName;
            document.getElementById('resultEmail').textContent = formData.email;
            document.getElementById('resultPhone').textContent = formData.phone;
            document.getElementById('resultBirthDate').textContent = formatDate(formData.birthDate);
            document.getElementById('resultDoctor').textContent = formData.doctor_name;
            document.getElementById('resultDate').textContent = formatDate(formData.consultDate);
            document.getElementById('resultTime').textContent = formData.consultTime;
            document.getElementById('resultType').textContent = formData.consultType;
            
            // 10. Tambahkan reservation ID ke tampilan
            const resultContainer = document.querySelector('.appointment-details');
            const reservationIdElement = document.createElement('div');
            reservationIdElement.className = 'detail-item';
            reservationIdElement.innerHTML = `
                <span class="detail-label">ID Reservasi</span>
                <span class="detail-value" style="color: #007bff; font-weight: bold;">#${formData.reservation_id}</span>
            `;
            resultContainer.querySelector('.detail-grid').appendChild(reservationIdElement);
            
            // 11. Update telegram link
            const telegramHandle = getTelegramHandle(formData.doctor_name);
            const doctorShortName = formData.doctor_name.split(',')[0].trim();
            const telegramNote = document.getElementById('telegramNote');
            
            if (telegramNote) {
                telegramNote.innerHTML = `Untuk memulai konsultasi dengan ${doctorShortName}, silahkan klik link berikut: <a href="https://t.me/${telegramHandle}" id="resultTelegramLink" target="_blank" rel="noopener noreferrer">Hubungi via Telegram</a>.`;
            }
            
            // 12. Tampilkan hasil
            appointmentResult.style.display = 'flex';
            updateStepProgressToCompleted();
            
            // 13. Scroll ke atas
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            alert(`Gagal menyimpan reservasi: ${error.message}`);
            console.error('Reservation error:', error);
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }
    
    function updateStepProgressToCompleted() {
        progressSteps.forEach(step => {
            step.classList.remove('active');
            step.classList.add('completed');
        });
    }

    // ==================== EVENT LISTENERS ====================

    // Initialize the form
    showStep(currentStep);
    updateProgress();
    
    // Inisialisasi dropdown tanggal lahir
    initializeBirthDateDropdowns();
    
    // Inisialisasi date picker untuk tanggal konsultasi
    const today = new Date().toISOString().split('T')[0];
    const consultDateInput = document.getElementById('consultDate');
    if (consultDateInput) {
        consultDateInput.setAttribute('min', today);
        
        if (typeof flatpickr !== 'undefined') {
            flatpickr(consultDateInput, {
                dateFormat: "Y-m-d",
                enableTime: false,
                minDate: today,
                maxDate: "2100-01-01",
                locale: "id",
                disableMobile: true,
                onChange: async function(selectedDates, dateStr) {
                    if (dateStr) {
                        await populateDoctorDropdown();
                    }
                }
            });
        } else {
            consultDateInput.setAttribute('type', 'date');
            consultDateInput.setAttribute('max', '2100-01-01');
            consultDateInput.addEventListener('change', async function() {
                if (this.value) {
                    await populateDoctorDropdown();
                }
            });
        }
    }
    
    // Load doctors saat halaman dimuat
    populateDoctorDropdown();

    // Next button functionality
    nextButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            if (validateStep(currentStep)) {
                currentStep = nextStep;
                updateProgress();
                showStep(currentStep);
                
                // Jika pindah ke step 3, cek login status
                if (nextStep === 3 && !checkLoginStatus()) {
                    currentStep = 2; // Kembalikan ke step 2
                    updateProgress();
                    showStep(currentStep);
                }
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
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            currentFormData = collectFormData();
            await displayAppointmentResult(currentFormData);
        }
    });

    // Event listeners untuk tombol aksi
    if (actionsArea) {
        const downloadBtn = document.querySelector('.btn-download');
        const downloadPDFHandler = function() {
            const originalText = this.textContent;
            this.textContent = 'Mengunduh...';
            this.disabled = true;
            setTimeout(() => {
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

    // Cek login status saat halaman dimuat
    window.addEventListener('load', function() {
        // Cek token di localStorage
        const token = getAuthToken();
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                console.log('User logged in:', user.name);
                
                // Isi email otomatis jika ada di form
                const emailInput = document.getElementById('email');
                if (emailInput && !emailInput.value) {
                    emailInput.value = user.email;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    });
});