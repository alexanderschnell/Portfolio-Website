<?php
session_start();

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
        $_SESSION['message'] = "<p style='color: green;'>Message sent successfully!</p>";
    } else {
        $_SESSION['message'] = "<p style='color: red;'>Failed to send message. Please try again later.</p>";
    }

    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}

if (isset($_SESSION['message'])) {
    $message = $_SESSION['message'];
    unset($_SESSION['message']);
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
            padding: 0.3rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

        h2 {
            font-family: 'Montserrat', sans-serif;
            color: #36454F;
            margin-bottom: 40px;
            text-align: center; /* Add this line */
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

        main {
            padding: 80px 40px 40px 40px;
            min-height: calc(100vh - 200px);
            display: flex;
            justify-content: center;
            align-items: center;
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
          padding: 10px;
          background-color: white;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 4px 4px 5px #3498db;
      }

        /* Dark mode styles */
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

        body.dark-mode header h1 {
            color: #ffffff;
        }

        body.dark-mode h2 {
            color: #f5f5f5;
        }

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

        /* Contact form styles */
        .contact-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
        }

        .contact-form {
            width: 100%;
        }

        .contact-form form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1em;
            box-sizing: border-box;
        }

        .contact-form textarea {
            height: 150px;
            resize: vertical;
        }

        /* Buttons container for side-by-side layout */
        .buttons-container {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 25px;
            width: 100%;
        }

        /* Update button styles */
        .contact-form button,
        .download-button {
            width: 200px;
            padding: 12px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 1em;
            font-weight: bold;
            text-decoration: none;
            text-align: center;
            height: 45px;
            line-height: 21px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
        }

        .contact-form button:hover,
        .download-button:hover {
            background-color: #2980b9;
        }

        /* Message styling */
        .message-container {
            width: 100%;
            margin-top: 20px;
            text-align: center;
        }

        .message {
            display: inline-block;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 500;
        }

        .message p {
            margin: 0;
        }

        .message p[style*="green"] {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 10px 20px;
            border-radius: 4px;
        }

        .message p[style*="red"] {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 10px 20px;
            border-radius: 4px;
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
        <div class="contact-container">
            <div class="contact-form">
                <h2>Get in Touch !</h2>
                <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email" required>
                    <input type="text" name="subject" placeholder="Subject" required>
                    <textarea name="message" placeholder="Your Message" required></textarea>
                    <div class="buttons-container">
                        <button type="submit">Send Message</button>
                        <a href="Alexander Schnell - Resume 2024.pdf" download class="download-button">My Resume</a>
                    </div>
                </form>
                <?php if ($message): ?>
                    <div class="message-container">
                        <div class="message"><?php echo $message; ?></div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </main>
    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>
    <script src="dark-mode.js"></script>
</body>
</html>