const categorySelect = document.getElementById("categorySelect");
const customWordsText = document.getElementById("customWords");
const timerInput = document.getElementById("timerInput");
const wordList = words.split("\n").join(" ").split(" ");
const usedList = [];

const timerDisplay = document.getElementById('timerDisplay');
const wordDisplay = document.getElementById('wordDisplay');
const btnGo = document.getElementById('btnGo');
const btnStop = document.getElementById('btnStop');
const btnWord = document.getElementById('btnWord');

let state = 2;
let currentWord = "";

const STATES = {
    INIT: 0,
    STARTED: 1,
    STOPPED: 2,
    READY: 3
}

let timerId = null;
let timeLeft = null;

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getWord() {
    if (wordList.length === 0) {
        wordList.push(...usedList);
        usedList.length = 0;
    }
    let word = wordList.splice(getRandom(wordList), 1)[0];
    usedList.push(word);
    return word;
}

function startTimer(sec) {
    timerDisplay.classList.remove("red");
    timeLeft = sec;
    timerDisplay.innerText = "" + sec;
    timerId = setInterval(function() {
        sec--;
        timerDisplay.innerText = "" + sec;
        if (sec <= 0) timerDisplay.classList.add("red");
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

btnWord.onclick = function() {
    if (state === STATES.STOPPED || state === STATES.READY) {
        currentWord = getWord();
        wordDisplay.innerText = currentWord;
        state = STATES.READY;
    }
}

btnGo.onclick = function() {
    if (state === STATES.READY) {
        let time = null;
        try {
            time = parseInt(timerInput.value);
        } catch (e) {
            return console.error("Invalid time");
        }
        state = STATES.STARTED;
        wordDisplay.classList.add("hidden");
        startTimer(time);
    }
}

btnStop.onclick = function() {
    if (state === STATES.STARTED) {
        stopTimer();
        wordDisplay.classList.remove("hidden");
        state = STATES.STOPPED;
    }
}