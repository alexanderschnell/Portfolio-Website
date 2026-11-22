// Contact form handler for a static site.
//
// The site has no backend, so messages are sent through a hosted form service.
// To enable it:
//   1. Create a free form at https://formspree.io (sign up with the address that
//      should receive messages; it is never stored in this repository).
//   2. Paste the form's endpoint below, e.g. 'https://formspree.io/f/abcdwxyz'.
const FORM_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    const statusText = status.querySelector('p');
    const submitButton = form.querySelector('button[type="submit"]');

    function showStatus(message, type) {
        statusText.textContent = message;
        statusText.className = type;
        status.hidden = false;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!FORM_ENDPOINT) {
            showStatus('The contact form is not set up yet. Please reach out on LinkedIn instead.', 'error');
            return;
        }

        submitButton.disabled = true;
        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' },
            });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            form.reset();
            showStatus('Thank you. I will get back to you soon.', 'success');
        } catch (error) {
            console.error('Contact form error:', error);
            showStatus('Sorry, there was an error sending your message. Please try again later.', 'error');
        } finally {
            submitButton.disabled = false;
        }
    });
});
