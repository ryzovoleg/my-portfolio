// --- БЛОК 1: ТЕМНА ТЕМА ---
const themeButton = document.getElementById('theme-toggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}
if (themeButton) {
    themeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
}

// --- БЛОК 2: КНОПКА ВГОРУ ---
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

// --- БЛОК 3: РОЗУМНЕ ПРИВІТАННЯ ---
const greetingElement = document.getElementById('greeting-text');
if (greetingElement) {
    const currentHour = new Date().getHours(); // Отримуємо поточну годину (від 0 до 23)
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

    // --- БЛОК 4: АНІМАЦІЯ ПРИ СКРОЛІ ---
const animElements = document.querySelectorAll('.scroll-anim');

if (animElements.length > 0) {
    // Створюємо "спостерігач", який стежить за появою елементів
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Якщо елемент з'явився в полі зору хоча б трохи
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible'); // Додаємо клас появи
                observer.unobserve(entry.target); // Вимикаємо стеження за цим елементом, щоб анімація не повторювалася щоразу
            }
        });
    }, {
        threshold: 0.15 // Анімація спрацює, коли елемент покажеться на 15%
    });

    // Запускаємо спостерігач для кожної картки
    animElements.forEach(el => observer.observe(el));
}
// --- БЛОК 5: МОДАЛЬНЕ ВІКНО (ПОПАП) — ЗАХИЩЕНА ВЕРСІЯ ---
const modal = document.getElementById('service-modal');
const serviceCards = document.querySelectorAll('.service-card');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalTitle = document.getElementById('modal-title');
const modalText = document.getElementById('modal-text');

if (modal && serviceCards.length > 0) {
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Безпечно шукаємо заголовок та текст всередині картки
            const h3Element = card.querySelector('h3');
            const pElement = card.querySelector('p');
            
            // Якщо знайшли — беремо текст, якщо ні — ставимо стандартний
            const cardTitle = h3Element ? h3Element.innerText : "Послуга";
            const cardText = pElement ? pElement.innerText : "";
            
            if (modalTitle && modalText) {
                modalTitle.innerText = cardTitle;
                modalText.innerText = cardText + " Ми пропонуємо індивідуальні умови співпраці, повний супровід та гарантію якості для кожного замовлення в нашому регіоні.";
            }
            
            // Показуємо попап
            modal.classList.add('active');
        });
    });

    // Закриття на хрестик
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Закриття на темне тло
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}
