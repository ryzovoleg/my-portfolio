// =======================================================
// БЛОК 1: РОЗУМНА ТЕМНА ТЕМА (ТАЙЛВІНД-READY)
// =======================================================
const themeButton = document.getElementById('theme-toggle');

// Перевірка теми при завантаженні сторінки
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Логіка кліку на кнопку місяця/сонця
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
// БЛОК 5: МОДАЛЬНЕ ВІКНО (ПОПАП)
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
// БЛОК 6: ДИНАМІЧНИЙ КАТАЛОГ ТА ФІЛЬТР БРЕНДІВ
// =======================================================

// КРИТИЧНИЙ ФІКС: Оголошуємо кошик НА САМОМУ ПОЧАТКУ, щоб браузер знав це слово!
let selectedBrandsList = []; 

const brandsData = [
    { 
        name: "Luminarc", 
        category: "glass", 
        desc: "Французький бренд ударостійкого скла. Посуд Luminarc витримує різкі перепади температур, підходить для мікрохвильовок та посудомийних машин. Ідеальний вибір для щоденного використання та HoReCa." 
    },
    { 
        name: "Wilmax", 
        category: "porcelain", 
        desc: "Англійський преміальний білий порцеляновий посуд. Вироби Wilmax мають витончений дизайн, глазуроване покриття, стійкі до сколів та відмінно утримують тепло страв." 
    },
    { 
        name: "Bohemia", 
        category: "glass", 
        desc: "Легендарний чеський кришталь та богемське скло. Витончені келихи, фужери та вази, що славляться своєю ідеальною прозорістю, тонким дзвоном та розкішним огранюванням." 
    },
    { 
        name: "Lessner", 
        category: "cookware", 
        desc: "Високоякісний кухонний посуд та кухонне приладдя з нержавіючої сталі. Каструлі, сковорідки та ножі Lessner — це ергономічність, довговічність та висока теплопровідність." 
    },
    { 
        name: "Vincent", 
        category: "cookware", 
        desc: "Практичний та доступний кухонний посуд для кожної оселі. Надійні матеріали, сучасний дизайн та оптимальне співвідношення ціни та якості для комфортного приготування їжі." 
    },
    { 
        name: "Milika", 
        category: "glass", 
        desc: "Сучасний бренд скляного посуду з яскравими дизайнерськими принтами. Салатники, чашки та тарілки Milika додадуть затишку та стильних акцентів будь-якому інтер'єру." 
    }
];

const brandsGrid = document.getElementById('brands-grid');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderBrands(filterValue = 'all') {
    if (!brandsGrid) return;
    
    brandsGrid.innerHTML = '';
    
    const filteredBrands = brandsData.filter(brand => {
        return filterValue === 'all' || brand.category === filterValue;
    });
    
    filteredBrands.forEach(brand => {
        const card = document.createElement('div');
        card.className = "brand-card scroll-anim bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/40 dark:border-zinc-800/60 text-center flex flex-col justify-between items-center font-bold text-blue-900 dark:text-zinc-200 min-h-[120px] transition-all duration-300 transform hover:scale-105 hover:shadow-md cursor-pointer";
        
        card.innerHTML = `
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

if (filterBtns.length > 0) {
    filterBtns.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) return;
            filterBtns.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            showCatalogSkeletons();
            setTimeout(() => { renderBrands(filterValue); }, 400);
        });
    });
}
renderBrands('all');
// =======================================================
// БЛОК 7: ВІДПРАВКА ЗАЯВОК В TELEGRAM
// =======================================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        // Зупиняємо стандартне перезавантаження сторінки
        event.preventDefault();

        // ОСОБЛИВЕ МІСЦЕ: Заміни цей текст всередині лапок на свої дані з Телеграму
        const TELEGRAM_TOKEN = '8621731043:AAEY4KZi6ioCEDeG-aTfZBNOs2Q6cBaknTo';
        const TELEGRAM_CHAT_ID = '706355653';

        // Збираємо текст із полів форми
        const name = document.getElementById('user-name').value;
        const contact = document.getElementById('user-contact').value;
        const message = document.getElementById('user-message').value;

        // Формуємо повідомлення
       // Знайди у Блоці 7 рядок const text і заміни його на цей варіант:
const cartContent = selectedBrandsList.length > 0 ? selectedBrandsList.join(', ') : 'Не вибрано (Загальний запит)';

const text = `🔔 Нова заявка!\n\n👤 Ім'я: ${name}\n📞 Контакт: ${contact}\n🛒 Сет брендів: ${cartContent}\n💬 Повідомлення: ${message}`;

        // Відправляємо дані на сервери Telegram
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: textMessage
            })
        })
.then(response => {
            if (response.ok) {
                showPremiumToast("Запит успішно надіслано! На зв'язку! 👍");
                contactForm.reset(); 
            } else {
                alert('Ой, щось пішло не так. Спробуйте ще раз.');
            }
        })
        .catch(error => {
            console.error('Помилка:', error);
            alert('Помилка з\'єднання із сервером.');
        });
    }); // Закриває contactForm.addEventListener
} // <-- ОЦЯ ОДНА САМОТНЯ ДУЖКА! Вона закриває "if (contactForm) {" і прибирає помилку внизу файлу!


// =======================================================
// БЛОК 8: КАСТОМНИЙ КУРСОР ТА МІКРОІНТЕРАКЦІЇ
// =======================================================
const cursor = document.getElementById('custom-cursor');
const cursorDot = document.getElementById('custom-cursor-dot');

if (cursor && cursorDot) {
    // Змушуємо кола бігати за координатами мишки
    document.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Знаходимо всі інтерактивні елементи на сайті
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .brand-card, input, textarea, .filter-btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '48px';
            cursor.style.height = '48px';
            if (document.documentElement.classList.contains('dark')) {
                cursor.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
            } else {
                cursor.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
            }
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '32px';
            cursor.style.height = '32px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// =======================================================
// БЛОК 9: РОЗУМНИЙ ПЕРЕМИКАЧ ТЕМ (LIGHT / DARK LOGIC)
// =======================================================
const themeToggleBtn = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
} else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
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
// БЛОК 10: ПРЕМІУМ-СПОВІЩЕННЯ (TOAST NOTIFICATIONS)
// =======================================================
function showPremiumToast(message) {
    const toast = document.createElement('div');
    
    toast.className = "fixed top-24 right-5 z-[100000] flex items-center gap-3 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-white/40 dark:border-zinc-800/60 px-6 py-4 rounded-2xl shadow-2xl transform translate-x-[150%] transition-all duration-500 opacity-0 max-w-sm font-bold text-gray-800 dark:text-zinc-200 pointer-events-auto";
    
    toast.innerHTML = `
        <span class="text-2xl text-emerald-500 animate-pulse">🚀</span>
        <div class="text-sm tracking-wide">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-[150%]', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 50);
    
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-[150%]', 'opacity-0');
        
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 4000);
}

// =======================================================
// БЛОК 11: ЕФЕКТ ДРУКАРСЬКОЇ МАШИНКИ (TYPEWRITER EFFECT)
// =======================================================
const typewriterElement = document.getElementById('typewriter-text');

// Фрази, які будуть змінювати одна одну
const phrases = [
    "Вивчаю HTML, CSS та Tailwind 💻",
    "Оптові постачання посуду 📊",
    "Прямий імпорт без посередників 💎",
    "Дистриб'юція по всій Волині ⚡"
];

let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingSpeed = 100; // Швидкість друку однієї літери (в мілісекундах)

function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        // Якщо режим видалення — стираємо по одній літері
        typewriterElement.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
        typingSpeed = 40; // Стираємо швидше, ніж друкуємо
    } else {
        // Якщо режим друку — додаємо по одній літері
        typewriterElement.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
        typingSpeed = 90; // Звичайна швидкість друку
    }

    // Якщо фразу надруковано повністю
    if (!isDeleting && characterIndex === currentPhrase.length) {
        typingSpeed = 2500; // Пауза на 2.5 секунди, щоб користувач встиг прочитати
        isDeleting = true;  // Вмикаємо режим стирання
    } 
    // Якщо фразу повністю стерто
    else if (isDeleting && characterIndex === 0) {
        isDeleting = false; // Вимикаємо стирання
        phraseIndex = (phraseIndex + 1) % phrases.length; // Переходимо до наступної фрази
        typingSpeed = 400;  // Невеличка пауза перед початком нової фрази
    }

    // Запускаємо функцію знову через вирахуваний час
    setTimeout(typeEffect, typingSpeed);
}

// Запускаємо друкарську машинку відразу при завантаженні скрипта
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
            
            // Перевіряємо, чи відкрита саме ця плашка зараз
            const isOpen = !currentContent.classList.contains('max-h-0');
            
            // 1. Спочатку закриваємо абсолютно всі інші плашки на сайті
            document.querySelectorAll('.faq-content').forEach(content => {
                content.classList.add('max-h-0', 'opacity-0');
                content.classList.remove('max-h-96', 'opacity-100');
            });
            
            document.querySelectorAll('.faq-icon').forEach(icon => {
                icon.textContent = '➕';
                icon.classList.remove('rotate-45');
            });

            // 2. Якщо плашка була закрита — плавно відкриваємо її
            if (!isOpen) {
                currentContent.classList.remove('max-h-0', 'opacity-0');
                currentContent.classList.add('max-h-96', 'opacity-100');
                currentIcon.textContent = '➖';
                // Можна також додати крутий ефект повороту іконки через класи Tailwind
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

    // Циклічність: якщо вийшли за межі, вертаємось на початок або кінець
    if (targetIndex >= sliderSlides.length) activeSlideIndex = 0;
    else if (targetIndex < 0) activeSlideIndex = sliderSlides.length - 1;
    else activeSlideIndex = targetIndex;

    // 1. Керуємо видимістю слайдів (плавний ефект Fade)
    sliderSlides.forEach((slide, i) => {
        if (i === activeSlideIndex) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    // 2. Оновлюємо крапочки (активна стає ширшою)
    sliderDots.forEach((dot, i) => {
        if (i === activeSlideIndex) {
            dot.classList.remove('bg-white/40');
            dot.classList.add('bg-white', 'w-6'); // Розтягуємо активну крапочку
        } else {
            dot.classList.remove('bg-white', 'w-6');
            dot.classList.add('bg-white/40');
        }
    });
}

// Функція для запуску/перезапуску автоматичного гортання (кожні 5 сек)
function startAutoCycle() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(() => {
        updateSlider(activeSlideIndex + 1);
    }, 5000);
}

// Вішаємо події на стрілочки
if (nextSlideBtn) {
    nextSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex + 1);
        startAutoCycle(); // Скидаємо таймер при ручному кліку
    });
}

if (prevSlideBtn) {
    prevSlideBtn.addEventListener('click', () => {
        updateSlider(activeSlideIndex - 1);
        startAutoCycle();
    });
}

// Вішаємо події на самі крапочки
sliderDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        updateSlider(index);
        startAutoCycle();
    });
});

// Ініціалізація першої крапочки та старт автогортання
if (sliderDots.length > 0) {
    sliderDots[0].classList.add('w-6'); // Задаємо початкову ширину першій крапочці
    startAutoCycle();
}

// =======================================================
// БЛОК 14: ІНТЕРАКТИВНИЙ ОПТОВИЙ КОШИК
// =======================================================
let selectedBrandsList = []; // Масив для зберігання обраних брендів

const floatingCart = document.getElementById('floating-cart');
const cartCountElement = document.getElementById('cart-count');

function toggleBrandInCart(brandName, buttonElement) {
    const index = selectedBrandsList.indexOf(brandName);
    
    if (index === -1) {
        // 1. Якщо бренду немає — додаємо його
        selectedBrandsList.push(brandName);
        buttonElement.textContent = "✓ Додано";
        buttonElement.classList.remove('bg-blue-600', 'dark:bg-zinc-800');
        buttonElement.classList.add('bg-emerald-600', 'dark:bg-emerald-600');
        
        // Використовуємо наше круте вчорашнє Toast-сповіщення!
        showPremiumToast(`Бренд ${brandName} додано до вашого запиту! 🛒`);
    } else {
        // 2. Якщо клікнули ще раз — видаляємо з кошика
        selectedBrandsList.splice(index, 1);
        buttonElement.textContent = "+ Додати до запиту";
        buttonElement.classList.remove('bg-emerald-600', 'dark:bg-emerald-600');
        buttonElement.classList.add('bg-blue-600', 'dark:bg-zinc-800');
        
        showPremiumToast(`Бренд ${brandName} видалено із запиту.`);
    }
    
    // 3. Оновлюємо лічильник та видимість плаваючого кошика
    if (cartCountElement) cartCountElement.textContent = selectedBrandsList.length;
    
    if (floatingCart) {
        if (selectedBrandsList.length > 0) {
            // Плавно вилітає знизу
            floatingCart.classList.remove('translate-y-24', 'opacity-0');
            floatingCart.classList.add('translate-y-0', 'opacity-100');
        } else {
            // Плавно ховається вниз
            floatingCart.classList.remove('translate-y-0', 'opacity-100');
            floatingCart.classList.add('translate-y-24', 'opacity-0');
        }
    }
}

// Клік по плаваючому кошику плавно несе клієнта до форми замовлення
if (floatingCart) {
    floatingCart.addEventListener('click', () => {
        const contactSection = document.getElementById('contacts');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
