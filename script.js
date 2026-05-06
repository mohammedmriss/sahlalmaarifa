/**
 * script.js - Simplified for Multi-page Static Site
 */

const El = {
    hamburger: document.getElementById('hamburger-btn'),
    navMenu: document.getElementById('nav-menu'),
    progressBar: document.getElementById('progress-bar'),
    backToTop: document.getElementById('back-to-top'),
    search: document.getElementById('main-search')
};

function init() {
    setupEventListeners();
}

function setupEventListeners() {
    // Mobile Menu
    if (El.hamburger && El.navMenu) {
        El.hamburger.addEventListener('click', () => {
            El.navMenu.classList.toggle('active');
            El.hamburger.classList.toggle('open');
        });
    }

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (El.navMenu && El.navMenu.classList.contains('active')) {
            if (!El.navMenu.contains(e.target) && !El.hamburger.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // Scroll Progress & Back to Top
    window.addEventListener('scroll', () => {
        if (El.progressBar) {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            El.progressBar.style.width = `${scrolled}%`;
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

    // Search (Minimal UI Feedback)
    if (El.search) {
        El.search.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                alert('البحث سيتوفر قريباً في النسخة القادمة!');
            }
        });
    }
}

function closeMenu() {
    if (El.navMenu) El.navMenu.classList.remove('active');
    if (El.hamburger) El.hamburger.classList.remove('open');
}

// Boot
init();
