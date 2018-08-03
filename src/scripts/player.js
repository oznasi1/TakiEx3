//import {Stats} from "./stats.js";
const Stats = require('./stats.js');

class Player {

    constructor(i_PlayerId) {
        this.Playing = false;
        this.Cards = [];
        this.PlayerId = i_PlayerId; // todo: PlayerId == PlayerName
        this.Stats = new Stats();
        this.startYourTurn = null;
        this.endYourTurn = null;
    }

    init() {

        this.Stats = new Stats();
        this.Stats.init();

        for (let i = 0; i < this.Cards.length; i++) {
            this.Cards[i].makeCardFaceUp();
        }

        this.startYourTurn = function () {
            if (!this.Playing) {
                this.Playing = true;
                this.Stats.startTurnTimer();
            }
        };

        this.endYourTurn = function () {
            if (this.Playing) {
                this.Playing = false;
                if (this.Cards.length === 1) {
                    this.Stats.incrementNumOfOneCard();
                }
                this.Stats.endTurnTimer();
            }
        };
    }

    addCard(card) {

        // if (this.PlayerId === "human") {
        //     card.makeCardFaceUp();
        // }
        card.makeCardFaceUp();
        this.Cards.push(card);
    }

    removeCard(card) {

        for (let i = 0; i < this.Cards.length; i++) {
            if (Player.equalTwoCards(this.Cards[i], card)) // the card found
            {
                this.Cards.splice(i, 1);
                break;
            }
        }
    }

    getCards() {
        return this.Cards;
    }

    getStats() {
        return this.Stats;
    }

    getId() {
        return this.PlayerId;
    }

    static equalTwoCards(card1, card2) {
        let isEqual = false;
        if (card1.getColor() === card2.getColor() && card1.getId() === card2.getId()) {
            isEqual = true;
        }
        return isEqual;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setPlayingToFalse() {
        this.Playing = false;
    }
}


//export {Player};

module.exports = Player;