// System sounds: an original startup chime when the visitor logs on, plus small
// beeps other scripts can use (the desktop droid). Everything is synthesized
// with the Web Audio API; there are no sound files.
//
// Browsers only allow sound after the visitor has clicked or pressed a key,
// so a chime requested before that waits for the first interaction (if
// Welcome is still open by then). The tray speaker button mutes everything
// and remembers the choice.
//
// Loaded before main.js so its listener is in place for the first boot.
(function () {
    const KEY = 'systemSounds';
    let muted = false;
    try { muted = localStorage.getItem(KEY) === 'off'; } catch (e) { /* storage unavailable */ }

    let ctx = null;
    let master = null;
    let unlocked = false;
    let pendingChime = false;
    let chimedAt = 0;

    function audio() {
        if (ctx) return ctx;
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        ctx = new Ctx();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
        return ctx;
    }

    // One soft voice: a sine with a triangle an octave up, slow attack, long tail.
    function voice(freq, start, length, level, out) {
        const c = ctx;
        const g = c.createGain();
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(level, start + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0008, start + length);
        g.connect(out);
        [['sine', freq, 1], ['triangle', freq * 2, 0.25]].forEach(([type, f, mix]) => {
            const o = c.createOscillator();
            const og = c.createGain();
            o.type = type;
            o.frequency.value = f;
            o.detune.value = (Math.random() - 0.5) * 6;
            og.gain.value = mix;
            o.connect(og).connect(g);
            o.start(start);
            o.stop(start + length + 0.05);
        });
    }

    // The chime: a rising, airy major-ninth arpeggio over a low pad, with a
    // faint echo. About two and a half seconds; original, not a sample.
    function playChime() {
        if (!audio() || muted) return;
        chimedAt = performance.now();
        const t = ctx.currentTime + 0.05;
        const echo = ctx.createDelay();
        echo.delayTime.value = 0.28;
        const feedback = ctx.createGain();
        feedback.gain.value = 0.3;
        const wet = ctx.createGain();
        wet.gain.value = 0.35;
        echo.connect(feedback).connect(echo);
        echo.connect(wet).connect(master);
        const bus = ctx.createGain(); // this chime's own output: dry plus echo
        bus.connect(master);
        bus.connect(echo);

        voice(130.81, t, 2.6, 0.05, bus);          // C3 pad
        voice(196.0, t, 2.6, 0.04, bus);           // G3 pad
        [261.63, 329.63, 392.0, 587.33, 783.99].forEach((f, i) => {
            voice(f, t + 0.12 + i * 0.13, 1.9 - i * 0.12, 0.07, bus); // C4 E4 G4 D5 G5
        });
    }

    // A short robot chirp. pitch: base frequency; count: how many syllables.
    function beep(pitch = 880, count = 3) {
        if (!unlocked || !audio() || muted) return;
        let t = ctx.currentTime + 0.02;
        for (let i = 0; i < count; i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            const f = pitch * (0.7 + Math.random() * 0.9);
            const len = 0.05 + Math.random() * 0.09;
            o.type = Math.random() < 0.5 ? 'square' : 'sine';
            o.frequency.setValueAtTime(f, t);
            o.frequency.exponentialRampToValueAtTime(f * (Math.random() < 0.5 ? 1.6 : 0.6), t + len);
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, t + len);
            o.connect(g).connect(master);
            o.start(t);
            o.stop(t + len + 0.02);
            t += len + 0.03;
        }
    }

    // Play the chime now if the browser allows sound (it may, for sites the
    // visitor uses often or has set to allow sound); otherwise wait for the
    // first click or key press.
    function chime() {
        if (muted) return;
        if (unlocked) {
            playChime();
            return;
        }
        pendingChime = true;
        if (!audio()) return;
        const tryNow = () => {
            if (ctx.state === 'running' && pendingChime) {
                unlocked = true;
                pendingChime = false;
                playChime();
            }
        };
        tryNow();
        // resume() succeeds straight away where autoplay is allowed; where it
        // isn't, it waits (harmlessly) until the first interaction.
        ctx.resume().then(tryNow).catch(() => {});
    }

    // The first interaction unlocks audio (and plays a waiting chime if
    // Welcome is still on screen).
    function unlock() {
        if (unlocked) return;
        unlocked = true;
        if (!audio()) return;
        ctx.resume();
        const welcome = document.getElementById('welcome');
        if (pendingChime && welcome && !welcome.hidden) playChime();
        pendingChime = false;
    }
    ['pointerdown', 'keydown'].forEach((type) => document.addEventListener(type, unlock, { capture: true, once: false }));

    window.systemSound = {
        chime,
        beep,
        get muted() { return muted; },
        get chimed() { return chimedAt; }, // when the last chime started (for testing)
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Chime once per visit, when the visitor logs on. Relaunching
        // welcome.exe later stays quiet. (Without a log-on screen, chime the
        // first time Welcome opens instead.)
        if (document.getElementById('logon')) {
            document.addEventListener('logon', chime, { once: true });
        } else {
            document.getElementById('welcome')?.addEventListener('winopen', chime, { once: true });
        }

        // Tray speaker toggle
        const btn = document.getElementById('sound-btn');
        if (!btn) return;
        const sync = () => {
            btn.setAttribute('aria-pressed', String(!muted));
            btn.setAttribute('aria-label', muted ? 'System sounds off' : 'System sounds on');
            btn.title = muted ? 'System sounds: off' : 'System sounds: on';
            btn.classList.toggle('muted', muted);
        };
        sync();
        btn.addEventListener('click', () => {
            muted = !muted;
            try { localStorage.setItem(KEY, muted ? 'off' : 'on'); } catch (e) { /* storage unavailable */ }
            sync();
            if (!muted) beep(1100, 2); // a little confirmation blip
        });
    });
})();
