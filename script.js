// --- БЛОК 1: ТЕМНА ТЕМА ---
const themeButton = document.getElementById('theme-toggle');

// Перевіряємо пам'ять при завантаженні сторінки
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// ПЕРЕВІРКА: Якщо кнопка теми є на цій сторінці — вмикаємо її логіку
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

// PЕРЕВІРКА: Якщо кнопка "Вгору" є на цій сторінці — вмикаємо її логіку
if (backToTopBtn) {
    // Слідкуємо за гортанням
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.style.style.display = 'block'; // Якщо скрол більше 400px — показуємо
        } else {
            backToTopBtn.style.style.display = 'none'; // Інакше ховаємо
        }
    });

    // Клік по кнопці
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
