/**
 * © 2026 Aventis RP
 */

(function() {
    // 1. Отримання або створення унікального ID відвідувача
    let visitorId = localStorage.getItem('vrp_visitor_id');
    if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        localStorage.setItem('vrp_visitor_id', visitorId);
    }

    const currentUrl = window.location.pathname;

    // Функція відправки даних
    function sendEvent(type, data = '') {
        // Використовуємо шлях без .php, щоб уникнути редіректу від .htaccess (який викликає помилку Mixed Content)
        fetch('/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                visitor_id: visitorId,
                page_url: currentUrl,
                event_type: type,
                event_data: data,
                referrer: document.referrer
            })
        }).catch(err => console.error('Analytics error:', err));
    }

    // 2. Відстеження перегляду сторінки (Page View)
    sendEvent('view');

    // 3. Відстеження часу (Heartbeat) - кожні 10 секунд
    // Це дозволить порахувати загальний час: кількість heartbeat * 10 сек
    let timeInterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            sendEvent('heartbeat');
        }
    }, 10000);

    // 4. Відстеження кліків
    document.addEventListener('click', function(e) {
        let target = e.target;
        
        // Намагаємося знайти найближчий клікабельний елемент (посилання або кнопку)
        const clickable = target.closest('a, button, .cta-button, .nav-link, .social-btn');
        
        if (clickable) {
            let label = '';
            
            // Визначаємо назву елемента
            if (clickable.innerText) {
                label = clickable.innerText.trim().substring(0, 50);
            } else if (clickable.getAttribute('alt')) {
                label = clickable.getAttribute('alt');
            } else if (clickable.getAttribute('aria-label')) {
                label = clickable.getAttribute('aria-label');
            } else if (clickable.href) {
                label = clickable.href;
            } else {
                label = clickable.tagName;
            }

            // Додаємо клас елемента для контексту
            const classes = clickable.className ? `.${clickable.className.replace(/\s+/g, '.')}` : '';
            
            sendEvent('click', `${label} [${classes}]`);
        }
    });

    // Очистка інтервалу при закритті (опціонально, браузери можуть ігнорувати)
    window.addEventListener('beforeunload', () => {
        clearInterval(timeInterval);
    });

})();
