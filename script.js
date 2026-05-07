/**
 * script.js - Centralized Blog Engine
 * Optimized for GitHub Pages & Vanilla JS
 */

// 1. Global State & Configuration
const BlogState = {
    isInitialized: false,
    allArticles: [],
    basePath: window.location.pathname.includes('/categories/') ? '../' : './'
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

// 2. Initialization Entry Point
async function init() {
    if (BlogState.isInitialized) return;
    BlogState.isInitialized = true;

    console.log("🚀 Blog Engine Initializing...");
    setupUI();
    
    // Determine which page logic to run
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    try {
        if (page === 'article.html') {
            await handleArticleDetail();
        } else {
            await handleArticleList(page);
        }
    } catch (err) {
        console.error("❌ Initialization Error:", err);
    }
}

// 3. UI Helpers
function setupUI() {
    // Mobile Menu
    if (El.hamburger && El.navMenu) {
        El.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            El.navMenu.classList.toggle('active');
            El.hamburger.classList.toggle('open');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (El.navMenu?.classList.contains('active')) {
            if (!El.navMenu.contains(e.target) && !El.hamburger.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
        if (El.progressBar) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            El.progressBar.style.width = scrolled + "%";
        }

        if (El.backToTop) {
            if (window.scrollY > 500) El.backToTop.style.display = 'flex';
            else El.backToTop.style.display = 'none';
        }
    });

    if (El.backToTop) {
        El.backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Search Redirect (Mockup)
    if (El.search) {
        El.search.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') alert('البحث سيتوفر قريباً!');
        });
    }
}

function closeMenu() {
    El.navMenu?.classList.remove('active');
    El.hamburger?.classList.remove('open');
}

// 4. Data Loading Logic
async function fetchArticles() {
    if (BlogState.allArticles.length > 0) return BlogState.allArticles;
    
    const fetchPath = `${BlogState.basePath}articles.json`;
    console.log(`📡 Fetching data from: ${fetchPath}`);
    
    const response = await fetch(fetchPath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    BlogState.allArticles = data.posts || [];
    return BlogState.allArticles;
}

// 5. List View Handler (Home & Categories)
async function handleArticleList(page) {
    if (!El.grid) return;

    const articles = await fetchArticles();
    
    // Define Category Map
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
        console.log(`📂 Filtering for category: ${targetCategory}`);
        filtered = articles.filter(a => 
            a.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
        );
    }

    renderArticles(filtered);
}

// 6. Article Detail Handler
async function handleArticleDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    if (isNaN(id)) {
        showArticleError();
        return;
    }

    const articles = await fetchArticles();
    const article = articles.find(a => a.id === id);

    if (article) {
        renderFullArticle(article);
    } else {
        showArticleError();
    }
}

// 7. Rendering Engine
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

    // Sort by date (newest first)
    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Avoid multiple innerHTML resets if possible, but for a clean start:
    const html = sorted.map(art => `
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

    El.grid.innerHTML = html;
}

function renderFullArticle(data) {
    const titleEl = document.getElementById('article-title');
    const catEl = document.getElementById('article-category');
    const dateEl = document.getElementById('article-date')?.querySelector('span');
    const imgEl = document.getElementById('article-image');
    const contentEl = document.getElementById('article-content');
    const pageTitle = document.getElementById('page-title');

    if (pageTitle) pageTitle.textContent = `${data.title} | مدونة سهل المعرفة`;
    if (titleEl) titleEl.textContent = data.title;
    if (catEl) catEl.textContent = data.category;
    if (dateEl) dateEl.textContent = formatDate(data.date);
    if (imgEl) {
        imgEl.src = data.image;
        imgEl.alt = data.title;
    }
    if (contentEl) contentEl.innerHTML = data.content;

    if (El.articleView) El.articleView.style.display = 'block';
    if (El.notFound) El.notFound.style.display = 'none';
}

// 8. Utilities
function formatDate(dateStr) {
    try {
        return new Date(dateStr).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

function stripHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

function showArticleError() {
    if (El.articleView) El.articleView.style.display = 'none';
    if (El.notFound) El.notFound.style.display = 'block';
}

// 9. Event Listeners
document.addEventListener('DOMContentLoaded', init);
// Safeguard for already loaded DOM
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}
