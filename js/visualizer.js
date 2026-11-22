// visualizer.exe: a 2000s-style audio visualizer. It listens to the
// visitor's microphone (after the browser asks permission) or plays an audio
// file they open, and draws a spectrum with falling peak caps and/or an
// oscilloscope line in the current skin's colours. All analysis happens in
// the browser; nothing is recorded or uploaded.
document.addEventListener('DOMContentLoaded', () => {
    const section = document.getElementById('visualizer');
    const win = section?.querySelector('.window');
    const canvas = document.getElementById('viz-canvas');
    if (!win || !canvas) return;

    const g = canvas.getContext('2d');
    const micBtn = document.getElementById('viz-mic');
    const fileInput = document.getElementById('viz-file');
    const stopBtn = document.getElementById('viz-stop');
    const modeSelect = document.getElementById('viz-mode');
    const idle = document.getElementById('viz-idle');
    const status = document.getElementById('viz-status');
    const sourceText = document.getElementById('viz-source');

    const BARS = 48;
    let ctx = null;
    let analyser = null;
    let freq = null;
    let wave = null;
    let source = null;   // the current audio source node
    let stream = null;   // microphone stream
    let player = null;   // <audio> element for files
    let fileUrl = null;
    let rafId = 0;
    const peaks = new Float32Array(BARS);
    const levels = new Float32Array(BARS);
    let colours = null;

    // Pull the skin's colours, so the display matches the theme.
    function readColours() {
        const css = getComputedStyle(document.documentElement);
        const pick = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
        // The screen is always dark, so: bars in the skin's accent fading to
        // white at the top, white peak caps, and a pale scope line that glows
        // in the accent colour.
        const accent = pick('--accent', '#a6ff4d');
        colours = { bar: accent, bar2: '#ffffff', peak: '#ffffff', scope: '#eef8ff', glow: accent };
    }
    new MutationObserver(readColours).observe(document.documentElement, { attributes: true, attributeFilter: ['data-skin'] });
    readColours();

    function ensureAudio() {
        if (ctx) return true;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) {
            status.textContent = 'Sorry, this browser can’t analyse audio.';
            return false;
        }
        ctx = new Ctx();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.78;
        freq = new Uint8Array(analyser.frequencyBinCount);
        wave = new Uint8Array(analyser.fftSize);
        return true;
    }

    function size() {
        const r = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(r.width * dpr));
        canvas.height = Math.max(1, Math.round(r.height * dpr));
        g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    new ResizeObserver(size).observe(canvas);

    // Spread the bars over a log frequency scale (about 40 Hz to 16 kHz),
    // so bass, mids and treble each get a fair share.
    function bandRange(i) {
        const nyquist = ctx.sampleRate / 2;
        const lo = 40 * Math.pow(16000 / 40, i / BARS);
        const hi = 40 * Math.pow(16000 / 40, (i + 1) / BARS);
        const n = freq.length;
        return [Math.floor((lo / nyquist) * n), Math.max(Math.floor((lo / nyquist) * n) + 1, Math.ceil((hi / nyquist) * n))];
    }

    function draw() {
        rafId = requestAnimationFrame(draw);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        g.clearRect(0, 0, w, h);
        const mode = modeSelect.value;

        // faint grid, like an old LCD
        g.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        g.lineWidth = 1;
        for (let y = 0; y < h; y += 16) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); g.stroke(); }

        analyser.getByteFrequencyData(freq);
        analyser.getByteTimeDomainData(wave);

        if (mode !== 'scope') {
            const gap = 3;
            const bw = (w - gap * (BARS - 1)) / BARS;
            const grad = g.createLinearGradient(0, h, 0, 0);
            grad.addColorStop(0, colours.bar);
            grad.addColorStop(0.7, colours.bar);
            grad.addColorStop(1, colours.bar2);
            for (let i = 0; i < BARS; i++) {
                const [a, b] = bandRange(i);
                let sum = 0;
                for (let k = a; k < b && k < freq.length; k++) sum += freq[k];
                const v = sum / Math.max(1, b - a) / 255;
                levels[i] = Math.max(v, levels[i] * 0.86); // quick rise, smooth fall
                const bh = levels[i] * (h - 8);
                // segmented bars, like LED meters
                g.fillStyle = grad;
                for (let y = h - 3; y > h - bh; y -= 5) g.fillRect(i * (bw + gap), y - 3, bw, 3);
                // peak caps fall slowly
                peaks[i] = Math.max(levels[i], peaks[i] - 0.006);
                g.fillStyle = colours.peak;
                g.fillRect(i * (bw + gap), h - peaks[i] * (h - 8) - 6, bw, 2);
            }
        }

        if (mode !== 'bars') {
            g.lineWidth = 2;
            g.strokeStyle = colours.scope;
            g.shadowColor = colours.glow;
            g.shadowBlur = 8;
            g.beginPath();
            const mid = mode === 'scope' ? h / 2 : h * 0.3;
            const amp = mode === 'scope' ? h * 0.45 : h * 0.22;
            const step = Math.max(1, Math.floor(wave.length / w));
            for (let x = 0, i = 0; x < w && i < wave.length; x++, i += step) {
                const y = mid + ((wave[i] - 128) / 128) * amp;
                if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
            }
            g.stroke();
            g.shadowBlur = 0;
        }
    }

    function begin(node, label) {
        stopSource();
        source = node;
        source.connect(analyser);
        idle.hidden = true;
        stopBtn.disabled = false;
        sourceText.textContent = `Input: ${label}`;
        if (!rafId) { size(); draw(); }
    }

    function stopSource() {
        if (source) { try { source.disconnect(); } catch (e) { /* already gone */ } }
        source = null;
        if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
        if (player) { player.pause(); player.removeAttribute('src'); player.load(); player = null; }
        if (fileUrl) { URL.revokeObjectURL(fileUrl); fileUrl = null; }
    }

    function stopAll(message = 'Stopped') {
        stopSource();
        cancelAnimationFrame(rafId);
        rafId = 0;
        peaks.fill(0);
        levels.fill(0);
        g.clearRect(0, 0, canvas.width, canvas.height);
        idle.hidden = false;
        stopBtn.disabled = true;
        micBtn.textContent = 'Listen (microphone)';
        sourceText.textContent = 'Input: none';
        status.textContent = message;
    }

    micBtn.addEventListener('click', async () => {
        if (!ensureAudio()) return;
        if (!navigator.mediaDevices?.getUserMedia) {
            status.textContent = 'Microphone access isn’t available here (it needs a secure https page).';
            return;
        }
        status.textContent = 'Waiting for microphone permission…';
        try {
            await ctx.resume();
            const s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } });
            const node = ctx.createMediaStreamSource(s);
            begin(node, 'microphone');
            stream = s; // after begin(), which clears any previous source
            micBtn.textContent = 'Listening…';
            status.textContent = 'Listening. Talk, sing or play some music near your mic.';
        } catch (err) {
            status.textContent = err && err.name === 'NotAllowedError'
                ? 'Microphone permission was declined. You can still open a music file.'
                : 'Couldn’t start the microphone.';
        }
    });

    fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        fileInput.value = ''; // allow picking the same file again later
        if (!file || !ensureAudio()) return;
        await ctx.resume();
        const audioEl = new Audio();
        const url = URL.createObjectURL(file);
        audioEl.src = url;
        const node = ctx.createMediaElementSource(audioEl);
        node.connect(ctx.destination); // files are heard as well as seen
        begin(node, file.name);
        player = audioEl;
        fileUrl = url;
        micBtn.textContent = 'Listen (microphone)';
        audioEl.addEventListener('ended', () => stopAll('Finished playing'));
        try {
            await audioEl.play();
            status.textContent = `Playing ${file.name}`;
        } catch (e) {
            stopAll('That file couldn’t be played.');
        }
    });

    stopBtn.addEventListener('click', () => stopAll());

    // Closing the program releases the microphone and stops any music.
    win.addEventListener('winclose', () => stopAll('Ready'));
});
