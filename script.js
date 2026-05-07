/**
 * script.js - Centralized Blog Engine
 * Optimized for GitHub Pages & Custom Domains
 */

const BlogState = {
    isInitialized: false,
    allArticles: [],
    // Simple path detection: if hosted on github.io/repo/, we need the repo name.
    // If on custom domain, it's just /
    basePath: window.location.hostname.includes('github.io') 
        ? window.location.pathname.split('/')[1] 
        : ''
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

async function init() {
    if (BlogState.isInitialized) return;
    BlogState.isInitialized = true;

    setupUI();
    setupSearch();
    
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    if (page === 'categories.html') return;

    try {
        if (page === 'article.html') {
            await handleArticleDetail();
        } else if (El.grid) {
            // Optional: show loading state
            // El.grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">جاري التحميل...</div>';
            await handleArticleList(page);
        }
    } catch (err) {
        console.error("❌ Initialization Failed:", err);
        // Only show error if grid is empty (no static content)
        if (El.grid && El.grid.children.length === 0) {
            showGenericError(err.message);
        }
    }
}

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
                closeMenu();
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

function closeMenu() {
    El.navMenu?.classList.remove('active');
    El.hamburger?.classList.remove('open');
}

async function fetchArticles() {
    if (BlogState.allArticles.length > 0) return BlogState.allArticles;
    
    // Try multiple paths for articles.json to ensure it works on all environments
    const paths = ['articles.json', '/articles.json', './articles.json'];
    if (BlogState.basePath) paths.unshift(`/${BlogState.basePath}/articles.json`);

    for (const path of paths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const data = await response.json();
                BlogState.allArticles = data.posts || data;
                return BlogState.allArticles;
            }
        } catch (e) {
            continue;
        }
    }
    throw new Error("تعذر تحميل البيانات. يرجى التأكد من وجود ملف articles.json");
}

async function handleArticleList(page) {
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

    let filtered = articles;
    const targetCategory = categoryMap[page];

    if (targetCategory) {
        filtered = articles.filter(a => 
            a.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
        );
    }

    renderArticles(filtered);
}

async function handleArticleDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    if (isNaN(id)) return showArticleError();

    const articles = await fetchArticles();
    const article = articles.find(a => a.id === id);

    if (article) {
        renderFullArticle(article);
    } else {
        showArticleError();
    }
}

function renderArticles(list) {
    if (!El.grid) return;

    if (!list || list.length === 0) {
        El.grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 20px; display: block;"></i>
                <p style="font-size: 1.2rem; color: #64748b;">عذراً، لا توجد مقالات في هذا القسم حالياً.</p>
            </div>
        `;
        return;
    }

    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

    El.grid.innerHTML = sorted.map(art => `
        <article class="card">
            <div class="card-img-container">
                <img src="${art.image}" alt="${art.title}" class="card-img" loading="lazy">
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
}

function renderFullArticle(data) {
    document.title = `${data.title} | مدونة سهل المعرفة`;
    
    const fields = {
        'article-title': data.title,
        'article-category': data.category,
        'article-content': data.content
    };

    for (const [id, val] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) {
            if (id === 'article-content') el.innerHTML = val;
            else el.textContent = val;
        }
    }
    
    const dateEl = document.getElementById('article-date')?.querySelector('span');
    if (dateEl) dateEl.textContent = formatDate(data.date);
    
    const img = document.getElementById('article-image');
    if (img) {
        img.src = data.image;
        img.alt = data.title;
    }
    
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

function showArticleError() {
    if (El.articleView) El.articleView.style.display = 'none';
    if (El.notFound) El.notFound.style.display = 'block';
}

function showGenericError(msg) {
    if (El.grid) {
        El.grid.innerHTML = `<div style="grid-column: 1/-1; color: red; text-align: center; padding: 20px;">
            <strong>❌ خطأ في التحميل:</strong><br>
            ${msg}
        </div>`;
    }
}

// Ensure init runs once
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

