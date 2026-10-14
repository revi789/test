// Ждем полной загрузки DOM, чтобы скрипт точно видел все элементы
document.addEventListener('DOMContentLoaded', () => {

    // 1. Автоматический текущий год в футере
    const yearEl = document.querySelector('#year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // 2. Переключатель Темной / Светлой темы (Луна / Солнце)
    const themeBtn = document.querySelector('#theme-toggle');
    if (themeBtn) {
        // Проверяем, была ли сохранена темная тема ранее
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
            themeBtn.textContent = '☀️';
        }

        themeBtn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            themeBtn.textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 3. ВЕРСИЯ ДЛЯ СЛАБОВИДЯЩИХ (С сохранением состояния)
    // Улучшенный поиск кнопки: ищет по ID, классу .accessibility-toggle или по тегу кнопки в навигации
    let a11yBtn = document.querySelector('#accessibility-toggle') || 
                  document.querySelector('.accessibility-toggle') ||
                  document.querySelector('nav button'); // резервный вариант, если это единственная кнопка-глаз в меню

    const bodyEl = document.body;

    // Вспомогательная функция для безопасного обновления текста кнопки (сохраняя иконку-глаз или аватар)
    function updateButtonText(button, text) {
        if (!button) return;
        // Если внутри кнопки есть тег <span>, меняем текст в нем, чтобы не удалить картинку глаза
        const textSpan = button.querySelector('span');
        if (textSpan) {
            textSpan.textContent = text;
        } else {
            // Если спана нет, меняем текстовое содержимое, но пытаемся не затереть картинку
            const img = button.querySelector('img');
            if (img) {
                button.innerHTML = ''; 
                button.appendChild(img);
                button.appendChild(document.createTextNode(' ' + text));
            } else {
                button.textContent = '👁️ ' + text;
            }
        }
    }

    // Функции включения/выключения режима
    function enableA11y() {
        if (bodyEl) bodyEl.classList.add('high-contrast-mode');
        if (a11yBtn) {
            a11yBtn.setAttribute('aria-pressed', 'true');
            updateButtonText(a11yBtn, 'Обычная версия');
            a11yBtn.setAttribute('aria-label', 'Вернуться к обычной версии сайта');
        }
        localStorage.setItem('a11y-mode', 'enabled');
    }

    function disableA11y() {
        if (bodyEl) bodyEl.classList.remove('high-contrast-mode');
        if (a11yBtn) {
            a11yBtn.setAttribute('aria-pressed', 'false');
            updateButtonText(a11yBtn, 'Версия для слабовидящих');
            a11yBtn.setAttribute('aria-label', 'Включить версию для слабовидящих');
        }
        localStorage.setItem('a11y-mode', 'disabled');
    }

    // Проверяем сохраненный режим при загрузке страницы
    if (localStorage.getItem('a11y-mode') === 'enabled') {
        enableA11y();
    }

    // Слушатель клика на кнопку доступности
    if (a11yBtn) {
        a11yBtn.addEventListener('click', () => {
            const isEnabled = bodyEl.classList.contains('high-contrast-mode');
            if (isEnabled) {
                disableA11y();
            } else {
                enableA11y();
            }
        });
    } else {
        console.warn('Предупреждение JS: Кнопка версии для слабовидящих не найдена на странице. Проверьте селекторы.');
    }

    // 4. Валидация и отправка формы контактов
    const form = document.querySelector('form');
    const statusMsg = document.querySelector('#form-status');

    if (form && statusMsg) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nameInput = document.querySelector('#name');
            const name = nameInput ? nameInput.value.trim() : 'Гость';
            
            statusMsg.textContent = `Спасибо, ${name}! Сообщение отправлено.`;
            statusMsg.classList.add('visible');
            form.reset();
        });
    }

    // 5. Кнопка "Наверх"
    const upBtn = document.querySelector('#to-top');
    if (upBtn) {
        window.addEventListener('scroll', () => {
            upBtn.classList.toggle('visible', window.scrollY > 400);
        });

        upBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
