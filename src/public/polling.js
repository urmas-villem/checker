// polling.js
import { fetchAndDisplayPodImages } from './script.js';

const polling = (() => {
    let countdownInterval;

    async function manualPoll() {
        await fetchAndDisplayPodImages(false);
        startCountdownTimer(Date.now());
    }

    function startCountdownTimer(lastUpdated) {
        clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            const currentTime = Date.now();
            const timeElapsed = currentTime - lastUpdated;
            const timeRemaining = 300000 - timeElapsed;
            if (timeRemaining <= 0) {
                clearInterval(countdownInterval);
                document.getElementById('nextPoll').innerText = 'Polling now...';
                fetchAndDisplayPodImages();
            } else {
                const minutes = Math.floor(timeRemaining / 60000);
                const seconds = Math.floor((timeRemaining % 60000) / 1000);
                document.getElementById('nextPoll').innerText = `Next poll in: ${minutes}m ${seconds}s`;
            }
        }, 1000);
    }

    return {
        manualPoll,
        startCountdownTimer
    };
})();

export { polling };