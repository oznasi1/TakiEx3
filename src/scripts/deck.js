//import {Card} from './card';
const Card = require('./card.js');

let cardID = ["1", "3", "4", "5", "6", "7", "8", "9"
    , "stop", "taki", "plus", "2plus", "taki_colorful", "change_colorful"];// adding 2plus before chanege color
let cardColor = ["red", "blue", "green", "yellow"];
let NO_COLOR = null;
let NUM_OF_STARTING_CARDS = 8;
let NUM_OF_TAKI_COLOR_CARD = 2;
let NUM_OF_CHANGE_COLOR_CARD = 4;


class Deck {
    constructor() {
        this.Cards = [];
        this.NumOfCardToDraw = 1;
    }

    init() {
        this.NumOfCardToDraw = 1;
        this.createDeck();
        this.shuffle();
        this.shuffle();
    };

    createDeck() {
        for (let i = 0; i < cardColor.length; i++) {
            for (let j = 0; j < cardID.length - 2; j++) { // execept chang_color card
                let cardAttribute = "card_" + cardID[j] + "_" + cardColor[i];
                let isActionCard = cardID[j] === "taki" || cardID[j] === "stop" || cardID[j] === "2plus" || cardID[j] === "plus";

                let card1 = new Card(cardColor[i], cardID[j], cardAttribute, isActionCard);// maybe we need 2 "new line"
                let card2 = new Card(cardColor[i], cardID[j], cardAttribute, isActionCard);// maybe we need 2 "new line"

                this.Cards.push(card1);
                this.Cards.push(card2);
            }
        }
        for (let i = 0; i < NUM_OF_CHANGE_COLOR_CARD; i++) {
            let changeColorfulID = cardID[cardID.length - 1];
            let cardAttribute = "card_" + changeColorfulID;
            let card = new Card(NO_COLOR, changeColorfulID, cardAttribute, true);//CHANGE_COLOR
            this.Cards.push(card);
        }

        for (let i = 0; i < NUM_OF_TAKI_COLOR_CARD; i++) {
            let takiColorfulID = cardID[cardID.length - 2];
            let cardAttribute = "card_" + takiColorfulID;
            let card = new Card(NO_COLOR, takiColorfulID, cardAttribute, true);//SUPER_TAKI
            this.Cards.push(card);
        }
    }

    createDeckFromPile(i_Cards) {

        this.Cards = i_Cards;
        let topPileCard = this.Cards.pop(); //we need to save top pile card

        if (this.Cards.length === 0) { //if there is no more cards in deck&pile only the top card in pile
            this.NumOfCardToDraw = 1;
            return topPileCard;
        }

        //make all the cards face down
        for (let i = 0; i < this.Cards.length; i++) { //-1 ==> we don't touch the last card

            this.Cards[i].makeCardFaceDown();
            let card = this.Cards[i];

            if (card.getId() === "change_colorful") {
                card.setColor(NO_COLOR);
                card.setAttributes("card_change_colorful");
            }
            if (card.getId() === "taki_colorful") {
                card.setColor(NO_COLOR);
                card.setAttributes("card_taki_colorful");
            }
        }
        this.shuffle();
        return topPileCard; //return the last card
    };

    shuffle() {
        for (let i = 0; i < this.Cards.length; i++) {
            let rndNo = Deck.getRandomInt(0, this.Cards.length - 1);
            let card = this.Cards[i];
            this.Cards[i] = this.Cards[rndNo];
            this.Cards[rndNo] = card;
        }
    };

    getTopCardFromDeck() {
        let card = this.Cards.pop(); //todo: Amit Test *************************************************
        card.makeCardFaceUp();
        return card;
    };

    getCards() {
        return this.Cards;
    }

    getNumberOfCardToDraw() {
        let numToReturn = this.NumOfCardToDraw;
        if (this.NumOfCardToDraw > 1) {
            this.NumOfCardToDraw -= 1;
        }
        return numToReturn;
    }

    setNumberOfCardToDraw() {
        if (this.NumOfCardToDraw === 1) {
            this.NumOfCardToDraw = 2;
        }
        else {
            this.NumOfCardToDraw += 2;
        }
    }

    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

module.exports = Deck;