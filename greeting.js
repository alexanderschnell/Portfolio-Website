function updateGreeting() {
    const greetingElement = document.getElementById('dynamic-greeting');
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning... Welcome to my website!";
    } else if (currentHour < 18) {
        greeting = "Good afternoon... Welcome to my website!";
    } else {
        greeting = "Good evening... Welcome to my website!";
    }

    greetingElement.textContent = `${greeting}`;
}

document.addEventListener('DOMContentLoaded', updateGreeting);