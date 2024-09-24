function updateGreeting() {
    const greetingElement = document.getElementById('dynamic-greeting');
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12) {
        greeting = "Good morning";
    } else if (currentHour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    greetingElement.textContent = `${greeting}, welcome to my website.`;
}

document.addEventListener('DOMContentLoaded', updateGreeting);