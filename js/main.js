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
            const dy = Math.min(Math.max(e.clientY - move.startY, -r.top), window.innerHeight - TASKBAR_H - 32 - r.top);
            win.dataset.x = move.baseX + dx;
            win.dataset.y = move.baseY + dy;
            win.style.transform = `translate(${move.baseX + dx}px, ${move.baseY + dy}px)`;
        });
        const stopMove = () => { move = null; };
        bar?.addEventListener('pointerup', stopMove);
        bar?.addEventListener('pointercancel', stopMove);
    }

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
    /* ---------- Log-on screen ---------- */
    // The desktop boots when the visitor clicks their name (or presses
    // Enter). That click is also what lets the browser play the startup chime.
    // Other scripts can wait for the 'logon' event on document.
    const logon = document.getElementById('logon');
    const logonUser = document.getElementById('logon-user');

    // The profile picture: an animated ASCII wolf, an original drawing
    // rendered like a zoomed-out image. The head is a shape (ears, fur ruff,
    // muzzle) shaded with light from the upper left and rippling fur, then
    // drawn with a ramp of characters from sparse to dense. Its eyes blink and
    // an ear twitches now and then. It stops once the visitor has logged on.
    const wolfEl = document.getElementById('logon-wolf');
    let wolfTimer = 0;
    if (wolfEl) {
        const COLS = 60;
        const ROWS = 50;
        const RAMP = ' .\'`,:;-~=+*o#%@';

        // Head outline, in a -1..1 box (x right, y down). Ear tips are the
        // first and fourth points; the left one twitches.
        const HEAD = [
            [-0.62, -0.96], [-0.27, -0.46], [0.27, -0.46], [0.62, -0.96],
            [0.74, -0.30], [0.93, 0.02], [0.64, 0.30], [0.26, 0.64],
            [0.12, 0.98], [-0.12, 0.98], [-0.26, 0.64], [-0.64, 0.30],
            [-0.93, 0.02], [-0.74, -0.30],
        ];
        const EAR_L = [[-0.60, -0.84], [-0.36, -0.50], [-0.64, -0.40]];
        const EAR_R = [[0.60, -0.84], [0.36, -0.50], [0.64, -0.40]];

        function inside(poly, x, y) {
            let hit = false;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [xi, yi] = poly[i];
                const [xj, yj] = poly[j];
                if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
            }
            return hit;
        }

        // Distance from a point to the outline (for the fur fringe at the edge).
        function edgeDist(poly, x, y) {
            let best = Infinity;
            for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
                const [ax, ay] = poly[j];
                const [bx, by] = poly[i];
                const dx = bx - ax;
                const dy = by - ay;
                const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
                best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
            }
            return best;
        }

        const ellipse = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;

        let frame = 0;
        function drawWolf() {
            frame++;
            const t = frame * 0.12;
            const blink = frame % 22 === 0 || frame % 22 === 1;
            const twitch = frame % 37 < 2;
            const head = HEAD.map((p) => p.slice());
            const earL = EAR_L.map((p) => p.slice());
            if (twitch) { head[0][0] -= 0.08; head[0][1] += 0.06; earL[0][0] -= 0.07; earL[0][1] += 0.05; }

            let out = '';
            for (let r = 0; r < ROWS; r++) {
                // sample the drawing slightly shrunk so it sits inside the round frame
                const y = ((r / (ROWS - 1)) * 2 - 1 - 0.03) / 0.86;
                for (let c = 0; c < COLS; c++) {
                    const x = ((c / (COLS - 1)) * 2 - 1) / 0.86;
                    const ang = Math.atan2(y - 0.1, x);
                    // a ragged, slowly rippling fur fringe around the edge
                    const fringe = 0.035 * Math.sin(ang * 26 + t) + 0.02 * Math.sin(ang * 61 - t * 1.3);
                    const isIn = inside(head, x, y);
                    const d = edgeDist(head, x, y);
                    if (!(isIn ? true : d < fringe)) { out += ' '; continue; }

                    // base fur with light from the upper left
                    let v = 0.52 - 0.16 * x - 0.10 * y;
                    // fur strands flowing outward from the face, rippling over time
                    v += 0.10 * Math.sin(ang * 14 + Math.hypot(x, y) * 9 - t);
                    // darker rim right at the edge for definition
                    if (isIn && d < 0.05) v -= 0.18;
                    // pale blaze down the forehead and a light muzzle
                    v += 0.22 * Math.exp(-((x / 0.11) ** 2)) * (y > -0.5 && y < 0.55 ? 1 : 0);
                    if (ellipse(x, y, 0, 0.62, 0.24, 0.34) < 1) v += 0.18;
                    // dark inner ears
                    if (inside(earL, x, y) || inside(EAR_R, x, y)) v = 0.12 + 0.05 * Math.sin(y * 20 + t);
                    // eyes: dark mask, then a glowing slit (or a closed line when blinking)
                    for (const s of [-1, 1]) {
                        const ex = s * 0.31;
                        const ey = -0.12; // both eyes level
                        const tilt = (y - ey) + s * (x - ex) * 0.35; // slanted
                        const mask = ellipse(x, ey + tilt, ex, ey, 0.17, 0.085);
                        if (mask < 1) v = Math.min(v, 0.16);
                        const eye = ellipse(x, ey + tilt, ex, ey, 0.09, blink ? 0.01 : 0.032);
                        if (eye < 1) v = blink ? 0.45 : 1;
                    }
                    // nose and mouth line
                    if (ellipse(x, y, 0, 0.84, 0.09, 0.05) < 1) v = 0.05;
                    if (Math.abs(x) < 0.018 && y > 0.89 && y < 0.97) v = 0.1;

                    const i = Math.max(1, Math.min(RAMP.length - 1, Math.round(v * (RAMP.length - 1))));
                    out += RAMP[i];
                }
                out += '\n';
            }
            wolfEl.textContent = out;
        }

        drawWolf();
        if (!reduceMotion) wolfTimer = setInterval(drawWolf, 140);
    }

    // Behind the card: an original, misty cyber forest drawn in ASCII. It's
    // a still scene with living details. A dim layer holds a tame, still haze,
    // a great old tree with flaring roots, the forest floor and ferns. The
    // backdrop is kept deliberately plain so the foreground reads clearly. A
    // bright layer holds the lights: data streaks flowing down the great tree,
    // glowing patches on the floor and roots, and a few drifting motes. The
    // ferns sway in the breeze and the floor lights twinkle.
    const forestEl = logon?.querySelector('.logon-forest');
    const scene = forestEl?.querySelector('.lf-scene');
    const glow = forestEl?.querySelector('.lf-glow');
    let forestTimer = 0;
    if (forestEl && scene && glow) {
        // dots and strokes rather than dashes, so mist reads as haze, not scanlines
        const RAMP = " .`':;!|iIlo*%#@";
        const start = performance.now();
        let cols = 0;
        let rows = 0;
        let charW = 3.3;
        let lineH = 6;
        let W = 0;
        let H = 0;
        // Per-cell data computed once per screen size
        let base = null;      // static brightness: fog, trunks, great tree, floor
        let kind = null;      // 0 open air, 2 great tree, 3 floor
        let treeCols = [];    // columns of the great tree that carry data streaks
        let floorLights = [];
        let motes = [];
        let ferns = [];
        let crown = null;     // the great tree's leafy top: 0 outside, rising toward clump centres
        let leafN = null;     // leaf texture noise
        let boughs = null;    // branching inside the crown: 1 where a branch runs
        let strands = [];     // willow-like strands of leaves hanging from the crown
        let wind = 1;

        const hash = (n) => {
            const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
            return s - Math.floor(s);
        };
        const hash2 = (a, b) => hash(a * 57.3 + b * 113.9);
        function noise(x, y) {
            const xi = Math.floor(x);
            const yi = Math.floor(y);
            const xf = x - xi;
            const yf = y - yi;
            const u = xf * xf * (3 - 2 * xf);
            const v = yf * yf * (3 - 2 * yf);
            const a = hash2(xi, yi);
            const b = hash2(xi + 1, yi);
            const c = hash2(xi, yi + 1);
            const d = hash2(xi + 1, yi + 1);
            return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
        }
        const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;

        // The great tree: trunk centre and half-width at a height (pixels)
        const tree = {
            cx: (py) => W * 0.8 + W * 0.018 * Math.sin((py / H) * 3.2),
            hw: (py) => {
                const t = py / H;
                return W * (0.055 + 0.6 * Math.max(0, t - 0.62) ** 2 + 0.008 * Math.sin(t * 11));
            },
        };
        // Thick limbs reaching up into the crown
        const limbs = [
            { x1: 0.79, y1: 0.36, x2: 0.6, y2: 0.06, w: 0.016 },
            { x1: 0.81, y1: 0.28, x2: 0.93, y2: -0.02, w: 0.013 },
            { x1: 0.8, y1: 0.18, x2: 0.72, y2: -0.05, w: 0.01 },
        ];
        function limbDist(px, py, L) {
            const ax = L.x1 * W;
            const ay = L.y1 * H;
            const bx = L.x2 * W;
            const by = L.y2 * H;
            const dx = bx - ax;
            const dy = by - ay;
            const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
            return { d: Math.hypot(px - ax - t * dx, py - ay - t * dy), t };
        }

        function build() {
            const probe = document.createElement('span');
            probe.textContent = 'M'.repeat(40);
            scene.append(probe);
            charW = probe.getBoundingClientRect().width / 40 || 3.3;
            probe.remove();
            lineH = parseFloat(getComputedStyle(scene).lineHeight) || 6;
            const box = forestEl.getBoundingClientRect();
            cols = Math.ceil(box.width / charW) + 1;
            rows = Math.ceil(box.height / lineH) + 1;
            W = cols * charW;
            H = rows * lineH;
            const n = cols * rows;
            base = new Float32Array(n);
            kind = new Uint8Array(n);
            crown = new Float32Array(n);
            leafN = new Float32Array(n);
            // leaf clumps (x, y as fractions of the screen, r as a fraction of its
            // width): a broad, heavy crown spanning the top from about a third of
            // the way in, sized for the trunk. A dense upper layer, then a lower
            // layer whose outer ends hang down like boughs weighed with leaves.
            const clumps = [];
            for (let j = 0; j < 16; j++) {
                const x = 0.36 + j * 0.044 + (hash(j * 4.1) - 0.5) * 0.02;
                clumps.push({ x, y: 0.03 + hash(j * 2.7) * 0.06, r: 0.075 + hash(j * 6.3) * 0.03 });
            }
            for (let j = 0; j < 13; j++) {
                const x = 0.4 + j * 0.052 + (hash(j * 3.9 + 50) - 0.5) * 0.02;
                const out = Math.abs(x - 0.79) / 0.4; // 0 over the trunk, 1 at the ends
                clumps.push({ x, y: 0.16 + 0.12 * out * out + hash(j * 7.7 + 50) * 0.04, r: 0.05 + hash(j * 1.9 + 50) * 0.025 });
            }
            // drooping ends, and a heavy skirt of leaves around the top of the
            // trunk, so the limbs disappear into the crown instead of showing bare
            clumps.push({ x: 0.41, y: 0.27, r: 0.04 }, { x: 1.0, y: 0.31, r: 0.04 });
            clumps.push({ x: 0.62, y: 0.27, r: 0.05 }, { x: 0.69, y: 0.3, r: 0.055 }, { x: 0.76, y: 0.32, r: 0.05 },
                { x: 0.84, y: 0.31, r: 0.05 }, { x: 0.91, y: 0.29, r: 0.05 }, { x: 0.8, y: 0.25, r: 0.06 });

            for (let r = 0; r < rows; r++) {
                const py = r * lineH;
                const fy = py / H;
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    const px = c * charW;
                    // a tame, still backdrop: one soft band of haze behind the tree,
                    // kept low so the foreground silhouettes read clearly against it
                    // (dithered per cell, so it fades out as a stipple instead of hard bands)
                    let v = 0.03 + 0.12 * Math.exp(-(((fy - 0.62) / 0.24) ** 2)) * (1 - 0.4 * Math.abs(px / W - 0.45));
                    v += (hash2(c, r) - 0.5) * 0.06;
                    let k = 0;
                    // the great tree: trunk, flaring roots and limbs
                    const cx = tree.cx(py);
                    const hw = tree.hw(py);
                    const bark = fbm(px / 7, py / 46);
                    let inTree = Math.abs(px - cx) < hw * (0.88 + 0.24 * bark);
                    let limbV = -1;
                    for (const L of limbs) {
                        const { d, t } = limbDist(px, py, L);
                        const lw = W * L.w * (1 - t * 0.6);
                        // edge = 0 along the limb's spine, 1 at its outline
                        if (d < lw) { limbV = Math.max(limbV, d / lw); inTree = true; }
                    }
                    if (inTree) {
                        // a dark mass with bark texture and a moonlit left edge
                        const side = Math.max(-1, Math.min(1, (px - cx) / hw));
                        v = limbV >= 0 ? 0.05 + (bark - 0.5) * 0.06 : 0.05 + (bark - 0.5) * 0.1 + 0.03 * Math.sin(px / 3 + bark * 6);
                        if (limbV < 0 && side < -0.82) v += 0.4 * (side + 1.18) * 2;
                        k = 2;
                    }
                    // forest floor
                    const ground = H * (0.86 + 0.025 * Math.sin(px / 90) + 0.02 * noise(px / 40, 1));
                    if (py > ground && k !== 2) {
                        v = 0.08 + 0.14 * fbm(px / 14, py / 9);
                        k = 3;
                    }
                    base[i] = v;
                    if (fy < 0.5) {
                        // lumpy outline: warp each clump's edge with noise
                        const warp = 0.75 + 0.5 * fbm(px / 40, py / 26);
                        let cr = 0;
                        for (const K of clumps) {
                            const dx = (px - K.x * W) / (K.r * W);
                            const dy = (py - K.y * H) / (K.r * W * 0.62);
                            cr = Math.max(cr, 1 - Math.hypot(dx, dy) / warp);
                        }
                        crown[i] = cr;
                        leafN[i] = fbm(px / 9, py / 7);
                    }
                    kind[i] = k;
                }
            }

            // data streaks: some columns across the great tree
            treeCols = [];
            for (let c = 0; c < cols; c++) {
                if (hash(c * 7.7) < 0.42) treeCols.push({ c, phase: hash(c * 3.3) * 60, speed: 6 + hash(c * 5.1) * 10, len: 6 + Math.floor(hash(c * 9.9) * 12), gap: 18 + Math.floor(hash(c * 2.2) * 26) });
            }

            // glowing floor and root lights, gathered in patches
            floorLights = [];
            for (let i = 0; i < cols * 2.2; i++) {
                const c = Math.floor(hash(i * 1.37) * cols);
                const px = c * charW;
                const patch = noise(px / 60, 9.1);
                if (patch < 0.45) continue;
                const nearTree = Math.abs(px - W * 0.8) < W * 0.22;
                const top = H * (nearTree ? 0.78 : 0.84);
                const r = Math.floor((top + hash(i * 2.91) * (H - top)) / lineH);
                if (r < rows) floorLights.push({ c, r, phase: hash(i * 5.3) * 6.28, big: hash(i * 8.1) > 0.85 });
            }

            // branching inside the crown: boughs fork from the top of the trunk,
            // curving and tapering into twigs. Seen as dark silhouettes against
            // the leaves, never as bright lines.
            boughs = new Uint8Array(n);
            const stamp = (x, y, w) => {
                const rw = Math.max(w, charW * 0.55);
                const c0 = Math.max(0, Math.floor((x - rw) / charW));
                const c1 = Math.min(cols - 1, Math.ceil((x + rw) / charW));
                const r0 = Math.max(0, Math.floor((y - rw) / lineH));
                const r1 = Math.min(rows - 1, Math.ceil((y + rw) / lineH));
                for (let r = r0; r <= r1; r++) {
                    for (let c = c0; c <= c1; c++) {
                        if (Math.hypot(c * charW - x, r * lineH - y) <= rw) boughs[r * cols + c] = 1;
                    }
                }
            };
            let seed = 1;
            const grow = (x, y, ang, len, w, depth) => {
                const steps = Math.max(3, Math.round(len / (lineH * 0.8)));
                const bend = (hash(seed++) - 0.5) * 0.5; // each bough curves its own way
                for (let s = 0; s < steps; s++) {
                    const u = s / steps;
                    ang += (bend + (hash(seed++) - 0.5) * 0.35) / steps * 2;
                    x += Math.cos(ang) * (len / steps);
                    y += Math.sin(ang) * (len / steps);
                    stamp(x, y, w * (1 - u * 0.35));
                }
                if (depth <= 0 || w < 0.6) return;
                const kids = hash(seed++) > 0.55 ? 3 : 2;
                for (let k = 0; k < kids; k++) {
                    const spread = (k - (kids - 1) / 2) * (0.5 + hash(seed++) * 0.35);
                    grow(x, y, ang + spread, len * (0.62 + hash(seed++) * 0.15), w * 0.62, depth - 1);
                }
            };
            const tx = tree.cx(H * 0.34);
            [
                { a: -Math.PI + 0.28, len: 0.2, w: 0.011 },  // the long reach to the left
                { a: -Math.PI + 0.75, len: 0.13, w: 0.01 },
                { a: -Math.PI / 2 - 0.15, len: 0.1, w: 0.012 },
                { a: -0.7, len: 0.11, w: 0.01 },
                { a: -0.2, len: 0.09, w: 0.009 },
            ].forEach((B) => grow(tx, H * 0.34, B.a, B.len * W, B.w * W, 4));

            // hanging strands: from the underside of the crown, longest toward the
            // outer ends, like the boughs are weighed down with leaves
            strands = [];
            for (let c = 0; c < cols; c += 2) {
                let bottom = -1;
                const maxR = Math.min(rows, Math.ceil((H * 0.5) / lineH));
                for (let r = maxR - 1; r >= 0; r--) {
                    if (crown[r * cols + c] > 0.12) { bottom = r; break; }
                }
                if (bottom < 0 || hash(c * 1.31) < 0.35) continue;
                const out = Math.min(1, Math.abs(c * charW - W * 0.79) / (W * 0.4));
                const len = Math.round((H * (0.03 + 0.11 * out + 0.07 * hash(c * 2.17))) / lineH);
                strands.push({ c, r0: bottom - 2, len, phase: hash(c * 3.7) * 6.28, leafy: hash(c * 5.9) });
            }

            motes = Array.from({ length: Math.round(cols / 30) }, () => ({ x: Math.random() * cols, y: rows * (0.2 + Math.random() * 0.75), v: 0.2 + Math.random() * 0.5, p: Math.random() * 6.28 }));

            // ferns in the foreground corners
            ferns = [
                { x: 0.05, s: 1.0, seed: 1 }, { x: 0.17, s: 0.75, seed: 2 },
                { x: 0.6, s: 0.8, seed: 3 }, { x: 0.97, s: 1.05, seed: 4 },
            ].map((f) => ({ ...f, fronds: Array.from({ length: 7 }, (_, j) => ({ a: -Math.PI / 2 + (j - 3) * 0.38 + (hash(f.seed * 10 + j) - 0.5) * 0.2, len: H * (0.13 + hash(f.seed * 20 + j) * 0.08) * f.s, phase: hash(f.seed * 30 + j) * 6.28 })) }));
        }

        function plot(buf, c, r, v) {
            if (c < 0 || c >= cols || r < 0 || r >= rows) return;
            const i = r * cols + c;
            if (v > buf[i]) buf[i] = v;
        }

        function drawForest() {
            const t = (performance.now() - start) / 1000;
            wind = 0.7 + 0.3 * Math.sin(t * 0.23) + 0.25 * Math.max(0, Math.sin(t * 0.61));
            const n = cols * rows;
            const val = Float32Array.from(base);
            const glowCh = new Array(n).fill(' ');

            // the great tree's crown, swaying in the same wind as the ferns:
            // the top of the screen (the outermost leaves) moves the most
            const crownRows = Math.min(rows, Math.ceil((H * 0.5) / lineH));
            for (let r = 0; r < crownRows; r++) {
                const fy = (r * lineH) / H;
                const reach = 1 - fy / 0.5;
                const sway = Math.round((Math.sin(t * 0.9 * wind + r * 0.04) * 2.6 + 1.2) * wind * reach);
                for (let c = 0; c < cols; c++) {
                    const sc = c - sway;
                    if (sc < 0 || sc >= cols) continue;
                    const s = r * cols + sc;
                    const cr = crown[s];
                    if (cr <= 0) continue;
                    const lf = leafN[s];
                    // leaf flutter: a little shimmer that rises with the gusts
                    const flick = Math.sin(t * 5 + sc * 0.9 + r * 1.7) * 0.05 * wind;
                    const d = cr + (lf - 0.5) * 0.7 + flick;
                    const i = r * cols + c;
                    if (d > 0.3) val[i] = 0.15 + 0.22 * lf + 0.08 * reach; // textured leaf mass
                    else if (d > 0.14) val[i] = 0.42 + 0.06 * reach;     // moonlit fringe
                    else continue;
                    // boughs show as dark silhouettes, except where a clump of
                    // leaves sits in front of them
                    if (boughs[s] && lf < 0.64) val[i] = 0.02;
                }
            }

            // hanging strands: they follow the crown at the top and swing more
            // freely toward the tips, on the same wind
            const swayAt = (r) => {
                const fy = (r * lineH) / H;
                const reach = Math.max(0, 1 - fy / 0.5);
                return (Math.sin(t * 0.9 * wind + r * 0.04) * 2.6 + 1.2) * wind * reach;
            };
            for (const S of strands) {
                const top = swayAt(S.r0);
                for (let k = 0; k <= S.len; k++) {
                    const u = k / S.len;
                    const swing = Math.sin(t * 0.9 * wind + S.phase + k * 0.09) * wind * (1.5 + S.len * 0.1) * u ** 1.4;
                    const c = Math.round(S.c + top + swing);
                    const r = S.r0 + k;
                    const fade = 1 - u * 0.45;
                    plot(val, c, r, 0.3 * fade);
                    // small leaves along the strand, thinning toward the tip
                    if ((k + Math.round(S.leafy * 4)) % 2 === 0 && hash2(S.c, k) > u * 0.7) {
                        plot(val, c + (hash2(k, S.c) > 0.5 ? 1 : -1), r, 0.4 * fade);
                    }
                }
            }

            // ferns: fronds arching out, with leaflets, swaying
            ferns.forEach((F) => {
                const bx = F.x * W;
                const by = H + lineH;
                F.fronds.forEach((fr) => {
                    const a = fr.a + Math.sin(t * 0.9 * wind + fr.phase) * 0.06 * wind;
                    const steps = Math.round(fr.len / (lineH * 0.6));
                    for (let s = 1; s <= steps; s++) {
                        const u = s / steps;
                        // arch: rise along the angle, then droop toward the tip
                        const x = bx + Math.cos(a) * fr.len * u * 1.4;
                        const y = by + Math.sin(a) * fr.len * u + fr.len * 0.55 * u * u;
                        const c = Math.round(x / charW);
                        const r = Math.round(y / lineH);
                        plot(val, c, r, 0.5);
                        if (s % 2 === 0) {
                            const leaf = Math.round((1 - u) * 7 + 1);
                            const nx = -Math.sin(a);
                            for (let q = 1; q <= leaf; q++) {
                                plot(val, Math.round((x + nx * q * charW * 1.4) / charW), Math.round((y + q * lineH * 0.35) / lineH), 0.4);
                                plot(val, Math.round((x - nx * q * charW * 1.4) / charW), Math.round((y + q * lineH * 0.35) / lineH), 0.4);
                            }
                        }
                    }
                });
            });

            // data streaks flowing down the great tree
            for (const S of treeCols) {
                const px = S.c * charW;
                for (let r = 0; r < rows; r++) {
                    const i = r * cols + S.c;
                    if (kind[i] !== 2 || val[i] !== base[i]) continue; // hidden behind leaves
                    const py = r * lineH;
                    if (Math.abs(px - tree.cx(py)) > tree.hw(py) * 0.92) continue;
                    const pos = (((r - t * S.speed + S.phase) % S.gap) + S.gap) % S.gap;
                    if (pos < S.len) {
                        const head = pos > S.len - 2;
                        glowCh[i] = head ? '|' : hash2(S.c, r) > 0.7 ? ':' : hash2(r, S.c) > 0.85 ? '1' : '|';
                        if (!head && pos < 2) glowCh[i] = '.';
                    } else if (hash2(S.c * 3, r) > 0.985 && Math.sin(t * 3 + r) > 0) {
                        glowCh[i] = '=';
                    }
                }
            }

            // twinkling floor and root lights
            for (const L of floorLights) {
                const tw = Math.sin(t * 1.6 + L.phase);
                if (tw > -0.35) glowCh[L.r * cols + L.c] = L.big && tw > 0.5 ? 'o' : tw > 0.4 ? '*' : '.';
            }

            // motes drifting up through the air
            motes.forEach((m) => {
                m.y -= m.v * 0.25;
                m.x += Math.sin(t * 0.8 + m.p) * 0.3 + 0.15 * wind;
                if (m.y < rows * 0.12 || m.x > cols) { m.y = rows * (0.7 + Math.random() * 0.25); m.x = Math.random() * cols; }
                const c = Math.round(m.x);
                const r = Math.round(m.y);
                if (c >= 0 && c < cols && r >= 0 && r < rows) glowCh[r * cols + c] = Math.sin(t * 4 + m.p) > 0.6 ? '*' : '.';
            });

            let outBase = '';
            let outGlow = '';
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const i = r * cols + c;
                    // contrast curve: dark parts become empty, so silhouettes read clearly
                    const lit = Math.max(0, (val[i] - 0.11) * 1.7);
                    const idx = Math.max(0, Math.min(RAMP.length - 1, Math.round(lit * (RAMP.length - 1))));
                    outBase += RAMP[idx];
                    outGlow += glowCh[i];
                }
                outBase += '\n';
                outGlow += '\n';
            }
            scene.textContent = outBase;
            glow.textContent = outGlow;
        }

        build();
        drawForest();
        if (!reduceMotion) forestTimer = setInterval(drawForest, 120);
        window.addEventListener('resize', () => {
            if (logon.hidden) return;
            build();
            drawForest();
        });
    }

    if (logon && logonUser) {
        logonUser.focus({ preventScroll: true });
        logonUser.addEventListener('click', () => {
            if (logon.classList.contains('leaving')) return;
            logon.classList.add('leaving');
            document.getElementById('logon-status').textContent = 'Welcome';
            setTimeout(() => {
                clearInterval(wolfTimer); // the wolf and the forest can rest once the desktop is up
                clearInterval(forestTimer);
                logon.hidden = true;
                document.dispatchEvent(new CustomEvent('logon'));
                openWelcome();
            }, reduceMotion ? 0 : 420);
        });
    } else {
        openWelcome(); // no log-on screen: boot straight away
    }

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
            const dy = Math.min(Math.max(e.clientY - drag.startY, -r.top), window.innerHeight - TASKBAR_H - 32 - r.top);
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
