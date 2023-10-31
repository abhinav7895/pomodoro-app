const buttons = [
    {
        element: document.querySelector("[data-pomodoro-btn]"),
        timeInSeconds: 1500,
        color: "linear-gradient(#33d8d8, #0d0f92",
        background: "rgb(56, 110, 190)",
        msg: " - Time to focus!",
    },
    {
        element: document.querySelector("[data-shortBreak-btn]"),
        timeInSeconds: 300,
        color: "linear-gradient(#d833ca, #920d39)",
        background: "rgb(255, 87, 87)",
        msg: " - Time for a short break!",
    },
    {
        element: document.querySelector("[data-longBreak-btn]"),
        timeInSeconds: 900,
        color: "linear-gradient(#ecba6e, #92850d)",
        background: "#a18c36",
        msg: " - Time for a long break!",
    },
];

const startBtn = document.querySelector("[data-start-btn]");
const pauseBtn = document.querySelector("[data-pause-btn]");
const dataTimer = document.querySelector("[data-timer]");
const ringEnd = document.querySelector('[data-ring="end"]');
const ringStart = document.querySelector('[data-ring="start"]');
const body = document.querySelector("body");
let msg;
let timeInSeconds = buttons[0].timeInSeconds;
const pomodoroWorker = new Worker('worker.js');

function updateTitle(seconds, msg) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    document.title = formattedTime + msg;
}

function displayTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    dataTimer.textContent = formattedTime;
}

function resetButtonColor() {
    buttons.forEach((btn) => {
        btn.element.style.background = "white";
        btn.element.style.color = "black";
    });
}

function startPomodoro(button) {
    msg = button.msg;
    resetButtonColor();
    pauseBtn.textContent = "PAUSE";
    timeInSeconds = button.timeInSeconds;
    displayTime(timeInSeconds);
    pomodoroWorker.postMessage('stopTimer');
    startBtn.disabled = false;
    setTimeout(() => {
        button.element.style.color = "white";
        body.style.background = button.color;
        button.element.style.background = button.color;
    }, 200);
    updateTitle(timeInSeconds, msg);
}

buttons.forEach((button) => {
    button.element.addEventListener("click", () => startPomodoro(button));
});

startBtn.addEventListener("click", () => startTimer());

pauseBtn.addEventListener("click", (e) => {
    const textContent = e.target.textContent;
    if (textContent === 'PAUSE') {
        e.target.textContent = "RESUME";
        pomodoroWorker.postMessage('pause');
    } else {
        e.target.textContent = "PAUSE";
        pomodoroWorker.postMessage('resume')
    }
})

function startTimer() {
    pomodoroWorker.postMessage('reset');
    startBtn.disabled = true;
    ringStart.play();
    pomodoroWorker.postMessage({ command: 'startTimer', timeInSeconds });
    console.log(timeInSeconds);
    pomodoroWorker.addEventListener('message', (e) => {
        if (e.data.command === 'tick') {
            displayTime(e.data.timeInSeconds);
            updateTitle(e.data.timeInSeconds, msg);
        } else if (e.data.command === 'timerEnd') {
            timeInSeconds = 0;
            startBtn.disabled = false;
            ringEnd.play();
        }
    });
}

startPomodoro(buttons[0])
updateTitle(timeInSeconds, msg);
displayTime(timeInSeconds);
