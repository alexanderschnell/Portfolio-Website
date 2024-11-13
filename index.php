<?php

$headshot = [
    [
        'description' => 'My headshot',
        'image' => 'monkey02.jpg' // Replace with my image path when aquired 
    ],
];
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

.image-box {
        position: absolute;
        top: 930px;
        right: 855px;
        width: 300px; 
        height: 300px; 
    }
    .image-box img {
        width: 100%;
        height: 100%; 
        object-fit: cover; 
        border-radius: 8px; 
        box-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3); 
    }
</style>
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
    <h3>About Me</h3>
    <h4>My name is Alexander Schnell. I am a level 2 student at Algonquin College studying Computer Engineering Technology - Computing Science.
        I am currently seeking co-op opportunities to gain real world expierence.
        I am always interested in learning new technologies and figuring out how they work. 
    <div class="image-box">
        <img src="<?php echo $headshot[0]['image']; ?>" alt="<?php echo $headshot[0]['description']; ?>">
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