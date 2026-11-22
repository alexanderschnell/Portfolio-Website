// goalstat.exe: replays real output of the GOALSTAT COBOL batch program on a
// dot-matrix printer. The reports in assets/goalstat/ were produced by the
// program itself (github.com/alexanderschnell/arsenal-goals-cobol); this
// script only "prints" them: the print head sweeps back and forth across
// striped, tractor-fed paper, one line at a time.
document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('goalstat');
    const win = section?.querySelector('.window');
    if (!win) return;

    // The control cards for each job, exactly as they appear in the repo's cards/ folder.
    const JOBS = [
        { id: 'ALLGOALS', label: 'ALLGOALS: every goal', cards: ['* ALLGOALS - NO FILTERS: EVERY ARSENAL PREMIER LEAGUE GOAL, 2025-26'] },
        { id: 'SAKAAWAY', label: "SAKAAWAY: Saka's away goals", cards: ["* SAKAAWAY - BUKAYO SAKA'S AWAY GOALS", 'PLAYER=SAKA', 'VENUE=A'] },
        { id: 'NLDERBY', label: 'NLDERBY: North London derbies', cards: ['* NLDERBY - NORTH LONDON DERBY GOALS (OPPONENT MATCHES BY PREFIX)', 'OPPONENT=TOTTENHAM'] },
        { id: 'PENALTY', label: 'PENALTY: every penalty', cards: ['* PENALTY - EVERY PENALTY SCORED', 'TYPE=P'] },
        { id: 'LATEGOAL', label: 'LATEGOAL: stoppage-time goals', cards: ['* LATEGOAL - GOALS SCORED IN STOPPAGE TIME (45+ AND 90+)', 'STOPPAGE=Y'] },
        { id: 'RUNIN', label: 'RUNIN: title run-in, last 15 min', cards: ['* RUNIN - THE TITLE RUN-IN: ROUNDS 30-38, FINAL 15 MINUTES', 'ROUND=30-38', 'MINUTE=76-90'] },
        { id: 'BADCARD', label: 'BADCARD: invalid cards (RC 12)', cards: ['* BADCARD - DELIBERATELY INVALID CARDS, EXPECT RETURN CODE 12', 'VENUE=X', 'COLOUR=RED'] },
    ];

    const $ = (id) => document.getElementById(id);
    const jobSelect = $('gs-job');
    const runBtn = $('gs-run');
    const skipBtn = $('gs-skip');
    const soundBox = $('gs-sound');
    const deck = $('gs-deck');
    const paperWin = $('gs-paper-window');
    const paper = $('gs-paper');
    const head = $('gs-head');
    const led = $('gs-led');
    const status = $('gs-status');
    const rcText = $('gs-rc');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    JOBS.forEach((job) => jobSelect.add(new Option(job.label, job.id)));

    /* ---------- Punched cards ---------- */
    // Each control card is drawn as an 80-column punched card, with the holes
    // in the real IBM 029 keypunch code for its characters.
    const ROWS = [12, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const SPECIAL = {
        ' ': [], '&': [12], '-': [11], '/': [0, 1], '=': [6, 8], "'": [5, 8], '*': [11, 4, 8],
        ',': [0, 3, 8], '.': [12, 3, 8], '(': [12, 5, 8], ')': [11, 5, 8], ':': [2, 8], '+': [12, 6, 8],
    };
    function punches(ch) {
        if (ch in SPECIAL) return SPECIAL[ch];
        if (ch >= '0' && ch <= '9') return [Number(ch)];
        const c = ch.charCodeAt(0);
        if (ch >= 'A' && ch <= 'I') return [12, c - 64];
        if (ch >= 'J' && ch <= 'R') return [11, c - 73];
        if (ch >= 'S' && ch <= 'Z') return [0, c - 81];
        return [];
    }

    const NS = 'http://www.w3.org/2000/svg';
    function svgEl(name, attrs) {
        const el = document.createElementNS(NS, name);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    }

    function drawCard(text) {
        // 80 columns, 10 units apart; 12 rows, 24 units apart.
        const svg = svgEl('svg', { viewBox: '0 0 840 372', class: 'punch-card' });
        svg.append(svgEl('path', { d: 'M24 0H840V372H0V24Z', class: 'card-face' }));
        const printed = svgEl('text', { x: 20, y: 22, class: 'card-print', textLength: text.length * 10, lengthAdjust: 'spacingAndGlyphs' });
        printed.textContent = text; // keypunches printed the characters along the top edge
        svg.append(printed);
        ROWS.forEach((row, i) => {
            if (row < 0 || row > 9) return; // rows 12 and 11 have no printed digits
            const t = svgEl('text', { x: 21, y: 60 + i * 26 + 9, class: 'card-digits', textLength: 798, lengthAdjust: 'spacing' });
            t.textContent = String(row).repeat(80);
            svg.append(t);
        });
        [...text.slice(0, 80)].forEach((ch, col) => {
            punches(ch).forEach((row) => {
                svg.append(svgEl('rect', { x: 20 + col * 10, y: 50 + ROWS.indexOf(row) * 26, width: 6, height: 14, class: 'card-hole' }));
            });
        });
        return svg;
    }

    function showDeck(job) {
        deck.replaceChildren();
        // The first card is in front; later cards peek out behind it.
        [...job.cards].reverse().forEach((line, i, arr) => {
            const card = drawCard(line);
            const depth = arr.length - 1 - i;
            card.style.setProperty('--depth', depth);
            deck.append(card);
        });
        deck.style.setProperty('--cards', job.cards.length);
        deck.setAttribute('aria-label', `Control cards: ${job.cards.join(' / ')}`);
    }

    /* ---------- Sound (off until the visitor turns it on) ---------- */
    let audio = null;
    let noise = null;
    function initAudio() {
        if (audio) return;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audio = new Ctx();
        noise = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
        const data = noise.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }

    // The screech of the pins: band-passed noise chopped up by a fast square wave.
    function buzz(seconds) {
        if (!soundBox.checked || !audio || seconds <= 0) return;
        const t = audio.currentTime;
        const src = audio.createBufferSource();
        src.buffer = noise;
        src.loop = true;
        const band = audio.createBiquadFilter();
        band.type = 'bandpass';
        band.frequency.value = 2400 + Math.random() * 400;
        band.Q.value = 3;
        const gain = audio.createGain();
        gain.gain.value = 0.0;
        const chop = audio.createOscillator();
        chop.type = 'square';
        chop.frequency.value = 110 + Math.random() * 30;
        const chopGain = audio.createGain();
        chopGain.gain.value = 0.09;
        chop.connect(chopGain).connect(gain.gain);
        src.connect(band).connect(gain).connect(audio.destination);
        src.start(t);
        chop.start(t);
        src.stop(t + seconds);
        chop.stop(t + seconds);
    }

    // The platen advancing the paper.
    function thunk() {
        if (!soundBox.checked || !audio) return;
        const t = audio.currentTime;
        const osc = audio.createOscillator();
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.05);
        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain).connect(audio.destination);
        osc.start(t);
        osc.stop(t + 0.07);
    }

    soundBox.addEventListener('change', () => {
        if (soundBox.checked) {
            initAudio();
            audio?.resume();
        }
        try { localStorage.setItem('goalstatSound', soundBox.checked ? '1' : '0'); } catch (e) { /* storage unavailable */ }
    });

    /* ---------- The printer ---------- */
    const CPS = 700; // characters per second as the head sweeps
    const LINE_FEED_MS = 45;
    const reports = {};
    let job = null; // the job being printed
    let firstOpen = true;
    let charW = 7;

    function measure() {
        const probe = document.createElement('span');
        probe.textContent = 'M'.repeat(50);
        paper.append(probe);
        charW = probe.getBoundingClientRect().width / 50 || 7;
        probe.remove();
    }

    async function loadReport(id) {
        if (!reports[id]) {
            const res = await fetch(`assets/goalstat/${id}.txt`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            reports[id] = text.replace(/\s+$/, '').split(/\r?\n/).map((l) => l.replace(/\s+$/, ''));
        }
        return reports[id];
    }

    // Blank paper above the first line, so printing starts at the print head.
    function feedBlank() {
        // Each printed line starts with its own line feed, so the newest line
        // always sits right above the print head.
        const lead = Math.max(0, Math.floor(paperWin.clientHeight / 16) - 1);
        paper.textContent = '\n'.repeat(lead);
        paperWin.scrollTop = paperWin.scrollHeight;
    }

    // Where the head sits: over a column of the paper, allowing for sideways scroll.
    function moveHead(col) {
        const paperLeft = paper.offsetLeft + parseFloat(getComputedStyle(paper).paddingLeft);
        head.style.transform = `translateX(${paperLeft + col * charW - paperWin.scrollLeft}px)`;
    }

    function setStatus(text, rc) {
        status.textContent = text;
        if (rc !== undefined) {
            rcText.textContent = rc === null ? 'LPT1: online' : `RC ${String(rc).padStart(4, '0')}`;
            rcText.className = rc === null ? '' : rc === 0 ? 'rc-ok' : rc < 8 ? 'rc-warn' : 'rc-bad';
        }
    }

    function finish(current) {
        current.done = true;
        skipBtn.disabled = true;
        runBtn.disabled = false;
        led.classList.remove('busy');
        head.classList.remove('printing');
        const last = current.lines.join('\n').match(/RETURN CODE (\d+)/);
        const rc = last ? Number(last[1]) : 0;
        setStatus(`Job GOALSTAT (${current.id}) ended: ${current.lines.length} lines printed`, rc);
        moveHead(0);
    }

    // Print one line, sweeping left-to-right or right-to-left (bidirectional,
    // like the real thing), then advance the paper.
    function printLine(current) {
        if (current !== job || current.done) return;
        const i = current.next;
        if (i >= current.lines.length) {
            finish(current);
            return;
        }
        const text = current.lines[i];
        const span = document.createElement('span');
        span.className = 'line';
        span.style.opacity = (0.8 + Math.random() * 0.2).toFixed(2); // uneven ribbon ink
        paper.append('\n', span);
        paperWin.scrollTop = paperWin.scrollHeight;
        setStatus(`Printing ${current.id}: line ${i + 1} of ${current.lines.length}`);

        const len = text.length;
        const ltr = i % 2 === 0;
        const ms = (len / CPS) * 1000;
        buzz(ms / 1000);
        const start = performance.now();

        function step(now) {
            if (current !== job || current.done) return;
            const n = Math.min(len, Math.round(((now - start) / ms) * len) || 0);
            if (ltr) {
                span.textContent = text.slice(0, n);
                moveHead(n);
            } else {
                span.textContent = ' '.repeat(len - n) + text.slice(len - n);
                moveHead(len - n);
            }
            if (n < len) {
                setTimeout(() => step(performance.now()), 16);
            } else {
                span.textContent = text;
                current.next = i + 1;
                thunk();
                current.timer = setTimeout(() => printLine(current), LINE_FEED_MS);
            }
        }
        if (len === 0) {
            current.next = i + 1;
            current.timer = setTimeout(() => printLine(current), LINE_FEED_MS);
        } else {
            setTimeout(() => step(performance.now()), 16);
        }
    }

    // Print whatever is left in one go.
    function formFeed() {
        const current = job;
        if (!current || current.done) return;
        clearTimeout(current.timer);
        current.done = true; // stops the running sweep
        const printedSoFar = current.next;
        const spans = paper.querySelectorAll('.line');
        if (spans.length > printedSoFar) spans[spans.length - 1].textContent = current.lines[printedSoFar];
        const rest = current.lines.slice(printedSoFar + (spans.length > printedSoFar ? 1 : 0));
        rest.forEach((text) => {
            const span = document.createElement('span');
            span.className = 'line';
            span.style.opacity = (0.8 + Math.random() * 0.2).toFixed(2);
            span.textContent = text;
            paper.append('\n', span);
        });
        paperWin.scrollTop = paperWin.scrollHeight;
        finish(current);
    }

    async function runJob() {
        const id = jobSelect.value;
        const chosen = JOBS.find((j) => j.id === id);
        if (job) {
            clearTimeout(job.timer);
            job.done = true;
        }
        const current = { id, next: 0, done: false, lines: [] };
        job = current;

        showDeck(chosen);

        // Tear off the previous printout before starting a new one.
        if (paper.querySelector('.line') && !reduceMotion) {
            paper.classList.add('tearing');
            await new Promise((r) => setTimeout(r, 380));
            paper.classList.remove('tearing');
        }
        if (current !== job) return;

        setStatus(`Submitting job GOALSTAT (${id})…`, null);
        led.classList.add('busy');
        try {
            current.lines = await loadReport(id);
        } catch (err) {
            if (current !== job) return;
            current.done = true;
            led.classList.remove('busy');
            runBtn.disabled = false;
            paper.textContent = '';
            setStatus('Printer error: the report could not be loaded. Try again.', null);
            return;
        }
        if (current !== job) return;

        measure();
        feedBlank();
        skipBtn.disabled = false;
        head.classList.add('printing');
        if (reduceMotion) formFeed();
        else printLine(current);
    }

    runBtn.addEventListener('click', runJob);
    skipBtn.addEventListener('click', formFeed);
    jobSelect.addEventListener('change', () => showDeck(JOBS.find((j) => j.id === jobSelect.value)));
    paperWin.addEventListener('scroll', () => {
        if (job?.done) moveHead(0);
    });

    // The first time the program is opened, run the full report straight away.
    win.addEventListener('winopen', () => {
        if (!firstOpen) return;
        firstOpen = false;
        runJob();
    });
    // Closing the program cancels the job and clears the paper.
    win.addEventListener('winclose', () => {
        if (job) {
            clearTimeout(job.timer);
            job.done = true;
            job = null;
        }
        firstOpen = true;
        paper.textContent = '';
        led.classList.remove('busy');
        head.classList.remove('printing');
        runBtn.disabled = false;
        skipBtn.disabled = true;
        setStatus('Ready', null);
    });

    try { soundBox.checked = localStorage.getItem('goalstatSound') === '1'; } catch (e) { /* storage unavailable */ }
    if (soundBox.checked) initAudio(); // resumes on the first click (browsers block autoplay)
    document.addEventListener('pointerdown', () => { if (soundBox.checked) audio?.resume(); }, { once: true });
    showDeck(JOBS[0]);
});
