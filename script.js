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
// БЛОК 6: ІНТЕРАКТИВНИЙ ФІЛЬТР БРЕНДІВ
// =======================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const brandCards = document.querySelectorAll('.brand-card');

if (filterButtons.length > 0 && brandCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Перемикаємо активну кнопку (вона тепер зафіксується зеленим/синім кольором)
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            brandCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('hide-card'); // Показуємо
                } else {
                    card.classList.add('hide-card'); // Ховаємо
                }
            });
        });
    });
}
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
        const textMessage = `
🔔 NEW LEAD FROM WEBSITE!
👤 Ім'я: ${name}
📞 Контакт: ${contact}
✉️ Повідомлення: ${message}
        `;

        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

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
