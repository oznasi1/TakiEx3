let eGameState = {
    "normal": 0,
    "change_colorful": 1,
    "taki": 2,
    "stop": 3,
    "plus": 4,
    "2plus": 5,
    "taki_colorful": 6
};

let NO_COLOR = null;

class ActionManager {

    constructor(i_Pile) {
        this.Pile = i_Pile;
        this.gameState = null;
        this.isValidCard = null;
        this.isActionCard = null;
        this.TakiColor = null;
    }

    init() {
        this.gameState = eGameState["normal"];
        this.isValidCard = false;
        this.isActionCard = false;
    };

    static isActionCardFunc(i_Card) {

        return (i_Card.getId() === "change_colorful" ||
            i_Card.getId() === "taki" ||
            i_Card.getId() === "stop" ||
            i_Card.getId() === "plus" ||
            i_Card.getId() === "2plus" ||
            i_Card.getId() === "taki_colorful"
        );
    }

    checkValidCard(i_Card) {

        return (this.Pile.getTopCardColor() === NO_COLOR && i_Card.getId() !== "taki_colorful" || //if pile color = no color --> can't use taki colorful
            this.Pile.getTopCardColor() !== NO_COLOR && i_Card.getId() === "taki_colorful" ||
            (i_Card.getId() === "taki" && this.Pile.getTopCardId() === "taki_colorful") ||
            i_Card.getColor() !== NO_COLOR && this.Pile.getTopCardColor() !== NO_COLOR && i_Card.getColor() === this.Pile.getTopCardColor()||
            i_Card.getId() === this.Pile.getTopCardId() ||
            i_Card.getId() === "change_colorful");
    }

    AddCardToPileWhenTaki(i_CurrPlayer, i_Card) {

        this.isValidCard = (i_Card.getColor() === this.TakiColor || i_Card.getId() === "taki_colorful");//|| (this.Pile.getTopCardId() === "taki" && i_Card.getId() === "taki"));

        if (this.isValidCard) {
            if (i_Card.getId() === "taki_colorful") {
                let topPileColor = this.Pile.getTopCardColor();
                i_Card.setColor(topPileColor);
                this.Pile.addCard(i_Card);
                i_Card.setAttributes("card_taki_" + topPileColor);
            }
            else {
                this.Pile.addCard(i_Card);
            }

            i_CurrPlayer.removeCard(i_Card);
        }
    };

    AddCardToPileWhen2Plus(i_CurrPlayer, i_Card) {
        this.isValidCard = i_Card.getId() === "2plus";

        if (this.isValidCard) {

            this.Pile.addCard(i_Card);
            i_CurrPlayer.removeCard(i_Card);
        }
    }


    AddCardToPile(i_CurrPlayer, i_Card) {

        this.isValidCard = this.checkValidCard(i_Card);
        if (this.isValidCard) {

            this.isActionCard = ActionManager.isActionCardFunc(i_Card);
            if (this.isActionCard) {

                this.gameState = eGameState[i_Card.getId()];

                if (this.gameState === eGameState["taki"]) {
                    this.TakiColor = i_Card.getColor();
                }
                else if (this.gameState === eGameState["taki_colorful"]) {
                    this.TakiColor = this.Pile.getTopCardColor();
                    i_Card.setColor(this.TakiColor);
                }
            }

            this.Pile.addCard(i_Card);

            if(this.gameState === eGameState["taki_colorful"]){
                this.gameState = eGameState["taki"];
                i_Card.setAttributes("card_taki_" + this.TakiColor);
            }

            i_CurrPlayer.removeCard(i_Card);
        }

    }

    getTurnResult() {
        let result = -1; //not added sign

        if (this.isValidCard) {
            result = eGameState["normal"];
            if (this.isActionCard) {
                result = this.gameState;
            }
        }

        return result;
    }

    changeStateByCard(i_Card){
        this.gameState = eGameState["normal"];
        this.isValidCard = true;
        this.isActionCard = ActionManager.isActionCardFunc(i_Card);
        if(this.isActionCard){

            if(i_Card.getId() !== "taki" && i_Card.getId() !== "taki_colorful"){
                this.gameState = eGameState[i_Card.getId()];
            }
        }
        else{

        }
    }

    setDefaultState() {
        this.gameState = eGameState["normal"];
        this.isValidCard = true;
        this.isActionCard = false;
    }

    static GetGameState() {
        return this.gameState;
    }

    getCurrentGameState() {
        return this.gameState;
    }

}//Action Manager


export {ActionManager, eGameState};