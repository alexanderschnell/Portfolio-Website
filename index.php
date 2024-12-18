<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dark-mode.css">
    <style>
/* Reset and base styles */
body {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
    height: 100vh;
    overflow: hidden;
    background-color: #F5F5F5;  /* Light mode default */
}

 header {
            background-color: #ffffff;
            color: #333333;
            padding: 0.3rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 26px;
    color: #3498db;
    font-weight: 700;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3);
    padding-left: 25px;
}

/* Main content layout */
main {
    height: calc(100vh - 120px);
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rem;
}

#dynamic-greeting {
    font-size: clamp(20px, 8vw, 60px);
    color: #3498db;
    font-family: 'Montserrat', sans-serif;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3);
    margin: 0;
    text-align: center;
}

/* About section text */
main h4 {
    font-family: 'Montserrat', sans-serif;
    font-size: 25px;
    color: #4a4a4a;
    text-align: center;
    max-width: 800px;
    padding: 0 20px;
    line-height: 1.6;
    margin: 0;
}

/* NAV BAR STYLES */
nav ul {
       font-family: 'Montserrat', sans-serif;
                   list-style-type: none;
                   padding-right: 25px;
                   display: flex;
                   gap: 30px;
               }

        nav ul li a {
            color: #333333;
            text-decoration: none;
            font-weight: 500;
            font-size: 16px;
            transition: color 0.3s ease;
        }

        nav ul li a:hover {
            color: #3498db;
        }

footer {
    background-color: #ffffff;
    color: #333333;
    padding: 0.3rem 20px;
    width: 100%;
    box-shadow: 0 -2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
}

footer p {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
}

span {
    width: 800px;
    height: auto;
    justify-content: center;
    padding: 20px;
    background-color: white;
    border-radius: 8px;
    display: inline-block;
    box-shadow: 4px 4px 5px #3498db;
    transition: all 0.3s ease;
}

/* Dark mode styles */
body.dark-mode {
    background-color: #1a1a1a;
}

body.dark-mode header {
    background-color: rgba(34, 34, 34, 0.9);
}

body.dark-mode nav ul li a {
    color: #f5f5f5;
}

body.dark-mode nav ul li a:hover {
    color: #3498db;
}

body.dark-mode footer {
    background-color: rgba(34, 34, 34, 0.9);
    color: #f5f5f5;
}

body.dark-mode span {
    background-color: #2d2d2d;
    color: #f5f5f5;
    box-shadow: 4px 4px 5px rgba(52, 152, 219, 0.5);
}

body.dark-mode main h4 {
    color: #f5f5f5;
}

/* Toggle button styles */
#dark-mode-toggle {
    background-color: #f5f5f5;
    color: #333;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-right: 20px;
    font-family: 'Montserrat', sans-serif;
}

body.dark-mode #dark-mode-toggle {
    background-color: #333;
    color: #f5f5f5;
}

#dark-mode-toggle:hover {
    background-color: #3498db;
    color: #ffffff;
}
    </style>
</head>
<body>
    <header>
        <h1>Alexander Schnell</h1>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="portfolio.php">Portfolio</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <h2 id="dynamic-greeting"></h2>
        <h4><span>My name is Alex, a third semester Computer Engineering Technology - Computing Science student at Algonquin College's CO-OP program. I am actively seeking internship opportunities to apply my technical skills and gain hands-on industry experience. As a naturally curious individual with a passion for learning, I thrive on exploring new technologies and understanding their underlying mechanisms.</span></h4>
    </main>

    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="greeting.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>