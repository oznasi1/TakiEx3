
let Face_Down_Attribute = "card_back";

export class Card {

    //attributes[1] is the valid attribute
    constructor(i_Color, i_Id, card_attributes, actionCard) {
        this.color = i_Color;                   //["red", "blue", "green", "yellow"]
        this.id = i_Id;                         //["1", "3", "4", "5", "6", "7", "8", "9","stop", "taki", "2plus", "taki_colorful", "change_colorful"]
        this.cardAtrribute = card_attributes;   //"card_3_red"
        this.isUp = false;
        this.isActionCard = actionCard;
        this.attributes = ["card", Face_Down_Attribute];

    }

    makeCardFaceUp() {
        this.attributes[1] = this.cardAtrribute;
        this.isUp = true;
    }

    makeCardFaceDown() {
        this.attributes[1] = Face_Down_Attribute;
        this.isUp = false;
    }

    getAttributes() {
       return this.attributes[0] + " " + this.attributes[1];
    }

    setAttributes(newAttribute) {
        this.attributes[1] = newAttribute;
    }

    getColor() {
        return this.color;
    }

    setColor(i_Color) {
        this.color = i_Color;
    }

    getId() {
        return this.id;
    }

    isUp() {
        return this.isUp;
    }

    isActionCard() {
        return this.isActionCard;
    }
}