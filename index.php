<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex's Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
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
        }

        header {
            background-color: #ffffff;
            color: #333333;
            height: 60px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 0 2rem;
        }

        main {
            position: absolute;
            top: 60px;
            bottom: 60px;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 50px;
        }

        .turquoise-container {
            background-color: #00BFA5;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 3rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 60px;
            position: relative;
        }

        .name-container {
            width: 100%;
            max-width: 600px;
            margin-bottom: 2rem;
        }

        .name-line {
            font-size: 5rem;
            font-weight: 700;
            color: white;
            line-height: 1;
            margin: 0;
            display: block;
        }

        nav ul {
            list-style-type: none;
            display: flex;
            gap: 30px;
            padding-right: 25px;
        }

        nav ul li a {
            color: #333333;
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        nav ul li a:hover {
            color: #00BFA5; /* Updated hover color */
        }

        footer {
            background-color: #ffffff;
            color: #333333;
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
            padding: 0 20px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }

        /* Dark mode styles */
        body.dark-mode {
            background-color: #1a1a1a;
        }

        body.dark-mode header {
            background-color: rgba(34, 34, 34, 0.9);
        }

    body.dark-mode nav ul li a {
        color: #f5f5f5;  /* Makes links white in dark mode */
    }

        body.dark-mode nav ul li a:hover {
            color: #00BFA5; /* Updated hover color */
        }

        body.dark-mode footer {
            background-color: rgba(34, 34, 34, 0.9);
            color: #f5f5f5;
        }

    /* Dark Mode Toggle Button - Default Light Mode */
    #dark-mode-toggle {
        background-color: #f5f5f5;
        color: #333;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 20px;
    }

    /* Light Mode Hover */
    #dark-mode-toggle:hover {
        background-color: #00BFA5; /* Green color on hover */
        color: #ffffff;
    }

    /* Dark Mode - Default */
    body.dark-mode #dark-mode-toggle {
        background-color: #333;
        color: #f5f5f5;
    }

    /* Dark Mode Hover */
    body.dark-mode #dark-mode-toggle:hover {
        background-color: #00BFA5; /* Green color on hover */
        color: #ffffff; /* White text for better contrast */
    }

        @media (max-width: 768px) {
            main {
                padding: 25px;
            }

            .name-line {
                font-size: 3.5rem;
            }
        }

   .greeting {
       position: absolute;
       bottom: 30px;
       right: 45px;
       font-size: 3rem;
       font-weight: 500;
       color: white;
       text-align: right;
       opacity: 0; /* Initially hidden */
       animation: fade-in 2s ease-in forwards; /* 2-second fade-in effect */
   }

   @keyframes fade-in {
       0% {
           opacity: 0;
       }
       100% {
           opacity: 1;
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
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="greeting.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>