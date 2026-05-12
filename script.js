/**
 * script.js - Final Static Blog Engine
 * Data Source: Local 'articles' array from articles-data.js
 */

const El = {
    hamburger: document.getElementById('hamburger-btn'),
    navMenu: document.getElementById('nav-menu'),
    progressBar: document.getElementById('progress-bar'),
    backToTop: document.getElementById('back-to-top'),
    search: document.getElementById('main-search'),
    grid: document.querySelector('.articles-grid'),
    articleView: document.getElementById('article-view'),
    notFound: document.getElementById('not-found')
};

// Global reference for filtering
let currentFilteredArticles = [];

/**
 * Initialize Engine
 */
async function init() {
    console.log('[Blog] Initializing Engine (JSON Data Mode)...');
    
    try {
        const response = await fetch('articles.json');
        if (!response.ok) throw new Error('Failed to fetch articles.json');
        window.articles = await response.json();
    } catch (err) {
        console.error('Data file missing or invalid:', err);
        showError('تعذر تحميل بيانات المقالات. يرجى التأكد من وجود ملف articles.json');
        return;
    }

    setupUI();
    setupSearch(window.articles);
    
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    // Handle Article Detail Page
    if (page === 'article.html') {
        handleArticleDetail(window.articles);
        return;
    }

    // Skip dynamic grid rendering on categories overview page
    if (page === 'categories.html') return;

    // Handle Article List & Filtering
    if (El.grid) {
        handleArticleList(page, window.articles);
    }
}

/**
 * UI & Navigation
 */
function setupUI() {
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    if (El.hamburger && El.navMenu) {
        El.hamburger.onclick = (e) => {
            e.stopPropagation();
            const isActive = El.navMenu.classList.toggle('active');
            El.hamburger.classList.toggle('open');
            overlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = isActive ? 'hidden' : '';
        };
    }

    overlay.onclick = () => {
        El.navMenu?.classList.remove('active');
        El.hamburger?.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    document.addEventListener('click', (e) => {
        if (El.navMenu?.classList.contains('active')) {
            if (!El.navMenu.contains(e.target) && !El.hamburger.contains(e.target)) {
                El.navMenu.classList.remove('active');
                El.hamburger?.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    window.addEventListener('scroll', () => {
        if (El.progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            El.progressBar.style.width = scrolled + "%";
        }
        if (El.backToTop) {
            El.backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
        }
    });

    if (El.backToTop) {
        El.backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Search Logic
 */
function setupSearch(data) {
    if (!El.search || !El.grid) return;

    El.search.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        // Search through the articles currently allowed on this page
        const results = currentFilteredArticles.filter(art => 
            art.title.toLowerCase().includes(term) || 
            art.category.toLowerCase().includes(term)
        );

        renderArticles(results);
    });
}

/**
 * Page Handlers
 */
function handleArticleList(page, data) {
    const categoryMap = {
        'akhbar.html': 'أخبار',
        'wazaef.html': 'وظائف',
        'hijra.html': 'الهجرة',
        'riyada.html': 'رياضة',
        'tabkh.html': 'الطبخ',
        'siya9a.html': 'تعليم السياقة',
        'aflam.html': 'أفلام',
        'ribh.html': 'ربح المال',
        'hiraf.html': 'حرف ومشاريع',
        'wataik.html': 'وثائق إدارية',
        'islah.html': 'إصلاح'
    };

    const targetCategory = categoryMap[page];
    
    /**
     * REQUIREMENT: Page Logic
     * index.html (or targetCategory null) -> Render All
     * category.html -> Filter by Category
     */
    currentFilteredArticles = targetCategory 
        ? data.filter(a => a.category.trim() === targetCategory)
        : data;

    renderArticles(currentFilteredArticles);
}

function handleArticleDetail(data) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    
    if (!id) return showArticleNotFound();

    const article = data.find(a => a.id == id);
    if (article) {
        renderFullArticle(article);
    } else {
        showArticleNotFound();
    }
}

/**
 * Rendering Logic
 */
function renderArticles(list) {
    if (!El.grid) return;

    if (!list || list.length === 0) {
        El.grid.innerHTML = `
            <div class="empty-container">
                <i class="fas fa-search"></i>
                <p>لا توجد مقالات تطابق بحثك حالياً.</p>
            </div>
        `;
        return;
    }

    // Sort by date descending
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

    const html = sorted.map(art => `
        <article class="card">
            <div class="card-img-container">
                <!-- REQUIREMENT: Image Fallback (onerror) -->
                <img src="${art.image}" alt="${art.title}" class="card-img" loading="lazy" 
                     onerror="this.onerror=null;this.src='https://via.placeholder.com/800x450?text=No+Image'">
                <span class="card-badge">${art.category}</span>
            </div>
            <div class="card-body">
                <div class="card-date"><i class="far fa-calendar-alt"></i> ${formatDate(art.date)}</div>
                <h3>${art.title}</h3>
                <p>${stripHtml(art.content).substring(0, 100)}...</p>
                <a href="article.html?id=${art.id}" class="btn-read">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        </article>
    `).join('');

    El.grid.innerHTML = html;
}

function renderFullArticle(data) {
    document.title = `${data.title} | مدونة سهل المعرفة`;
    
    const fields = {
        'article-title': data.title,
        'article-category': data.category,
        'article-content': data.content
    };

    Object.entries(fields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'article-content') el.innerHTML = val;
            else el.textContent = val;
        }
    });

    const img = document.getElementById('article-image');
    if (img) {
        img.src = data.image;
        img.alt = data.title;
        // REQUIREMENT: Image Fallback (onerror)
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/1200x600?text=Image+Not+Found';
        };
    }

    const dateContainer = document.getElementById('article-date');
    const dateSpan = dateContainer?.querySelector('span');
    if (dateSpan) dateSpan.textContent = formatDate(data.date);
    
    if (El.articleView) El.articleView.style.display = 'block';
    if (El.notFound) El.notFound.style.display = 'none';
}

/**
 * Helpers
 */
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    } catch (e) { return dateStr; }
}

function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function showArticleNotFound() {
    if (El.articleView) El.articleView.style.display = 'none';
    if (El.notFound) El.notFound.style.display = 'block';
}

function showError(msg) {
    if (El.grid) {
        El.grid.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>خطأ في النظام</h3>
                <p>${msg}</p>
            </div>
        `;
    }
}

// Execution Start (Immediate/Synchronous)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}


