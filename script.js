/**
 * script.js - Professional Blog Engine
 * Optimized for GitHub Pages + Custom Domains
 */

const BlogState = {
    isInitialized: false,
    allArticles: [],
    isLoading: false,
    basePath: (() => {
        const hostname = window.location.hostname;
        if (hostname.includes('github.io')) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            return pathParts.length > 1 ? `/${pathParts[0]}/` : '/';
        }
        return '/';
    })()
};

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

/**
 * Initialize Engine
 */
async function init() {
    if (BlogState.isInitialized) return;
    BlogState.isInitialized = true;

    setupUI();
    setupSearch();
    
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    // Don't render dynamic cards on the categories overview page
    if (page === 'categories.html') return;

    if (page === 'article.html') {
        await handleArticleDetail();
    } else if (El.grid) {
        await handleArticleList(page);
    }
}

/**
 * UI & Navigation
 */
function setupUI() {
    if (El.hamburger && El.navMenu) {
        El.hamburger.onclick = (e) => {
            e.stopPropagation();
            El.navMenu.classList.toggle('active');
            El.hamburger.classList.toggle('open');
        };
    }

    document.addEventListener('click', (e) => {
        if (El.navMenu?.classList.contains('active')) {
            if (!El.navMenu.contains(e.target) && !El.hamburger.contains(e.target)) {
                El.navMenu.classList.remove('active');
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
function setupSearch() {
    if (!El.search || !El.grid) return;

    El.search.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!BlogState.allArticles.length) return;

        const filtered = BlogState.allArticles.filter(art => 
            art.title.toLowerCase().includes(term) || 
            art.content.toLowerCase().includes(term) ||
            art.category.toLowerCase().includes(term)
        );

        renderArticles(filtered);
    });
}

/**
 * Robust Fetch logic
 */
async function fetchArticles() {
    if (BlogState.allArticles.length > 0) return BlogState.allArticles;

    showLoading();

    const paths = [
        `${BlogState.basePath}articles.json`,
        'articles.json',
        '/articles.json'
    ];

    for (const path of [...new Set(paths)]) {
        try {
            console.log(`[Fetch] Trying: ${path}`);
            const resp = await fetch(path);
            if (!resp.ok) continue;
            
            const data = await resp.json();
            const articles = Array.isArray(data) ? data : (data.posts || []);
            
            if (articles.length > 0) {
                BlogState.allArticles = articles;
                return articles;
            }
        } catch (e) {
            console.warn(`[Fetch] Failed on ${path}:`, e);
        }
    }

    throw new Error('Could not load articles.json');
}

/**
 * Loading & Error States
 */
function showLoading() {
    if (!El.grid) return;
    El.grid.innerHTML = Array(6).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text medium"></div>
            <div class="skeleton-text long"></div>
            <div class="skeleton-text short"></div>
        </div>
    `).join('');
}

function showError(msg) {
    if (!El.grid) return;
    El.grid.innerHTML = `
        <div class="error-container">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>عذراً، حدث خطأ أثناء تحميل البيانات</h3>
            <p>${msg}</p>
            <button class="btn-retry" onclick="location.reload()">إعادة المحاولة</button>
        </div>
    `;
}

/**
 * Handlers
 */
async function handleArticleList(page) {
    try {
        const articles = await fetchArticles();
        
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
        const filtered = targetCategory 
            ? articles.filter(a => a.category === targetCategory)
            : articles;

        renderArticles(filtered);
    } catch (err) {
        showError(err.message);
    }
}

async function handleArticleDetail() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return showArticleNotFound();

    try {
        const articles = await fetchArticles();
        const article = articles.find(a => a.id == id);
        if (article) renderFullArticle(article);
        else showArticleNotFound();
    } catch (err) {
        showArticleNotFound();
    }
}

/**
 * Rendering
 */
function renderArticles(list) {
    if (!El.grid) return;

    if (!list || list.length === 0) {
        El.grid.innerHTML = `
            <div class="empty-container">
                <i class="fas fa-search"></i>
                <p>لا توجد مقالات في هذا القسم حالياً.</p>
            </div>
        `;
        return;
    }

    const html = list
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(art => `
            <article class="card">
                <div class="card-img-container">
                    <img src="${art.image}" alt="${art.title}" class="card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/800x450?text=No+Image'">
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
    
    // Fill basic fields
    const textFields = {
        'article-title': data.title,
        'article-category': data.category,
        'article-content': data.content
    };

    Object.entries(textFields).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === 'article-content') el.innerHTML = val;
        else el.textContent = val;
    });
    
    // Fill image
    const imgEl = document.getElementById('article-image');
    if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = data.title;
    }

    // Fill date span
    const dateSpan = document.getElementById('article-date')?.querySelector('span');
    if (dateSpan) dateSpan.textContent = formatDate(data.date);
    
    if (El.articleView) El.articleView.style.display = 'block';
    if (El.notFound) El.notFound.style.display = 'none';
}

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

// Start
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
