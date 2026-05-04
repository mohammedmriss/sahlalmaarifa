/**
 * Modern Arabic News/Blog JS - Production Version 2026
 * Pure Vanilla JS - No Dependencies
 */

// --- Article Database ---
const DB = [
    { 
        id: 1, 
        title: "نتائج الدوري المغربي: صراع الصدارة يشتعل", 
        description: "شهدت الجولة الأخيرة من الدوري المغربي للمحترفين منافسات قوية، حيث تمكن الوداد والرجاء من تحقيق انتصارات هامة.", 
        category: "رياضة", 
        date: "04 مايو 2026",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80", // Soccer stadium
        content: `
            <p>تمكن فريق الوداد الرياضي من تعزيز صدارته للدوري المغربي بعد تغلبه على غريمه التقليدي في مباراة شهدت حضوراً جماهيرياً كبيراً وتكتيكات فنية عالية.</p>
            <p>المنافسة هذا الموسم تبدو استثنائية مع تقارب النقاط بين المراكز الأربعة الأولى، مما يضع ضغطاً كبيراً على المدربين في الجولات القادمة.</p>
            <h3>أهم نتائج الجولة:</h3>
            <ul>
                <li>الوداد 2 - 1 الرجاء</li>
                <li>نهضة بركان 0 - 0 الجيش الملكي</li>
            </ul>
        `
    },
    { 
        id: 2, 
        title: "دليل الهجرة إلى كندا 2026: الفرص المتاحة", 
        description: "تعرف على أحدث التحديثات في نظام 'الدخول السريع' والمهن الأكثر طلباً في مختلف الأقاليم الكندية هذا العام.", 
        category: "الهجرة", 
        date: "03 مايو 2026",
        image: "https://images.unsplash.com/photo-1506710507565-203b9f24669b?auto=format&fit=crop&w=800&q=80", // Travel/Canada
        content: `<p>أعلنت وزارة الهجرة الكندية عن تسهيلات جديدة للعمال المهرة في مجالات الصحة والتكنولوجيا. يتوقع أن يتم استقبال أكثر من 400 ألف مهاجر جديد خلال العام الجاري.</p>`
    },
    { 
        id: 3, 
        title: "فرص شغل في شركات تقنية كبرى بالمغرب", 
        description: "أعلنت عدة شركات ناشئة وكبرى في القطب التكنولوجي للدار البيضاء عن رغبتها في توظيف مبرمجين ومحللي بيانات.", 
        category: "وظائف", 
        date: "02 مايو 2026",
        image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80", // Office/Working
        content: `<p>يعرف قطاع التكنولوجيا في المغرب نمواً متسارعاً. الوظائف المطلوبة تشمل مطوري Full-Stack وخبراء الأمن السيبراني.</p>`
    },
    { 
        id: 4, 
        title: "أحدث أخبار التكنولوجيا: الذكاء الاصطناعي في 2026", 
        description: "كيف غيرت النماذج اللغوية الكبيرة طريقة عملنا اليومية؟ تقرير شامل حول مستقبل الذكاء الاصطناعي التوليدي.", 
        category: "تقنية", 
        date: "01 مايو 2026",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80" // AI/Tech
    },
    { 
        id: 5, 
        title: "دليل الحصول على رخصة السياقة بالمغرب", 
        description: "شرح كامل للمساطر الإدارية الجديدة والأسئلة الأكثر تكراراً في الامتحان النظري لرخصة السياقة صنف B.", 
        category: "أخبار", 
        date: "30 أبريل 2026",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" // Driving/Bus
    },
    { 
        id: 6, 
        title: "مستقبل التعليم الرقمي في العالم العربي", 
        description: "تقرير حول التحول نحو المنصات التعليمية الإلكترونية وتأثيرها على الأجيال القادمة.", 
        category: "أخبار", 
        date: "29 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" // News/Reading
    },
    { 
        id: 7, 
        title: "أفضل 10 تطبيقات للإنتاجية في 2026", 
        description: "مجموعة مختارة من الأدوات التي تساعدك على تنظيم وقتك ومهامك بذكاء.", 
        category: "تقنية", 
        date: "28 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80" // Mobile/App
    },
    { 
        id: 8, 
        title: "كيف تبدأ مشروعك الخاص برأس مال بسيط؟", 
        description: "خطوات عملية للشباب الراغبين في دخول عالم المقاولات الذاتية.", 
        category: "وظائف", 
        date: "27 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80" // Laptop/Work
    },
    { 
        id: 9, 
        title: "أخبار الرياضة العالمية: ميركاتو الصيف يشتعل", 
        description: "انتقالات كبرى متوقعة في الدوري الإنجليزي والإسباني.", 
        category: "رياضة", 
        date: "26 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" // Stadium/Sports
    },
    { 
        id: 10, 
        title: "تطورات سوق العملات الرقمية", 
        description: "هل لا يزال الاستثمار في البيتكوين آمناً؟ تحليل لخبراء ماليين.", 
        category: "تقنية", 
        date: "25 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80" // Crypto/Bitcoin
    },
    { 
        id: 11, 
        title: "دليل السفر إلى إسبانيا 2026", 
        description: "كل ما تحتاج معرفته عن تأشيرة 'شينغن' والمتطلبات الجديدة للسياح العرب.", 
        category: "الهجرة", 
        date: "24 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=800&q=80" // Spain/Travel
    },
    { 
        id: 12, 
        title: "نصائح لتطوير مهارات البرمجة", 
        description: "أفضل المصادر لتعلم جافا سكريبت وبايثون من الصفر.", 
        category: "تقنية", 
        date: "23 أبريل 2026", 
        image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80" // Code
    },
    
    // --- Category: الطبخ ---
    { 
        id: 13, 
        title: "أسرار تحضير الكسكس المغربي الأصيل", 
        description: "دليل خطوة بخطوة لتحضير طبق الكسكس بسبع خضار مع أسرار 'التفويرة' المغربية التقليدية.", 
        category: "الطبخ", 
        date: "05 مايو 2026",
        image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80", // Couscous/Food
        content: `<h3>طريقة التحضير التقليدية</h3><p>يعتبر الكسكس رمزاً للضيافة المغربية. السر يكمن في جودة السميد وطريقة طهيه على البخار ثلاث مرات متتالية مع إضافة السمن البلدي في المرحلة الأخيرة.</p>`
    },
    { 
        id: 14, 
        title: "حلويات العيد: طريقة عمل كعب الغزال", 
        description: "وصفة دقيقة لتحضير أرقى الحلويات المغربية بحشوة اللوز المنسمة بماء الزهر والمسكة الحرة.", 
        category: "الطبخ", 
        date: "06 مايو 2026",
        image: "https://images.unsplash.com/photo-1516685018646-527ad9501517?auto=format&fit=crop&w=800&q=80" // Sweets/Food
    },

    // --- Category: تعليم السياقة ---
    { 
        id: 15, 
        title: "دليل رخصة السياقة صنف A و B", 
        description: "كل ما يجب معرفته عن قواعد السير الجديدة والأسئلة الأكثر تكراراً في امتحان السياقة بالمغرب لعام 2026.", 
        category: "تعليم السياقة", 
        date: "07 مايو 2026",
        image: "https://images.unsplash.com/photo-1519003300449-424ad040507b?auto=format&fit=crop&w=800&q=80", // Driving/Car
        content: `<h3>قواعد الأسبقية وعلامات المرور</h3><p>يشمل الامتحان الجديد تركيزاً أكبر على السلامة الطرقية والقيادة الاقتصادية. تأكد من مراجعة علامات المنع والإجبار بدقة.</p>`
    },
    { 
        id: 16, 
        title: "رخص السياقة المهنية C و D: الشروط والمساطر", 
        description: "دليل المهنيين الراغبين في الحصول على رخصة سياقة الشاحنات والحافلات، مع تفاصيل الفحص الطبي الإجباري.", 
        category: "تعليم السياقة", 
        date: "08 مايو 2026",
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80" // Truck/Driving
    },

    // --- Additional News ---
    { 
        id: 17, 
        title: "توقعات حالة الطقس: موجة حر مرتقبة", 
        description: "مديرية الأرصاد الجوية تنذر بموجة حر ستشمل معظم مناطق المملكة ابتداءً من الأسبوع المقبل.", 
        category: "أخبار", 
        date: "09 مايو 2026",
        image: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80" // Sun/Weather
    },

    // --- New Category: الأفلام والمسلسلات ---
    { 
        id: 18, 
        title: "أفضل 5 مسلسلات عربية يجب مشاهدتها", 
        description: "قائمة مختارة لأقوى الإنتاجات الدرامية العربية التي حققت نسب مشاهدة قياسية وتصدرت 'التريند'.", 
        category: "الأفلام والمسلسلات", 
        date: "10 مايو 2026",
        image: "https://images.unsplash.com/photo-1593359674291-7424fe5a7330?auto=format&fit=crop&w=800&q=80", // Cinema/TV
        content: `<h3>الدراما العربية في أوج عطائها</h3><p>شهد هذا العام تنوعاً كبيراً في المواضيع المعالجة، من الدراما الاجتماعية إلى مسلسلات الغموض والإثارة التاريخية.</p>`
    },
    { 
        id: 19, 
        title: "مراجعة فيلم الخيال العلمي 'أمل جديد'", 
        description: "هل يستحق الفيلم الضجة المثارة حوله؟ تحليل لأداء الممثلين والمؤثرات البصرية التي أبهرت النقاد.", 
        category: "الأفلام والمسلسلات", 
        date: "11 مايو 2026",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80" // Film/Projector
    }
];

// ... (Categories and State unchanged)

// ...

function renderArticleList() {
    const data = getFilteredData();
    const start = (State.page - 1) * State.perPage;
    const end = start + State.perPage;
    const paginated = data.slice(start, end);

    if (paginated.length === 0) {
        El.dynamicArea.innerHTML = `
            <div style="text-align:center; padding: 50px;">
                <i class="fas fa-search" style="font-size:3rem; color:#cbd5e1; margin-bottom:15px;"></i>
                <h2>لا توجد نتائج</h2>
                <p>حاول البحث بكلمات أخرى أو تغيير التصنيف.</p>
            </div>
        `;
        El.pagination.innerHTML = '';
        return;
    }

    const html = `
        <div class="articles-grid">
            ${paginated.map(item => `
                <article class="card">
                    <div class="card-img-wrapper">
                        <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy">
                        <span class="card-badge">${item.category}</span>
                    </div>
                    <div class="card-body">
                        <h3>${item.title}</h3>
                        <div class="card-date"><i class="far fa-calendar-alt"></i> ${item.date}</div>
                        <p>${item.description}</p>
                        <div class="btn-link" style="cursor:pointer" onclick="viewArticle(${item.id})">
                            اقرأ المزيد <i class="fas fa-arrow-left"></i>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
    
    El.dynamicArea.innerHTML = html;
    renderPagination(data.length);
}

// ...

function viewArticle(id) {
    const item = DB.find(a => a.id === id);
    if (!item) return;

    State.view = 'article';
    El.hero.classList.add('hidden');
    El.pagination.innerHTML = '';
    
    El.dynamicArea.innerHTML = `
        <div class="detail-view">
            <img src="${item.image}" alt="${item.title}" class="detail-header-img">
            <div class="detail-body">
                <div class="back-link" onclick="navigate('home')">
                    <i class="fas fa-arrow-right"></i> العودة للرئيسية
                </div>
                <h2>${item.title}</h2>
                <div class="article-meta">
                    <span><i class="far fa-folder"></i> ${item.category}</span>
                    <span><i class="far fa-calendar-alt"></i> ${item.date}</span>
                </div>
                <div class="article-text">
                    ${item.content || \`<p>\${item.description}</p><p>المحتوى الكامل لهذا المقال سيتم توفيره قريباً. شكراً لمتابعتكم مدونة المعرفة.</p>\`}
                </div>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCategoryGrid() {
    const icons = { 
        'أخبار': 'fa-newspaper', 
        'الهجرة': 'fa-globe-africa', 
        'وظائف': 'fa-briefcase', 
        'رياضة': 'fa-futbol', 
        'تقنية': 'fa-laptop-code',
        'الطبخ': 'fa-utensils',
        'تعليم السياقة': 'fa-car',
        'الأفلام والمسلسلات': 'fa-film'
    };
    
    El.dynamicArea.innerHTML = `
        <div style="text-align:center; margin-bottom:40px;">
            <h2>تصفح حسب التصنيفات</h2>
            <p>اختر المجال الذي يهمك لاستكشاف أحدث المقالات</p>
        </div>
        <div class="cat-grid">
            ${Categories.filter(c => c !== 'الكل').map(cat => `
                <div class="cat-card" onclick="filterByCategory('${cat}')">
                    <i class="fas ${icons[cat] || 'fa-folder'}"></i>
                    <h3>${cat}</h3>
                    <p>${DB.filter(a => a.category === cat).length} مقال</p>
                </div>
            `).join('')}
        </div>
    `;
    El.pagination.innerHTML = '';
}

function renderStaticPage(type) {
    let content = '';
    if (type === 'about') {
        content = `
            <div class="detail-view" style="padding: 40px;">
                <h2 style="text-align:center; margin-bottom:30px;">من نحن</h2>
                <div class="article-text">
                    <p><strong>مدونة المعرفة</strong> هي وجهتكم الأولى للحصول على معلومات دقيقة وموثوقة حول أهم المواضيع التي تهم المواطن العربي.</p>
                    <p>نحن فريق من المحررين المتخصصين نسعى لتبسيط المعلومة وتقديمها بأسلوب عصري يواكب التطور التكنولوجي.</p>
                    <h3>أهدافنا:</h3>
                    <ul>
                        <li>توفير قاعدة بيانات شاملة لفرص الشغل.</li>
                        <li>شرح مساطر الهجرة والوثائق الإدارية.</li>
                        <li>تقديم تحليلات تقنية ورياضية موضوعية.</li>
                    </ul>
                </div>
            </div>
        `;
    } else if (type === 'contact') {
        content = `
            <div class="detail-view" style="padding: 40px;">
                <h2 style="text-align:center; margin-bottom:30px;">اتصل بنا</h2>
                <form id="contact-form" onsubmit="handleContact(event)" style="display:flex; flex-direction:column; gap:20px;">
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <label>الاسم الكامل</label>
                        <input type="text" required style="padding:12px; border:1px solid #ddd; border-radius:8px;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <label>البريد الإلكتروني</label>
                        <input type="email" required style="padding:12px; border:1px solid #ddd; border-radius:8px;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:8px;">
                        <label>الرسالة</label>
                        <textarea rows="5" required style="padding:12px; border:1px solid #ddd; border-radius:8px;"></textarea>
                    </div>
                    <button type="submit" style="padding:15px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;">إرسال الرسالة</button>
                </form>
            </div>
        `;
    }
    El.dynamicArea.innerHTML = content;
    El.pagination.innerHTML = '';
}

// --- Event Handlers ---

function setupGlobalListeners() {
    // Search
    El.search.addEventListener('input', debounce((e) => {
        State.search = e.target.value.trim();
        State.page = 1;
        State.view = 'home';
        router();
    }, 300));

    // Hamburger Menu
    El.hamburger.addEventListener('click', toggleMenu);

    // Nav Links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.closest('[data-page]').dataset.page;
            navigate(page);
        });
    });

    // Home Logo
    document.getElementById('home-logo').addEventListener('click', (e) => {
        e.preventDefault();
        State.category = 'الكل';
        State.search = '';
        El.search.value = '';
        navigate('home');
    });

    // Scroll Effects
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        El.progressBar.style.width = scrolled + "%";

        if (winScroll > 500) El.backToTop.style.display = 'flex';
        else El.backToTop.style.display = 'none';
    });

    El.backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function toggleMenu() {
    State.isMenuOpen = !State.isMenuOpen;
    El.hamburger.classList.toggle('open');
    El.navMenu.classList.toggle('active');
}

function closeMenu() {
    State.isMenuOpen = false;
    El.hamburger.classList.remove('open');
    El.navMenu.classList.remove('active');
}

function updateNavActiveState() {
    document.querySelectorAll('[data-page]').forEach(link => {
        if (link.dataset.page === State.view) link.classList.add('active');
        else link.classList.remove('active');
    });
}

function handleContact(e) {
    e.preventDefault();
    alert('شكراً لتواصلك معنا! سيتم الرد على رسالتك في أقرب وقت.');
    navigate('home');
}

// --- Utilities ---

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}
