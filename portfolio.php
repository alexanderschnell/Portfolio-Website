<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexander Schnell - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="dark-mode.css">

    <style>
        /* Core styles */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #F5F5F5;
            color: #36454F;
        }

        /* Header styles (preserved from original) */
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

        /* Main content styles */
        main {
            padding: 85px 40px 40px 40px; /* Reduced top padding from 40px to 20px */
            max-width: 1200px;
            margin: 0 auto;
            margin-bottom: 100px; /* Space for footer */
        }

        /* GitHub repos section styles */
        .github-repos {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }

      .repo-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(128, 128, 128, 0.4) !important; /* Grey shadow with !important */
          transition: transform 0.3s ease;
      }

        .repo-card:hover {
            transform: translateY(-5px);
        }

        .repo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        }

        .repo-header h3 {
            margin: 0;
            color: #3498db;
            font-family: 'Montserrat', sans-serif;
        }

        .repo-header a {
            color: #666;
            transition: color 0.3s ease;
        }

        .repo-header a:hover {
            color: #3498db;
        }

        .repo-stats {
            display: flex;
            gap: 15px;
            font-size: 0.9rem;
            color: #666;
            margin-top: 15px;
        }

       .repo-stats span {
           display: flex;
           align-items: center;
           gap: 5px;
           padding: 10px;
           background-color: white;
           border-radius: 8px;
           box-shadow: 2px 2px 2px #808080;  /* Changed to grey */
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

        body.dark-mode header h1 {
            color: #ffffff;
        }

      body.dark-mode .repo-card {
          background-color: #222;
          color: #f5f5f5;
          box-shadow: 0 2px 4px rgba(128, 128, 128, 0.4) !important; /* Same shadow for dark mode */
      }

        body.dark-mode .repo-header h3 {
            color: #3498db;
        }

        body.dark-mode .repo-stats {
            color: #aaa;
        }

       /* In your dark mode styles */
       body.dark-mode .repo-stats span {
           background-color: #333;  /* Dark grey background for the boxes */
           color: #ffffff;         /* White text */
           box-shadow: 2px 2px 2px #4a4a4a;  /* Dark grey shadow */
       }
        /* Make sure SVG icons are also white in dark mode */
        body.dark-mode .repo-stats span svg {
            fill: #ffffff;
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
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-right: 20px;
        }

        body.dark-mode #dark-mode-toggle {
            background-color: #333;
            color: #f5f5f5;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            main {
                padding: 20px;
            }

            nav ul {
                gap: 15px;
                padding-right: 15px;
            }

            h1 {
                padding-left: 15px;
            }
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
        <h2>My GitHub Projects</h2>
        <div id="github-repos" class="github-repos">
            <!-- Repositories will be loaded here -->
        </div>
    </main>

    <footer>
        <p>&copy; <?php echo date("Y"); ?> Alexander Schnell. All rights reserved.</p>
        <button id="dark-mode-toggle">Toggle Dark Mode</button>
    </footer>

    <script>
       // Add this language color mapping
       const languageColors = {
           "JavaScript": "#f1e05a",
           "Python": "#3572A5",
           "Java": "#b07219",
           "HTML": "#e34c26",
           "CSS": "#563d7c",
           "TypeScript": "#2b7489",
           "PHP": "#4F5D95",
           "C++": "#f34b7d",
           "C#": "#178600",
           "Ruby": "#701516",
           // Add more languages as needed
       };

       async function loadGitHubRepos() {
           const username = 'alexanderschnell';
           const reposContainer = document.getElementById('github-repos');

           try {
               const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=6`);
               const repos = await response.json();

               reposContainer.innerHTML = repos.map(repo => `
                   <div class="repo-card">
                       <div class="repo-header">
                           <h3>${repo.name}</h3>
                           <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
                               <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                   <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 1 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                                   <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                               </svg>
                           </a>
                       </div>
                       <p>${repo.description || 'No description available'}</p>
                       <div class="repo-stats">
                           ${repo.language ? `
                               <span>
                                   <svg width="12" height="12" viewBox="0 0 12 12">
                                       <circle cx="6" cy="6" r="6" fill="${languageColors[repo.language] || '#888888'}"/>
                                   </svg>
                                   ${repo.language}
                               </span>
                           ` : ''}
                           <span>
                               <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                   <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
                               </svg>
                               ${repo.stargazers_count}
                           </span>
                           <span>
                               <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                   <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0z"/>
                               </svg>
                               ${repo.forks_count}
                           </span>
                       </div>
                   </div>
               `).join('');
           } catch (error) {
               console.error('Error fetching GitHub repos:', error);
               reposContainer.innerHTML = '<p>Error loading repositories</p>';
           }
       }

        // Load repos when the page loads
        loadGitHubRepos();
    </script>
    <script src="dark-mode.js"></script>
</body>
</html>