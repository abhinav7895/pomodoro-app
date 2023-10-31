let timer;
let timeInSeconds;
let remainingSeconds = 0;

const startTimer = (duration, e) => {
    timeInSeconds = duration;
    timer = setInterval(() => {
        // self.postMessage({command : 'tick', timeInSeconds});
        if (timeInSeconds === 0) {
            clearInterval(timer);
            self.postMessage({command :'timerEnd'});
        } else {
            timeInSeconds--;
            self.postMessage({command : 'tick', timeInSeconds});
            console.log(timeInSeconds);
        }
    }, 1000);
}

self.addEventListener('message', (e) => {
    if (e.data.command === 'startTimer') {
        clearInterval(timer);
        timeInSeconds = e.data.timeInSeconds;
        startTimer(timeInSeconds)
    } else if (e.data === 'stopTimer') {
        clearInterval(timer);
    } else if(e.data === 'pause') {
        console.log('pause');
        clearInterval(timer);
    } else if(e.data === 'resume') {
        console.log('resume');
        startTimer(timeInSeconds);
    }
});



