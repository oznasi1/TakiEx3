//import {Card} from './card';
//const Card = require('./card.js');

class Pile {
    constructor() {
        this.Cards = [];
        this.Color = null;
        this.CardId = null;
    }

    init(i_Deck) {
        //let card = i_Deck.getTopCardFromDeck(); //todo: change back to this

        //delete todo:
        let resCard;
        i_Deck.getCards().find(card=>{
            if(card.getId() === "change_colorful"){
                resCard = card;
            }
        });

        this.addCard(resCard);
        /////delete before

        
        //this.addCard(card);
    }

    addCard(i_Card) {
        i_Card.makeCardFaceUp();
        this.Cards.push(i_Card);
        this.Color = i_Card.getColor();
        this.CardId = i_Card.getId();
    }

    getTopCardFromPile() {
        return this.Cards[this.Cards.length - 1];
    }

    getTopCardId() {
        return this.CardId;
    }

    setTopCardId(i_NewCardId) {
        this.CardId = i_NewCardId;
    }

    getTopCardColor() {
        return this.Color;
    }

    setTopCardColor(i_NewColor) {
        this.Color = i_NewColor;
    }

    getCards() {
        return this.Cards;
    }

    getTopCard() {
        return this.Cards[this.Cards.length - 1];
    }

}

module.exports = Pile;