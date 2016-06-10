function getCode(letter) { return letter.charCodeAt(); }
function getLetter(code) { return String.fromCharCode(code); }
function getRandomChar() { return String.fromCharCode(Math.floor(Math.random() * (max - min)) + min); }
var min = 65;
var max = 91;
var maxchars = 1000000000;
var found = false;
var log = [];
var button = document.getElementById("btn");
var input = document.getElementById("input");
var output = document.getElementById("results");
button.onclick = function () {
    output.innerHTML = "";
    findWord(input.value);

}

function findWord(wordToFind) {
    var word = wordToFind.toUpperCase();
    var progress = 0;
    while (!found && log.length < maxchars) {
        log.push(getRandomChar());
        if (log[log.length - 1] === word[progress]) {
            progress++;
            if (progress === word.length) {
                found = true;
            }
        } else {
            progress = 0;
        }
    }
    if (found) {
        var node = document.createElement('div');
        node.innerHTML = "Word " + word + " found after " + log.length + " characters!<br/><p>";
        output.appendChild(node);
        console.log("Word found after " + log.length + " characters!");
        reset();
    } else {
        var node = document.createElement('div');
        node.innerHTML ="Max chars " + maxchars + " reached, word not found!";
        output.appendChild(node);
        console.log("Max chars " + maxchars + " reached, word not found!");
        reset();
    }
}


function reset() {
    log = [];
    found = false;
}

