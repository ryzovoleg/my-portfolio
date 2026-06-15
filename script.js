// --- БЛОК 1: ТЕМНА ТЕМА ---
const themeButton = document.getElementById('theme-toggle');

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});


// --- БЛОК 2: КНОПКА ВГОРУ ---
const backToTopBtn = document.getElementById('back-to-top');

// Слідкуємо за гортанням сторінки
window.addEventListener('scroll', () => {
    // Якщо прокрутили більше ніж 400 пікселів — показуємо кнопку, інакше — ховаємо
    if (window.scrollY > 400) {
        backToTopBtn.style.display = 'block';
    } else {
        backToTopBtn.style.display = 'none';
    }
});

// При кліку на кнопку — плавно котимося на самий верх
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
