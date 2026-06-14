// 1. Знаходимо нашу кнопку на сторінці за її ID
const themeButton = document.getElementById('theme-toggle');

// 2. Слідкуємо за тим, коли користувач натисне на неї
themeButton.addEventListener('click', () => {
    // 3. Перемикаємо (додаємо/видаляємо) клас 'dark-theme' у тега body
    document.body.classList.toggle('dark-theme');
});
