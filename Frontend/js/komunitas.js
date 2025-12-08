// Data simulasi topik forum (Gunakan ini untuk data awal)
const mockTopics = [
    { 
        id: 1, 
        title: "Cara Mengatasi Serangan Panik Tiba-Tiba", 
        author: "Anonim123", 
        category: "Kecemasan", 
        replies: 15, 
        views: 230, 
        date: "2 jam lalu" 
    },
    { 
        id: 2, 
        title: "Perbedaan Terapi Kognitif dan Terapi Perilaku", 
        author: "PenulisArtikel", 
        category: "Edukasi", 
        replies: 5, 
        views: 110, 
        date: "5 jam lalu" 
    },
    { 
        id: 3, 
        title: "Merasa Sangat Lelah Setelah Episode Depresi, Adakah yang Merasakan?", 
        author: "User_CepatSembuh", 
        category: "Depresi", 
        replies: 28, 
        views: 450, 
        date: "1 hari lalu" 
    },
    { 
        id: 4, 
        title: "Tips Komunikasi Efektif dengan Pasangan", 
        author: "Konselor_Pro", 
        category: "Hubungan", 
        replies: 7, 
        views: 150, 
        date: "2 hari lalu" 
    },
];

const forumTopicsElement = document.getElementById('forum-topics');
const newTopicForm = document.getElementById('new-topic-form');

// Fungsi untuk membuat elemen HTML topik card
function createTopicCard(topic) {
    const topicCard = document.createElement('div');
    topicCard.className = 'topic-card';
    topicCard.setAttribute('data-topic-id', topic.id); 
    
    const initial = topic.author.charAt(0).toUpperCase();

    topicCard.innerHTML = `
        <div class="topic-icon">${initial}</div>
        <div class="topic-info">
            <span class="topic-category-tag">${topic.category}</span>
            <h4>${topic.title}</h4>
            <div class="topic-meta">
                <span>Dibuat oleh <span class="topic-author">${topic.author}</span></span>
                <span>${topic.date}</span>
            </div>
        </div>
        <div class="topic-stats">
            <span class="topic-replies"><strong>${topic.replies}</strong></span>
            <span class="topic-views"><strong>${topic.views}</strong></span>
        </div>
    `;

    topicCard.addEventListener('click', () => {
        alert(`Anda mengklik topik: "${topic.title}". Di halaman nyata, ini akan membuka halaman detail topik.`);
    });
    
    return topicCard;
}

// Fungsi untuk merender daftar topik
function renderTopics(topics) {
    forumTopicsElement.innerHTML = ''; 
    topics.forEach(topic => {
        forumTopicsElement.appendChild(createTopicCard(topic));
    });

    if (topics.length === 0) {
        forumTopicsElement.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--secondary-text-color);">Tidak ada topik yang ditemukan untuk saat ini.</p>';
    }
}

// FUNGSI PERBAIKAN: Menampilkan form topik baru tanpa auto-scroll
function showNewTopicForm() {
    newTopicForm.style.display = 'block';
    // Perintah scrollIntoView() telah dihapus untuk mencegah scroll otomatis yang mengganggu.
}

// Fungsi untuk menyembunyikan form topik baru
function hideNewTopicForm() {
    newTopicForm.style.display = 'none';
    document.getElementById('topic-title').value = '';
    document.getElementById('topic-content').value = '';
    document.getElementById('topic-category').value = '';
}

// Fungsi untuk mensubmit topik baru (simulasi)
function submitNewTopic() {
    const title = document.getElementById('topic-title').value.trim();
    const content = document.getElementById('topic-content').value.trim();
    const category = document.getElementById('topic-category').value;

    if (!title || !content || !category) {
        alert('Mohon lengkapi semua bidang: Judul, Isi, dan Kategori.');
        return;
    }

    const newTopic = {
        id: mockTopics.length + 1,
        title: title,
        author: "Pengguna Baru", 
        category: category,
        replies: 0,
        views: 1,
        date: "Baru saja",
    };

    mockTopics.unshift(newTopic); 
    renderTopics(mockTopics); 

    alert(`Topik "${title}" berhasil diposting!`);
    hideNewTopicForm(); 
}

// FUNGSI PERBAIKAN: Untuk mereset filter dan menampilkan semua topik
function showAllTopics(e) {
    e.preventDefault();
    
    // 1. Reset judul kembali ke default
    document.querySelector('.topics-title').textContent = `Topik Terbaru`;
    
    // 2. Reset semua gaya bold pada daftar kategori
    document.querySelectorAll('.category-list a').forEach(l => l.style.fontWeight = 'normal');
    
    // 3. Reset input pencarian
    document.getElementById('forum-search').value = '';

    // 4. Render semua topik
    renderTopics(mockTopics);
}

// Event Listener untuk fitur Pencarian (Simulasi Filter)
document.getElementById('forum-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredTopics = mockTopics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm) ||
        topic.category.toLowerCase().includes(searchTerm) ||
        topic.author.toLowerCase().includes(searchTerm)
    );
    // Pastikan tidak ada kategori yang ter-bold saat mencari
    document.querySelectorAll('.category-list a').forEach(l => l.style.fontWeight = 'normal');
    
    document.querySelector('.topics-title').textContent = `Hasil Pencarian untuk: "${e.target.value}"`;
    renderTopics(filteredTopics);
});

// Event Listener untuk filter Kategori (Simulasi Filter)
document.querySelectorAll('.category-list a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.currentTarget.getAttribute('data-category');
        
        // Reset semua dan atur bold pada kategori yang dipilih
        document.querySelectorAll('.category-list a').forEach(l => l.style.fontWeight = 'normal');
        e.currentTarget.style.fontWeight = 'bold';
        
        // Kosongkan input pencarian saat memfilter kategori
        document.getElementById('forum-search').value = '';

        if (category) {
            const filteredTopics = mockTopics.filter(topic => topic.category.toLowerCase() === category.toLowerCase());
            document.querySelector('.topics-title').textContent = `Topik Kategori: ${category}`;
            renderTopics(filteredTopics);
        } else {
            showAllTopics(e);
        }
    });
});

// Inisialisasi: Panggil fungsi renderTopics saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    renderTopics(mockTopics);
});