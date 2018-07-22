import {Card} from './card';

class Pile {
    constructor() {
        this.Cards = [];
        this.Color = null;
        this.CardId = null;
    }

    init(i_Deck) {
        let card = i_Deck.getTopCardFromDeck();
        this.addCard(card);
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

export {Pile};