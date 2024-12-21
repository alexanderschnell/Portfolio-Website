document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const sunPath = darkModeToggle.querySelector('.sun');
    const moonPath = darkModeToggle.querySelector('.moon');

    // Check if user preference exists in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';

    // Set initial state based on localStorage
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        sunPath.style.display = 'none';
        moonPath.style.display = 'block';
    } else {
        document.body.classList.remove('dark-mode');
        sunPath.style.display = 'block';
        moonPath.style.display = 'none';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Update localStorage with new preference
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

        // Toggle icon
        if (document.body.classList.contains('dark-mode')) {
            sunPath.style.display = 'none';
            moonPath.style.display = 'block';
        } else {
            sunPath.style.display = 'block';
            moonPath.style.display = 'none';
        }
    });
});