// Language color mapping
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
    "C": "#555555"
};

async function loadGitHubRepos() {
    console.log('Starting to load repos...'); // Debug log
    const username = 'alexanderschnell';
    const reposContainer = document.getElementById('github-repos');

    // Show loading state
    reposContainer.innerHTML = '<p>Loading repositories...</p>';

    try {
        console.log('Fetching from GitHub API...'); // Debug log
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
        console.log('API Response:', response); // Debug log

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const repos = await response.json();
        console.log('Repos data:', repos); // Debug log

        if (repos.length === 0) {
            reposContainer.innerHTML = '<p>No repositories found</p>';
            return;
        }

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
                <div class="repo-description">
                    <p>${repo.description || 'No description available'}</p>
                </div>
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
        reposContainer.innerHTML = '<p>Error loading repositories. Please try again later.</p>';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, calling loadGitHubRepos'); // Debug log
    loadGitHubRepos();
});