import {Player} from './player';
import {BotLogic} from './botLogic';

let NUM_OF_CHANGE_COLOR_CARD = 4;
let NUM_OF_STARTING_CARDS = 8;

class Players {

    constructor() {
        this.CurrentPlayerIndex = null;
        this.CurrentPlayer = null;
        this.Players = [];
        this.numOfBot = null;
        this.numOfHumans = null
        this.botLogic = null;
    }

    init(gameEngine, pile, deck, i_HumansNum, i_BotNum) {

        this.botLogic = new BotLogic(gameEngine, deck, pile);
        this.numOfHumans = i_HumansNum;
        this.numOfBot = i_BotNum;
        this.createPlayers(gameEngine, pile, deck, i_HumansNum, i_BotNum);
        this.CurrentPlayer = this.Players[0]; // the first human player
        this.CurrentPlayerIndex = 0;
        this.CurrentPlayer.startYourTurn();
    }

    createPlayers(i_GameEngine, i_Pile, i_Deck, i_HumansNum, i_BotNum) {

        for (let i = 0; i < i_HumansNum; i++) {
            // this.createPlayer(i_GameEngine, i_Pile, i_Deck, "human");
            this.createPlayer(i_Deck, "human");
        }

        for (let i = 0; i < i_BotNum; i++) {
            // this.createPlayer(i_GameEngine, i_Pile, i_Deck, "bot");
            this.createPlayer(i_Deck, "bot");
        }
    }

    createPlayer(deck, playerType) {
        let newPlayer = new Player(playerType); //use the new BotLogic class to impl bot turn

        for (let i = 0; i < NUM_OF_STARTING_CARDS; i++) {
            let lastCard = deck.getTopCardFromDeck();
            newPlayer.addCard(lastCard);
        }
        // newPlayer.init(gameEngine, pile);
        newPlayer.init();
        if (playerType === "bot") {
            newPlayer.startYourTurn = this.botLogic.startYourTurnFunc.bind(newPlayer);   //startYourTurnFunc.call(newPlayer);
            newPlayer.endYourTurn = this.botLogic.endYourTurnFunc.bind(newPlayer);
        }
        this.Players.push(newPlayer);
    }

    getPlayersList() {
        return this.Players;
    }

    getCurrentPlayer() {
        return this.CurrentPlayer;
    }

    nextPlayerTurn() {
        this.CurrentPlayer.endYourTurn(); //end currPlayer turn

        this.CurrentPlayerIndex = (++this.CurrentPlayerIndex) % (this.numOfBot + this.numOfHumans);
        this.CurrentPlayer = this.Players[this.CurrentPlayerIndex];
    }

    startTurn() {
        this.CurrentPlayer.startYourTurn();//start nextPlayar turn
    }

    getCurrentPlayerIndex() {
        return this.CurrentPlayerIndex;
    }

}

export {Players};
