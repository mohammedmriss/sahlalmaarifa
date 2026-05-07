/**
 * script.js - Bulletproof Blog Engine for GitHub Pages + Custom Domains
 * 
 * CRITICAL FIX: This version handles all edge cases:
 * 1. Custom domain routing
 * 2. Dynamic vs hardcoded content
 * 3. Fetch failures with graceful fallback
 * 4. Single execution guarantee
 * 5. No flickering or disappearing articles
 */

const BlogState = {
    isInitialized: false,
    allArticles: [],
    fetchAttempted: false,
    fetchSucceeded: false,
    // Properly detect if on GitHub Pages with custom domain vs username.github.io
    basePath: (() => {
        const hostname = window.location.hostname;
        // GitHub Pages username repos: username.github.io/repo-name/
        if (hostname.includes('github.io')) {
            const pathParts = window.location.pathname.split('/').filter(p => p);
            // pathParts[0] is the repo name on github.io
            return pathParts.length > 1 ? `/${pathParts[0]}/` : '/';
        }
        // Custom domain or localhost: everything is at root /
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
 * Initialize blog engine
 * Single execution guard ensures this runs ONLY ONCE
 */
async function init() {
    // Double-check guard
    if (BlogState.isInitialized) {
        console.log('[Blog] Already initialized, skipping');
        return;
    }
    BlogState.isInitialized = true;

    console.log('[Blog] Initializing...');
    console.log('[Blog] Base path:', BlogState.basePath);
    console.log('[Blog] Current URL:', window.location.href);
    
    setupUI();
    setupSearch();
    
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    console.log('[Blog] Page detected:', page);

    // CRITICAL: Skip dynamic rendering for categories.html
    // It has its own static layout that should NOT be replaced
    if (page === 'categories.html') {
        console.log('[Blog] Categories page - skipping dynamic content');
        return;
    }

    try {
        if (page === 'article.html') {
            console.log('[Blog] Loading article detail view');
            await handleArticleDetail();
        } else if (El.grid) {
            console.log('[Blog] Loading article list for page:', page);
            await handleArticleList(page);
        } else {
            console.warn('[Blog] No .articles-grid found on this page');
        }
    } catch (err) {
        console.error('[Blog] ERROR:', err.message);
        // Only show error if the grid is completely empty (no hardcoded content)
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

/**
 * Fetch articles.json with intelligent path resolution
 * Handles: custom domains, GitHub Pages repos, subdirectories
 */
async function fetchArticles() {
    if (BlogState.allArticles.length > 0) {
        console.log('[Blog] Using cached articles:', BlogState.allArticles.length);
        return BlogState.allArticles;
    }

    if (BlogState.fetchAttempted) {
        console.log('[Blog] Fetch already attempted');
        if (!BlogState.fetchSucceeded) {
            throw new Error('تعذر تحميل البيانات من articles.json');
        }
        return BlogState.allArticles;
    }

    BlogState.fetchAttempted = true;

    console.log('[Blog] Starting fetch for articles.json');

    // Try multiple paths in order of likelihood
    const paths = [
        `${BlogState.basePath}articles.json`,     // Primary: basePath aware
        '/articles.json',                          // Root of domain
        'articles.json',                           // Relative to current location
        './articles.json',                         // Explicit relative
        window.location.origin + '/articles.json'  // Absolute to domain root
    ];

    // Remove duplicates while preserving order
    const uniquePaths = [...new Set(paths)];

    console.log('[Blog] Attempting fetch from', uniquePaths.length, 'paths');

    for (let i = 0; i < uniquePaths.length; i++) {
        const fetchPath = uniquePaths[i];
        console.log(`[Blog] Attempt ${i + 1}/${uniquePaths.length}: ${fetchPath}`);

        try {
            const response = await fetch(fetchPath);
            console.log(`[Blog] Response status: ${response.status} ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                console.log('[Blog] JSON parsed successfully');

                // Handle flexible response formats
                if (Array.isArray(data)) {
                    BlogState.allArticles = data;
                } else if (data && Array.isArray(data.posts)) {
                    BlogState.allArticles = data.posts;
                } else if (data && typeof data === 'object') {
                    // Try to find the first array in the response
                    for (const [key, value] of Object.entries(data)) {
                        if (Array.isArray(value)) {
                            BlogState.allArticles = value;
                            console.log('[Blog] Found articles in property:', key);
                            break;
                        }
                    }
                }

                if (!BlogState.allArticles.length) {
                    console.warn('[Blog] No articles found in response, trying next path');
                    continue;
                }

                BlogState.fetchSucceeded = true;
                console.log('[Blog] SUCCESS: Loaded', BlogState.allArticles.length, 'articles from', fetchPath);
                return BlogState.allArticles;
            }
        } catch (err) {
            console.warn(`[Blog] Fetch error: ${err.message}`);
            continue;
        }
    }

    // All attempts failed
    console.error('[Blog] All fetch attempts failed');
    BlogState.fetchSucceeded = false;
    throw new Error('تعذر تحميل ملف articles.json من جميع المسارات المحاولة');
}

async function handleArticleList(page) {
    if (!El.grid) {
        console.warn('[Blog] No .articles-grid element found');
        return;
    }

    console.log('[Blog] Handling article list for:', page);
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
        'islah.html': 'إصلاح',
        'index.html': null  // Show all articles on homepage
    };

    let filtered = articles;
    const targetCategory = categoryMap[page];

    if (targetCategory) {
        console.log('[Blog] Filtering by category:', targetCategory);
        filtered = articles.filter(a => 
            a.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
        );
        console.log('[Blog] Filtered articles:', filtered.length);
    } else if (targetCategory === null) {
        console.log('[Blog] Showing all articles (no category filter)');
    }

    renderArticles(filtered);
}

async function handleArticleDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    console.log('[Blog] Article detail - ID:', id);
    
    if (isNaN(id)) {
        console.error('[Blog] Invalid article ID');
        return showArticleError();
    }

    const articles = await fetchArticles();
    const article = articles.find(a => a.id === id);

    if (article) {
        console.log('[Blog] Article found:', article.title);
        renderFullArticle(article);
    } else {
        console.error('[Blog] Article not found with ID:', id);
        showArticleError();
    }
}

/**
 * Render article list
 * IMPORTANT: This replaces the entire grid content
 * Make sure to only call on pages that expect dynamic content
 */
function renderArticles(list) {
    if (!El.grid) return;

    console.log('[Blog] Rendering', list?.length || 0, 'articles');

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

    // Build HTML in memory first to avoid flicker
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

    // Single DOM update to avoid flicker
    El.grid.innerHTML = html;
    console.log('[Blog] Articles rendered successfully');
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
        El.grid.innerHTML = `
            <div style="grid-column: 1/-1; color: #d32f2f; text-align: center; padding: 30px;">
                <i class="fas fa-exclamation-circle" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <strong>خطأ في التحميل</strong><br>
                <small>${msg}</small><br>
                <small style="display: block; margin-top: 10px; color: #666;">
                    افتح وحدة التحكم (F12) لرؤية المزيد من التفاصيل
                </small>
            </div>
        `;
    }
}

/**
 * CRITICAL: Ensure init() runs exactly once
 * Check document state and register for DOMContentLoaded if needed
 */
if (document.readyState === 'loading') {
    // Document is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
    // Document is already loaded (complete or interactive)
    init();
}