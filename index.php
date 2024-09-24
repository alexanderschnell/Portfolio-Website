<?php echo "<!-- PHP is working: " . date('Y-m-d H:i:s') . " -->"; ?>
<?php
// index.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dark-mode.css">
    <link rel="stylesheet" href="styles.css">
<style>
</style>
</head>
<body>
    <header>
        <h1>Alexander Schnell</h1>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="portfolio.php">Portfolio</a></li>
                <li><a href="about.php">About</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
        
    </header>
    <main>
        <h2 id="dynamic-greeting"></h2>
    </main>
    
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>

    <script src="greeting.js"></script>
    <script src="dark-mode.js"></script>
</body>
</html>