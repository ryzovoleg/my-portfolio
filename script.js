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
        const TELEGRAM_TOKEN = 'СЮДИ_ВСТАВ_ТОКЕН_ВІД_BOTFATHER';
        const TELEGRAM_CHAT_ID = 'СЮДИ_ВСТАВ_СВІЙ_CHAT_ID';

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
                alert('Дякую! Вашу заявку успішно надіслано. Я зв\'яжуся з вами найближчим часом. 👋');
                contactForm.reset(); // Очищаємо поля
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
