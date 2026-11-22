// Page-wide behaviour: theme toggle, greeting, footer year, mobile menu,
// active-section highlighting, scroll progress and scroll-reveal animations.
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;

    /* ---------- Theme (dark by default) ---------- */
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle?.addEventListener('click', () => {
        const isDark = root.dataset.theme !== 'light';
        root.dataset.theme = isDark ? 'light' : 'dark';
        try {
            localStorage.setItem('darkMode', String(!isDark));
        } catch (e) { /* storage unavailable */ }
    });

    /* ---------- Greeting & year ---------- */
    const greeting = document.getElementById('greeting');
    if (greeting) {
        const hour = new Date().getHours();
        greeting.textContent = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
    }

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Mobile menu ---------- */
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    function setMenu(open) {
        navLinks.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
    }

    menuBtn?.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    navLinks?.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav')) setMenu(false);
    });

    /* ---------- Header state & scroll progress ---------- */
    const header = document.querySelector('.site-header');
    const progress = document.getElementById('scroll-progress');

    function onScroll() {
        const max = root.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        progress.style.transform = `scaleX(${ratio})`;
        header.classList.toggle('scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Active nav link ---------- */
    const links = [...document.querySelectorAll('.nav-links a')];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((link) => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));

    // Clear the highlight when back at the hero.
    const hero = document.getElementById('home');
    if (hero) {
        new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) links.forEach((link) => link.classList.remove('active'));
        }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }

    /* ---------- Scroll reveal ---------- */
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    window.observeReveal = (el) => revealObserver.observe(el);
    document.querySelectorAll('.reveal').forEach(window.observeReveal);
});
