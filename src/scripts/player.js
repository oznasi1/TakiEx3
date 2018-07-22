import {Stats} from "./stats.js";

class Player {

    constructor(i_PlayerId) {
        this.Playing = false;
        // this.GameEngine = null;
        // this.Pile = null;
        this.Cards = [];
        this.PlayerId = i_PlayerId; // human or bot (next ex change to int)
        this.Stats = new Stats();
        this.startYourTurn = null;
        this.endYourTurn = null;
    }

    init() {

        this.Stats = new Stats();
        this.Stats.init();

        if (this.PlayerId === "human") {
            for (let i = 0; i < this.Cards.length; i++) {
                this.Cards[i].makeCardFaceUp();
            }
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

// init(i_GameEngine, i_Pile) {
//
//     this.GameEngine = i_GameEngine;
//     this.Pile = i_Pile;
//     this.Stats = new Stats();
//     this.Stats.init();
//
//     if (this.PlayerId === "human") {
//         for (var i = 0; i < this.Cards.length; i++) {
//             this.Cards[i].makeCardFaceUp();
//         }
//     }
//
//     if (this.PlayerId === "human") {
//
//         this.startYourTurn = function () {
//             if (!this.Playing) {
//                 this.Playing = true;
//                 this.Stats.startTurnTimer();
//             }
//         };
//         this.endYourTurn = function () {
//             if (this.Playing) {
//                 this.Playing = false;
//                 if (this.Cards.length === 1) {
//                     this.Stats.incrementNumOfOneCard();
//                 }
//                 this.Stats.endTurnTimer();
//             }
//         };
//     }
//     else if (this.PlayerId === "bot") {
//
//         this.startYourTurn = function () {
//
//             if (!this.Playing) {
//
//                 this.Playing = true;
//                 //this.WaitBySec(500);
//
//                 this.Stats.startTurnTimer();
//                 var takistate = false;
//
//                 var cardIndex = this.hasCard("change_colorful");
//                 if (cardIndex !== -1) {
//                     this.GameEngine.CardClick(cardIndex);
//                     var randColor = randomColor();
//                     this.GameEngine.CardClick(randColor);
//                     return;
//                 }
//
//                 cardIndex = this.hasCard("stop");
//                 if (cardIndex !== -1) {
//                     this.GameEngine.CardClick(cardIndex);
//                     return;
//                 }
//
//                 cardIndex = this.hasCard("taki");
//                 if (cardIndex !== -1) {
//                     var takistate = true;
//                     this.GameEngine.CardClick(cardIndex);
//                     return;
//                 }
//                 cardIndex = this.checkForValidCard();
//                 if (cardIndex !== -1) {
//
//                     this.GameEngine.CardClick(cardIndex);
//                 }
//                 else {
//                     if (!takistate) {
//                         this.GameEngine.DeckClick();
//                     }
//                 }
//             }
//         };
//
//         this.endYourTurn = function () {
//
//             if (this.Playing) {
//                 this.Playing = false;
//                 if (this.Cards.length === 1) {
//                     this.Stats.incrementNumOfOneCard();
//                 }
//                 this.Stats.endTurnTimer();
//             }
//         };
//     }
// };

    // checkForValidCard() {
    //
    //     let cardIndex = -1;
    //
    //     for (let i = 0; i < this.Cards.length; i++) {
    //         if (this.Cards[i].getColor() === this.Pile.getTopCardColor() || this.Cards[i].getId() === this.Pile.getTopCardId()) {
    //             cardIndex = i;
    //             break;
    //         }
    //     }
    //
    //     return cardIndex;
    // }

    addCard(card) {

        if (this.PlayerId === "human") {
            card.makeCardFaceUp();
        }
        this.Cards.push(card);
    }

    removeCard(card) {

        for (var i = 0; i < this.Cards.length; i++) {
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


export {Player};