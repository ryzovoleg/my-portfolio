// =======================================================
// БЛОК 1: ТЕМНА ТЕМА
// =======================================================
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
} // <-- ОЦЯ ДУЖКА МАЄ БУТИ ТУТ! Вона закриває весь Блок 5.
// =======================================================
// БЛОК 6: ІНТЕРАКТИВНИЙ ФІЛЬТР БРЕНДІВ
// =======================================================
const filterButtons = document.querySelectorAll('.filter-btn');
const brandCards = document.querySelectorAll('.brand-card');

if (filterButtons.length > 0 && brandCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 1. Перемикаємо активний клас між кнопками
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Отримуємо категорію, за якою треба фільтрувати
            const filterValue = button.getAttribute('data-filter');

            // 3. Перебираємо всі картки брендів
            brandCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                // Якщо вибрано "Усі" або категорія картки збігається з кнопкою — показуємо, інакше ховаємо
                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.classList.remove('hide-card');
                } else {
                    card.classList.add('hide-card');
                }
            });
        });
    });
}
