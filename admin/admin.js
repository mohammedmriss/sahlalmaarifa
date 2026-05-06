/**
 * admin.js - Admin Dashboard Logic
 */

const API_URL = 'http://localhost:3000/api';
let allArticles = [];

// --- Auth System ---
function checkLogin() {
    const pass = document.getElementById('admin-pass').value;
    if (pass === 'admin123') { // Simple hardcoded check
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-content').style.display = 'flex';
        sessionStorage.setItem('isAdmin', 'true');
        loadArticles();
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function logout() {
    sessionStorage.removeItem('isAdmin');
    location.reload();
}

// Check session on load
window.onload = () => {
    if (sessionStorage.getItem('isAdmin') === 'true') {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('admin-content').style.display = 'flex';
        loadArticles();
    }
};

// --- Navigation ---
function switchTab(tab) {
    document.getElementById('tab-dashboard').style.display = tab === 'dashboard' ? 'block' : 'none';
    document.getElementById('tab-add').style.display = tab === 'add' ? 'block' : 'none';
    
    // Reset form if switching to 'add'
    if (tab === 'add' && !document.getElementById('article-id').value) {
        document.getElementById('article-form').reset();
        document.getElementById('article-id').value = '';
        document.getElementById('form-title').innerText = 'إضافة مقال جديد';
    }

    // Update sidebar links
    const links = document.querySelectorAll('.sidebar-nav a');
    links[0].classList.toggle('active', tab === 'dashboard');
    links[1].classList.toggle('active', tab === 'add');
}

// --- API Calls & CRUD ---

async function loadArticles() {
    try {
        const res = await fetch(`${API_URL}/articles`);
        allArticles = await res.json();
        renderArticlesTable();
    } catch (err) {
        console.error('Failed to load articles:', err);
    }
}

function renderArticlesTable() {
    const list = document.getElementById('articles-list');
    list.innerHTML = allArticles.map(art => `
        <tr>
            <td>
                <div style="font-weight:700;">${art.title}</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">${art.description || ''}</div>
            </td>
            <td><span class="badge badge-cat">${art.category}</span></td>
            <td>${art.date || new Date(art.createdAt?._seconds * 1000).toLocaleDateString('ar-EG')}</td>
            <td><i class="far fa-eye"></i> ${art.views || 0}</td>
            <td>
                <div class="actions">
                    <button class="action-btn btn-edit" onclick="editArticle('${art.id}')"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="deleteArticle('${art.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Handle Form Submission
document.getElementById('article-form').onsubmit = async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('article-id').value;
    const articleData = {
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        content: document.getElementById('content').value,
        notes: document.getElementById('notes').value,
        date: new Date().toLocaleDateString('ar-EG'),
        description: document.getElementById('content').value.substring(0, 150) + '...'
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/articles/${id}` : `${API_URL}/articles`;
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        });

        if (res.ok) {
            alert(id ? 'تم تحديث المقال بنجاح!' : 'تم نشر المقال بنجاح!');
            switchTab('dashboard');
            loadArticles();
        }
    } catch (err) {
        alert('حدث خطأ أثناء حفظ المقال.');
    }
};

async function editArticle(id) {
    const art = allArticles.find(a => a.id === id);
    if (!art) return;

    document.getElementById('article-id').value = art.id;
    document.getElementById('title').value = art.title;
    document.getElementById('category').value = art.category;
    document.getElementById('image').value = art.image;
    document.getElementById('content').value = art.content;
    document.getElementById('notes').value = art.notes || '';
    
    document.getElementById('form-title').innerText = 'تعديل المقال';
    switchTab('add');
}

async function deleteArticle(id) {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المقال؟')) return;

    try {
        const res = await fetch(`${API_URL}/articles/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadArticles();
        }
    } catch (err) {
        alert('حدث خطأ أثناء الحذف.');
    }
}

// --- Gemini AI Integration ---

async function generateAI() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const notes = document.getElementById('notes').value;

    if (!title) {
        alert('يرجى إدخال عنوان أولاً لمساعدة الذكاء الاصطناعي.');
        return;
    }

    const btn = document.getElementById('btn-generate');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التوليد...';

    try {
        const res = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, notes })
        });

        const data = await res.json();
        
        if (data.error) throw new Error(data.error);

        // Populate form with AI results
        document.getElementById('title').value = data.title;
        document.getElementById('content').value = data.content;
        document.getElementById('category').value = data.category;
        document.getElementById('image').value = data.image;
        
        alert('تم توليد المقال بنجاح! يمكنك المراجعة الآن ثم الضغط على "حفظ ونشر".');
    } catch (err) {
        alert('حدث خطأ أثناء الاتصال بـ Gemini AI.');
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-magic"></i> توليد بالذكاء الاصطناعي';
    }
}
