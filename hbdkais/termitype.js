function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let TYPEDELAY = 75;
let LINEDELAY = 500;
let container = document.querySelector("#content");

let intro = [
    "./hbd --name=KAIS",
    "hbd module initiated... press any key to begin"
]
let text = [
    "Beginning sequence..",
    "?WAIT 500",
    "Happy birthday to you",
    "Happy birthday to you",
    "Happy birthday, happy birthday",
    "Happy birthday to you.",
    "Happy birthday Mr/Mrs 'KAIS'",
    "?WAIT 500",
    "done"
];

async function addChar(p, c) {
    p.textContent += c;
    await sleep(TYPEDELAY);
}


async function simulate(text) {
    for (let i = 0; i < text.length; i++) {
        let line = text[i];
        switch (line.split(' ')[0]) {
            case "?TYPEDELAY":
                TYPEDELAY = parseInt(line[1]);
                break;
            case "?LINEDELAY":
                LINEDELAY = parseInt(line[1]);
                break;
            case "?WAIT":
                await sleep(parseInt(line[1]));
                break;
            default:
                let p = document.createElement("p");
                container.appendChild(p);
                let characters = line.split('');
                for (let ci = 0; ci < characters.length; ci++) {
                    await addChar(p, characters[ci]);
                }
                await sleep(LINEDELAY);
        }
    }
}

(async function() {
    await simulate(intro);
    document.onkeydown = function() {
        document.onkeydown = null;
        var audio = new Audio('./song.mp3');
        audio.play();
        simulate(text);
    };
})();