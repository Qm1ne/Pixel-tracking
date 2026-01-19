(function (window, document) {
    'use strict';

    const CONFIG = {
        endpoint: 'http://localhost:3000/api/v1/event',
        id_cookie_name: 'utm_uuid'
    };

    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function getAnonymousId() {
        let id = localStorage.getItem(CONFIG.id_cookie_name);
        if (!id) {
            id = generateUUID();
            localStorage.setItem(CONFIG.id_cookie_name, id);
        }
        return id;
    }

    function sendEvent(eventType, payload = {}) {
        const data = {
            event_type: eventType,
            anonymous_id: getAnonymousId(),
            page_url: window.location.href,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            ...payload
        };

        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            navigator.sendBeacon(CONFIG.endpoint, blob);
        } else {
            console.warn('sendBeacon not supported');
            // Fallback to fetch or XHR
        }
    }

    // --- Event Listeners ---

    // 1. Pageview
    sendEvent('pageview');

    // 2. Clicks
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a, button, [data-track]');
        if (target) {
            const metadata = {
                text: target.innerText || target.value,
                href: target.href,
                id: target.id,
                class: target.className
            };
            sendEvent('click', { metadata });
        }
    });

    // 3. Scroll Depth (Throttled)
    let maxScroll = 0;
    let scrollTimeout;
    window.addEventListener('scroll', function () {
        if (scrollTimeout) return;

        scrollTimeout = setTimeout(function () {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollTop = document.documentElement.scrollTop;
            const percent = Math.round((scrollTop / docHeight) * 100);

            if (percent > maxScroll && percent % 25 === 0) {
                maxScroll = percent;
                sendEvent('scroll', { metadata: { depth: percent } });
            }
            scrollTimeout = null;
        }, 500);
    });

    // 4. Form Submissions
    document.addEventListener('submit', function (e) {
        const form = e.target;
        sendEvent('submit', {
            metadata: {
                form_id: form.id,
                form_action: form.action,
                method: form.method
            }
        });
    });

    // Expose global object
    window.Pixel = {
        track: sendEvent,
        init: (config) => Object.assign(CONFIG, config)
    };

})(window, document);
