// Learn about Worker API -> https://developer.mozilla.org/en-US/docs/Web/API/Worker

let timer;
let timeInSeconds;
let remainingSeconds = 0;

// Function to start the timer with a given duration
const startTimer = (duration, e) => {
    // Set the initial time
    timeInSeconds = duration;

    // Set up an interval to update the timer
    timer = setInterval(() => {
        // Notify the main thread about the timer tick
        if (timeInSeconds === 0) {
            // If the timer reaches 0, clear the interval and notify the main thread about timer end
            clearInterval(timer);
            self.postMessage({ command: 'timerEnd' });
        } else {
            // If the timer is still running, decrement the time, notify the main thread about the tick
            timeInSeconds--;
            self.postMessage({ command: 'tick', timeInSeconds });
        }
    }, 1000);
}

// Event listener for messages from the main thread
self.addEventListener('message', (e) => {
    if (e.data.command === 'startTimer') {
        // If the command is to start the timer, clear any existing timer, set the initial time, and start the timer
        clearInterval(timer);
        timeInSeconds = e.data.timeInSeconds;
        startTimer(timeInSeconds)
    } else if (e.data === 'stopTimer') {
        // If the command is to stop the timer, clear the interval
        clearInterval(timer);
    } else if (e.data === 'pause') {
        // If the command is to pause, clear the interval
        clearInterval(timer);
    } else if (e.data === 'resume') {
        // If the command is to resume, start the timer with the remaining time
        startTimer(timeInSeconds);
    }
});



