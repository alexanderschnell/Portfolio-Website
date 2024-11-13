// Dark Mode function 
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save the user's preference in localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    
    // Update button text
    const button = document.getElementById('dark-mode-toggle');
    button.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
}

// Check for saved user preference, if any, on load of the website
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    const button = document.getElementById('dark-mode-toggle');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        button.textContent = 'Light Mode';
    } else {
        button.textContent = 'Dark Mode';
    }
    
    // Add event listener to toggle button
    button.addEventListener('click', toggleDarkMode);
});