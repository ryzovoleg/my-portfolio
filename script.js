const themeButton = document.getElementById('theme-toggle');

// 1. При завантаженні сторінки перевіряємо, чи вмикав користувач темну тему раніше
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

themeButton.addEventListener('click', () => {
    // 2. Перемикаємо клас як і раніше
    document.body.classList.toggle('dark-theme');
    
    // 3. Якщо після кліку тема стала темною — записуємо це в пам'ять браузера
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
    } else {
        // Якщо повернулися до світлої — видаляємо запис або пишемо 'light'
        localStorage.setItem('theme', 'light');
    }
