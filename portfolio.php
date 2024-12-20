<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
/* Reset default margin, padding, and box-sizing */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Body Styles */
body {
    font-family: 'Montserrat', sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #F5F5F5;
    color: #36454F;
    height: 100vh;
    display: flex;
    flex-direction: column;
    transition: background-color 0.3s ease;
    overflow: hidden;
    position: fixed;
    width: 100%;
}

/* Body Background Pattern */
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M18 17v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2zm0-15V0h-1v2h-2v1h2v2h1V3h2V2h-2zM3 17v-2H2v2H0v1h2v2h1v-2h2v-1H3zM3 2V0H2v2H0v1h2v2h1V3h2V2H3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
}

/* Header and Navigation Styles */
header {
    background-color: rgba(255, 255, 255, 0.95);
    color: #333333;
    height: 70px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 0 2rem;
    position: relative;
    z-index: 10;
    transition: background-color 0.3s ease;
}

nav ul {
    list-style-type: none;
    display: flex;
    gap: 40px;
    padding-right: 25px;
}

nav ul li a {
    color: #333333;
    text-decoration: none;
    font-weight: 500;
    font-size: 18px;
    padding: 8px 16px;
    border-radius: 4px;
    transition: all 0.3s ease;
}

nav ul li a:hover {
    color: #00BFA5;
    background-color: rgba(0, 191, 165, 0.1);
}

/* Mobile Menu Button */
.mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: inherit;
    padding: 10px;
    cursor: pointer;
}

.mobile-menu-btn svg {
    stroke: #333333;
}

/* Main Content Styles */
main {
    position: fixed;
    top: 70px;
    bottom: 70px;
    left: 0;
    right: 0;
    overflow-y: auto;
    padding: 40px;
    -webkit-overflow-scrolling: touch;
}

/* Custom scrollbar */
main::-webkit-scrollbar {
    width: 12px;
}

main::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}

main::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    border: 3px solid #F5F5F5;
}

/* Dark mode scrollbar */
body.dark-mode main::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border: 3px solid #1a1a1a;
}

body.dark-mode main::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
}

h2 {
    font-family: 'Montserrat', sans-serif;
    font-size: 32px;
    font-weight: 700;
    color: #333;
    margin-bottom: 30px;
    text-align: center;
}

/* Repository Card Styles */
.github-repos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px 0;
    min-height: 200px;
    position: relative;
}

.repo-card {
    background: #ffffff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    min-height: 200px;
    position: relative;
}

.repo-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.repo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
}

.repo-header h3 {
    margin: 0;
    color: #333333;
    font-family: 'Montserrat', sans-serif;
    padding-right: 30px;
}

.repo-header a {
    color: #666;
    transition: color 0.3s ease;
}

.repo-header a:hover {
    color: #00BFA5;
}

.repo-description {
    flex-grow: 1;
    margin-bottom: 15px;
    color: #666;
}

.repo-stats {
    display: flex;
    gap: 15px;
    font-size: 0.9rem;
    color: #666;
    margin-top: auto;
}

.repo-stats span {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 4px 8px;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}

/* Footer Styles */
footer {
    background-color: rgba(255, 255, 255, 0.95);
    color: #333333;
    height: 70px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    padding: 0 2rem;
    padding-bottom: env(safe-area-inset-bottom, 0px);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    z-index: 100;
    transition: background-color 0.3s ease;
}

footer p {
    font-size: 0.8rem;
    margin: 0;
    text-align: center;
}

.social-links {
    justify-self: start;
    display: flex;
    gap: 20px;
    align-items: center;
}

.social-links a {
    color: #333333;
    text-decoration: none;
    transition: color 0.3s ease;
}

.social-links a:hover {
    color: #00BFA5;
}

/* Dark Mode Toggle */
#dark-mode-toggle {
    justify-self: end;
    background: rgba(0, 0, 0, 0.05);
    border: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    padding: 0;
}

#dark-mode-toggle svg {
    width: 24px;
    height: 24px;
    fill: #333333;
    transition: all 0.3s ease;
}

#dark-mode-toggle:hover {
    background-color: rgba(0, 191, 165, 0.1);
}

/* Dark Mode Styles */
body.dark-mode {
    background-color: #1a1a1a;
    color: #f5f5f5;
}

body.dark-mode::before {
    background: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.05'%3E%3Cpath d='M18 17v-2h-1v2h-2v1h2v2h1v-2h2v-1h-2zm0-15V0h-1v2h-2v1h2v2h1V3h2V2h-2zM3 17v-2H2v2H0v1h2v2h1v-2h2v-1H3zM3 2V0H2v2H0v1h2v2h1V3h2V2H3z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

body.dark-mode header {
    background-color: rgba(34, 34, 34, 0.95);
}

body.dark-mode nav ul li a {
    color: #f5f5f5;
}

body.dark-mode nav ul li a:hover {
    color: #00BFA5;
    background-color: rgba(0, 191, 165, 0.1);
}

body.dark-mode h2 {
    color: #f5f5f5;
}

body.dark-mode .repo-card {
    background-color: #222;
    color: #f5f5f5;
}

body.dark-mode .repo-header h3 {
    color: #f5f5f5;
}

body.dark-mode .repo-description {
    color: #ccc;
}

body.dark-mode .repo-stats {
    color: #aaa;
}

body.dark-mode .repo-stats span {
    background-color: rgba(255, 255, 255, 0.1);
}

body.dark-mode footer {
    background-color: rgba(34, 34, 34, 0.95);
    color: #f5f5f5;
}

body.dark-mode .social-links a {
    color: #f5f5f5;
}

body.dark-mode .social-links a:hover {
    color: #00BFA5;
}

body.dark-mode #dark-mode-toggle {
    background-color: #333;
    color: #f5f5f5;
}

body.dark-mode #dark-mode-toggle svg {
    fill: #f5f5f5;
}

body.dark-mode #dark-mode-toggle:hover {
    background-color: rgba(0, 191, 165, 0.1);
}

body.dark-mode #dark-mode-toggle {
          background-color: #333;
          color: #f5f5f5;
      }

/* Responsive Styles */
@media (max-width: 768px) {
    body {
        height: 100vh;
        overflow: hidden;
    }

    main {
        position: absolute;
        top: 70px;
        bottom: calc(70px + env(safe-area-inset-bottom, 0px));
        left: 0;
        right: 0;
        padding: 30px;
        overflow-y: auto;
        height: auto;
        margin: 0;
    }
h2{
margin-bottom: 12px;
}

    .github-repos {
        display: grid;
        grid-template-columns: 1fr;
        gap: 15px;
        margin-left: -2.5px;
        margin-bottom: 10px;
    }

    .repo-card {
        margin: 0;
        width: 100%;  /* Fix missing semicolon */
    }

    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        z-index: 1000;
    }

    .mobile-menu-btn {
        display: block;
        background: none;
        border: none;
        color: inherit;
        padding: 10px;
        cursor: pointer;
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
    }

    nav ul {
        display: none;
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        flex-direction: column;
        padding: 20px;
        gap: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 999;
    }

    nav ul.show {
        display: flex;
    }

    nav ul li a {
        font-size: 16px;
        padding: 12px 16px;
        display: block;
        width: 100%;
    }

    footer {
                           position: fixed;
                           bottom: 0;
                           left: 0;
                           right: 0;
                           height: 70px;
                           min-height: calc(70px + env(safe-area-inset-bottom, 0px));
                           padding: 0 0.5rem;
                           padding-bottom: env(safe-area-inset-bottom, 0px);
                           z-index: 1000;
                           background-color: rgba(255, 255, 255, 0.95);
                           display: grid;
                                   grid-template-columns: 1fr auto 1fr;
                                   align-items: center;
                       }

    footer p {
        justify-self: center;
        text-align: center;
        font-size: 0.7rem;
    }

    .social-links {
            justify-self: center;
            display: flex;
            padding-top: 5px;
            gap: 20px;
            align-items: center;
        }

    #dark-mode-toggle {
        justify-self: center;
    }

    body.dark-mode nav ul {
        background: rgba(34, 34, 34, 0.95);
    }

    body.dark-mode .mobile-menu-btn svg {
        stroke: #f5f5f5;
    }
}
           </style>
</head>
<body>
    <header>
        <nav>
            <button class="mobile-menu-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="portfolio.php">Portfolio</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h2>My Projects</h2>
        <div id="github-repos" class="github-repos">
            <!-- Repositories will be loaded here -->
        </div>
    </main>

    <footer>
        <div class="social-links">
            <a href="https://github.com/alexanderschnell" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
            <a href="https://www.linkedin.com/in/alexander-schnell-8064262b1" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            </a>
        </div>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell</p>
        <button id="dark-mode-toggle">
                        <svg viewBox="0 0 24 24">
                            <path class="sun" d="M12 15.5q1.45 0 2.475-1.025Q15.5 13.45 15.5 12q0-1.45-1.025-2.475Q13.45 8.5 12 8.5q-1.45 0-2.475 1.025Q8.5 10.55 8.5 12q0 1.45 1.025 2.475Q10.55 15.5 12 15.5Zm0 1.5q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.537 1.463T17 12q0 2.075-1.463 3.537T12 17ZM1.75 12.75q-.3 0-.525-.225Q1 12.3 1 12q0-.3.225-.525Q1.45 11.25 1.75 11.25h2.5q.3 0 .525.225Q5 11.7 5 12q0 .3-.225.525-.225.225-.525.225Zm18 0q-.3 0-.525-.225Q19 12.3 19 12q0-.3.225-.525q.225-.225.525-.225h2.5q.3 0 .525.225Q23 11.7 23 12q0 .3-.225.525-.225.225-.525.225ZM12 5q-.3 0-.525-.225Q11.25 4.55 11.25 4.25v-2.5q0-.3.225-.525Q11.7 1 12 1q.3 0 .525.225q.225.225.225.525v2.5q0 .3-.225.525Q12.3 5 12 5Zm0 18q-.3 0-.525-.225q-.225-.225-.225-.525v-2.5q0-.3.225-.525Q11.7 19 12 19q.3 0 .525.225q.225.225.225.525v2.5q0 .3-.225.525Q12.3 23 12 23ZM6 7.05l-1.425-1.4q-.225-.225-.225-.525q0-.3.225-.525q.225-.225.525-.225q.3 0 .525.225L7.05 6q.2.225.2.525q0 .3-.2.525q-.225.225-.525.225q-.3 0-.525-.225Zm12.35 12.375L16.95 18q-.225-.225-.225-.525q0-.3.225-.525q.225-.225.525-.225q.3 0 .525.225l1.425 1.4q.225.225.225.525q0 .3-.225.525q-.225.225-.525.225q-.3 0-.525-.225ZM16.95 7.05q-.225-.225-.225-.525q0-.3.225-.525l1.4-1.425q.225-.225.525-.225q.3 0 .525.225q.225.225.225.525q0 .3-.225.525L18 7.05q-.225.225-.525.225q-.3 0-.525-.225ZM4.575 19.425q-.225-.225-.225-.525q0-.3.225-.525L6 16.95q.225-.225.525-.225q.3 0 .525.225q.225.225.225.525q0 .3-.225.525l-1.4 1.425q-.225.225-.525.225q-.3 0-.525-.225Z"/>
                            <path class="moon" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025q.337.025.662.075q-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613q1.15-.612 1.875-1.637q.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Zm0-1.5q2.725 0 4.75-1.687q2.025-1.688 2.575-4.063q-.675.325-1.362.488q-.688.162-1.438.162q-2.9 0-4.925-2.025T9.575 7.45q0-.775.163-1.438q.162-.662.487-1.337Q7.85 5.15 6.162 7.175Q4.475 9.2 4.475 12q0 3.125 2.2 5.312Q8.875 19.5 12 19.5Zm-.1-7.425Z"/>
                        </svg>
                    </button>
    </footer>
    <script src="dark-mode.js"></script>
    <script src="github-repos.js"></script>
    <script>
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            document.querySelector('nav ul').classList.remove('show');
        }
    });
    </script>
</body>
</html>