// Page-wide behaviour: theme toggle, greeting, clock, start menu,
// active taskbar button and window "open" animations.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* ---------- Skins (Display Properties) ---------- */
    // family: "dark" = flat beveled panels, "light" = glossy rounded chrome.
    // swatch: desktop, window, accent - shown in the picker.
    // The first entry is the default (keep in sync with the inline script in index.html).
    const SKINS = [
        { id: 'olive',  name: 'Olive Drab',   family: 'dark',  swatch: ['#2c3326', '#4c5844', '#c4b550'] },
        { id: 'luna',   name: 'Luna Blue',    family: 'light', swatch: ['#3a6fd8', '#ece9d8', '#45a845'] },
        { id: 'silver', name: 'Silver Metal', family: 'light', swatch: ['#9aa3b5', '#eceef3', '#3a5fb5'] },
        { id: 'aero',   name: 'Aero Glass',   family: 'light', swatch: ['#5cc3f5', '#f2fbff', '#9be35a'] },
        { id: 'noir',   name: 'Night LCD',    family: 'dark',  swatch: ['#0d0f12', '#1d2025', '#a6ff4d'] },
        { id: 'cyber',  name: 'Y2K Cyber',    family: 'dark',  swatch: ['#1b1236', '#3a2a72', '#ff6ad5'] },
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

    /* ---------- Windows: open / minimize / close ---------- */
    // Links to "#welcome" or "#contact" (desktop icons, buttons, Start menu)
    // open that window. Close hides it and its taskbar button; Minimize hides
    // only the window, and the taskbar button brings it back (or minimizes it).
    function makeWindow({ win, hideEl = win, task, focusFirst = false }) {
        const taskLink = task?.querySelector('a');
        const isOpen = () => !hideEl.hidden;

        function open() {
            const wasOpen = isOpen();
            hideEl.hidden = false;
            if (task) task.hidden = false;
            taskLink?.classList.add('active');
            if (!wasOpen) {
                win.classList.remove('opening');
                void win.offsetWidth; // restart the open animation
                win.classList.add('opening');
            }
            if (focusFirst) {
                win.querySelector('input:not([type="hidden"]):not([tabindex="-1"])')?.focus({ preventScroll: true });
            }
        }

        function minimize() {
            hideEl.hidden = true;
            taskLink?.classList.remove('active');
        }

        function close() {
            minimize();
            if (task) task.hidden = true;
            win.style.transform = ''; // reopen in its starting spot
            win.dataset.x = win.dataset.y = '0';
        }

        win.querySelector('[data-win="close"]')?.addEventListener('click', close);
        win.querySelector('[data-win="minimize"]')?.addEventListener('click', minimize);

        return { win, taskLink, isOpen, open, minimize, close };
    }

    const windows = {};

    const welcomeWin = document.getElementById('welcome');
    if (welcomeWin) {
        windows['#welcome'] = makeWindow({ win: welcomeWin, task: document.getElementById('task-welcome') });
        welcomeWin.hidden = true; // launched on load, after the loading indicator
    }

    const contactSection = document.getElementById('contact');
    const contactWin = contactSection?.querySelector('.window-contact');
    if (contactSection && contactWin) {
        contactSection.classList.add('popup');
        contactSection.hidden = true;
        windows['#contact'] = makeWindow({
            win: contactWin,
            hideEl: contactSection,
            task: document.getElementById('task-contact'),
            focusFirst: true,
        });
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        const w = link && windows[link.getAttribute('href')];
        if (!w || e.defaultPrevented) return;
        if (w === windows['#welcome']) { // opened by hand before it finished starting
            document.getElementById('welcome-loading')?.remove();
            root.classList.remove('busy');
        }
        e.preventDefault();
        if (link === w.taskLink && w.isOpen()) w.minimize();
        else w.open();
    });

    document.addEventListener('keydown', (e) => {
        const c = windows['#contact'];
        if (e.key === 'Escape' && c?.isOpen() && c.win.contains(document.activeElement)) c.close();
    });

    // Only clicks open windows. Drop a leftover "#welcome"/"#contact" from the
    // URL so a refresh always starts with with Welcome launching.
    if (windows[location.hash]) history.replaceState(null, '', location.pathname + location.search);

    // Drag the New Message window around by its title bar (mouse or pen).
    const bar = contactWin?.querySelector('.titlebar');
    let move = null;
    bar?.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || e.pointerType === 'touch' || e.target.closest('button')) return;
        e.preventDefault();
        bar.setPointerCapture(e.pointerId);
        move = {
            startX: e.clientX,
            startY: e.clientY,
            baseX: Number(contactWin.dataset.x || 0),
            baseY: Number(contactWin.dataset.y || 0),
            rect: contactWin.getBoundingClientRect(),
        };
    });
    bar?.addEventListener('pointermove', (e) => {
        if (!move) return;
        const r = move.rect;
        // Keep at least the title bar reachable on screen.
        const dx = Math.min(Math.max(e.clientX - move.startX, 80 - r.right), window.innerWidth - 80 - r.left);
        const dy = Math.min(Math.max(e.clientY - move.startY, -r.top), window.innerHeight - TASKBAR_H - 32 - r.top);
        contactWin.dataset.x = move.baseX + dx;
        contactWin.dataset.y = move.baseY + dy;
        contactWin.style.transform = `translate(${move.baseX + dx}px, ${move.baseY + dy}px)`;
    });
    const stopMove = () => { move = null; };
    bar?.addEventListener('pointerup', stopMove);
    bar?.addEventListener('pointercancel', stopMove);

    /* ---------- Launch Welcome on load, with a loading indicator ---------- */
    // The desktop shows straight away; an hourglass sits where the Welcome
    // window will appear, then the window opens like a starting program.
    const welcomeLoading = document.getElementById('welcome-loading');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LAUNCH_MS = 1300;

    welcomeWin?.classList.remove('pending'); // JS has taken over showing/hiding it

    if (welcomeLoading && !reduceMotion) {
        welcomeLoading.hidden = false;
        root.classList.add('busy');
        setTimeout(() => {
            if (!welcomeLoading.isConnected) return; // already opened by a click
            welcomeLoading.remove();
            root.classList.remove('busy');
            windows['#welcome']?.open();
        }, LAUNCH_MS);
    } else {
        welcomeLoading?.remove();
        windows['#welcome']?.open();
    }

    /* ---------- Movable desktop icons ---------- */
    // Drag with a mouse or pen. A short click still opens the link; a drag
    // (more than a few pixels) moves the icon and swallows the click.
    // Touch is left alone so phones can still scroll past the icons.
    const TASKBAR_H = 42;
    let iconLayer = 3;

    document.querySelectorAll('.desk-icon').forEach((icon) => {
        let drag = null;

        icon.addEventListener('dragstart', (e) => e.preventDefault()); // no native link-drag ghost

        icon.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.pointerType === 'touch') return;
            drag = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(icon.dataset.x || 0),
                baseY: Number(icon.dataset.y || 0),
                rect: icon.getBoundingClientRect(),
                moved: false,
            };
            icon.setPointerCapture(e.pointerId);
        });

        icon.addEventListener('pointermove', (e) => {
            if (!drag) return;
            let dx = e.clientX - drag.startX;
            let dy = e.clientY - drag.startY;
            if (!drag.moved) {
                if (Math.hypot(dx, dy) < 5) return;
                drag.moved = true;
                icon.classList.add('dragging');
                icon.style.zIndex = String(++iconLayer); // last-moved icon sits on top
            }
            // Keep the icon on screen and above the taskbar.
            const r = drag.rect;
            dx = Math.min(Math.max(dx, -r.left), window.innerWidth - r.right);
            dy = Math.min(Math.max(dy, -r.top), window.innerHeight - TASKBAR_H - r.bottom);
            const x = drag.baseX + dx;
            const y = drag.baseY + dy;
            icon.dataset.x = x;
            icon.dataset.y = y;
            icon.style.transform = `translate(${x}px, ${y}px)`;
        });

        const endDrag = () => {
            if (!drag) return;
            if (drag.moved) icon.dataset.justDragged = '1';
            icon.classList.remove('dragging');
            drag = null;
        };
        icon.addEventListener('pointerup', endDrag);
        icon.addEventListener('pointercancel', endDrag);

        icon.addEventListener('click', (e) => {
            if (icon.dataset.justDragged) {
                e.preventDefault();
                delete icon.dataset.justDragged;
            }
        });
    });

    /* ---------- "Not Responding" window drag ---------- */
    // Dragging the Welcome window stamps frozen copies of it behind the
    // pointer, like an old PC that stopped repainting. On release the
    // screen "repaints": the trail clears and the window snaps back.
    const hungWindow = document.querySelector('.window-welcome');
    const hungBar = hungWindow?.querySelector('.titlebar');
    const hungTitle = hungWindow?.querySelector('.titlebar-text');

    if (hungWindow && hungBar && hungTitle) {
        const baseTitle = hungTitle.textContent;
        const MAX_TRAIL = 140;
        let drag = null;

        function stamp() {
            const r = hungWindow.getBoundingClientRect();
            const ghost = hungWindow.cloneNode(true);
            ghost.removeAttribute('id');
            ghost.removeAttribute('aria-labelledby');
            ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
            ghost.classList.add('trail');
            Object.assign(ghost.style, {
                left: `${r.left}px`,
                top: `${r.top}px`,
                width: `${r.width}px`,
                height: `${r.height}px`,
            });
            drag.layer.append(ghost);
            if (drag.layer.childElementCount > MAX_TRAIL) drag.layer.firstElementChild.remove();
        }

        hungBar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('button')) return; // let Minimize/Close click normally
            e.preventDefault();
            hungBar.setPointerCapture(e.pointerId);

            const layer = document.createElement('div');
            layer.className = 'trail-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.append(layer);

            drag = { startX: e.clientX, startY: e.clientY, lastX: null, lastY: null, layer };
            hungWindow.style.transition = 'none';
            hungWindow.classList.add('hung');
            hungTitle.textContent = `${baseTitle} (Not Responding)`;
        });

        hungBar.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const dx = e.clientX - drag.startX;
            const dy = e.clientY - drag.startY;
            hungWindow.style.transform = `translate(${dx}px, ${dy}px)`;
            // Leave a frozen copy every few pixels of travel.
            if (drag.lastX === null || Math.hypot(dx - drag.lastX, dy - drag.lastY) >= 6) {
                stamp();
                drag.lastX = dx;
                drag.lastY = dy;
            }
        });

        const release = () => {
            if (!drag) return;
            drag.layer.remove();
            drag = null;
            hungTitle.textContent = baseTitle;
            hungWindow.classList.remove('hung');
            hungWindow.style.transition = 'transform 0.25s ease-out';
            hungWindow.style.transform = '';
        };
        hungBar.addEventListener('pointerup', release);
        hungBar.addEventListener('pointercancel', release);
        hungBar.addEventListener('lostpointercapture', release);
    }

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
