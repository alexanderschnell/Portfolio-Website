<?php
session_start();
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

$message = '';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Sanitize and validate inputs
        $name = sanitizeInput($_POST['name'] ?? '');
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $subject = sanitizeInput($_POST['subject'] ?? '');
        $userMessage = sanitizeInput($_POST['message'] ?? '');

        // Validate required fields
        if (!$name || !$email || !$subject || !$userMessage) {
            throw new Exception('All fields are required and must be valid.');
        }

        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'alex.schnell18@gmail.com'; // Your Gmail address
        $mail->Password = 'zxyn nazr cklv zomx'; // The app password you generated
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // For debugging only - remove in production
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;

        // Recipients
        $mail->setFrom('alex.schnell18@gmail.com', 'Contact Form');
        $mail->addAddress('alex.schnell18@gmail.com', 'Alexander Schnell');
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Email: [" . $name . "] Subject: [" . $subject . "]";

        // Create HTML message body
        $htmlMessage = "
            <h2>$name sent you a message.</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Subject:</strong> {$subject}</p>
            <p><strong>Message:</strong></p>
            <p>" . nl2br($userMessage) . "</p>
        ";

        $mail->Body = $htmlMessage;
        $mail->AltBody = "From: $name\nEmail: $email\nSubject: $subject\n\nMessage:\n$userMessage";

        // Send email
        $mail->send();
        $_SESSION['message'] = "<p style='color: green;'>Thank you. I will get back to you soon.</p>";

    } catch (Exception $e) {
        error_log("Mail Error: " . $e->getMessage());
        $_SESSION['message'] = "<p style='color: red;'>Sorry, there was an error sending your message. Please try again later.</p>";
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
            color: #333333;
            height: 60px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 0 2rem;
        }

        h2 {
            font-family: 'Montserrat', sans-serif;
            color: #36454F;
            margin-bottom: 30px;
            text-align: center;
            font-size: 32px;
            font-weight: 700;
        }

        body.dark-mode h2 {
            color: #f5f5f5;
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
            color: #00BFA5;
        }

        main {
            padding: 10px 40px 40px 40px;
            min-height: calc(100vh - 200px);
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .accent-button {
            background-color: #00BFA5;
            color: #fff;
            padding: 10px 10px;
            border: none;
            border-radius: 2px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .accent-button:hover {
            background-color: #00BFA5;
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
            color: #00BFA5;
        }

        body.dark-mode footer {
            background-color: #222;
            color: #f5f5f5;
        }

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

        #dark-mode-toggle:hover {
            background-color: #00BFA5;
            color: #ffffff;
        }

        body.dark-mode #dark-mode-toggle {
            background-color: #333;
            color: #f5f5f5;
        }

        body.dark-mode #dark-mode-toggle:hover {
            background-color: #00BFA5;
            color: #ffffff;
        }

    body.dark-mode .contact-form form {
        background-color: #222;
        border-color: #444;
    }

    body.dark-mode .contact-form input,
    body.dark-mode .contact-form textarea {
        background-color: #333;
        border-color: #444;
        color: #f5f5f5;
    }

    body.dark-mode .contact-form input::placeholder,
    body.dark-mode .contact-form textarea::placeholder {
        color: #aaa;
    }

        .contact-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 30px;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
        }

        .contact-form {
            width: 100%;
        }

        .contact-form h2 {
            font-size: 2rem;
            font-weight: 600;
            margin-bottom: 40px;
        }

        .contact-form form {
            display: flex;
            flex-direction: column;
            gap: 20px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 10px;
            background-color: white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .contact-form input,
        .contact-form textarea {
            width: 100%;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1.2em;
            box-sizing: border-box;
        }

        .contact-form textarea {
            height: 200px;
        }

        .contact-form button,
        .download-button {
            width: 100%;
            max-width: 250px;
            padding: 15px;
            font-size: 1.2em;
            font-weight: bold;
            background-color: #00BFA5;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .contact-form button:hover,
        .download-button:hover {
            background-color: #00796B;
            transform: scale(1.05);
        }

        .buttons-container {
            display: flex;
            justify-content: center;
            gap: 25px;
            margin-top: 30px;
            width: 100%;
        }

        .message-container {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }

        .message {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: 500;
        }

        .message p {
            margin: 0;
            text-align: center;
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
                <h2>Get in Touch</h2>
                <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
                    <input type="text" name="name" placeholder="Your Name" required>
                    <input type="email" name="email" placeholder="Your Email" required>
                    <input type="text" name="subject" placeholder="Subject" required>
                    <textarea name="message" placeholder="Your Message" required></textarea>
                    <div class="buttons-container">
                        <button type="submit">Send Message</button>
                        <a href="Alexander Schnell - Resume 2024.pdf" download class="download-button">Download Resume</a>
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