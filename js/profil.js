// profil.js - Script untuk fungsi ubah profil

// Data profil (nanti bisa diganti dengan data dari database/localStorage)
let userData = {
    name: "Ida Bagus Mas Muliadi",
    email: "muliapanjang@gmail.com",
    phone: "0812-4343-0987",
    address: "Jl. Kesakitan No. 12, Denpasar",
    joinDate: "15-01-2024",
    photo: "assets/images/profil.jpg"
};

// Variabel global untuk zoom
let currentZoom = 1;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

// Fungsi untuk menampilkan modal edit profil
function showModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    
    // Isi form dengan data saat ini
    document.getElementById('editName').value = userData.name;
    document.getElementById('editEmail').value = userData.email;
    document.getElementById('editPhone').value = userData.phone;
    document.getElementById('editAddress').value = userData.address;
}

// Fungsi untuk menutup modal edit profil
function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
}

// Fungsi untuk menampilkan modal zoom foto
function showImageModal(imageSrc) {
    const imageModal = document.getElementById('imageModal');
    const zoomedImage = document.getElementById('zoomedImage');
    const imageContainer = document.querySelector('.image-container');
    
    zoomedImage.src = imageSrc;
    imageModal.style.display = 'flex';
    
    // Reset zoom dan posisi
    currentZoom = 1;
    zoomedImage.style.transform = `scale(${currentZoom})`;
    zoomedImage.classList.remove('zoomed');
    
    // Reset container scroll
    if (imageContainer) {
        imageContainer.scrollLeft = (imageContainer.scrollWidth - imageContainer.clientWidth) / 2;
        imageContainer.scrollTop = (imageContainer.scrollHeight - imageContainer.clientHeight) / 2;
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Fungsi untuk menutup modal zoom foto
function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    imageModal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// Fungsi zoom in
function zoomIn() {
    currentZoom = Math.min(currentZoom + 0.2, 3);
    updateZoom();
}

// Fungsi zoom out
function zoomOut() {
    currentZoom = Math.max(currentZoom - 0.2, 0.5);
    updateZoom();
}

// Fungsi reset zoom
function resetZoom() {
    currentZoom = 1;
    updateZoom();
    
    // Reset container scroll ke tengah
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.scrollLeft = (imageContainer.scrollWidth - imageContainer.clientWidth) / 2;
        imageContainer.scrollTop = (imageContainer.scrollHeight - imageContainer.clientHeight) / 2;
    }
}

// Update zoom transform
function updateZoom() {
    const zoomedImage = document.getElementById('zoomedImage');
    if (zoomedImage) {
        zoomedImage.style.transform = `scale(${currentZoom})`;
        
        if (currentZoom > 1) {
            zoomedImage.classList.add('zoomed');
        } else {
            zoomedImage.classList.remove('zoomed');
        }
    }
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
}

// Fungsi untuk menyimpan perubahan profil
function saveProfile() {
    const name = document.getElementById('editName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const photoInput = document.getElementById('editPhoto');
    
    // Validasi input
    if (!name || !email || !phone || !address) {
        showNotification('Semua field harus diisi!', 'error');
        return;
    }
    
    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Format email tidak valid!', 'error');
        return;
    }
    
    // Validasi nomor telepon (format Indonesia)
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(phone.replace(/-/g, ''))) {
        showNotification('Format nomor telepon tidak valid!', 'error');
        return;
    }
    
    // Update data
    userData.name = name;
    userData.email = email;
    userData.phone = phone;
    userData.address = address;
    
    // Handle foto profil jika ada
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.photo = e.target.result;
            updateProfileDisplay();
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        updateProfileDisplay();
    }
    
    closeModal();
    showNotification('Profil berhasil diperbarui!', 'success');
}

// Fungsi untuk update tampilan profil
function updateProfileDisplay() {
    // Update nama
    const nameElement = document.querySelector('.profile-header-info h2');
    if (nameElement) {
        nameElement.textContent = userData.name;
    }
    
    // Update detail
    const emailElement = document.querySelector('[data-field="email"]');
    const phoneElement = document.querySelector('[data-field="phone"]');
    const addressElement = document.querySelector('[data-field="address"]');
    
    if (emailElement) emailElement.textContent = userData.email;
    if (phoneElement) phoneElement.textContent = userData.phone;
    if (addressElement) addressElement.textContent = userData.address;
    
    // Update foto profil
    const profileImages = document.querySelectorAll('.profile-large-img, .active-profile-img');
    profileImages.forEach(img => {
        img.src = userData.photo;
    });
}

// Fungsi logout - arahkan ke halaman register
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        showNotification('Berhasil logout! Mengarahkan ke halaman register...', 'success');
        
        // Hapus data session/localStorage jika ada
        localStorage.removeItem('userData');
        sessionStorage.clear();
        
        setTimeout(() => {
            // Redirect ke halaman register
            window.location.href = 'register.html';
        }, 1500);
    }
}

// Event listeners untuk drag
function initImageDrag() {
    const imageContainer = document.querySelector('.image-container');
    const zoomedImage = document.getElementById('zoomedImage');
    
    if (!imageContainer || !zoomedImage) return;
    
    imageContainer.addEventListener('mousedown', startDrag);
    imageContainer.addEventListener('touchstart', startDragTouch);
    
    function startDrag(e) {
        if (currentZoom <= 1) return;
        
        isDragging = true;
        startX = e.pageX - imageContainer.offsetLeft;
        startY = e.pageY - imageContainer.offsetTop;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }
    
    function startDragTouch(e) {
        if (currentZoom <= 1) return;
        
        isDragging = true;
        startX = e.touches[0].pageX - imageContainer.offsetLeft;
        startY = e.touches[0].pageY - imageContainer.offsetTop;
        scrollLeft = imageContainer.scrollLeft;
        scrollTop = imageContainer.scrollTop;
        
        document.addEventListener('touchmove', dragTouch);
        document.addEventListener('touchend', stopDrag);
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - imageContainer.offsetLeft;
        const y = e.pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    }
    
    function dragTouch(e) {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - imageContainer.offsetLeft;
        const y = e.touches[0].pageY - imageContainer.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageContainer.scrollLeft = scrollLeft - walkX;
        imageContainer.scrollTop = scrollTop - walkY;
    }
    
    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', dragTouch);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Tombol Ubah Profil
    const btnEdit = document.querySelector('.btn-edit');
    if (btnEdit) {
        btnEdit.addEventListener('click', showModal);
    }
    
    // Tombol Close Modal Edit
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Tombol Cancel
    const btnCancel = document.querySelector('.btn-cancel');
    if (btnCancel) {
        btnCancel.addEventListener('click', closeModal);
    }
    
    // Tombol Save
    const btnSave = document.querySelector('.btn-save');
    if (btnSave) {
        btnSave.addEventListener('click', saveProfile);
    }
    
    // Tombol Logout
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }
    
    // Foto profil - klik untuk zoom
    const profileLargeImg = document.querySelector('.profile-large-img');
    if (profileLargeImg) {
        profileLargeImg.style.cursor = 'pointer';
        profileLargeImg.addEventListener('click', function() {
            showImageModal(this.src);
        });
    }
    
    // Close button pada modal zoom
    const closeImageBtn = document.querySelector('.close-image');
    if (closeImageBtn) {
        closeImageBtn.addEventListener('click', closeImageModal);
    }
    
    // Close modal edit saat klik di luar modal content
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Close modal zoom saat klik di luar gambar
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', function(e) {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Close modal dengan tombol Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeImageModal();
        }
    });
    
    // Preview foto sebelum upload
    const photoInput = document.getElementById('editPhoto');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validasi tipe file
                if (!file.type.startsWith('image/')) {
                    showNotification('File harus berupa gambar!', 'error');
                    photoInput.value = '';
                    return;
                }
                
                // Validasi ukuran file (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                    showNotification('Ukuran file maksimal 2MB!', 'error');
                    photoInput.value = '';
                    return;
                }
            }
        });
    }
    
    // Init image drag functionality
    initImageDrag();
    
    // Zoom dengan scroll mouse
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.addEventListener('wheel', function(e) {
            if (e.ctrlKey) { // Zoom hanya saat Ctrl ditekan
                e.preventDefault();
                if (e.deltaY < 0) {
                    zoomIn();
                } else {
                    zoomOut();
                }
            }
        });
    }
});