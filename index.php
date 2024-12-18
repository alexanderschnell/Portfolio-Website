<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex's Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dark-mode.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Montserrat', sans-serif;
            height: 100vh;
            overflow: hidden;
            background-color: #F5F5F5;
            position: relative;
            transition: background-color 0.3s ease;
        }

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

        main {
            position: absolute;
            top: 70px;
            bottom: 70px;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 50px;
        }

        .turquoise-container {
            background: linear-gradient(135deg, #00BFA5 0%, #00897B 100%);
            width: 100%;
            height: 100%;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 3rem;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            padding: 60px;
            position: relative;
            overflow: hidden;
        }

        .turquoise-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            pointer-events: none;
        }

        .name-container {
            width: 100%;
            max-width: 600px;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(20px);
            animation: slide-up 0.8s ease forwards;
        }

        .name-line {
            font-size: 5rem;
            font-weight: 700;
            color: white;
            line-height: 1.1;
            margin: 0;
            display: block;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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

        footer {
            background-color: rgba(255, 255, 255, 0.95);
            color: #333333;
            height: 70px;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
            padding: 0 40px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            transition: background-color 0.3s ease;
        }

        /* Dark mode styles */
        body.dark-mode {
            background-color: #1a1a1a;
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

        body.dark-mode footer {
            background-color: rgba(34, 34, 34, 0.95);
            color: #f5f5f5;
        }

        #dark-mode-toggle {
            justify-self: end;
            background-color: #f5f5f5;
            color: #333;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Montserrat', sans-serif;
            font-weight: 500;
            font-size: 16px;
        }

        #dark-mode-toggle:hover {
            background-color: #00BFA5;
            color: #ffffff;
            transform: translateY(-1px);
        }

        body.dark-mode #dark-mode-toggle {
            background-color: #333;
            color: #f5f5f5;
        }

        body.dark-mode #dark-mode-toggle:hover {
            background-color: #00BFA5;
            color: #ffffff;
        }

        .greeting {
            position: absolute;
            bottom: 30px;
            right: 45px;
            font-size: 3rem;
            font-weight: 500;
            color: white;
            text-align: right;
            opacity: 0;
            animation: fade-in 2s ease-in forwards 1s;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
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

        body.dark-mode .social-links a {
            color: #f5f5f5;
        }

        body.dark-mode .social-links a:hover {
            color: #00BFA5;
        }

        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        @keyframes slide-up {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            main {
                padding: 25px;
            }

            .name-line {
                font-size: 3.5rem;
            }

            nav ul {
                gap: 20px;
            }

            nav ul li a {
                font-size: 16px;
                padding: 6px 12px;
            }

            .greeting {
                font-size: 2rem;
                bottom: 20px;
                right: 25px;
            }

            footer {
                padding: 0 20px;
                grid-template-columns: auto;
                grid-template-rows: repeat(3, auto);
                height: auto;
                padding: 20px;
                gap: 15px;
            }

            .social-links {
                justify-self: center;
            }

            footer p {
                justify-self: center;
                text-align: center;
            }

            #dark-mode-toggle {
                justify-self: center;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
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
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="greeting.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>