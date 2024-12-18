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
        * {
                   margin: 0;
                   padding: 0;
                   box-sizing: border-box;
               }

               body {
                   font-family: 'Montserrat', sans-serif;
                   min-height: 100vh;
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

               main {
                   padding: 50px;
                   min-height: calc(100vh - 140px);
                   display: flex;
                   justify-content: center;
                   align-items: center;
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
                   transition: background-color 0.3s ease;
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

               body.dark-mode .social-links a {
                   color: #f5f5f5;
               }

               body.dark-mode .social-links a:hover {
                   color: #00BFA5;
               }

               body.dark-mode #dark-mode-toggle {
                   background-color: #333;
                   color: #f5f5f5;
               }

               body.dark-mode #dark-mode-toggle:hover {
                   background-color: #00BFA5;
                   color: #ffffff;
               }

               /* Contact form specific styles */
               .contact-container {
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
                   text-align: center;
                   color: #333333;
               }

               body.dark-mode .contact-form h2 {
                   color: #f5f5f5;
               }

               .contact-form form {
                   display: flex;
                   flex-direction: column;
                   gap: 20px;
                   padding: 20px;
                   border: 1px solid #ccc;
                   border-radius: 10px;
                   background-color: white;
                   box-shadow: 0 8px 32px rgba(0,0,0,0.15);
               }

               body.dark-mode .contact-form form {
                   background-color: #222;
                   border-color: #444;
               }

               .contact-form input,
               .contact-form textarea {
                   width: 100%;
                   padding: 15px;
                   border: 1px solid #ccc;
                   border-radius: 5px;
                   font-size: 1.2em;
                   font-family: 'Montserrat', sans-serif;
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

               .contact-form textarea {
                   height: 200px;
                   resize: vertical;
               }

               .buttons-container {
                   display: flex;
                   justify-content: center;
                   gap: 25px;
                   margin-top: 30px;
               }

               .contact-form button,
               .download-button {
                   padding: 15px 30px;
                   font-size: 1.2em;
                   font-weight: 500;
                   background-color: #00BFA5;
                   color: white;
                   border: none;
                   border-radius: 6px;
                   cursor: pointer;
                   text-decoration: none;
                   text-align: center;
                   transition: all 0.3s ease;
                   font-family: 'Montserrat', sans-serif;
               }

               .contact-form button:hover,
               .download-button:hover {
                   background-color: #00897B;
                   transform: translateY(-1px);
               }

               .message-container {
                   margin-top: 20px;
                   text-align: center;
               }

               .message p[style*="green"] {
                   background-color: #d4edda;
                   border: 1px solid #c3e6cb;
                   padding: 10px 20px;
                   border-radius: 4px;
                   display: inline-block;
               }

               .message p[style*="red"] {
                   background-color: #f8d7da;
                   border: 1px solid #f5c6cb;
                   padding: 10px 20px;
                   border-radius: 4px;
                   display: inline-block;
               }

               @media (max-width: 768px) {
                   main {
                       padding: 25px;
                   }

                   nav ul {
                       gap: 20px;
                   }

                   nav ul li a {
                       font-size: 16px;
                       padding: 6px 12px;
                   }

                    /* Update/add these footer-related styles */
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

                       /* Dark mode styles */
                       body.dark-mode footer {
                           background-color: rgba(34, 34, 34, 0.95);
                           color: #f5f5f5;
                       }

                       body.dark-mode .social-links a {
                           color: #f5f5f5;
                       }

                       body.dark-mode .social-links a:hover {
                           color: #00BFA5;
                       }

                       body.dark-mode #dark-mode-toggle {
                           background-color: #333;
                           color: #f5f5f5;
                       }

                       body.dark-mode #dark-mode-toggle:hover {
                           background-color: #00BFA5;
                           color: #ffffff;
                       }

                       @media (max-width: 768px) {
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

                   #dark-mode-toggle {
                       justify-self: center;
                   }

                   .buttons-container {
                       flex-direction: column;
                       align-items: center;
                   }

                   .contact-form button,
                   .download-button {
                       width: 100%;
                       max-width: 250px;
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

    <script src="dark-mode.js"></script>
</body>
</html>