<?php

// Email is broken fix by using a modern, secure approach with PHPMailer and Gmail SMTP!!!!!!

$message = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $subject = filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING);
    $userMessage = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);
    
    $to = "alex.schnell18@gmail.com";
    $headers = "From: $email";
    $fullMessage = "Name: $name\nEmail: $email\n\n$userMessage";
    
    if (mail($to, $subject, $fullMessage, $headers)) {
        $message = "<p style='color: green;'>Message sent successfully!</p>";
    } else {
        $message = "<p style='color: red;'>Failed to send message. Please try again later.</p>";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell</title>
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
    /* Remove the color property from here */
     padding: 0.3rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header h1 {
    color: #36454F; /* This should now take effect */
    font-family: 'Montserrat', sans-serif;
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    padding-left: 25px;
    text-shadow: 1px 1px 2px rgba(54, 69, 79, 0.3); /* Adjusted text shadow */
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
    font-size: 16px; /* Adjust this value as needed */
    transition: color 0.3s ease;
}

nav ul li a:hover {
    color: #3498db;
}

main {
    padding: 40px;
    text-align: center;
}

.accent-button {
    background-color: #F88379;
    color: #fff;
    padding: 10px 10px;
    border: none;
    border-radius: 2px;
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
    margin: 0;
    padding-left: 20px; /* Adjust this value to move text more or less to the right */
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

        main {
            padding: 10px;
            max-width: 800px;
            margin: 0 auto;
            padding-bottom:  100px;
        }

        main h3 {
            font-size: 25px;
            color:#3498db;
        }

        .contact-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .contact-form form {
            display: flex;
            flex-direction: column;
        }

        .contact-form input,
        .contact-form textarea {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1em;
        }

        .contact-form textarea {
            height: 150px;
        }

        .contact-form button {
            padding: 10px 5px;
            background-color:#3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 1em;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;

        }
        
        .download-button {
            padding: 10px 5px;
            background-color:#3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 1em;
            font-weight: bold;
            text-decoration: none;
            display: inline-block;
            padding-block: 7px;
            
        }

        .contact-form button {
        padding: 10px 5px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1em;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
    }

    .contact-form button:hover {
        background-color: #2980b9; /* Darker shade for hover effect */
    }
    
    .download-button {
        padding: 10px 5px;
        background-color: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 1em;
        font-weight: bold;
        text-decoration: none;
        display: inline-block;
        padding-block: 7px;
    }

    .download-button:hover {
        background-color: #2980b9; /* Darker shade for hover effect */
    }


    </style>
</head>
<body>
    <header>
        <h1>Contact Information</h1>
        <nav>
            <ul>
                <li><a href="index.php">Home</a></li>
                <li><a href="portfolio.php">Portfolio</a></li>
                <li><a href="contact.php">Contact</a></li>
            </ul>
        </nav>
    </header>
    <main>
    <?php if ($message): ?>
            <div class="message"><?php echo $message; ?></div>
        <?php endif; ?>
    <div class="contact-container">
            <div class="contact-form">
                <h3>Get in Touch</h3>
                <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email" required>
                    <input type="text" name="subject" placeholder="Subject" required>
                    <textarea name="message" placeholder="Your Message" required></textarea>
                    <button type="submit">Send Message</button>
                </form>
            </div>
        <a href="Alexander Schnell - Resume 2024.pdf" download class="download-button">Download My Resume</a>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="dark-mode.js"></script>
</body>
</html>