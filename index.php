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
}

header {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 0.8rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
    box-sizing: border-box;
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
    padding-top: 0;  /* Remove top padding since we're using full viewport height */
    max-width: 100%;  /* Allow full width for greeting */
    margin: 0;
}

.greeting-section {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

#dynamic-greeting {
    font-size: clamp(40px, 8vw, 80px);
    color: #3498db;
    font-family: 'Montserrat', sans-serif;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3);
    margin: 0;
    text-align: center;
    padding: 0 20px;
}

/* ABOUT SECTION STYLES */
.about-section {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    align-items: center;  /* Center children horizontally */
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    min-height: 100vh;  /* Full viewport height for second section */
    justify-content: center;  /* Center content vertically */
}


/* About section heading */
main h3 {
    font-family: 'Montserrat', sans-serif;
    font-size: 40px;
    color: #3498db;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3);
    text-align: center;  /* Center the heading */
    margin: 0 0 30px 0;  /* Changed padding to margin for spacing */
    width: 100%;
    max-width: 800px;  /* Match the text width */
}

/* About section text */
main h4 {
    font-family: 'Montserrat', sans-serif;
    font-size: 25px;
    color: #3498db;
    text-align: center;  /* Center the text */
    max-width: 800px;
    padding: 0 20px;  /* Responsive padding */
    line-height: 1.6;
    margin: 0;
}

.about-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    
}

/* NAV BAR STYLES */
nav ul {
    font-family: 'Montserrat', sans-serif;
    list-style-type: none;
    padding-right: 45px;
    display: flex;
    gap: 30px;
    margin: 0;
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
}

footer p {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
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
        <section class="greeting-section">
            <h2 id="dynamic-greeting"></h2>
        </section>        
        <section class="about-section">
    <h3>About Me</h3>
    <h4>My name is Alexander Schnell. I am a level 2 student at Algonquin College studying Computer Engineering Technology - Computing Science. I am currently seeking co-op opportunities to gain real world expierence. I am always interested in learning new technologies and figuring out how they work.</h4>    
</section>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="greeting.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>