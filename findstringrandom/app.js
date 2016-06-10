function getCode(letter) { return letter.charCodeAt(); }
function getLetter(code) { return String.fromCharCode(code); }
function getRandomChar() { return String.fromCharCode(Math.floor(Math.random() * (max - min)) + min); }
var min = 65;
var max = 91;
var maxchars = 1000000000;

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
    var total = 0;
    var found = false;
    while (!found && log.length < maxchars) {
        total++;
        var letter = getRandomChar();
        if (letter === word[progress]) {
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
        node.innerHTML = "Word " + word + " found after " + total + " characters!<br/><p>";
        output.appendChild(node);
        console.log("Word found after " + total + " characters!");
    }else{
        console.log('error');
    }
}

