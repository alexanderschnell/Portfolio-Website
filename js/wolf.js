// The ASCII wolf: an original drawing, the site's logo. The favicon
// (assets/images/favicon.svg) is a still frame of this shape.
//
// Used as the Start menu avatar (main.js mounts it while the menu is open).
//
// The head is a shape (ears, fur ruff, muzzle) shaded with light from the
// upper left and rippling fur, drawn with a ramp of characters from sparse
// to dense. Its eyes blink and an ear twitches now and then.
//
// Usage: <span class="ascii-wolf-box"><pre class="ascii-wolf"></pre></span>
// (styles in css/wolf.css), then
//   const stop = asciiWolf.mount(document.querySelector('.ascii-wolf'));
// asciiWolf.frame(n) returns frame n as plain text (60x50 characters).
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    function frame(n) {
        const t = n * 0.12;
        const blink = n % 22 === 0 || n % 22 === 1;
        const twitch = n % 37 < 2;
        const head = HEAD.map((p) => p.slice());
        const earL = EAR_L.map((p) => p.slice());
        if (twitch) { head[0][0] -= 0.08; head[0][1] += 0.06; earL[0][0] -= 0.07; earL[0][1] += 0.05; }

        let out = '';
        for (let r = 0; r < ROWS; r++) {
            // sample the drawing slightly shrunk so it has a little margin
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
        return out;
    }

    // Animate the wolf in a <pre>, scaled to fit its parent box whatever
    // monospace font (and minimum text size) the device uses. Returns a
    // function that stops the animation.
    function mount(el) {
        let n = 0;
        const draw = () => { el.textContent = frame(++n); };
        draw();
        const timer = reduceMotion ? 0 : setInterval(draw, 140);
        const fit = () => {
            const box = el.parentElement;
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            if (!w || !h) return;
            el.style.setProperty('--wolf-k', String(Math.min(box.clientWidth / w, box.clientHeight / h)));
        };
        fit();
        window.addEventListener('resize', fit);
        document.fonts?.ready.then(fit);
        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', fit);
        };
    }

    window.asciiWolf = { frame, mount };
})();
