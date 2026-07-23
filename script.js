const translations = {
    ua: {
        services: "Що я пропоную",
        brands: "Бренди",
        about: "Про мене",
        contacts: "Контакти",
        greeting: "Привіт, я Олег!",
        heroSubtitle: "Оптові постачання посуду"
    },
    ru: {
        services: "Что я предлагаю",
        brands: "Бренды",
        about: "Обо мне",
        contacts: "Контакты",
        greeting: "Привет, я Олег!",
        heroSubtitle: "Оптовые поставки посуды"
    }
};
// =======================================================
// БЛОК 1: РОЗУМНА ТЕМНА ТЕМА (ТАЙЛВІНД-READY)
// =======================================================
const themeButton = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

if (themeButton) {
    themeButton.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// =======================================================
// БЛОК 2: КНОПКА ВГОРУ (Back to Top)
// =======================================================
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =======================================================
// БЛОК 3: РОЗУМНЕ ПРИВІТАННЯ
// =======================================================
const greetingElement = document.getElementById('greeting-text');
if (greetingElement) {
    const currentHour = new Date().getHours();
    let greetingString = "Привіт, я Олег!";
    if (currentHour >= 5 && currentHour < 12) {
        greetingString = "Доброго ранку, я Олег! 🌅";
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingString = "Доброго дня, я Олег! ☀️";
    } else if (currentHour >= 18 && currentHour < 23) {
        greetingString = "Доброго вечора, я Олег! 🌌";
    } else {
        greetingString = "Доброї ночі, я Олег! 🌙";
    }
    greetingElement.textContent = greetingString;
}

// =======================================================
// БЛОК 4: АНІМАЦІЯ ПОЯВИ ПРИ СКРОЛІ
// =======================================================
const animElements = document.querySelectorAll('.scroll-anim');
if (animElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animElements.forEach(el => observer.observe(el));
}

// =======================================================
// БЛОК 5: МОДАЛЬНЕ ВІКНО (ПОПАП ДЛЯ ПОСЛУГ)
// =======================================================
const modal = document.getElementById('service-modal');
const serviceCards = document.querySelectorAll('.service-card');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');

if (modal && serviceCards.length > 0) {
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const h3Element = card.querySelector('h3');
            const pElement = card.querySelector('p');
            const cardTitle = h3Element ? h3Element.innerText : "Послуга";
            const cardText = pElement ? pElement.innerText : "";
            
            if (modalTitle && modalText) {
                modalTitle.innerText = cardTitle;
                modalText.innerText = cardText + " Ми пропонуємо індивідуальні умови співпраці, повний супровід та гарантію якості для кожного замовлення.";
            }
            modal.classList.add('active');
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// =======================================================
// БЛОК 6: ДИНАМІЧНИЙ КАТАЛОГ ТА ФІЛЬТР БРЕНДІВ (З ЖИВИМ ПОШУКОМ)
// =======================================================

let selectedBrandsList = []; // Наш оптовий кошик

// ТРЕКЕРИ СТАНУ: Запам'ятовуємо, що вибрав і що ввів користувач
let currentFilter = 'all';
let currentSearchQuery = '';
let simulatedTotal = 0;

const brandsData = [
    { name: "Luminarc", category: "glass", desc: "Французький бренд ударостійкого скла. Посуд Luminarc витримує різкі перепади температур, підходить для мікрохвильовок та посудомийних машин. Ідеальний вибір для щоденного використання та HoReCa." },
    { name: "Wilmax", category: "porcelain", desc: "Англійський преміальний білий порцеляновий посуд. Вироби Wilmax мають витончений дизайн, глазуроване покриття, стійкі до сколів та відмінно утримують тепло страв." },
    { name: "Bohemia", category: "glass", isNew: true, desc: "Легендарний чеський кришталь та богемське скло. Витончені келихи, фужери та вази, що славляться своєю ідеальною прозорістю, тонким дзвоном та розкішним огранюванням." },
    { name: "Lessner", category: "cookware", isPopular: true, desc: "Високоякісний кухонний посуд та кухонне приладдя з нержавіючої сталі. Каструлі, сковорідки та ножі Lessner — це ергономічність, довговічність та висока теплопровідність." },
    { name: "Vincent", category: "cookware", desc: "Практичний та доступний кухонний посуд для кожної оселі. Надійні матеріали, сучасний дизайн та оптимальне співвідношення ціни та якості для комфортного приготування їжі." },
    { name: "Milika", category: "glass", desc: "Сучасний бренд скляного посуду з яскравими дизайнерськими принтами. Салатники, чашки та тарілки Milika додадуть затишку та стильних акцентів будь-якому інтер'єру." }
];

const brandsGrid = document.getElementById('brands-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('brand-search'); // Наше нове поле пошуку

// ГОЛОВНА ФУНКЦІЯ РЕНДЕРУ (Враховує і фільтр кнопок, і пошуковий рядок)
function renderBrands() {
    if (!brandsGrid) return;
    brandsGrid.innerHTML = '';
    
    // Фільтруємо масив ОДНОЧАСНО за двома параметрами
    const filteredBrands = brandsData.filter(brand => {
const matchesCategory = 
    currentFilter === 'all' || 
    (currentFilter === 'new' && brand.isNew) || 
    (currentFilter === 'popular' && brand.isPopular) || 
    brand.category === currentFilter;
        const matchesSearch = brand.name.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    // Якщо нічого не знайдено — показуємо красиве скляне повідомлення
    if (filteredBrands.length === 0) {
        brandsGrid.innerHTML = `
            <div class="col-span-2 md:col-span-3 text-center py-8 text-gray-500 dark:text-zinc-400 font-medium bg-white/20 dark:bg-zinc-900/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-zinc-800/40">
                🛸 Бренду з назвою "${currentSearchQuery}" у цій категорії не знайдено.
            </div>
        `;
        return;
    }
    
    filteredBrands.forEach(brand => {
        const card = document.createElement('div');
        card.className = "cursor-pointer select-none group brand-card scroll-anim bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl shadow-sm";
        
        
            card.innerHTML = `
    ${brand.isNew ? '<span class="opacity-75 group-hover:opacity-100 transition-opacity duration-300 inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded mb-1 mr-1">Новинка</span>' : ''}
    ${brand.isPopular ? '<span class="opacity-75 group-hover:opacity-100 transition-opacity duration-300 inline-block bg-orange-400 text-orange-900 text-xs font-bold px-2 py-0.5 rounded mb-1">Популярно</span>' : ''}
            <p class="text-lg tracking-wide mt-2">${brand.name}</p>
            <button class="add-to-cart-btn mt-3 text-xs bg-blue-600 dark:bg-zinc-800 hover:bg-blue-700 dark:hover:bg-green-600 text-white dark:text-zinc-300 dark:hover:text-white px-4 py-2 rounded-xl transition-all duration-200 shadow-sm font-medium active:scale-95">
                + Додати до запиту
            </button>
        `;

            card.addEventListener('click', () => {
            const modal = document.getElementById('service-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalText = document.getElementById('modal-text');
            
            if (modal && modalTitle && modalText) { 
                modalTitle.innerText = `Бренд ${brand.name}`;
                modalText.innerText = brand.desc + " Ми пропонуємо найкращі оптові ціни на цей бренд, швидку логістику та повний пакет документів для вашого бізнесу на Волині.";
                modal.classList.add('active');
            }
        });
        
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleBrandInCart(brand.name, addToCartBtn);
        });
        
        if (selectedBrandsList.includes(brand.name)) {
            addToCartBtn.textContent = "✓ Додано";
            addToCartBtn.classList.remove('bg-blue-600', 'dark:bg-zinc-800');
            addToCartBtn.classList.add('bg-emerald-600', 'dark:bg-emerald-600');
        }
        
        brandsGrid.appendChild(card);
    });
}

function showCatalogSkeletons() {
    if (!brandsGrid) return;
    brandsGrid.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = "bg-white/20 dark:bg-zinc-900/20 backdrop-blur-md p-6 rounded-xl border border-white/20 dark:border-zinc-800/40 min-h-[80px] animate-pulse flex justify-center items-center shadow-inner";
        skeleton.innerHTML = `<div class="h-4 bg-gray-300/40 dark:bg-zinc-700/40 rounded-full w-28"></div>`;
        brandsGrid.appendChild(skeleton);
    }
}

// Події кліку на кнопки фільтрів
if (filterBtns.length > 0) {
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Оновлюємо поточний фільтр категорії
            currentFilter = button.getAttribute('data-filter');
            
            showCatalogSkeletons();
            setTimeout(() => { renderBrands(); }, 400);
        });
    });
}

// НОВА ПОДІЯ: Живе відстеження введення тексту в пошук
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        // Записуємо текст у наш трекер стану
        currentSearchQuery = e.target.value;
        
        // Оновлюємо картки миттєво (без скелетонів, щоб інтерфейс не блимав при друку)
        renderBrands();
    });
}

// Стартовий запуск
renderBrands();

// =======================================================
// БЛОК 7: ВІДПРАВКА ЗАЯВОК В TELEGRAM
// =======================================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('user-name').value;
        const contact = document.getElementById('user-contact').value;
        const brand = document.getElementById('user-brand').value;
        const message = document.getElementById('user-message').value;

        // Впиши сюди свої реальні дані Телеграму:
        const token = '8621731043:AAEY4KZi6ioCEDeG-aTfZBNOs2Q6cBaknTo'; 
        const chatId = '706355653';

        const cartContent = selectedBrandsList.length > 0 ? selectedBrandsList.join(', ') : 'Не вибрано (Загальний запит)';
        const text = `🔔 Нова заявка!\n\n👤 Ім'я: ${name}\n📞 Контакт: ${contact}\n📦 Обраний бренд: ${brand}\n🛒 Сет брендів з кошика: ${cartContent}\n💬 Повідомлення: ${message}`;

        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        })
        .then(response => {
            if (response.ok) {
                showPremiumToast("Запит успішно надіслано! На зв'язку! 👍");
                contactForm.reset(); 
                selectedBrandsList = [];
                const cartCountElement = document.getElementById('cart-count');
                if (cartCountElement) cartCountElement.textContent = '0';
                const floatingCart = document.getElementById('floating-cart');
                if (floatingCart) floatingCart.classList.add('translate-y-24', 'opacity-0');
                renderBrands('all');
            } else {
                alert('Ой, щось пішло не так. Спробуйте ще раз.');
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Помилка з\'єднання із сервером.');
        });
    });
}

// =======================================================
// БЛОК 8: КАСТОМНИЙ КУРСОР ТА МІКРОІНТЕРАКЦІЇ (ЧИСТИЙ КОД)
// =======================================================
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');

if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
        // Просто передаємо чисті координати мишки, без мінусів!
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });
}

// =======================================================
// БЛОК 10: ПРЕМІУМ ТОАСТ-СПОВІЩЕННЯ (TOAST)
// =======================================================
function showPremiumToast(textMessage) {
    const toastContainer = document.getElementById('premium-toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = "flex items-center gap-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-white/40 dark:border-zinc-800/60 px-6 py-4 rounded-2xl shadow-2xl transform translate-x-full opacity-0 transition-all duration-500 ease-out text-blue-950 dark:text-zinc-100 font-medium text-sm md:text-base";
    
    toast.innerHTML = `
        <span class="text-xl animate-pulse">🚀</span>
        <span>${textMessage}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 50);

    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => { toast.remove(); }, 500);
    }, 4000);
}

// =======================================================
// БЛОК 11: ЕФЕКТ ДРУКАРСЬКОЇ МАШИНКИ (TYPEWRITER EFFECT)
// =======================================================
const typewriterElement = document.getElementById('typewriter-text');
const phrases = [
    "Вивчаю HTML, CSS та Tailwind 💻",
    "Оптові постачання посуду 📊",
    "Прямий імпорт без посередників 💎",
    "Дистриб'юція по всій Волині ⚡"
];
let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    if (!typewriterElement) return;
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
        typingSpeed = 40;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
        typingSpeed = 90;
    }

    if (!isDeleting && characterIndex === currentPhrase.length) {
        typingSpeed = 2500;
        isDeleting = true;
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
    }
    setTimeout(typeEffect, typingSpeed);
}
typeEffect();

// =======================================================
// БЛОК 12: ІНТЕРАКТИВНИЙ FAQ (АКОРДЕОН)
// =======================================================
const faqToggles = document.querySelectorAll('.faq-toggle');
if (faqToggles.length > 0) {
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentItem = toggle.closest('.faq-item');
            const currentContent = currentItem.querySelector('.faq-content');
            const currentIcon = toggle.querySelector('.faq-icon');
            const isOpen = !currentContent.classList.contains('max-h-0');
            
            document.querySelectorAll('.faq-content').forEach(content => {
                content.classList.add('max-h-0', 'opacity-0');
                content.classList.remove('max-h-96', 'opacity-100');
            });
            document.querySelectorAll('.faq-icon').forEach(icon => {
                icon.textContent = '➕';
                icon.classList.remove('rotate-45');
            });

            if (!isOpen) {
                currentContent.classList.remove('max-h-0', 'opacity-0');
                currentContent.classList.add('max-h-96', 'opacity-100');
                currentIcon.textContent = '➖';
                currentIcon.classList.add('rotate-45'); 
            }
        });
    });
}

// =======================================================
// БЛОК 13: ПРЕМІАЛЬНА СКЛЯНА КАРУСЕЛЬ (SLIDER)
// =======================================================
const sliderSlides = document.querySelectorAll('.slide');
const sliderDots = document.querySelectorAll('.dot');
const prevSlideBtn = document.getElementById('prev-slide');
const nextSlideBtn = document.getElementById('next-slide');
let activeSlideIndex = 0;
let autoSlideTimer;

function updateSlider(targetIndex) {
    if (sliderSlides.length === 0) return;
    if (targetIndex >= sliderSlides.length) activeSlideIndex = 0;
    else if (targetIndex < 0) activeSlideIndex = sliderSlides.length - 1;
    else activeSlideIndex = targetIndex;

    sliderSlides.forEach((slide, i) => {
        if (i === activeSlideIndex) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    sliderDots.forEach((dot, i) => {
        if (i === activeSlideIndex) {
            dot.classList.remove('bg-white/40');
            dot.classList.add('bg-white', 'w-6');
        } else {
            dot.classList.remove('bg-white', 'w-6');
            dot.classList.add('bg-white/40');
        }
    });
}

// 🎠 Обробники кліків для стрілочок слайдера
if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex + 1);
    });
}

if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex - 1);
    });
}

// 🎠 Обробники кліків для стрілочок слайдера
if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex + 1);
    });
}

if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex - 1);
    });
}
// Функція для запуску автоматичного гортання
function startAutoSlide() {
    // Очищаємо старий таймер, якщо він раптом був запущений
    clearInterval(autoSlideTimer); 
    
    // Запускаємо новий таймер на 5000 мілісекунд (5 секунд)
    autoSlideTimer = setInterval(() => {
        updateSlider(activeSlideIndex + 1);
    }, 5000);
}

// Запускаємо автогортання відразу при завантаженні сторінки
startAutoSlide();

const brandCards = document.querySelectorAll('#brands .cursor-pointer, #brands .bg-white\\/30');
    brandCards.forEach(card => {
        card.addEventListener('click', () => {
            // 1. Оновлюємо прогрес-бар
            if (simulatedTotal < 5000) {
                updateWholesaleProgress(1250);
            }
            
            // 2. Силою знаходимо кошик, змиваємо клас hidden і додаємо flex (щоб він точно з'явився)
            const floatingCart = document.getElementById('floating-cart');
            if (floatingCart) {
                floatingCart.classList.remove('hidden');
                floatingCart.style.display = 'flex'; // залізобетонне відображення
            }
        });
    });


if (sliderDots.length > 0) {
    sliderDots[0].classList.add('w-6');
  //  startAutoCycle();
}
/*
// =======================================================
// БЛОК 14: ІНТЕРАКТИВНИЙ ОПТОВИЙ КОШИК
// =======================================================
const floatingCart = document.getElementById('floating-cart');
const cartCountElement = document.getElementById('cart-count');

function toggleBrandInCart(brandName, buttonElement) {
    const cartCountElement = document.getElementById('cart-count');
    const floatingCart = document.getElementById('floating-cart');

    // 🎯 Перевіряємо та використовуємо колекцію selectedBrands
    if (typeof selectedBrands === 'undefined' || !selectedBrands) {
        window.selectedBrands = new Set();
    }

    // Додаємо або видаляємо бренд із колекції Set
    let isAdded = false;
    if (selectedBrands.has(brandName)) {
        selectedBrands.delete(brandName);
    } else {
        selectedBrands.add(brandName);
        isAdded = true;
    }

    // 🎨 Міняємо вигляд кнопки
    if (buttonElement) {
        if (isAdded) {
            buttonElement.textContent = "✓ Додано";
            buttonElement.classList.remove('bg-blue-600', 'dark:bg-zinc-800');
            buttonElement.classList.add('bg-emerald-600', 'dark:bg-emerald-600');
        } else {
            buttonElement.textContent = "+ Додати до запиту";
            buttonElement.classList.remove('bg-emerald-600', 'dark:bg-emerald-600');
            buttonElement.classList.add('bg-blue-600', 'dark:bg-zinc-800');
        }
    }

    // 💬 Показуємо фірмове сповіщення
    if (typeof showPremiumToast === "function") {
        showPremiumToast(isAdded ? `Бренд ${brandName} додано до вашого запиту! 🛒` : `Бренд ${brandName} видалено із запиту.`);
    }

    // 🔢 Рахуємо кількість брендів
    const currentCount = selectedBrands.size;

    // 🛒 Оновлюємо цифру на кошику
    if (cartCountElement) {
        cartCountElement.textContent = currentCount;
    }

    // 📈 Рухаємо прогрес-бар гурту (1 бренд = 1500 грн)
    if (typeof updateWholesaleProgressFromCart === 'function') {
        updateWholesaleProgressFromCart(currentCount * 1500);
    }

    // 📦 Керуємо видимістю кошика через display
if (floatingCart) {
    if (currentCount > 0) {
        // Якщо бренди є — вмикаємо режим flex
        floatingCart.style.display = 'flex';
    } else {
        // Якщо кошик порожній — повністю ховаємо
        floatingCart.style.display = 'none';
    }
}
}
*/
// =======================================================
// БЛОК 15: НЕОНОВИЙ ТРЕКЕР СКРОЛУ (PROGRESS BAR)
// =======================================================
const progressBar = document.getElementById('scroll-progress');

if (progressBar) {
    window.addEventListener('scroll', () => {
        // Рахуємо, скільки всього пікселів можна прокрутити на сайті
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (totalScrollableHeight > 0) {
            // Вираховуємо відсоток поточного скролу від 0 до 100
            const scrolledPercentage = (window.scrollY / totalScrollableHeight) * 100;
            
            // Змінюємо ширину лінії в CSS
            progressBar.style.width = scrolledPercentage + '%';
        }
    });
}

// =======================================================
// БЛОК 16: СКЛЯНИЙ ПЛАВАЮЧИЙ ВІДЖЕТ ЗВ'ЯЗКУ (MULTI-FAB)
// =======================================================
const fabMain = document.getElementById('fab-main');
const fabOptions = document.getElementById('fab-options');
const fabIcon = document.getElementById('fab-icon');

if (fabMain && fabOptions && fabIcon) {
    fabMain.addEventListener('click', () => {
        // Перевіряємо, чи відкритий віджет зараз
        const isOpen = fabOptions.classList.contains('opacity-100');

        if (!isOpen) {
            // ЕФЕКТНЕ ВІДКРИТТЯ: прибираємо прозорість, піднімаємо вгору та збільшуємо до 100%
            fabOptions.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none', 'scale-75');
            fabOptions.classList.add('translate-y-0', 'opacity-100', 'scale-100');
            
            // Міняємо іконку на хрестик та закручуємо її на 90 градусів
            fabIcon.textContent = '❌';
            fabIcon.style.transform = 'rotate(90deg)';
        } else {
            // ЕФЕКТНЕ ЗГОРТАННЯ: повертаємо в початковий схований стан
            fabOptions.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
            fabOptions.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none', 'scale-75');
            
            // Повертаємо назад хмаринку зв'язку
            fabIcon.textContent = '💬';
            fabIcon.style.transform = 'rotate(0deg)';
        }
    });

    // РОЗУМНЕ ЗАКРИТТЯ: якщо клікнули повз віджет — ховаємо кнопки назад
    document.addEventListener('click', (event) => {
        if (!fabMain.contains(event.target) && !fabOptions.contains(event.target)) {
            fabOptions.classList.remove('translate-y-0', 'opacity-100', 'scale-100');
            fabOptions.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none', 'scale-75');
            fabIcon.textContent = '💬';
            fabIcon.style.transform = 'rotate(0deg)';
        }
    });
}

// =======================================================
// БЛОК 17: МАГІЧНІ ЦИФРИ БІЗНЕСУ (ANIMATED COUNTERS)
// =======================================================
const businessCounters = document.querySelectorAll('.counter-num');

if (businessCounters.length > 0) {
    // Створюємо робота-спостерігача за екраном
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Якщо блок заїхав в поле зору користувача хоча б на половину
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.getAttribute('data-target'), 10);
                
                let currentValue = 0;
                const duration = 1500; // Час крутіння в мілісекундах (1.5 секунди)
                const frameRate = 1000 / 60; // 60 кадрів на секунду для ідеальної плавності
                const totalSteps = duration / frameRate;
                const increment = targetValue / totalSteps; // Розумний крок збільшення
                
                const animateScrollNumber = () => {
                    currentValue += increment;
                    
                    if (currentValue < targetValue) {
                        counterElement.textContent = Math.ceil(currentValue);
                        setTimeout(animateScrollNumber, frameRate);
                    } else {
                        counterElement.textContent = targetValue; // Фіксуємо точне фінальне число
                    }
                };
                
                animateScrollNumber(); // Запускаємо магію крутіння
                observer.unobserve(counterElement); // Кажемо роботу більше не стежити, щоб не крутити вдруге
            }
        });
    }, { threshold: 0.4 }); // Спрацьовує, коли видно 40% плашки

    // Вішаємо робота на кожну цифру
    businessCounters.forEach(counter => counterObserver.observe(counter));
}

// =======================================================
// БЛОК 18: СКЛЯНА КАРУСЕЛЬ ВІДГУКІВ (TESTIMONIALS SLIDER)
// =======================================================
const reviewSlides = document.querySelectorAll('.review-slide');
const reviewDots = document.querySelectorAll('.review-dot');
const prevReviewBtn = document.getElementById('prev-review');
const nextReviewBtn = document.getElementById('next-review');

let activeReviewIndex = 0;

function updateReviewSlider(targetIndex) {
    if (reviewSlides.length === 0) return;

    // Циклічність гортання
    if (targetIndex >= reviewSlides.length) activeReviewIndex = 0;
    else if (targetIndex < 0) activeReviewIndex = reviewSlides.length - 1;
    else activeReviewIndex = targetIndex;

    // 1. Перемикаємо видимість слайдів-відгуків
    reviewSlides.forEach((slide, i) => {
        if (i === activeReviewIndex) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    // 2. Керуємо активністю крапочок (активна стає довгою овальною)
    reviewDots.forEach((dot, i) => {
        if (i === activeReviewIndex) {
            dot.classList.remove('bg-blue-900/30', 'dark:bg-white/20');
            dot.classList.add('bg-blue-600', 'dark:bg-green-500', 'w-5'); // Розтягуємо активну крапку
        } else {
            dot.classList.remove('bg-blue-600', 'dark:bg-green-500', 'w-5');
            dot.classList.add('bg-blue-900/30', 'dark:bg-white/20');
        }
    });
}

// Події кліку на стрілочки відгуків
if (nextReviewBtn) {
    nextReviewBtn.addEventListener('click', () => {
        updateReviewSlider(activeReviewIndex + 1);
    });
}

if (prevReviewBtn) {
    prevReviewBtn.addEventListener('click', () => {
        updateReviewSlider(activeReviewIndex - 1);
    });
}

// Події кліку на самі крапочки відгуків
reviewDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateReviewSlider(index);
    });
});

// Ініціалізація першої крапочки відгуків при старті
if (reviewDots.length > 0) {
    reviewDots[0].classList.add('bg-blue-600', 'dark:bg-green-500', 'w-5');
}

// =======================================================
// БЛОК 19: РОЗУМНИЙ ЛІД-МАГНІТ (ЗАВАНТАЖЕННЯ ПРАЙСУ З ОБРОБКОЮ ЛІДІВ)
// =======================================================
const openPriceBtn = document.getElementById('open-price-btn');
const priceModal = document.getElementById('price-modal');
const closePriceBtn = document.getElementById('close-price-modal');
const priceForm = document.getElementById('price-form');
const priceModalBody = document.getElementById('price-modal-body');

if (openPriceBtn && priceModal && priceModalBody) {
    openPriceBtn.addEventListener('click', () => {
        priceModal.classList.remove('opacity-0', 'pointer-events-none');
        priceModalBody.classList.remove('scale-90');
        priceModalBody.classList.add('scale-100');
    });

    if (closePriceBtn) {
        closePriceBtn.addEventListener('click', () => {
            priceModal.classList.add('opacity-0', 'pointer-events-none');
            priceModalBody.classList.remove('scale-100');
            priceModalBody.classList.add('scale-90');
        });
    }

    priceModal.addEventListener('click', (e) => {
        if (e.target === priceModal) {
            priceModal.classList.add('opacity-0', 'pointer-events-none');
            priceModalBody.classList.remove('scale-100');
            priceModalBody.classList.add('scale-90');
        }
    });
}

if (priceForm) {
    priceForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const clientName = document.getElementById('price-name').value;
        const clientPhone = document.getElementById('price-phone').value;

        // ⚠️ ВПИШИ СВОЇ ДАНІ ТЕЛЕГРАМУ СТРОГО ВСЕРЕДИНУ ОДИНАРНИХ ЛАПОК:
        const token = '5739345242:AAEYH_YourActualTokenHere'; 
        const chatId = '540321234';

        const text = `🔥 ГАРИЧИЙ ЛІД! Клієнт завантажує прайс!\n\n👤 Ім'я/Компанія: ${clientName}\n📞 Телефон: ${clientPhone}`;

        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: text })
        })
        .then(response => {
            // ⚠️ ВСТАВ СВОЄ ПОСИЛАННЯ НА GOOGLE ДИСК СТРОГО МІЖ ОДИНАРНИМИ ЛАПКАМИ:
            window.open('https://drive.google.com/drive/folders/1EVfvymVDZPVoTHhTu2lDQn1AkgbrJJ9t', '_blank');
            
            if (updateProductsModalBody) {
                priceModal.classList.add('opacity-0', 'pointer-events-none');
                priceModalBody.classList.remove('scale-100');
                priceModalBody.classList.add('scale-90');
            }
            priceForm.reset();

            if (typeof showPremiumToast === 'function') {
                showPremiumToast("Прайс-лист успішно відкрито! 📊");
            }
        })
        .catch(error => {
            console.error('Помилка відправки ліда:', error);
            // ⚠️ СЮДИ ТЕЖ ДУБЛЮЄШ СВОЄ ПОСИЛАННЯ НА ТАБЛИЦЮ (ТЕЖ ВСЕРЕДИНІ ЛАПОК):
            window.open('https://drive.google.com/drive/folders/1EVfvymVDZPVoTHhTu2lDQn1AkgbrJJ9t', '_blank');
        });
    });
}

// =======================================================
// БЛОК 20: ІНТЕРАКТИВНИЙ ГРАФІК ЛОГІСТИКИ ПО ВОЛИНІ
// =======================================================
const cityButtons = document.querySelectorAll('.city-btn');
const logisticContent = document.getElementById('logistic-content');
const logisticCityTitle = document.getElementById('logistic-city-title');

// База даних логістики для міст Волині
const logisticsData = {
    lutsk: {
        title: "Луцьк & передмістя",
        days: "Понеділок – Субота",
        time: "З 09:00 до 18:00 (узгоджується індивідуально)",
        conditions: "Безкоштовна доставка прямо до дверей вашого магазину, складу чи закладу HoReCa при замовленні від 1500 грн."
    },
    kovel: {
        title: "Ковель (та напрямок Рожище)",
        days: "Вівторок та Четвер",
        time: "З 11:00 до 15:00 регулярний рейс",
        conditions: "Безкоштовна підвезення товару для постійних партнерів. Мінімальна сума міксованого замовлення брендів — 3000 грн."
    },
    volodymyr: {
        title: "Володимир (напрямок Торчин)",
        days: "Середа та П'ятниця",
        time: "З 10:30 до 14:30 регулярний рейс",
        conditions: "Доставка до дверей торгових точок. При замовленні від 3500 грн — доставка за наш рахунок."
    },
    novovolynsk: {
        title: "Нововолинськ (та Іваничі)",
        days: "Середа та П'ятниця",
        time: "З 13:00 до 17:00 регулярний рейс",
        conditions: "Формуємо замовлення під клієнта напередодні. Безкоштовна логістика при гуртових сетах від 4000 грн."
    }
};

if (cityButtons.length > 0 && logisticContent && logisticCityTitle) {
    cityButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Якщо кнопка вже активна — нічого не робимо
            if (button.classList.contains('active')) return;

            // Змінюємо активний стиль кнопок міст
            cityButtons.forEach(btn => {
                btn.classList.remove('active');
                // Повертаємо сірий бейдж неактивним містам
                const badge = btn.querySelector('span:last-child');
                if (badge && btn.getAttribute('data-city') !== 'lutsk') {
                    badge.classList.remove('bg-blue-600', 'dark:bg-green-600');
                    badge.classList.add('bg-gray-400', 'dark:bg-zinc-700');
                }
            });
            
            button.classList.add('active');
            // Робимо бейдж активного міста кольоровим
            const activeBadge = button.querySelector('span:last-child');
            if (activeBadge) {
                activeBadge.classList.remove('bg-gray-400', 'dark:bg-zinc-700');
                activeBadge.classList.add('bg-blue-600', 'dark:bg-green-600');
            }

            const cityKey = button.getAttribute('data-city');
            const data = logisticsData[cityKey];

            if (data) {
                // ЕФЕКТ ПЛАВНОЇ ЗМІНИ ТЕКСТУ (Fade-out)
                logisticContent.classList.remove('opacity-100');
                logisticContent.classList.add('opacity-0');

                setTimeout(() => {
                    // Оновлюємо вміст табло новими даними Волині
                    logisticContent.innerHTML = `
                        <div class="flex items-center gap-3 border-b border-gray-200 dark:border-zinc-800 pb-4 mb-4">
                            <span class="text-3xl">🚚</span>
                            <div>
                                <h3 class="text-xl font-black text-blue-950 dark:text-white" id="logistic-city-title">${data.title}</h3>
                                <p class="text-xs text-gray-500 dark:text-zinc-400">Власна кур'єрська служба доставки</p>
                            </div>
                        </div>
                        
                        <ul class="space-y-3 text-sm text-gray-700 dark:text-zinc-300 font-medium">
                            <li class="flex items-center gap-2">🗓️ <span class="font-bold text-blue-900 dark:text-green-500">Дні доставки:</span> ${data.days}</li>
                            <li class="flex items-center gap-2">⏰ <span class="font-bold text-blue-900 dark:text-green-500">Час прибуття:</span> ${data.time}</li>
                            <li class="flex items-center gap-2">📦 <span class="font-bold text-blue-900 dark:text-green-500">Умови:</span> ${data.conditions}</li>
                        </ul>
                    `;

                    // Повертаємо видимість (Fade-in)
                    logisticContent.classList.remove('opacity-0');
                    logisticContent.classList.add('opacity-100');
                }, 300); // 300 мілісекунд на красиву анімацію
            }
        });
    });
}

// =======================================================
// БЛОК 21: РОЗУМНЕ «ЖИВЕ» МЕНЮ (SMART STICKY HEADER)
// =======================================================
let lastScrollTop = 0;
const mainHeader = document.getElementById('main-header');

if (mainHeader) {
    window.addEventListener('scroll', () => {
        // Отримуємо поточну позицію скролу
        let currentScroll = window.scrollY || document.documentElement.scrollTop;
        
        // Якщо прокрутили нижче ніж на 80 пікселів (висота меню)
        if (currentScroll > 80) {
            if (currentScroll > lastScrollTop) {
                // Скролимо вниз — ховаємо меню, зміщуючи його вгору на 100%
                mainHeader.classList.add('-translate-y-full');
            } else {
                // Скролимо вгору — миттєво повертаємо меню на екран
                mainHeader.classList.remove('-translate-y-full');
            }
        } else {
            // Якщо ми на самому верху сторінки — меню завжди на місці
            mainHeader.classList.remove('-translate-y-full');
        }
        
        // Запам'ятовуємо поточний скрол для наступного кроку
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// =======================================================
// БЛОК 22: РОЗУМНИЙ «ЖИВИЙ» ПОШУК ПО БРЕНДАХ (РЯТУВАЛЬНИЙ)
// =======================================================
const brandSearchInput = document.getElementById('brand-search-input');
const searchResultsDropdown = document.getElementById('search-results-dropdown');

// База даних брендів (тепер без індивідуальних id, летимо на загальний блок!)
const totalBrands = [
    { name: "Luminarc", desc: "Французьке загартоване скло та тарілки" },
    { name: "Wilmax", desc: "Англійська біла порцеляна преміум якості" },
    { name: "Bohemia", desc: "Чеський елітний кришталь та келихи" },
    { name: "Lessner", desc: "Ергономічний кухонний посуд та прибори" },
    { name: "Vincent", desc: "Практичний та надійний посуд на кожен день" },
    { name: "Milika", desc: "Яскравий дизайнерський кольоровий посуд" }
];

if (brandSearchInput && searchResultsDropdown) {
    brandSearchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        searchResultsDropdown.innerHTML = '';

        if (query.length === 0) {
            searchResultsDropdown.classList.add('hidden');
            return;
        }

        const matchedBrands = totalBrands.filter(b => b.name.toLowerCase().includes(query));

        if (matchedBrands.length > 0) {
            matchedBrands.forEach(brand => {
                const row = document.createElement('div');
                row.className = "px-4 py-3 hover:bg-blue-50 dark:hover:bg-zinc-800/60 cursor-pointer text-sm transition-colors border-b border-gray-100 dark:border-zinc-800/40 last:border-b-0 flex justify-between items-center";
                row.innerHTML = `
                    <div>
                        <span class="font-bold text-blue-950 dark:text-white">${brand.name}</span>
                        <span class="text-xs text-gray-500 dark:text-zinc-400 block">${brand.desc}</span>
                    </div>
                    <span class="text-xs text-blue-600 dark:text-green-500 font-bold">Перейти ➔</span>
                `;

                // Клік переносить на загальну секцію брендів, яка у тебе вже точно є!
                row.addEventListener('click', () => {
                    const targetElement = document.getElementById('brands');
                    if (targetElement) {
                        const yOffset = -90; // Відступ під наше гарне меню
                        const yPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        
                        window.scrollTo({ top: yPosition, behavior: 'smooth' });
                    }
                    brandSearchInput.value = '';
                    searchResultsDropdown.classList.add('hidden');
                });

                searchResultsDropdown.appendChild(row);
            });
            searchResultsDropdown.classList.remove('hidden');
        } else {
            const noResultRow = document.createElement('div');
            noResultRow.className = "px-4 py-4 text-xs text-gray-500 dark:text-zinc-400 text-center font-medium";
            noResultRow.innerText = "Такого бренду немає в наявності на складі 🔍";
            searchResultsDropdown.appendChild(noResultRow);
            searchResultsDropdown.classList.remove('hidden');
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target !== brandSearchInput && e.target !== searchResultsDropdown) {
            searchResultsDropdown.classList.add('hidden');
        }
    });
}

// =======================================================
// БЛОК 23: ОНОВЛЕНИЙ ПРОГРЕС-БАР ГУРТОВОГО ЗАМОВЛЕННЯ
// =======================================================
function updateWholesaleProgressFromCart(totalMoney) {
    const minWholesaleLimit = 5000; 
    
    const progressBar = document.getElementById('wholesale-progress-bar');
    const statusText = document.getElementById('wholesale-status-text');
    const percentText = document.getElementById('wholesale-percent');

    if (!progressBar || !statusText || !percentText) return;

    let percent = Math.min((totalMoney / minWholesaleLimit) * 100, 100);
    percent = Math.round(percent);

    progressBar.style.width = `${percent}%`;
    percentText.innerText = `${percent}%`;

    if (totalMoney === 0) {
        statusText.innerHTML = `Мінімум для безкоштовної доставки: <span class="font-black">${minWholesaleLimit} грн</span>`;
    } else if (totalMoney < minWholesaleLimit) {
        const remaining = minWholesaleLimit - totalMoney;
        statusText.innerHTML = `До гуртової доставки залишилось: <span class="font-bold text-orange-600 dark:text-amber-400">${remaining} грн</span>`;
    } else {
        progressBar.className = "h-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-all duration-700 animate-pulse rounded-full";
        statusText.innerHTML = `🎉 <span class="text-green-600 dark:text-green-400 font-black">Гуртовий ліміт набрано! Доставка по Волині безкоштовна!</span>`;
    }
}

// Ініціалізація початкового стану при завантаженні сторінки всередині спільного DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    if (typeof updateWholesaleProgressFromCart === 'function') {
        updateWholesaleProgressFromCart(0);
    }
});

// =======================================================
// БЛОК 24: РОЗУМНИЙ НЕОНОВИЙ ІНДИКАТОР РОБОЧОГО ЧАСУ
// =======================================================
function initWorkStatus() {
    const statusContainer = document.getElementById('work-status');
    if (!statusContainer) return;

    const now = new Date();
    const currentHour = now.getHours(); // Отримуємо поточну годину (0-23)

    // Графік роботи: з 9 ранку до 18 вечора
    const isWorkingHours = currentHour >= 9 && currentHour < 18;

    if (isWorkingHours) {
        // Зелений неоновий статус для робочого часу
        statusContainer.innerHTML = `
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-ping absolute"></span>
            <span class="relative inline-block w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
            <span class="text-green-600 dark:text-green-400 font-bold">Зараз працюємо. Склад у Луцьку відвантажує замовлення!</span>
        `;
    } else {
        // Помаранчевий/сірий статус для неробочого часу
        statusContainer.innerHTML = `
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]"></span>
            <span class="text-gray-500 dark:text-zinc-400 font-medium">Приймаємо замовлення 24/7. Оформимо завтра з 09:00!</span>
        `;
    }
}

// Запускаємо перевірку часу відразу при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
    initWorkStatus();
});

// Знаходимо кнопки перемикання мов
const langUaBtn = document.getElementById('lang-ua');
const langRuBtn = document.getElementById('lang-ru');

// Знаходимо елементи меню
const navServices = document.getElementById('nav-services');
const navBrands = document.getElementById('nav-brands');
const navAbout = document.getElementById('nav-about');
const navContacts = document.getElementById('nav-contacts');
const greetingText = document.getElementById('greeting-text');
const heroSubtitle = document.getElementById('hero-subtitle'); // Додай цей рядок на 1115

// Функція зміни мови
function changeLanguage(lang) {
    // Оновлюємо тексти в меню
    navServices.textContent = translations[lang].services;
    navBrands.textContent = translations[lang].brands;
    navAbout.textContent = translations[lang].about;
    navContacts.textContent = translations[lang].contacts;
    greetingText.textContent = translations[lang].greeting;
    heroSubtitle.textContent = translations[lang].heroSubtitle;
}

// Вішаємо слухачі подій на кнопки
langUaBtn.addEventListener('click', () => changeLanguage('ua'));
langRuBtn.addEventListener('click', () => changeLanguage('ru'));

// Функція для завантаження та відображення товарів 📦
function loadProducts() {
  fetch('products.json')
    .then(response => response.json())
    .then(products => {
      const container = document.getElementById('products-container');
      container.innerHTML = '';

      products.forEach(product => {
        const productCard = `
          <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-md flex flex-col justify-between">
            <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-cover rounded-lg mb-4">
            <div>
              <span class="text-xs text-blue-600 dark:text-green-400 font-semibold">${product.category}</span>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-1">${product.title}</h3>
              <p class="text-xl font-extrabold text-gray-800 dark:text-gray-200 mt-2">${product.price}</p>
            </div>
            <button onclick="addToCart('${product.title}')" class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Замовити 🛒
            </button>
          </div>
        `;
        container.innerHTML += productCard;
      });
    })
    .catch(error => console.error('Помилка завантаження товарів:', error));
}

// Викликаємо функцію 🚀
loadProducts();

// Масив для збереження обраних товарів 🛍️
let cart = [];
const phoneNumber = "380500149104"; // Твій номер без знака + для посилання

// Функція оновлення вигляду кошика 🔄
function updateCartUI() {
    const cartBar = document.getElementById('cart-bar');
    const cartCount = document.getElementById('cart-count');
    
    if (cart.length > 0) {
        cartBar.classList.remove('hidden');
        cartCount.textContent = cart.length;
    } else {
        cartBar.classList.add('hidden');
    }
}

// Функція додавання товару в кошик ➕
function addToCart(title) {
    cart.push(title);
    updateCartUI();
}

// Знаходимо елементи модального вікна 🪟
const messengerModal = document.getElementById('messenger-modal');
const closeModalBtn = document.getElementById('close-modal-btn');

// Показуємо вікно при натисканні на "Оформити замовлення" 🛒
document.getElementById('send-order-btn')?.addEventListener('click', () => {
    if (cart.length === 0) return;
    messengerModal.classList.remove('hidden');
});

// Закриття вікна ❌
closeModalBtn?.addEventListener('click', () => {
    messengerModal.classList.add('hidden');
});

// ... далі функція getOrderText() залишається без змін ...

// У кнопках месенджерів також міняємо modal на messengerModal:
document.getElementById('btn-whatsapp')?.addEventListener('click', () => {
    const text = getOrderText();
    window.open(`https://wa.me/380500149104?text=${text}`, '_blank');
    messengerModal.classList.add('hidden');
});

document.getElementById('btn-telegram')?.addEventListener('click', () => {
    const text = getOrderText();
    window.open(`https://t.me/share/url?url=&text=${text}`, '_blank');
    messengerModal.classList.add('hidden');
});

document.getElementById('btn-viber')?.addEventListener('click', () => {
    const text = getOrderText();
    window.open(`viber://forward?text=${text}`, '_blank');
    messengerModal.classList.add('hidden');
});