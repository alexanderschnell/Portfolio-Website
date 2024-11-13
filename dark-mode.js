// Dark Mode function 
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save the user's preference in localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Check for saved user preference, if any, on load of the website
document.addEventListener('DOMContentLoaded', (event) => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }
    
    // Add event listener to toggle button
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);
});