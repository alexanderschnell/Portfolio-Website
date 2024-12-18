function updateGreeting() {
    const greetingElement = document.getElementById('dynamic-greeting');
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning.";
    } else if (currentHour < 18) {
        greeting = "Good afternoon.";
    } else {
        greeting = "Good evening.";
    }

    greetingElement.textContent = `${greeting}`;

    // Add fade-in effect class when greeting is updated
    greetingElement.style.animation = "fade-in 2s ease-in forwards";
}

document.addEventListener('DOMContentLoaded', updateGreeting);