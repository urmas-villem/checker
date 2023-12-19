import { fetchAndDisplayPodImages } from './script.js';

async function manualPoll() {
    const pollButton = document.getElementById('pollButton');
    pollButton.textContent = 'Updating...';
    pollButton.disabled = true;

    try {
        const response = await fetch('/trigger-update', { method: 'POST' });
        if (!response.ok) {
            throw new Error('Failed to update cache');
        }
        console.log('Cache updated successfully');
        await fetchAndDisplayPodImages();
    } catch (error) {
        console.error('Error:', error);
    } finally {
        pollButton.textContent = 'Poll Now';
        pollButton.disabled = false;
    }
}

document.getElementById('pollButton').addEventListener('click', manualPoll);
