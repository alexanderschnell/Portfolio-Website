// Page-wide behaviour: theme toggle, greeting, clock, start menu,
// active taskbar button and window "open" animations.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* ---------- Skins (Display Properties) ---------- */
    // family: "dark" = flat beveled panels, "light" = glossy rounded chrome.
    // swatch: desktop, window, accent - shown in the picker.
    const SKINS = [
        { id: 'olive',  name: 'Olive Drab',   family: 'dark',  swatch: ['#2c3326', '#4c5844', '#c4b550'] },
        { id: 'noir',   name: 'Night LCD',    family: 'dark',  swatch: ['#0d0f12', '#1d2025', '#a6ff4d'] },
        { id: 'cyber',  name: 'Y2K Cyber',    family: 'dark',  swatch: ['#1b1236', '#3a2a72', '#ff6ad5'] },
        { id: 'luna',   name: 'Luna Blue',    family: 'light', swatch: ['#3a6fd8', '#ece9d8', '#45a845'] },
        { id: 'silver', name: 'Silver Metal', family: 'light', swatch: ['#9aa3b5', '#eceef3', '#3a5fb5'] },
        { id: 'aero',   name: 'Aero Glass',   family: 'light', swatch: ['#5cc3f5', '#f2fbff', '#9be35a'] },
    ];

    const skinBtn = document.getElementById('skin-btn');
    const skinMenu = document.getElementById('skin-menu');
    const skinList = document.getElementById('skin-list');

    function applySkin(id) {
        const skin = SKINS.find((s) => s.id === id) || SKINS[0];
        root.dataset.skin = skin.id;
        root.dataset.theme = skin.family;
        try {
            localStorage.setItem('skin', skin.id);
            localStorage.removeItem('darkMode');
        } catch (e) { /* storage unavailable */ }
        skinList.querySelectorAll('.skin-option').forEach((btn) => {
            btn.setAttribute('aria-pressed', String(btn.dataset.skinId === skin.id));
        });
    }

    if (skinList) {
        SKINS.forEach((skin) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'skin-option';
            btn.dataset.skinId = skin.id;
            btn.setAttribute('aria-pressed', String(root.dataset.skin === skin.id));

            const swatch = document.createElement('span');
            swatch.className = 'skin-swatch';
            swatch.setAttribute('aria-hidden', 'true');
            skin.swatch.forEach((colour) => {
                const chip = document.createElement('span');
                chip.style.background = colour;
                swatch.append(chip);
            });

            const label = document.createElement('span');
            label.textContent = skin.name;
            const family = document.createElement('span');
            family.className = 'skin-family';
            family.textContent = skin.family === 'dark' ? 'Classic' : 'Glossy';

            btn.append(swatch, label, family);
            btn.addEventListener('click', () => applySkin(skin.id));
            li.append(btn);
            skinList.append(li);
        });
    }

    function setSkinMenu(open) {
        skinMenu.hidden = !open;
        skinBtn.setAttribute('aria-expanded', String(open));
    }

    skinBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setSkinMenu(skinMenu.hidden);
    });
    document.addEventListener('click', (e) => {
        if (skinMenu && !skinMenu.hidden && !e.target.closest('.tray-wrap')) setSkinMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skinMenu && !skinMenu.hidden) {
            setSkinMenu(false);
            skinBtn.focus();
        }
    });

    /* ---------- Greeting & year ---------- */
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const hour = new Date().getHours();
        greeting.textContent = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Taskbar clock ---------- */
    const clock = document.getElementById('clock');
    function tick() {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        clock.dateTime = now.toISOString();
    }
    if (clock) {
        tick();
        setInterval(tick, 15000);
    }

    /* ---------- Start menu ---------- */
    const startBtn = document.getElementById('start-btn');
    const startMenu = document.getElementById('start-menu');

    function setStart(open) {
        startMenu.hidden = !open;
        startBtn.setAttribute('aria-expanded', String(open));
    }

    startBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        setStart(startMenu.hidden);
    });
    startMenu?.addEventListener('click', (e) => {
        if (e.target.closest('a')) setStart(false);
    });
    document.addEventListener('click', (e) => {
        if (startMenu && !startMenu.hidden && !e.target.closest('.start-wrap')) setStart(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && startMenu && !startMenu.hidden) {
            setStart(false);
            startBtn.focus();
        }
    });

    /* ---------- Active taskbar button ---------- */
    const taskLinks = [...document.querySelectorAll('.task-buttons a')];
    const watched = ['home', ...taskLinks.map((a) => a.getAttribute('href').slice(1))]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            taskLinks.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    watched.forEach((section) => sectionObserver.observe(section));

    /* ---------- Window "open" animation ---------- */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
});
