/**
 * script.js - Comprehensive Arabic Blog Logic
 */

// --- Comprehensive Article Database (30+ Articles) ---
const DB = [
    // الأخبار
    { id: 1, category: "أخبار", title: "المغرب يطلق استراتيجية جديدة للطاقة المتجددة", date: "10 مايو 2026", description: "تهدف الاستراتيجية إلى تحقيق استقلال طاقي كامل بنسبة 52% بحلول عام 2030.", image: "https://images.unsplash.com/photo-1466611653911-95282ee3656d?w=600", content: "<p>أعلن المغرب اليوم عن خطة طموحة لتعزيز قدراته في إنتاج الطاقة الشمسية والريحية. المشروع يشمل بناء محطات جديدة في المناطق الجنوبية...</p>" },
    { id: 2, category: "أخبار", title: "توقعات بارتفاع النمو الاقتصادي في المنطقة العربية", date: "09 مايو 2026", description: "تقارير دولية تشير إلى تحسن ملحوظ في مؤشرات الاستهلاك والاستثمار.", image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600" },
    { id: 3, category: "أخبار", title: "افتتاح أكبر مكتبة رقمية في الشرق الأوسط", date: "08 مايو 2026", description: "المكتبة توفر أكثر من 5 ملايين كتاب إلكتروني مجاني للباحثين والطلاب.", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600" },

    // وظائف
    { id: 4, category: "وظائف", title: "مطلوب مهندسي برمجيات للعمل عن بعد", date: "11 مايو 2026", description: "شركة تقنية عالمية تبحث عن مطورين في تخصصات Full Stack و AI.", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600", content: "<p>نحن نبحث عن مبرمجين شغوفين للانضمام إلى فريقنا العالمي. المميزات تشمل رواتب تنافسية وبيئة عمل مرنة...</p>" },
    { id: 5, category: "وظائف", title: "فرص عمل في القطاع السياحي بمدينة مراكش", date: "10 مايو 2026", description: "الفنادق الكبرى تفتح باب التوظيف للموسم الصيفي في مختلف التخصصات.", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600" },
    { id: 6, category: "وظائف", title: "مباراة لتوظيف 500 ملحق قضائي", date: "09 مايو 2026", description: "وزارة العدل تعلن عن تنظيم مباراة لولوج السلك القضائي لعام 2026.", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600" },

    // الهجرة
    { id: 7, category: "الهجرة", title: "تحديثات نظام الهجرة الكندي لعام 2026", date: "12 مايو 2026", description: "تسهيلات جديدة في معالجة طلبات الإقامة الدائمة للعمال المهرة.", image: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?w=600" },
    { id: 8, category: "الهجرة", title: "ألمانيا تفتح باب 'بطاقة الفرصة' للباحثين عن عمل", date: "11 مايو 2026", description: "كل ما تحتاج معرفته عن شروط الحصول على فيزا البحث عن عمل في ألمانيا.", image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600" },
    { id: 9, category: "الهجرة", title: "أفضل 5 دول للهجرة في 2026 للشباب العربي", date: "10 مايو 2026", description: "دراسة شاملة حول جودة الحياة وفرص العمل وسهولة الاندماج.", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=600" },

    // رياضة
    { id: 10, category: "رياضة", title: "نتائج قرعة دوري أبطال أفريقيا", date: "13 مايو 2026", description: "مواجهات نارية مرتقبة بين كبار الأندية العربية في دور المجموعات.", image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600" },
    { id: 11, category: "رياضة", title: "أشرف حكيمي يقترب من العودة للدوري الإسباني", date: "12 مايو 2026", description: "تقارير صحفية تؤكد رغبة ريال مدريد في استعادة ظهيره السابق.", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600" },
    { id: 12, category: "رياضة", title: "المنتخب المغربي يتصدر تصنيف الفيفا عربياً", date: "11 مايو 2026", description: "أسود الأطلس يواصلون كتابة التاريخ بعد نتائجهم المبهرة الأخيرة.", image: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600" },

    // الطبخ
    { id: 13, category: "الطبخ", title: "طريقة تحضير الطجين المغربي الأصيل", date: "14 مايو 2026", description: "أسرار النكهة المغربية التقليدية وطريقة طهي اللحم مع البرقوق.", image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=600" },
    { id: 14, category: "الطبخ", title: "5 وصفات سريعة لعشاء خفيف وصحي", date: "13 مايو 2026", description: "أطباق مبتكرة يمكن تحضيرها في أقل من 20 دقيقة وبمكونات بسيطة.", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600" },
    { id: 15, category: "الطبخ", title: "فن تحضير الحلويات الشرقية في المنزل", date: "12 مايو 2026", description: "تعلمي خطوة بخطوة كيفية صنع البقلاوة والكنافة باحترافية.", image: "https://images.unsplash.com/photo-1516685018646-527ad9501517?w=600" },

    // تعليم السياقة
    { id: 16, category: "تعليم السياقة", title: "دليل رخصة السياقة صنف B (سيارات)", date: "15 مايو 2026", description: "شرح كامل لقواعد السير وأهم الأسئلة المتكررة في الامتحان النظري.", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600" },
    { id: 17, category: "تعليم السياقة", title: "رخص السياقة المهنية C و D", date: "14 مايو 2026", description: "كل ما يجب معرفته عن سياقة الشاحنات والحافلات والمساطر الإدارية.", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600" },
    { id: 18, category: "تعليم السياقة", title: "رخصة السياقة صنف A (دراجات نارية)", date: "13 مايو 2026", description: "شروط الحصول على رخصة الدراجات النارية الكبيرة والصغيرة بالمغرب.", image: "https://images.unsplash.com/photo-1558981403-c5f91cbcf523?w=600" },

    // الأفلام والمسلسلات
    { id: 19, category: "الأفلام والمسلسلات", title: "مراجعة فيلم 'أمل جديد' الدرامي", date: "16 مايو 2026", description: "لماذا تصدر هذا الفيلم شباك التذاكر في الوطن العربي هذا الأسبوع؟", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600" },
    { id: 20, category: "الأفلام والمسلسلات", title: "أفضل 10 مسلسلات قصيرة على نتفليكس", date: "15 مايو 2026", description: "قائمة مختارة للمشاهدة خلال عطلة نهاية الأسبوع.", image: "https://images.unsplash.com/photo-1593359674291-7424fe5a7330?w=600" },
    { id: 21, category: "الأفلام والمسلسلات", title: "تاريخ السينما العربية: من البدايات إلى العالمية", date: "14 مايو 2026", description: "رحلة شيقة عبر الزمان لاستكشاف أهم المحطات السينمائية العربية.", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600" },

    // الربح من الإنترنت
    { id: 22, category: "الربح من الإنترنت", title: "كيف تبدأ في مجال التسويق بالعمولة؟", date: "17 مايو 2026", description: "دليل شامل للمبتدئين لتحقيق أول دولار من الإنترنت عبر 'أفيلييت'.", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=600" },
    { id: 23, category: "الربح من الإنترنت", title: "أفضل منصات العمل الحر في 2026", date: "16 مايو 2026", description: "مقارنة بين خمسات، مستقل، Upwork و Fiverr وأيها الأنسب لك.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600" },
    { id: 24, category: "الربح من الإنترنت", title: "العمل في مجال التجارة الإلكترونية 'Local DropShipping'", date: "15 مايو 2026", description: "استراتيجية الربح من بيع المنتجات المحلية والدفع عند الاستلام.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600" },

    // الحرف والمشاريع
    { id: 25, category: "الحرف والمشاريع", title: "أفكار مشاريع صغيرة ناجحة برأس مال بسيط", date: "18 مايو 2026", description: "استثمر وقتك ومهاراتك في بناء مشروع خاص من المنزل.", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600" },
    { id: 26, category: "الحرف والمشاريع", title: "فن النجارة العصرية: دليلك للبدء", date: "17 مايو 2026", description: "الأدوات والتقنيات الأساسية لصناعة أثاث بسيط وجميل.", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600" },

    // الوثائق الإدارية
    { id: 27, category: "الوثائق الإدارية", title: "كيفية تجديد البطاقة الوطنية للتعريف الإلكترونية", date: "19 مايو 2026", description: "المستندات المطلوبة والمساطر الجديدة لعام 2026.", image: "https://images.unsplash.com/photo-1589330694653-93c9d7d4c849?w=600" },
    { id: 28, category: "الوثائق الإدارية", title: "دليل الحصول على جواز السفر المغربي", date: "18 مايو 2026", description: "شرح مفصل لطريقة ملء الطلب إلكترونياً وأداء الواجبات.", image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600" },

    // إصلاح الإلكترونيات
    { id: 29, category: "إصلاح الإلكترونيات", title: "كيفية إصلاح شاشات الهواتف الذكية المنكسرة", date: "20 مايو 2026", description: "خطوات عملية وأدوات ضرورية للمبتدئين في مجال صيانة الهواتف.", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600" },
    { id: 30, category: "إصلاح الإلكترونيات", title: "صيانة الحواسيب المحمولة: تنظيف وتسريع الجهاز", date: "19 مايو 2026", description: "طرق فعالة لتحسين أداء حاسوبك وإطالة عمر البطارية.", image: "https://images.unsplash.com/photo-1588702547919-26089e690ec9?w=600" },
    { id: 31, category: "أخبار", title: "انطلاق مهرجان موازين الدولي 2026", date: "07 مايو 2026", description: "الرباط تستعد لاستقبال نجوم الموسيقى العالميين في النسخة الـ21.", image: "https://images.unsplash.com/photo-1459749411177-042180ceea73?w=600" },
    { id: 32, category: "وظائف", title: "تدريبات مهنية مدفوعة الأجر في البنوك", date: "08 مايو 2026", description: "فرصة للطلبة حديثي التخرج لاكتساب خبرة ميدانية في القطاع المصرفي.", image: "https://images.unsplash.com/photo-1454165833767-027ff3d631ea?w=600" },
    { id: 33, category: "رياضة", title: "البطلة المغربية تتوج بذهبية ألعاب القوى", date: "10 مايو 2026", description: "فخر جديد للرياضة الوطنية في المحافل الدولية.", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600" }
];

const Categories = [
    "الكل", "أخبار", "وظائف", "الهجرة", "رياضة", "الطبخ", 
    "تعليم السياقة", "الأفلام والمسلسلات", "الربح من الإنترنت", 
    "الحرف والمشاريع", "الوثائق الإدارية", "إصلاح الإلكترونيات"
];

// --- Application State ---
let State = {
    view: 'home', // 'home', 'article', 'categories', 'about', 'privacy', 'contact'
    category: 'الكل',
    searchQuery: '',
    currentPage: 1,
    perPage: 9,
    activeArticleId: null
};

// --- DOM Selectors ---
const El = {
    dynamicArea: document.getElementById('dynamic-area'),
    pagination: document.getElementById('pagination-ui'),
    hero: document.getElementById('hero-section'),
    quickCats: document.getElementById('quick-categories'),
    search: document.getElementById('main-search'),
    hamburger: document.getElementById('hamburger-btn'),
    navMenu: document.getElementById('nav-menu'),
    progressBar: document.getElementById('progress-bar'),
    backToTop: document.getElementById('back-to-top')
};

// --- Core Functions ---

function init() {
    renderQuickCategories();
    setupEventListeners();
    router();
}

function router() {
    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (State.view === 'home') {
        El.hero.classList.remove('hidden');
        renderArticles();
    } else if (State.view === 'article') {
        El.hero.classList.add('hidden');
        renderArticleDetail(State.activeArticleId);
    } else if (State.view === 'categories') {
        El.hero.classList.add('hidden');
        renderCategoryGrid();
    } else if (State.view === 'about') {
        El.hero.classList.add('hidden');
        renderAboutPage();
    } else if (State.view === 'privacy') {
        El.hero.classList.add('hidden');
        renderPrivacyPage();
    } else if (State.view === 'contact') {
        El.hero.classList.add('hidden');
        renderContactPage();
    }
    
    updateNavActiveState();
}

// --- Rendering Functions ---

function renderArticles() {
    const data = getFilteredData();
    const start = (State.currentPage - 1) * State.perPage;
    const paginated = data.slice(start, start + State.perPage);

    if (paginated.length === 0) {
        El.dynamicArea.innerHTML = `
            <div style="text-align:center; padding: 100px 0;">
                <i class="fas fa-search-minus" style="font-size:4rem; color:#cbd5e1; margin-bottom:20px;"></i>
                <h2>عذراً، لم نجد أي نتائج</h2>
                <p>حاول البحث بكلمات أخرى أو تغيير التصنيف.</p>
                <button class="pill" style="margin-top:20px;" onclick="resetFilter()">عرض كل المقالات</button>
            </div>
        `;
        El.pagination.innerHTML = '';
        return;
    }

    let html = `<div class="articles-grid">`;
    paginated.forEach(item => {
        html += `
            <article class="card">
                <div class="card-img-container">
                    <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy">
                    <span class="card-badge">${item.category}</span>
                </div>
                <div class="card-body">
                    <div class="card-date"><i class="far fa-calendar-alt"></i> ${item.date}</div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <div class="btn-read" onclick="openArticle(${item.id})">
                        اقرأ المزيد <i class="fas fa-arrow-left"></i>
                    </div>
                </div>
            </article>
        `;
    });
    html += `</div>`;
    
    El.dynamicArea.innerHTML = html;
    renderPagination(data.length);
}

function renderPagination(total) {
    const pages = Math.ceil(total / State.perPage);
    if (pages <= 1) {
        El.pagination.innerHTML = '';
        return;
    }

    let html = `
        <button class="page-btn nav-btn ${State.currentPage === 1 ? 'disabled' : ''}" onclick="prevPage()">السابق</button>
    `;

    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= State.currentPage - 1 && i <= State.currentPage + 1)) {
            html += `<button class="page-btn ${State.currentPage === i ? 'active' : ''}" onclick="setPage(${i})">${i}</button>`;
        } else if (i === State.currentPage - 2 || i === State.currentPage + 2) {
            html += `<span style="padding: 10px;">...</span>`;
        }
    }

    html += `
        <button class="page-btn nav-btn ${State.currentPage === pages ? 'disabled' : ''}" onclick="nextPage()">التالي</button>
    `;
    
    El.pagination.innerHTML = html;
}

function renderQuickCategories() {
    El.quickCats.innerHTML = Categories.map(cat => `
        <div class="pill ${State.category === cat ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</div>
    `).join('');
}

function renderArticleDetail(id) {
    const item = DB.find(a => a.id === id);
    if (!item) return navigate('home');

    El.pagination.innerHTML = '';
    El.dynamicArea.innerHTML = `
        <div class="detail-view">
            <img src="${item.image}" alt="${item.title}" class="detail-img">
            <div class="detail-content">
                <div class="back-btn" onclick="navigate('home')">
                    <i class="fas fa-arrow-right"></i> العودة للرئيسية
                </div>
                <div class="detail-header">
                    <h2>${item.title}</h2>
                    <div class="detail-meta">
                        <span><i class="far fa-folder"></i> ${item.category}</span>
                        <span><i class="far fa-calendar-alt"></i> ${item.date}</span>
                    </div>
                </div>
                <div class="article-body">
                    ${item.content || `
                        <p>${item.description}</p>
                        <p>يعتبر هذا الموضوع من أهم القضايا التي تهم المتابع العربي في الوقت الراهن. نحن في مدونة المعرفة نحرص على تقديم أدق التفاصيل والمعلومات الموثوقة لمتابعينا الكرام.</p>
                        <p>سوف يتم تحديث هذا المقال بمزيد من التفاصيل والبيانات الحصرية قريباً. شكراً لمتابعتكم لنا.</p>
                    `}
                </div>
            </div>
        </div>
    `;
}

function renderCategoryGrid() {
    const icons = {
        "أخبار": "fa-newspaper", "وظائف": "fa-briefcase", "الهجرة": "fa-globe-africa",
        "رياضة": "fa-futbol", "الطبخ": "fa-utensils", "تعليم السياقة": "fa-car",
        "الأفلام والمسلسلات": "fa-film", "الربح من الإنترنت": "fa-laptop-code",
        "الحرف والمشاريع": "fa-hammer", "الوثائق الإدارية": "fa-file-signature",
        "إصلاح الإلكترونيات": "fa-tools"
    };

    let html = `
        <div style="text-align:center; margin-bottom: 50px;">
            <h2>تصفح حسب المجالات</h2>
            <p>اختر التصنيف الذي يهمك للوصول إلى كافة المقالات المتعلقة به</p>
        </div>
        <div class="articles-grid">
    `;

    Categories.filter(c => c !== 'الكل').forEach(cat => {
        html += `
            <div class="card" style="text-align:center; padding: 40px 20px; cursor:pointer;" onclick="filterByCategory('${cat}')">
                <i class="fas ${icons[cat] || 'fa-folder'}" style="font-size:3rem; color:var(--primary); margin-bottom:20px;"></i>
                <h3 style="margin-bottom:10px;">${cat}</h3>
                <p>${DB.filter(a => a.category === cat).length} مقال</p>
            </div>
        `;
    });

    html += `</div>`;
    El.dynamicArea.innerHTML = html;
    El.pagination.innerHTML = '';
}

function renderAboutPage() {
    El.pagination.innerHTML = '';
    El.dynamicArea.innerHTML = `
        <div class="detail-view" style="padding: 60px;">
            <h2 style="text-align:center; margin-bottom:30px;">عن مدونة المعرفة</h2>
            <div class="article-body">
                <p><strong>مدونة المعرفة</strong> هي منصة رقمية عربية تأسست عام 2026 لتكون المرجع الأول للمواطن العربي في البحث عن المعلومة الدقيقة والموثوقة.</p>
                <p>نحن نؤمن بأن المحتوى العربي الرقمي يحتاج إلى المزيد من الجودة والعمق، ولذلك يعمل فريقنا المتخصص على تغطية مجالات متنوعة تشمل سوق الشغل، الهجرة، التكنولوجيا، والمهارات الحياتية.</p>
                <h3>رؤيتنا:</h3>
                <p>أن نصبح الوجهة الرقمية الأكثر تأثيراً في إثراء الفكر العربي وتمكين الشباب بالأدوات والمعلومات اللازمة للنجاح.</p>
            </div>
        </div>
    `;
}

function renderPrivacyPage() {
    El.pagination.innerHTML = '';
    El.dynamicArea.innerHTML = `
        <div class="detail-view" style="padding: 60px;">
            <h2 style="text-align:center; margin-bottom:30px;">سياسة الخصوصية</h2>
            <div class="article-body privacy-content">
                <h3>مقدمة عن الخصوصية</h3>
                <p>نحن في مدونة المعرفة نولي أهمية قصوى لخصوصية زوارنا. تصف هذه الوثيقة أنواع المعلومات الشخصية التي نجمعها وكيفية استخدامها.</p>

                <h3>ما هي البيانات التي نجمعها</h3>
                <p>نجمع معلومات محدودة عند تفاعلك مع موقعنا، بما في ذلك:</p>
                <ul>
                    <li>المعلومات التي تقدمها عند الاتصال بنا (الاسم، البريد الإلكتروني).</li>
                    <li>بيانات التصفح التقنية (عنوان IP، نوع المتصفح).</li>
                </ul>

                <h3>كيفية استخدام البيانات</h3>
                <p>نستخدم البيانات التي نجمعها لـ:</p>
                <ul>
                    <li>تحسين تجربة المستخدم على الموقع.</li>
                    <li>الرد على استفساراتكم ورسائلكم.</li>
                    <li>إرسال تحديثات إخبارية في حال اشتراككم في القائمة البريدية.</li>
                </ul>

                <h3>ملفات تعريف الارتباط (Cookies)</h3>
                <p>نستخدم ملفات تعريف الارتباط لتحسين أداء الموقع وتخصيص المحتوى. يمكنك اختيار تعطيل هذه الملفات من إعدادات متصفحك.</p>

                <h3>حماية المعلومات</h3>
                <p>نحن نطبق مجموعة من الإجراءات الأمنية لضمان سلامة معلوماتك الشخصية ومنع الوصول غير المصرح به.</p>

                <h3>حقوق المستخدم</h3>
                <p>لك الحق في الوصول إلى بياناتك الشخصية، أو طلب تصحيحها، أو حذفها من سجلاتنا في أي وقت.</p>

                <h3>التعديلات على السياسة</h3>
                <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سيتم نشر أي تغييرات في هذه الصفحة.</p>

                <h3>معلومات التواصل</h3>
                <p>إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة "اتصل بنا".</p>
            </div>
        </div>
    `;
}

function renderContactPage() {
    El.pagination.innerHTML = '';
    El.dynamicArea.innerHTML = `
        <div class="detail-view" style="padding: 60px;">
            <div style="text-align:center; margin-bottom:40px;">
                <h2>اتصل بنا</h2>
                <p>يسعدنا دائماً سماع آرائكم واستفساراتكم. سنرد عليكم في أقرب وقت ممكن.</p>
            </div>
            
            <form class="contact-form" onsubmit="event.preventDefault(); alert('تم إرسال رسالتك بنجاح!'); this.reset();">
                <div class="form-group">
                    <label for="name">الاسم</label>
                    <input type="text" id="name" placeholder="أدخل اسمك الكامل" required>
                </div>
                <div class="form-group">
                    <label for="email">البريد الإلكتروني</label>
                    <input type="email" id="email" placeholder="example@mail.com" required>
                </div>
                <div class="form-group">
                    <label for="message">الرسالة</label>
                    <textarea id="message" rows="6" placeholder="اكتب رسالتك هنا..." required></textarea>
                </div>
                <button type="submit" class="btn-submit">إرسال الرسالة</button>
            </form>

            <div class="contact-info-grid">
                <div class="info-item">
                    <i class="fas fa-envelope"></i>
                    <p>contact@maarifablog.com</p>
                </div>
                <div class="info-item">
                    <i class="fas fa-phone-alt"></i>
                    <p>+212 600 000 000</p>
                </div>
            </div>
        </div>
    `;
}

// --- Event Handlers & Helpers ---

function setupEventListeners() {
    // Search with Debounce
    let searchTimeout;
    El.search.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            State.searchQuery = e.target.value.trim().toLowerCase();
            State.currentPage = 1;
            State.view = 'home';
            router();
        }, 300);
    });

    // Mobile Menu
    El.hamburger.addEventListener('click', () => {
        El.navMenu.classList.toggle('active');
        El.hamburger.classList.toggle('open');
    });

    // Scroll Progress & Back to Top
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        El.progressBar.style.width = `${scrolled}%`;

        if (window.scrollY > 500) El.backToTop.style.display = 'flex';
        else El.backToTop.style.display = 'none';
    });

    El.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function getFilteredData() {
    return DB.filter(item => {
        const matchesCat = State.category === 'الكل' || item.category === State.category;
        const matchesSearch = item.title.toLowerCase().includes(State.searchQuery) || 
                             item.description.toLowerCase().includes(State.searchQuery);
        return matchesCat && matchesSearch;
    });
}

function filterByCategory(cat) {
    State.category = cat;
    State.currentPage = 1;
    State.view = 'home';
    renderQuickCategories();
    router();
}

function resetFilter() {
    State.category = 'الكل';
    State.searchQuery = '';
    El.search.value = '';
    filterByCategory('الكل');
}

function setPage(p) {
    State.currentPage = p;
    router();
}

function nextPage() {
    const total = getFilteredData().length;
    if (State.currentPage < Math.ceil(total / State.perPage)) {
        State.currentPage++;
        router();
    }
}

function prevPage() {
    if (State.currentPage > 1) {
        State.currentPage--;
        router();
    }
}

function openArticle(id) {
    State.activeArticleId = id;
    State.view = 'article';
    router();
}

function navigate(view) {
    State.view = view;
    State.currentPage = 1;
    if (view === 'home') {
        State.category = 'الكل';
        State.searchQuery = '';
        El.search.value = '';
        renderQuickCategories();
    }
    router();
}

function updateNavActiveState() {
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(l => l.classList.remove('active'));
    
    if (State.view === 'home') links[0].classList.add('active');
    else if (State.view === 'categories') links[1].classList.add('active');
    else if (State.view === 'about') links[2].classList.add('active');
    else if (State.view === 'privacy') links[3].classList.add('active');
    else if (State.view === 'contact') links[4].classList.add('active');
}

function closeMenu() {
    El.navMenu.classList.remove('active');
    El.hamburger.classList.remove('open');
}

// Boot the App
init();
