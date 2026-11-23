// Desktop pet: "Bit", a small original maintenance droid with jet boots. It
// hovers along the top of the taskbar, stops to look around, sometimes jets
// up onto a window's title bar (and rides along if the window is dragged),
// walks off a window's edge and jets back down, beeps and hops when
// clicked, can be picked up and dropped, and dozes off when the visitor goes
// idle. Its colours come from the current skin.
document.addEventListener('DOMContentLoaded', () => {
    // Measured, since iPhones add the home-bar inset to the taskbar.
    const taskbarH = () => document.querySelector('.taskbar')?.offsetHeight || 42;
    const W = 46;
    const H = 52;
    const GRAVITY = 1500;      // px/s²
    const JET_FALL = 0.55;     // jets cut gravity to this fraction while falling
    const MAX_FALL = 520;      // px/s: terminal speed with the jets on
    const SPEED = 55;          // hovering speed, px/s
    const SLEEP_AFTER = 30000; // ms without activity
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const el = document.createElement('div');
    el.className = 'droid';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Bit, a small desktop robot. Click it to say hi.');
    el.title = 'Bit';
    el.innerHTML = `
        <div class="droid-bubble" aria-live="polite"></div>
        <svg class="droid-svg" viewBox="0 0 40 46" aria-hidden="true">
            <g class="d-bob">
                <line class="d-antenna" x1="25" y1="2.5" x2="25" y2="10"/>
                <circle class="d-tip" cx="25" cy="2.5" r="1.8"/>
                <rect class="d-shell" x="7.5" y="9.5" width="25" height="14" rx="4.5"/>
                <rect class="d-visor" x="10.5" y="12.5" width="19" height="7" rx="3.5"/>
                <g class="d-eye-track"><circle class="d-eye" cx="20" cy="16" r="2.4"/></g>
                <rect class="d-neck" x="17" y="23.5" width="6" height="2.5"/>
                <rect class="d-shell" x="9" y="25.5" width="22" height="12" rx="3"/>
                <rect class="d-panel" x="12" y="28.5" width="9" height="2.2" rx="1"/>
                <rect class="d-panel d-panel-dim" x="12" y="32" width="6" height="2.2" rx="1"/>
                <circle class="d-light" cx="26" cy="30" r="1.3"/>
                <circle class="d-light d-light-2" cx="26" cy="34" r="1.3"/>
            </g>
                <rect class="d-leg" x="12" y="37" width="3" height="2.5"/>
                <rect class="d-leg" x="25" y="37" width="3" height="2.5"/>
                <rect class="d-boot" x="9.5" y="39" width="8" height="4" rx="1.6"/>
                <rect class="d-boot" x="22.5" y="39" width="8" height="4" rx="1.6"/>
                <rect class="d-nozzle" x="11.5" y="43" width="4" height="1.4" rx="0.5"/>
                <rect class="d-nozzle" x="24.5" y="43" width="4" height="1.4" rx="0.5"/>
            </g>
            <g class="d-jet"><path class="d-flame" d="M11.6 44.4h3.8l-1.9 8.5z"/><path class="d-flame-core" d="M12.6 44.4h1.8l-0.9 4.6z"/></g>
            <g class="d-jet"><path class="d-flame" d="M24.6 44.4h3.8l-1.9 8.5z"/><path class="d-flame-core" d="M25.6 44.4h1.8l-0.9 4.6z"/></g>
        </svg>`;
    document.body.append(el);

    const svg = el.querySelector('.droid-svg');
    const eye = el.querySelector('.d-eye-track');
    const bob = el.querySelector('.d-bob');
    const bubble = el.querySelector('.droid-bubble');

    // State
    let x = -W;
    let y = ground();
    let vy = 0;
    let facing = 1;          // 1 = right, -1 = left
    let thrust = 0;          // 0..1, how hard the jets are firing (drawn as flame size)
    let lift = 0;            // px the body hovers above the surface
    let surface = null;      // null = taskbar, otherwise the window element it stands on
    let surfaceOffset = 0;   // x relative to the left edge of that window
    let mode = 'enter';      // enter | roll | look | hop | fall | carried | sleep
    let targetX = 140;       // where it's heading on the taskbar (screen x)
    let targetOff = 0;       // where it's heading on a window (offset from its left edge)
    let until = 0;           // when the current pause ends
    let hop = null;
    let drag = null;
    let lastActivity = performance.now();
    let bubbleTimer = 0;

    function ground() {
        return window.innerHeight - taskbarH() - H + 4; // boots rest on the taskbar edge
    }

    function visibleWindows() {
        return [...document.querySelectorAll('.window')].filter((w) => {
            if (w.classList.contains('trail') || w.closest('[hidden]') || w.hidden) return false;
            const r = w.getBoundingClientRect();
            return r.width > 120 && r.top > H + 10 && r.top < window.innerHeight - taskbarH() - 60;
        });
    }

    /* ---------- Layering ---------- */
    // Bit lives in the same front-to-back order as the windows: standing on a
    // window it takes that window's layer (it comes later in the page, so it
    // draws just above its own window and behind any window in front). On the
    // taskbar it sits just under all windows; while carried it's on top.
    const GROUND_Z = 49;
    const CARRIED_Z = 1000;
    let z = GROUND_Z;

    function layerZ(win) {
        const layer = window.desktopLayers?.layerOf(win) || win;
        return Number(getComputedStyle(layer).zIndex) || GROUND_Z + 1;
    }

    // The window actually visible at a point (so Bit never lands on a part of
    // a title bar that another window is covering).
    function topWindowAt(px, py) {
        for (const node of document.elementsFromPoint(px, py)) {
            if (el.contains(node)) continue;
            const w = node.closest('.window');
            if (w && !w.classList.contains('trail')) return w;
            if (node.closest('.taskbar')) return null;
        }
        return null;
    }

    function say(text, ms = 1600) {
        bubble.textContent = text;
        bubble.classList.add('show');
        clearTimeout(bubbleTimer);
        bubbleTimer = setTimeout(() => bubble.classList.remove('show'), ms);
    }

    function lookAround(ms) {
        mode = 'look';
        until = performance.now() + ms;
    }

    function pickNext() {
        const now = performance.now();
        const r = Math.random();
        const wins = visibleWindows();
        if (r < 0.22 && wins.length && !reduceMotion && window.innerWidth > 520) {
            // Hop up onto (or across to) a window's title bar.
            const w = wins[Math.floor(Math.random() * wins.length)];
            if (w !== surface) {
                const rect = w.getBoundingClientRect();
                // Pick a spot on the title bar that isn't hidden behind another window.
                for (let tries = 0; tries < 6; tries++) {
                    const tx = rect.left + 20 + Math.random() * Math.max(10, rect.width - W - 40);
                    if (topWindowAt(tx + W / 2, rect.top + 4) === w) {
                        startHop(tx, rect.top - H + 3, w, rect);
                        return;
                    }
                }
            }
        }
        if (r < 0.55) {
            lookAround(1200 + Math.random() * 2200);
            return;
        }
        mode = 'roll';
        void now;
        if (surface) {
            // On a window: wander along its title bar, measured from its left
            // edge so it moves with the window. Sometimes walk right off an
            // edge and jet back down.
            const width = surface.getBoundingClientRect().width;
            if (Math.random() < 0.3) {
                targetOff = Math.random() < 0.5 ? -W : width + 4;
            } else {
                targetOff = 4 + Math.random() * Math.max(1, width - W - 8);
            }
        } else {
            targetX = 8 + Math.random() * Math.max(1, window.innerWidth - W - 16);
        }
    }

    // Step off the window it's standing on.
    function dropOff() {
        surface = null;
        vy = 0;
        mode = 'fall';
        say(Math.random() < 0.5 ? 'whoosh!' : 'wheee!', 900);
    }

    function startHop(tx, ty, toWindow, rect) {
        hop = { fromX: x, fromY: y, toX: tx, toY: ty, t: 0, dur: 0.7, to: toWindow, rect };
        facing = tx >= x ? 1 : -1;
        mode = 'hop';
        window.systemSound?.beep(1200, 1);
    }

    // Land on a window title bar if falling through its top edge, else the taskbar.
    function landingFor(prevBottom, newBottom, cx) {
        for (const w of visibleWindows()) {
            const r = w.getBoundingClientRect();
            if (cx > r.left + 6 && cx < r.right - 6 && prevBottom <= r.top + 3 && newBottom >= r.top + 3
                && topWindowAt(cx, r.top + 4) === w) {
                return { win: w, y: r.top - H + 3 };
            }
        }
        if (newBottom >= ground() + H) return { win: null, y: ground() };
        return null;
    }

    function land(target) {
        surface = target.win;
        y = target.y;
        vy = 0;
        if (surface) surfaceOffset = x - surface.getBoundingClientRect().left;
        lookAround(700);
    }

    /* ---------- Main loop ---------- */
    let last = performance.now();
    function step(now) {
        requestAnimationFrame(step);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        if (document.hidden) return;

        // Riding a window: always move with it, and drop off if it closes or
        // if Bit is past either edge (the window moved, shrank or Bit walked off).
        if (surface && mode !== 'hop' && mode !== 'carried') {
            const r = surface.getBoundingClientRect();
            if (surface.hidden || surface.closest('[hidden]') || r.width === 0) {
                dropOff();
            } else {
                x = r.left + surfaceOffset;
                y = r.top - H + 3;
                const centre = surfaceOffset + W / 2;
                if (centre < 2 || centre > r.width - 2) dropOff();
            }
        } else if (!surface && mode !== 'hop' && mode !== 'carried' && mode !== 'fall') {
            y = ground();
        }

        // Fall asleep when the visitor has been idle for a while.
        if (mode !== 'sleep' && mode !== 'carried' && mode !== 'fall' && mode !== 'hop' && now - lastActivity > SLEEP_AFTER) {
            mode = 'sleep';
            el.classList.add('asleep');
            say('z z z', 2500);
        }

        let moving = 0;
        switch (mode) {
            case 'enter':
            case 'roll': {
                if (reduceMotion) { mode = 'look'; until = Infinity; break; }
                const d = surface ? targetOff - surfaceOffset : targetX - x;
                facing = d >= 0 ? 1 : -1;
                const stepX = Math.sign(d) * Math.min(Math.abs(d), SPEED * dt);
                if (surface) {
                    surfaceOffset += stepX;
                    x = surface.getBoundingClientRect().left + surfaceOffset;
                } else {
                    x += stepX;
                }
                moving = stepX;
                if (Math.abs(d) < 1) {
                    if (mode === 'enter') { say('beep!'); window.systemSound?.beep(900, 2); }
                    lookAround(900 + Math.random() * 1500);
                }
                break;
            }
            case 'look':
                if (now > until) pickNext();
                break;
            case 'hop': {
                hop.t += dt / hop.dur;
                const t = Math.min(1, hop.t);
                // keep aiming at the window even if it moved mid-hop
                if (hop.to) {
                    const r = hop.to.getBoundingClientRect();
                    hop.toY = r.top - H + 3;
                }
                x = hop.fromX + (hop.toX - hop.fromX) * t;
                y = hop.fromY + (hop.toY - hop.fromY) * t - Math.sin(t * Math.PI) * 90;
                if (t >= 1) {
                    const target = hop.to && !hop.to.closest('[hidden]') ? { win: hop.to, y: hop.toY } : { win: null, y: ground() };
                    hop = null;
                    land(target);
                }
                break;
            }
            case 'fall': {
                // Jets fire on the way down: a controlled descent, not a drop.
                const prevBottom = y + H;
                vy = Math.min(MAX_FALL, vy + GRAVITY * JET_FALL * dt);
                y += vy * dt;
                const hit = landingFor(prevBottom, y + H, x + W / 2);
                if (hit) land(hit);
                break;
            }
            default:
                break;
        }

        // Keep on screen horizontally.
        x = Math.max(-W, Math.min(window.innerWidth - W + 2, x));

        // Jets: how hard they fire depends on what Bit is doing. While moving
        // it hovers a few pixels above the surface; standing still, it lands.
        const want = { hop: 1, fall: 0.85, carried: 0.35, roll: 0.55, enter: 0.55 }[mode] ?? 0;
        thrust += ((moving || mode !== 'roll' ? want : 0) - thrust) * Math.min(1, dt * 10);
        const hoverTarget = moving ? 4 : 0;
        lift += (hoverTarget - lift) * Math.min(1, dt * 8);
        el.style.setProperty('--thrust', thrust.toFixed(3));
        bob.style.transform = moving ? `translateY(${Math.sin(now / 120) * 0.7}px)` : '';

        el.style.transform = `translate(${x}px, ${y - lift}px)`;
        svg.style.transform = `scaleX(${facing})`;
        // Layer: follow the window it's on (or heading to); keep the current
        // layer while falling, so it doesn't jump in front of windows mid-air.
        if (mode === 'carried') z = CARRIED_Z;
        else if (mode === 'hop') z = hop?.to ? layerZ(hop.to) : GROUND_Z;
        else if (mode !== 'fall') z = surface ? layerZ(surface) : GROUND_Z;
        else if (z === CARRIED_Z) z = GROUND_Z; // just dropped: fall at desktop level
        el.style.zIndex = String(z);

        el.dataset.state = mode; // handy for styling and debugging
        el.dataset.on = surface ? (surface.closest('section')?.id || 'window') : 'taskbar';
    }

    /* ---------- Eye: glances around, follows the pointer when it's near ---------- */
    let eyeX = 0;
    function glance() {
        if (mode === 'sleep') return;
        eyeX = (Math.random() * 2 - 1) * 4.5;
        eye.style.transform = `translateX(${eyeX}px)`;
    }
    setInterval(glance, 1800);

    /* ---------- Clicking and carrying ---------- */
    el.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
        drag = { sx: e.clientX, sy: e.clientY, ox: e.clientX - x, oy: e.clientY - y, moved: false };
    });

    el.addEventListener('pointermove', (e) => {
        if (!drag) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 5) return;
        if (!drag.moved) {
            drag.moved = true;
            mode = 'carried';
            surface = null;
            el.classList.add('carried');
            el.classList.remove('asleep');
            say('whoa!', 900);
            window.systemSound?.beep(1500, 2);
        }
        x = e.clientX - drag.ox;
        y = Math.max(0, Math.min(ground(), e.clientY - drag.oy)); // keep it on screen
        el.style.transform = `translate(${x}px, ${y}px)`;
    });

    const release = () => {
        if (!drag) return;
        const wasDrag = drag.moved;
        drag = null;
        el.classList.remove('carried');
        if (wasDrag) {
            vy = 0;
            mode = 'fall';
            return;
        }
        // A click: wake up, beep, hop on the spot.
        el.classList.remove('asleep');
        el.classList.add('happy');
        setTimeout(() => el.classList.remove('happy'), 900);
        const lines = ['beep-boop!', 'bweee?', '*whirr*', 'bip bip!', 'hello, human', '01101000 01101001'];
        say(lines[Math.floor(Math.random() * lines.length)]);
        window.systemSound?.beep(700 + Math.random() * 700, 3 + Math.floor(Math.random() * 3));
        if (!reduceMotion && mode !== 'fall' && mode !== 'hop') {
            startHop(x, y, surface, null);
            hop.toY = y;
            hop.dur = 0.45;
        } else if (mode === 'sleep') {
            lookAround(800);
        }
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);

    /* ---------- Waking up ---------- */
    const activity = () => {
        lastActivity = performance.now();
        if (mode === 'sleep') {
            el.classList.remove('asleep');
            say('!', 800);
            lookAround(600);
        }
    };
    ['mousemove', 'keydown', 'pointerdown', 'wheel', 'touchstart'].forEach((t) => document.addEventListener(t, activity, { passive: true }));

    // When someone shakes Welcome until it stops responding, Bit notices.
    document.addEventListener('welcomepanic', () => {
        el.classList.remove('asleep');
        if (mode === 'sleep') lookAround(800);
        say('uh oh…', 1800);
        window.systemSound?.beep(420, 4);
    });

    window.addEventListener('resize', () => {
        if (!surface && mode !== 'carried') y = ground();
    });

    // Roll in from the left shortly after the desktop appears.
    if (reduceMotion) {
        x = 120;
        mode = 'look';
        until = Infinity;
    } else {
        until = Infinity; // wait for the roll-in below
        mode = 'look';
        x = -W;
        // Wait for the visitor to log on (if there's a log-on screen), then roll in.
        const rollIn = () => setTimeout(() => { targetX = 110 + Math.random() * 80; mode = 'enter'; }, 1500);
        const logon = document.getElementById('logon');
        if (logon && !logon.hidden) document.addEventListener('logon', rollIn, { once: true });
        else rollIn();
    }
    requestAnimationFrame(step);
});
