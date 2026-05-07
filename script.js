/**
 * script.js - Centralized Blog Engine
 * Optimized for GitHub Pages & Custom Domains
 * Bulletproof version with anti-flicker protection
 */

// 1. Global State & Robust Path Detection
const BlogState = {
    isInitialized: false,
    allArticles: [],
    // Robustly find the root directory where script.js and articles.json live
    rootPath: window.location.origin + '/',  // Always use origin for GitHub Pages
    renderedContent: '',  // Store rendered HTML to prevent flicker
    mutationObserver: null  // For protection against external clearing
};

// Global execution guard
if (window.blogEngineInitialized) {
    console.log("🚫 Blog Engine already initialized, skipping...");
} else {
    window.blogEngineInitialized = true;

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
    if (BlogState.isInitialized) {
        console.log("🚫 Blog Engine already running, skipping init...");
        return;
    }
    BlogState.isInitialized = true;

    console.log("🚀 Blog Engine Initializing...");
    console.log("📂 Root Path Detected:", BlogState.rootPath);
    
    setupUI();
    
    // Determine page type
    const path = window.location.pathname;
    const page = path.split("/").pop() || 'index.html';

    try {
        console.log("📄 Page detected:", page);
        if (page === 'article.html') {
            console.log("📖 Handling article detail page");
            await handleArticleDetail();
        } else {
            console.log("📚 Handling article list page");
            await handleArticleList(page);
        }
        console.log("✅ Initialization complete");
    } catch (err) {
        console.error("❌ Initialization Failed:", err);
        showGenericError(err.message);
    }
}

// 3. UI Helpers
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

// 4. Data Loading Logic
async function fetchArticles() {
    if (BlogState.allArticles.length > 0) {
        console.log("📋 Using cached articles:", BlogState.allArticles.length, "articles");
        return BlogState.allArticles;
    }
    
    const fetchUrl = `${BlogState.rootPath}articles.json`;
    console.log(`📡 Fetching data from: ${fetchUrl}`);
    
    try {
        console.log("🔄 Starting fetch...");
        const response = await fetch(fetchUrl);
        console.log("📥 Response received, status:", response.status);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        
        const data = await response.json();
        console.log("📊 Data parsed successfully, posts found:", data.posts?.length || 0);
        
        BlogState.allArticles = data.posts || [];
        console.log("💾 Articles cached in BlogState");
        return BlogState.allArticles;
    } catch (err) {
        console.error("🚨 Fetch Error:", err);
        throw new Error("تعذر تحميل البيانات. يرجى التأكد من وجود ملف articles.json في الجذر.");
    }
}

// 5. List View Handler
async function handleArticleList(page) {
    if (!El.grid) {
        console.warn("⚠️ No articles grid element found");
        return;
    }

    console.log("📚 Handling article list for page:", page);
    const articles = await fetchArticles();
    console.log("📋 Total articles loaded:", articles.length);
    
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
        console.log("🏷️ Filtering by category:", targetCategory);
        filtered = articles.filter(a => 
            a.category.trim().toLowerCase() === targetCategory.trim().toLowerCase()
        );
        console.log("📋 Filtered articles:", filtered.length);
    } else {
        console.log("📋 Showing all articles (no category filter)");
    }

    renderArticles(filtered);
}

// 6. Article Detail Handler
async function handleArticleDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));
    
    console.log("📖 Handling article detail, ID from URL:", id);
    
    if (isNaN(id)) {
        console.error("❌ Invalid article ID:", params.get('id'));
        return showArticleError();
    }

    const articles = await fetchArticles();
    console.log("📋 Searching for article ID", id, "in", articles.length, "articles");
    
    const article = articles.find(a => a.id === id);

    if (article) {
        console.log("✅ Article found:", article.title);
        renderFullArticle(article);
    } else {
        console.error("❌ Article not found with ID:", id);
        showArticleError();
    }
}

// 7. Rendering Engine
function renderArticles(list) {
    if (!El.grid) {
        console.warn("⚠️ No articles grid found, skipping render");
        return;
    }

    console.log("🎨 Starting render of", list?.length || 0, "articles");

    if (!list || list.length === 0) {
        const emptyContent = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #cbd5e1; margin-bottom: 20px; display: block;"></i>
                <p style="font-size: 1.2rem; color: #64748b;">عذراً، لا توجد مقالات في هذا القسم حالياً.</p>
            </div>
        `;
        BlogState.renderedContent = emptyContent;
        El.grid.innerHTML = emptyContent;
        console.log("📭 Rendered empty state");
        setupProtection();
        return;
    }

    const sorted = [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log("🔄 Sorted articles by date");

    // Build content in memory first (anti-flicker)
    const content = sorted.map(art => `
        <article class="card">
            <div class="card-img-container">
                <img src="${art.image}" alt="${art.title}" class="card-img" loading="lazy">
                <span class="card-badge">${art.category}</span>
            </div>
            <div class="card-body">
                <div class="card-date"><i class="far fa-calendar-alt"></i> ${formatDate(art.date)}</div>
                <h3>${art.title}</h3>
                <p>${stripHtml(art.content).substring(0, 100)}...</p>
                <a href="${BlogState.rootPath}article.html?id=${art.id}" class="btn-read">
                    اقرأ المزيد <i class="fas fa-arrow-left"></i>
                </a>
            </div>
        </article>
    `).join('');

    console.log("🏗️ Content built in memory, length:", content.length);

    // Single DOM update (anti-flicker)
    BlogState.renderedContent = content;
    El.grid.innerHTML = content;
    console.log("✅ Articles rendered successfully");

    // Setup protection against external clearing
    setupProtection();
}

// Protection function to prevent flickering
function setupProtection() {
    if (!El.grid) return;

    // Disconnect existing observer
    if (BlogState.mutationObserver) {
        BlogState.mutationObserver.disconnect();
    }

    // Create new observer
    BlogState.mutationObserver = new MutationObserver((mutations) => {
        let wasCleared = false;
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                // Check if our content was removed
                const hasArticles = El.grid.querySelector('.card');
                if (!hasArticles && BlogState.renderedContent) {
                    console.warn("🚨 Detected content clearing, re-rendering...");
                    wasCleared = true;
                }
            }
        });
        
        if (wasCleared) {
            // Re-render after a short delay to avoid infinite loops
            setTimeout(() => {
                if (El.grid && BlogState.renderedContent && !El.grid.querySelector('.card')) {
                    console.log("🔄 Re-rendering protected content");
                    El.grid.innerHTML = BlogState.renderedContent;
                }
            }, 100);
        }
    });

    // Start observing
    BlogState.mutationObserver.observe(El.grid, {
        childList: true,
        subtree: false
    });

    console.log("🛡️ Content protection activated");
}

function renderFullArticle(data) {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${data.title} | مدونة سهل المعرفة`;
    
    if (document.getElementById('article-title')) document.getElementById('article-title').textContent = data.title;
    if (document.getElementById('article-category')) document.getElementById('article-category').textContent = data.category;
    if (document.getElementById('article-date')?.querySelector('span')) {
        document.getElementById('article-date').querySelector('span').textContent = formatDate(data.date);
    }
    
    const img = document.getElementById('article-image');
    if (img) {
        img.src = data.image;
        img.alt = data.title;
    }
    
    if (document.getElementById('article-content')) document.getElementById('article-content').innerHTML = data.content;

    if (El.articleView) El.articleView.style.display = 'block';
    if (El.notFound) El.notFound.style.display = 'none';
}

// 8. Utilities
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
        El.grid.innerHTML = `<div style="grid-column: 1/-1; color: red; text-align: center; padding: 20px;">${msg}</div>`;
    }
}

// 9. Lifecycle
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
}

} // End of global execution guard
