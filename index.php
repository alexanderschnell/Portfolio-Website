<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Alexander Schnell - Welcome</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/index.css">
    <link rel="icon" type="image/png" href="assets/images/charmander.png">
    <style>
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
        <div class="turquoise-container">
            <div class="name-container">
                <div class="name-line">Alexander</div>
                <div class="name-line">Schnell</div>
                <div class="tagline">Software Developer</div>
            </div>
            <div id="dynamic-greeting" class="greeting"></div>
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
    <script src="js/greeting.js"></script>
    <script src="js/dark-mode.js"></script>
    <script>
    document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
        document.querySelector('nav ul').classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav')) {
            document.querySelector('nav ul').classList.remove('show');
        }
    });
    </script>
</body>

</html>