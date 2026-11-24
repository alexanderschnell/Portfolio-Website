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
        { id: 'noir',   name: 'Night LCD',    family: 'dark',  swatch: ['#0d0f12', '#1d2025', '#a6ff4d'] },
        { id: 'olive',  name: 'Olive Drab',   family: 'dark',  swatch: ['#2c3326', '#4c5844', '#c4b550'] },
        { id: 'luna',   name: 'Luna Blue',    family: 'light', swatch: ['#3a6fd8', '#ece9d8', '#45a845'] },
        { id: 'silver', name: 'Silver Metal', family: 'light', swatch: ['#9aa3b5', '#eceef3', '#3a5fb5'] },
        { id: 'aero',   name: 'Aero Glass',   family: 'light', swatch: ['#5cc3f5', '#f2fbff', '#9be35a'] },
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
        updateFavicon(skin);
    }

    // The tab icon is the wolf, recoloured to match the skin: the wolf takes
    // the skin's accent, on a tile in a deep shade of its desktop colour. The
    // file (assets/images/favicon.svg) is drawn in Night LCD colours, which
    // are swapped out here.
    const faviconLink = document.querySelector('link[rel="icon"]');
    let faviconSvg = null;
    const hexRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const rgbHex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
    const mix = (a, b, t) => rgbHex(hexRgb(a).map((v, i) => v + (hexRgb(b)[i] - v) * t));
    const luma = (h) => {
        const [r, g, b] = hexRgb(h).map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    function updateFavicon(skin) {
        const [desktop, , accent] = skin.swatch;
        const tile = mix(desktop, '#000000', 0.7);
        let wolf = accent;
        // keep the wolf bright enough to read on the dark tile
        for (let t = 0.15; luma(wolf) < 0.32 && t <= 0.9; t += 0.15) wolf = mix(accent, '#ffffff', t);
        // The Start menu avatar: the wolf on a dark tile in the skin colours.
        root.style.setProperty('--wolf-tile', tile);
        root.style.setProperty('--wolf-colour', wolf);
        if (!faviconLink) return;
        // The tab icon has no background, so it's shaded with solid colours
        // (a deep shade of the accent up to the accent itself, by each pixel's
        // data-s level) to stay crisp on light and dark tab bars alike.
        const deep = mix(accent, '#000000', 0.55);
        const paint = (svg) => {
            const out = svg
                .replace(/fill="#[0-9a-f]{6}" data-s="([0-9.]+)"/g, (m, s) => `fill="${mix(deep, accent, Number(s))}"`)
                .replace(/#a6ff4d/g, accent)
                .replace(/#efffd9/g, mix(accent, '#ffffff', 0.8));
            faviconLink.href = 'data:image/svg+xml,' + encodeURIComponent(out);
        };
        if (faviconSvg) { paint(faviconSvg); return; }
        fetch('assets/images/favicon.svg')
            .then((r) => (r.ok ? r.text() : Promise.reject()))
            .then((svg) => { faviconSvg = svg; paint(svg); })
            .catch(() => { /* keep the static icon */ });
    }
    updateFavicon(SKINS.find((s) => s.id === root.dataset.skin) || SKINS[0]);

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

    let stopWolf = null;
    function setStart(open) {
        startMenu.hidden = !open;
        startBtn.setAttribute('aria-expanded', String(open));
        // The avatar wolf only animates while the menu is open.
        const wolfEl = document.getElementById('start-wolf');
        if (open && wolfEl && window.asciiWolf && !stopWolf) stopWolf = window.asciiWolf.mount(wolfEl);
        else if (!open && stopWolf) { stopWolf(); stopWolf = null; }
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
    /* ---------- Window stacking ---------- */
    // One front-to-back order for every window (Welcome and the pop-ups).
    // Opening or clicking a window brings it to the front. Layers stay compact
    // (50 + position in the stack), so windows never climb above the taskbar
    // (100) or its menus. A 'layers' event on document tells other scripts
    // (the droid) that the order changed.
    const LAYER_BASE = 50;
    const stack = [];
    const layerOf = (win) => win.closest('.section.popup') || win;

    function raise(win) {
        const el = layerOf(win);
        const i = stack.indexOf(el);
        if (i === stack.length - 1 && i !== -1) return; // already in front
        if (i !== -1) stack.splice(i, 1);
        stack.push(el);
        stack.forEach((layer, k) => { layer.style.zIndex = String(LAYER_BASE + k); });
        document.dispatchEvent(new CustomEvent('layers'));
    }
    window.desktopLayers = { layerOf, raise };

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
            raise(win); // bring to front
            if (focusFirst) {
                win.querySelector('input:not([type="hidden"]):not([tabindex="-1"])')?.focus({ preventScroll: true });
            }
            win.dispatchEvent(new CustomEvent('winopen')); // other scripts (goalstat.js) can react
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
            setMaximized(false); // reopen at normal size
            win.dispatchEvent(new CustomEvent('winclose'));
        }

        // Maximize fills the desktop above the taskbar; press again (or
        // double-click the title bar) to restore.
        const maxBtn = win.querySelector('[data-win="maximize"]');
        function setMaximized(on) {
            win.classList.toggle('maximized', on);
            maxBtn?.setAttribute('aria-label', on ? 'Restore' : 'Maximize');
        }
        maxBtn?.addEventListener('click', () => setMaximized(!win.classList.contains('maximized')));
        win.querySelector('.titlebar')?.addEventListener('dblclick', (e) => {
            if (!e.target.closest('button') && maxBtn && getComputedStyle(maxBtn).display !== 'none') {
                setMaximized(!win.classList.contains('maximized'));
            }
        });

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

    // Pop-up windows: each lives in its own full-screen <section> layer.
    const popups = [
        { id: 'contact', focusFirst: true },
        { id: 'projects' },
        { id: 'readme' },
        { id: 'myfinancepal' },
        { id: 'visualizer' },
        { id: 'goalstat' },
    ];
    popups.forEach(({ id, focusFirst = false }) => {
        const section = document.getElementById(id);
        const win = section?.querySelector('.window');
        if (!section || !win) return;
        section.classList.add('popup');
        section.hidden = true;
        windows[`#${id}`] = makeWindow({ win, hideEl: section, task: document.getElementById(`task-${id}`), focusFirst });
        makeDraggable(win);
    });

    // Clicking anywhere on a window brings it to the front (capture phase, so
    // it happens before a title-bar drag starts).
    Object.values(windows).forEach(({ win }) => {
        win.addEventListener('pointerdown', () => raise(win), true);
    });

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        const w = link && windows[link.getAttribute('href')];
        if (!w || e.defaultPrevented) return;
        e.preventDefault();
        if (link === w.taskLink && w.isOpen()) w.minimize();
        else if (w === windows['#welcome'] && w.taskLink?.parentElement.hidden) openWelcome(); // not running: start it
        else w.open(); // running (open or minimized): just bring it up
    });

    // Projects folder: pointing at (or tabbing to) a program describes it in the status bar.
    const folderInfo = document.getElementById('folder-info');
    const folderItems = document.querySelectorAll('.folder-item');
    if (folderInfo) {
        const idle = `${folderItems.length} object${folderItems.length === 1 ? '' : 's'}`;
        folderInfo.textContent = idle;
        folderItems.forEach((item) => {
            const show = () => { folderInfo.textContent = item.dataset.info || idle; };
            const reset = () => { folderInfo.textContent = idle; };
            item.addEventListener('pointerenter', show);
            item.addEventListener('focus', show);
            item.addEventListener('pointerleave', reset);
            item.addEventListener('blur', reset);
        });
    }

    // Escape closes the pop-up that has keyboard focus.
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        popups.forEach(({ id }) => {
            const w = windows[`#${id}`];
            if (w?.isOpen() && w.win.contains(document.activeElement)) w.close();
        });
    });

    // Only clicks open windows. Drop a leftover "#welcome"/"#contact" from the
    // URL so a refresh always always starts with Welcome launching.
    if (windows[location.hash]) history.replaceState(null, '', location.pathname + location.search);

    // Drag a pop-up window around by its title bar (mouse or pen).
    function makeDraggable(win) {
        const bar = win.querySelector('.titlebar');
        let move = null;
        bar?.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.pointerType === 'touch' || e.target.closest('button') || win.classList.contains('maximized')) return;
            e.preventDefault();
            bar.setPointerCapture(e.pointerId);
            move = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(win.dataset.x || 0),
                baseY: Number(win.dataset.y || 0),
                rect: win.getBoundingClientRect(),
            };
        });
        bar?.addEventListener('pointermove', (e) => {
            if (!move) return;
            const r = move.rect;
            // Keep at least the title bar reachable on screen.
            const dx = Math.min(Math.max(e.clientX - move.startX, 80 - r.right), window.innerWidth - 80 - r.left);
            const dy = Math.min(Math.max(e.clientY - move.startY, -r.top), window.innerHeight - taskbarH() - 32 - r.top);
            win.dataset.x = move.baseX + dx;
            win.dataset.y = move.baseY + dy;
            win.style.transform = `translate(${move.baseX + dx}px, ${move.baseY + dy}px)`;
        });
        const stopMove = () => { move = null; };
        bar?.addEventListener('pointerup', stopMove);
        bar?.addEventListener('pointercancel', stopMove);
    }

    /* ---------- Resizable windows ---------- */
    // Mouse or pen: drag any edge or corner. Touch: pinch a window with two
    // fingers (the midpoint between them also moves it). The first resize
    // lifts the window out of the page flow (.resized, position: fixed) so
    // its size and place are just four numbers; close() puts it back.
    const MIN_W = 260;
    const MIN_H = 150;
    const RZ_DIRS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

    // Room a window may use: the screen above the taskbar.
    const desk = () => ({ w: window.innerWidth, h: window.innerHeight - taskbarH() });

    // Detach a window at its current on-screen rect (translate included).
    function detach(win) {
        const r = win.getBoundingClientRect();
        setRect(win, r.left, r.top, r.width, r.height);
        win.classList.add('resized');
        return { left: r.left, top: r.top, width: r.width, height: r.height };
    }

    function setRect(win, left, top, width, height) {
        const d = desk();
        width = Math.min(Math.max(width, Math.min(MIN_W, d.w)), d.w);
        height = Math.min(Math.max(height, Math.min(MIN_H, d.h)), d.h);
        left = Math.min(Math.max(left, 0), d.w - width);
        top = Math.min(Math.max(top, 0), d.h - height);
        win.style.transform = '';
        win.dataset.x = win.dataset.y = '0';
        win.style.setProperty('--win-l', `${left}px`);
        win.style.setProperty('--win-t', `${top}px`);
        win.style.setProperty('--win-w', `${width}px`);
        win.style.setProperty('--win-h', `${height}px`);
    }

    function unsize(win) {
        win.classList.remove('resized');
        ['--win-l', '--win-t', '--win-w', '--win-h'].forEach((p) => win.style.removeProperty(p));
    }

    function makeResizable(win) {
        RZ_DIRS.forEach((dir) => {
            const h = document.createElement('div');
            h.className = `rz rz-${dir}`;
            h.dataset.dir = dir;
            h.setAttribute('aria-hidden', 'true');
            win.append(h);
        });

        // Edge and corner handles.
        let rs = null;
        win.addEventListener('pointerdown', (e) => {
            const h = e.target.closest('.rz');
            if (!h || h.parentElement !== win || e.button !== 0 || win.classList.contains('maximized')) return;
            e.preventDefault();
            e.stopPropagation();
            h.setPointerCapture(e.pointerId);
            rs = { dir: h.dataset.dir, x: e.clientX, y: e.clientY, r: detach(win) };
            win.classList.add('resizing');
        });
        win.addEventListener('pointermove', (e) => {
            if (!rs) return;
            const { dir, r } = rs;
            const d = desk();
            // Clamp the pointer to the desk so the opposite edge never moves.
            const dx = Math.min(Math.max(e.clientX, 0), d.w) - rs.x;
            const dy = Math.min(Math.max(e.clientY, 0), d.h) - rs.y;
            let { left, top, width, height } = r;
            if (dir.includes('e')) width = r.width + dx;
            if (dir.includes('s')) height = r.height + dy;
            if (dir.includes('w')) {
                width = Math.max(r.width - dx, Math.min(MIN_W, d.w));
                left = r.left + r.width - width;
            }
            if (dir.includes('n')) {
                height = Math.max(r.height - dy, Math.min(MIN_H, d.h));
                top = r.top + r.height - height;
            }
            setRect(win, left, top, width, height);
        });
        const stop = () => {
            if (!rs) return;
            rs = null;
            win.classList.remove('resizing');
        };
        win.addEventListener('pointerup', stop);
        win.addEventListener('pointercancel', stop);
        win.addEventListener('lostpointercapture', stop);

        // Two-finger pinch (touch events, so we can stop the page zooming).
        let pinch = null;
        const span = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        const mid = (t) => ({ x: (t[0].clientX + t[1].clientX) / 2, y: (t[0].clientY + t[1].clientY) / 2 });
        // Fingers on this window. Not targetTouches: that only counts fingers that
        // landed on the same element, so a pinch with one finger on a label and
        // the other on a field or button never registered (only readme.txt,
        // which is one big text box, could be pinched).
        const fingers = (e) => [...e.touches].filter((t) => win.contains(t.target));
        win.addEventListener('touchstart', (e) => {
            const t = fingers(e);
            if (t.length !== 2 || win.classList.contains('maximized')) return;
            e.preventDefault();
            raise(win);
            pinch = { d0: span(t) || 1, m0: mid(t), r: detach(win) };
            win.classList.add('resizing');
        }, { passive: false });
        win.addEventListener('touchmove', (e) => {
            const t = fingers(e);
            if (!pinch || t.length !== 2) return;
            e.preventDefault();
            const { r, m0 } = pinch;
            const k = span(t) / pinch.d0;
            const m = mid(t);
            const d = desk();
            const width = Math.min(Math.max(r.width * k, Math.min(MIN_W, d.w)), d.w);
            const height = Math.min(Math.max(r.height * k, Math.min(MIN_H, d.h)), d.h);
            // Keep the spot between the fingers under the fingers.
            const left = m.x - (m0.x - r.left) * (width / r.width);
            const top = m.y - (m0.y - r.top) * (height / r.height);
            setRect(win, left, top, width, height);
        }, { passive: false });
        const endPinch = (e) => {
            if (!pinch || fingers(e).length >= 2) return;
            pinch = null;
            win.classList.remove('resizing');
        };
        win.addEventListener('touchend', endPinch);
        win.addEventListener('touchcancel', endPinch);
        win.addEventListener('gesturestart', (e) => e.preventDefault()); // iOS Safari page zoom

        // Closing puts the window back at its starting size and place.
        win.addEventListener('winclose', () => unsize(win));
    }

    Object.values(windows).forEach(({ win }) => makeResizable(win));

    // Keep sized windows on screen when the browser window shrinks or a phone rotates.
    window.addEventListener('resize', () => {
        document.querySelectorAll('.window.resized').forEach((win) => {
            const s = win.style;
            setRect(win,
                parseFloat(s.getPropertyValue('--win-l')) + Number(win.dataset.x || 0),
                parseFloat(s.getPropertyValue('--win-t')) + Number(win.dataset.y || 0),
                parseFloat(s.getPropertyValue('--win-w')),
                parseFloat(s.getPropertyValue('--win-h')));
        });
    });

    /* ---------- Launch Welcome ---------- */
    // On page load, and whenever welcome.exe (or Start > Welcome) starts it
    // from closed, Welcome opens straight away, zooming out of its icon.
    const welcomeIcon = document.querySelector('.desk-icon[href="#welcome"]');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function openWelcome() {
        const w = windows['#welcome'];
        if (!w) return;
        w.open();
        if (reduceMotion || !welcomeIcon) return;
        // Start the zoom from the icon's centre, measured from the window's centre.
        const from = welcomeIcon.getBoundingClientRect();
        const to = welcomeWin.getBoundingClientRect();
        welcomeWin.style.setProperty('--zoom-x', `${from.left + from.width / 2 - (to.left + to.width / 2)}px`);
        welcomeWin.style.setProperty('--zoom-y', `${from.top + from.height / 2 - (to.top + to.height / 2)}px`);
        welcomeWin.classList.remove('opening', 'zooming');
        void welcomeWin.offsetWidth; // restart the animation
        welcomeWin.classList.add('zooming');
    }
    welcomeWin?.addEventListener('animationend', (e) => {
        if (e.animationName === 'win-zoom') welcomeWin.classList.remove('zooming');
    });

    welcomeWin?.classList.remove('pending'); // JS has taken over showing/hiding it
    openWelcome(); // boot straight into the desktop

    /* ---------- Welcome window: animated ASCII aura ---------- */
    // A demoscene-style plasma drawn in characters: overlapping sine waves,
    // a glowing core that drifts around, rings pulsing out of it and a few
    // twinkling sparkles. Runs only while Welcome is visible.
    const aura = document.getElementById('ascii-aura');
    if (aura && welcomeWin) {
        const RAMP = ' .,:;-~=+*o#%@';
        const SPARKS = '+*.\'';
        const FPS = 18;
        let cols = 0;
        let rows = 0;
        let charW = 7;
        let rafId = 0;
        let last = 0;
        const t0 = performance.now();

        function measure() {
            const probe = document.createElement('span');
            probe.textContent = 'M'.repeat(50);
            aura.append(probe);
            // Layout sizes (offsetWidth/Height), not on-screen ones: the window
            // may be mid-zoom (scaled down) when this runs.
            charW = probe.offsetWidth / 50 || 7;
            probe.remove();
            cols = Math.ceil(aura.offsetWidth / charW);
            rows = Math.ceil(aura.offsetHeight / 12);
        }

        function frame(t) {
            const s = t / 1000;
            // The core wanders in a slow figure-eight.
            const cx = cols * (0.5 + 0.28 * Math.sin(s * 0.37));
            const cy = rows * (0.5 + 0.3 * Math.sin(s * 0.74));
            let out = '';
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const dx = (x - cx) * 0.5; // characters are ~2x taller than wide
                    const dy = y - cy;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    let v = Math.sin(x * 0.11 + s * 1.1)
                        + Math.sin(y * 0.23 - s * 1.4)
                        + Math.sin((x * 0.5 + y) * 0.09 + s * 0.6)
                        + Math.sin(d * 0.45 - s * 2.6); // rings radiating from the core
                    v = (v + 4) / 8; // 0..1
                    v = v * 0.75 + Math.max(0, 1 - d / 14) * 0.6; // the glow
                    if (Math.random() < 0.0025) {
                        out += SPARKS[(Math.random() * SPARKS.length) | 0];
                    } else {
                        out += RAMP[Math.min(RAMP.length - 1, Math.max(0, (v * RAMP.length) | 0))];
                    }
                }
                out += '\n';
            }
            aura.textContent = out;
        }

        function loop(t) {
            rafId = requestAnimationFrame(loop);
            if (t - last < 1000 / FPS) return;
            last = t;
            frame(t - t0);
        }

        function update() {
            const visible = !welcomeWin.hidden && !document.hidden;
            if (visible && !rafId) {
                measure();
                if (reduceMotion) frame(4000); // one still frame
                else rafId = requestAnimationFrame(loop);
            } else if (!visible && rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }

        new MutationObserver(update).observe(welcomeWin, { attributes: true, attributeFilter: ['hidden'] });
        document.addEventListener('visibilitychange', update);
        // Redraw straight away at the new size (e.g. after Maximize/Restore).
        new ResizeObserver(() => {
            if (welcomeWin.hidden) return;
            measure();
            frame(reduceMotion ? 4000 : performance.now() - t0);
        }).observe(welcomeWin);
        update();
    }

    /* ---------- Movable desktop icons ---------- */
    // Drag with a mouse or pen. A short click still opens the link; a drag
    // (more than a few pixels) moves the icon and swallows the click.
    // Touch is left alone so phones can still scroll past the icons.
    // Measured, since iPhones add the home-bar inset to the taskbar.
    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 42;
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
            dy = Math.min(Math.max(dy, -r.top), window.innerHeight - taskbarH() - r.bottom);
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

    /* ---------- Welcome drag, with a hidden "Not Responding" panic ---------- */
    // Welcome drags like any other window and stays where it's dropped. But
    // shake it back and forth quickly and it panics: the title says "Not
    // Responding", the title bar greys out and frozen copies smear behind the
    // pointer, like an old PC that stopped repainting. On release the screen
    // "repaints": the trail clears and the window stays where it was dropped.
    const hungWindow = document.querySelector('.window-welcome');
    const hungBar = hungWindow?.querySelector('.titlebar');
    const hungTitle = hungWindow?.querySelector('.titlebar-text');
    const welcomeStatus = hungWindow?.querySelector('.statusbar span');

    if (hungWindow && hungBar && hungTitle) {
        const baseTitle = hungTitle.textContent;
        const baseStatus = welcomeStatus?.textContent || 'Ready';
        const MAX_TRAIL = 140;
        const SHAKES = 4;          // direction changes needed...
        const SHAKE_WINDOW = 900;  // ...within this many milliseconds
        let drag = null;
        let statusTimer = 0;

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

        function panic() {
            const layer = document.createElement('div');
            layer.className = 'trail-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.append(layer);
            // The trail sits just under the window: give it the window's layer
            // and lift the window one step above it while it's frozen.
            const z = Number(hungWindow.style.zIndex) || LAYER_BASE;
            layer.style.zIndex = String(z);
            hungWindow.style.zIndex = String(z + 1);
            drag.layer = layer;
            drag.z = z;
            drag.lastStamp = null;
            hungWindow.classList.add('hung');
            hungTitle.textContent = `${baseTitle} (Not Responding)`;
            document.dispatchEvent(new CustomEvent('welcomepanic')); // the droid notices
        }

        hungBar.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 || e.target.closest('button') || hungWindow.classList.contains('maximized')) return; // buttons click normally; no dragging while maximized
            e.preventDefault();
            hungBar.setPointerCapture(e.pointerId);
            drag = {
                startX: e.clientX,
                startY: e.clientY,
                baseX: Number(hungWindow.dataset.x || 0),
                baseY: Number(hungWindow.dataset.y || 0),
                rect: hungWindow.getBoundingClientRect(),
                prevX: e.clientX,
                dir: 0,
                turns: [],
                layer: null,
            };
            hungWindow.style.transition = 'none';
        });

        hungBar.addEventListener('pointermove', (e) => {
            if (!drag) return;
            const r = drag.rect;
            // Keep at least the title bar reachable on screen.
            const dx = Math.min(Math.max(e.clientX - drag.startX, 80 - r.right), window.innerWidth - 80 - r.left);
            const dy = Math.min(Math.max(e.clientY - drag.startY, -r.top), window.innerHeight - taskbarH() - 32 - r.top);
            const x = drag.baseX + dx;
            const y = drag.baseY + dy;
            hungWindow.dataset.x = x;
            hungWindow.dataset.y = y;
            hungWindow.style.transform = `translate(${x}px, ${y}px)`;

            // Shake detection: count quick left/right direction changes.
            const step = e.clientX - drag.prevX;
            if (Math.abs(step) > 3) {
                const dir = Math.sign(step);
                if (drag.dir && dir !== drag.dir) {
                    const now = performance.now();
                    drag.turns = drag.turns.filter((t) => now - t < SHAKE_WINDOW);
                    drag.turns.push(now);
                    if (!drag.layer && drag.turns.length >= SHAKES) panic();
                }
                drag.dir = dir;
                drag.prevX = e.clientX;
            }

            // While panicking, leave a frozen copy every few pixels of travel.
            if (drag.layer && (drag.lastStamp === null || Math.hypot(x - drag.lastStamp.x, y - drag.lastStamp.y) >= 6)) {
                stamp();
                drag.lastStamp = { x, y };
            }
        });

        const release = () => {
            if (!drag) return;
            if (drag.layer) {
                // "Repaint": clear the trail and recover, right where it was dropped.
                drag.layer.remove();
                hungWindow.style.zIndex = String(drag.z);
                hungTitle.textContent = baseTitle;
                hungWindow.classList.remove('hung');
                if (welcomeStatus) {
                    welcomeStatus.textContent = 'Recovered. Please don\u2019t shake me.';
                    clearTimeout(statusTimer);
                    statusTimer = setTimeout(() => { welcomeStatus.textContent = baseStatus; }, 4000);
                }
            }
            drag = null;
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
