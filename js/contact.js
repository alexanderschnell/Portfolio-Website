// Contact form handler for a static site.
//
// Messages are sent through Formspree (https://formspree.io), which forwards
// them to the email address on your Formspree account. That address never
// appears in this code; the endpoint below is safe to publish.
//
// Setup: create a form on Formspree and paste its endpoint here,
// e.g. 'https://formspree.io/f/abcdwxyz'.
const FORM_ENDPOINT = 'https://formspree.io/f/maeopqoo';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    if (!form || !status) return;

    const statusText = status.querySelector('p');
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonLabel = submitButton.textContent;

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

        const data = new FormData(form);
        // Formspree uses these special fields: _subject becomes the email
        // subject line, and _replyto lets you hit "Reply" to answer the sender.
        data.set('_subject', `Portfolio: ${data.get('subject')}`);
        data.set('_replyto', data.get('email'));

        submitButton.disabled = true;
        submitButton.textContent = 'Sending…';
        status.hidden = true;

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                form.reset();
                showStatus("Thanks for your message! I'll get back to you soon.", 'success');
                return;
            }

            // Formspree returns validation problems as { errors: [{ message }] }.
            const result = await response.json().catch(() => ({}));
            const detail = Array.isArray(result.errors)
                ? result.errors.map((e) => e.message).join(' ')
                : '';
            throw new Error(detail || `HTTP ${response.status}`);
        } catch (error) {
            console.error('Contact form error:', error);
            showStatus('Sorry, your message could not be sent. Please try again later or reach out on LinkedIn.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = buttonLabel;
        }
    });
});
