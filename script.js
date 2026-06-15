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
        // Якщо прокрутили більше 400px — показуємо кнопку, інакше ховаємо
        if (window.scrollY > 400) {
            backToTopBtn.style.display = 'block'; 
        } else {
            backToTopBtn.style.display = 'none'; 
        }
    });

    // Клік по кнопці плавно повертає наверх
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
