<?php

// My portfolio items
$portfolio_items = [
    [
        'title' => 'Project 1',
        'description' => 'A brief description of project 1.',
        'image' => 'monkey02.jpg',
    ],
    [
        'title' => 'Project 2',
        'description' => 'A brief description of Project 2.',
        'image' => 'monkey02.jpg',
    ],
    [
        'title' => 'Project 3',
        'description' => 'A brief description of Project 2.',
        'image' => 'monkey02.jpg',
    ],
    [
        'title' => 'Project 4',
        'description' => 'A brief description of Project 2.',
        'image' => 'monkey02.jpg',
    ],
    // Add more portfolio items as needed
];

// Function to generate HTML for a portfolio item
function renderPortfolioItem($item) {
    return "
        <div class='portfolio-item'>
            <h2>{$item['title']}</h2>
            <div class='image-box'>
                <img src='{$item['image']}' alt='{$item['title']}'>
                <div class='description'>
                    <p>{$item['description']}</p>
                </div>
            </div>
        </div>
    ";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dark-mode.css">

    <style>
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #F5F5F5;
    color: #36454F;
   

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

h1 {
    font-family: 'Montserrat', sans-serif;
    font-size: 26px;
    color: #36454F;
    font-weight: 700;
    margin: 0;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3); 
    padding-left: 25px;
}

main {
    padding: 30px;
    text-align: center;
    padding-bottom: 100px;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3); 
    font-size: 20px;
}

main h2 {
    color: #3498db;
}


main p {
    max-width: 600px;
    margin: 20px auto;
}

.portfolio-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 100px 150px;
    max-width: 1000px;
    margin: 0 auto;
    padding: 5px;
}

.portfolio-item {
    width: 100%;
    text-align: center;
    position: relative;
}

.image-box {
    position: relative;
    width: 99%;
    height: 300px;
    overflow: hidden;
    transition: transform 0.3s ease;
    background-color: #f0f0f0; 
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px; 
    box-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3); 
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    transition: transform 0.3s ease;
}

.description {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 15px;
    box-sizing: border-box;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.image-box:hover .description {
    transform: translateY(0);
}

.description p {
    margin: 0;
    text-align: center;
}

.image-box:hover {
    transform: scale(1.05);
}

@media (max-width: 600px) {
    .portfolio-container {
        grid-template-columns: 1fr;
    }
}
.accent-button {
    background-color: #F88379;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.accent-button:hover {
    background-color: #D4AF37;
}

footer {
    background-color: #ffffff;
    color: #333333;
    padding: 0.3rem;
    position: fixed;
    bottom: 0;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

footer p {
    font-family: 'Montserrat', sans-serif;;
    margin: 0;
    padding-left: 20px; 
    text-align: left;
}
/* Existing dark mode styles */
body.dark-mode {
    background-color: #333;
    color: #f5f5f5;
}

body.dark-mode header {
    background-color: #222;
    color: #f5f5f5;
}

body.dark-mode nav ul li a {
    color: #f5f5f5;
}

body.dark-mode nav ul li a:hover {
    color: #3498db;
}

body.dark-mode #dynamic-greeting {
    color: #3498db;
}

body.dark-mode footer {
    background-color: #222;
    color: #f5f5f5;
}

/* New style for the header h1 in dark mode */
body.dark-mode header h1 {
    color: #ffffff;
}

/* Existing toggle button styles */
#dark-mode-toggle {
    background-color: #f5f5f5;
    color: #333;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-right: 20px;
}

body.dark-mode #dark-mode-toggle {
    background-color: #333;
    color: #f5f5f5;
}
    </style>
</head>
<body>
    <header>
        <h1>My Portfolio</h1>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="portfolio.php">Portfolio</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
    <div class="portfolio-container">
    <?php
    echo renderPortfolioItem($portfolio_items[0]);
    echo renderPortfolioItem($portfolio_items[1]);
    echo renderPortfolioItem($portfolio_items[2]);
    echo renderPortfolioItem($portfolio_items[3]);
    ?>
    </div>
    </main>
    
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="dark-mode.js"></script>
</body>
</html>