
var suits = ['s', 'c', 'h', 'd'];
var ranks = ['a', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'];
var basecards = [];
var cardsleft = [];
var images = {};
var BLACK_JACK = 21;
var DEALER_HIT_LIMIT = 17;
GameState = {
    START_GAME: 0,
    PLAYER_TURN: 1,
    GAME_OVER: 2
}
ui = {
    wagerView: $('#wagerDisplay'),
    tokensView: $('#tokensDisplay'),
    playView: $('#buttons'),
    startView: $('#gamesettings'),
    wagerInput: $('#bet'),
    wager: $('#wager'),
    tokens: $('#tokens'),
    deal: $('#start'),
    hit: $('#hit'),
    stand: $('#stand'),
    status: $('#status'),
    dealerCards: $('#dealerCards'),
    playerCards: $('#playerCards')
}

/** Helper function to get random numbers in a range (inclusive).*/
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateView(g) {
    if (g.state != GameState.START_GAME) {
        ui.dealerCards.html('')
        ui.playerCards.html('')
        g.dealer.cards.forEach(function (card) {
            ui.dealerCards.append($('<img class="card" src="' + card.img + '"/>'));
        });
        g.player.cards.forEach(function (card) {
            ui.playerCards.append($('<img class="card" src="' + card.img + '"/>'));
        });
        ui.wager.text(g.wager);
    }
    ui.tokens.text(player_tokens);
    ui.status.text(g.status);
}

/** Class reprensenting card objects. Both in decks and in player hands.*/
class Card {
    constructor(suit, rank, value, imgname) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.imgsrc = './assets/images/cards/' + imgname + '.png'
        this.hidden = false;
    }

    get img() {
        return this.hidden ? './assets/images/cards/back.png' : this.imgsrc;
    }
}

/** Used to generate the list of card objects, preloads their images */
function initializeBaseCards() {
    suits.forEach(function (suit) {
        ranks.forEach(function (rank) {
            if (rank == 'a') value = 1;
            else if (rank == 'j' || rank == 'q' || rank == 'k') value = 10;
            else value = rank;
            basecards.push(new Card(suit, rank, value, rank + suit));
        });
    });
    basecards.forEach(function (card) {
        var img = new Image();
        img.src = card.img;
    });
}

/** Class representing a deck object. Used to deal cards from in the game. */
class Deck {
    constructor() {
        this.cards = [];
        this.fillDeck();
    }

    fillDeck() {
        let cardsleft = [];
        basecards.forEach(card => cardsleft.push(card));
        while (cardsleft.length > 0)
            this.cards.push(cardsleft.splice(randomRange(0, cardsleft.length - 1), 1)[0]);
    }

    drawCard() {
        return this.cards.pop();
    }

    drawCards(amt) {
        let drawn = [];
        for (let i = 0; i < amt; i++)
            drawn.push(this.drawCard());
        return drawn;
    }
}

function getEntranceChips() {
    return 1000;
}
/** Class representing a player. Either the player or the dealer. */
class Player {
    constructor(deck, gm) {
        this.cards = [];
        this.chipCount = 0;
        this.stand = false;
        this.firstTurn = true;
        this.deck = deck;
        this.gm = gm;
    }

    get handTotal() {
        let total = 0
        let hasAce = false;
        this.cards.forEach(function (card) {
            if (card.rank == 'a') hasAce = true;
            total += card.value;
        });
        if (total <= 11 && hasAce) {
            return total + 10;
        }
        return total;
    }

    get displayTotal() {
        let hasHidden = false;
        this.cards.forEach(function (card) {
            if (card.hidden) hasHidden = true;
        });
        return hasHidden ? "???" : this.handTotal;
    }

    hit(hideCard = false) {
        this.cards.push(this.deck.drawCard());
        if (hideCard) this.cards[this.cards.length - 1].hidden = true;
    }

    stand() {
        this.stand = true;
    }
}


class GameManager {

    constructor() {
        this.status = "Place your bet!";
        this.state = GameState.START_GAME;
    }

    prettyPrint() {
        let dealercards = "";
        let playercards = "";
        let dealertotal = 0;
        let playertotal = 0;

        this.dealer.cards.forEach(card => dealercards += card.hidden ? "[hidden]" : "[" + card.rank + " of " + card.suit + "]")
        this.player.cards.forEach(card => playercards += "[" + card.rank + " of " + card.suit + "]")
        dealertotal = this.dealer.handTotal;
        playertotal = this.player.handTotal;

        console.info("Dealer: " + dealercards + " | Total: " + (this.dealer.cards[1].hidden ? "???" : dealertotal));
        console.info("Player: " + playercards + " | Total: " + playertotal);
    }

    playerWin(reason) {
        this.status = "You won! " + reason + "Your total: " + this.player.handTotal + " Dealer total: " + this.dealer.displayTotal;
        console.log("You won!", reason);
        console.log("Winnings: ", Math.ceil(this.wager * 1.5));
        player_tokens += Math.ceil(this.wager * 1.5);
    }
    playerLose(reason) {
        this.status = "You lost! " + reason + "Your total: " + this.player.handTotal + " Dealer total: " + this.dealer.displayTotal;
        console.log("You lost!", reason);
    }
    tie() {
        this.status = "It was a tie! You get your tokens back. " + "Your total: " + this.player.handTotal + " Dealer total: " + this.dealer.displayTotal;
        console.log("It was a tie! You get your tokens back.");
        player_tokens += this.wager;
    }
    resolveGame(openingBJ = false) {
        if (openingBJ) {
            if (this.player.handTotal > this.dealer.handTotal) this.playerWin("You had an opening hand blackjack! ");
            else if (this.dealer.handTotal > this.player.handTotal) this.playerLose("Dealer had an opening hand blackjack! ");
            else this.tie();
        }
        updateView(this);
        this.dealer.cards[1].hidden = false;
        this.prettyPrint();
        if (this.player.handTotal > 21) this.playerLose("Player busted. ");
        else if (this.dealer.handTotal > 21) this.playerWin("Dealer busted. ");
        else if (this.player.handTotal > this.dealer.handTotal) this.playerWin("Player was closest to 21! ");
        else if (this.dealer.handTotal > this.player.handTotal) this.playerLose("Dealer was closest to 21! ");
        else this.tie();
        ui.startView.show();
        ui.playView.hide();
        updateView(this);
        this.state = GameState.START_GAME;
    }
    hit() {
        this.player.hit();
        if (this.player.handTotal == BLACK_JACK) {
            this.dealerTurn();
        }
        else if (this.player.handTotal > 21) {
            this.resolveGame();
            return;
        }
        else {
            console.info("Hit or stand!");
        }
        this.prettyPrint();
        this.status = "Your total: " + this.player.handTotal + " Dealer total: " + this.dealer.displayTotal;
    }
    stand() {
        this.dealerTurn();
    }

    dealerTurn() {
        this.dealer.cards[1].hidden = false;
        console.info("Dealer turn!");
        console.info("Dealer reveals his second card");
        this.prettyPrint();
        while (this.dealer.handTotal < DEALER_HIT_LIMIT) {
            console.info("Dealer hits!");
            this.dealer.hit();
            this.prettyPrint();
        }
        this.resolveGame();
    }
    play(amount) {
        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0) {
            this.status = "Enter a valid amount!";
            updateView(this);
            return false;
        }
        if (amount > player_tokens) {
            console.error("Not enough tokens");
            this.status = "Not enough tokens!";
            updateView(this);
            return false;
        } else {
            this.init(amount);
            return true;
        }
    }
    init(amount) {
        player_tokens -= amount;
        this.deck = new Deck();
        this.player = new Player(this.deck, this);
        this.dealer = new Player(this.deck, this);
        this.wager = amount;
        this.dealer.hit();
        this.player.hit();
        this.dealer.hit(true);
        this.player.hit();
        this.prettyPrint();

        if (this.dealer.cards[0].value == 10 || this.dealer.cards[0].rank == 'a') {
            console.info("Dealer peeking for blackjack..");
            if (this.dealer.handTotal == 21) {
                this.dealer.cards[1].hidden = false;
                console.info("Dealer had blackjack in opening hand!");
                this.resolveGame(true);
                return;
            }
            console.info("No blackjack!");
        }
        if (this.player.handTotal == 21) {
            updateView(this);
            this.resolveGame(true);
            return;
        }
        console.info("Player turn! use hit() or stand()");
        this.prettyPrint();
        this.state = GameState.PLAYER_TURN;
        this.status = "Your total: " + this.player.handTotal + " Dealer total: " + this.dealer.displayTotal;
        updateView(this);
    }

}

var player_tokens = getEntranceChips();

initializeBaseCards();
g = new GameManager();
updateView(g);

ui.playView.hide();
ui.deal.click(function () {
    if (g.state != GameState.START_GAME) window.alert("INVALID STATE");
    success = g.play(ui.wagerInput.val());
    if (success) {
        ui.startView.hide();
        ui.playView.show();
        updateView(g);
    }
});

ui.hit.click(function () {
    if (g.state != GameState.PLAYER_TURN) window.alert("INVALID STATE");
    g.hit();
    updateView(g);
});

ui.stand.click(function () {
    if (g.state != GameState.PLAYER_TURN) window.alert("INVALID STATE");
    g.stand();
    updateView(g);
});