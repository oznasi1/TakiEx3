//import {Player} from './player';
//import {BotLogic} from './botLogic';

const Player = require('./player.js');

let NUM_OF_CHANGE_COLOR_CARD = 4;
let NUM_OF_STARTING_CARDS = 1;

class Players {

    constructor() {
        this.CurrentPlayerIndex = null;
        this.CurrentPlayer = null;
        this.Players = [];
        this.numOfBot = 0;
        this.numOfHumans = null
        this.botLogic = null;
    }

    init(gameEngine, pile, deck, i_PlayersArray) { //i_PlayerArray = [{name: "Amit"}, {name: "Oz"}]

        //this.botLogic = new BotLogic(gameEngine, deck, pile);
        this.numOfHumans = i_PlayersArray.length;
        this.createPlayers(gameEngine, pile, deck, i_PlayersArray);
        this.CurrentPlayer = this.Players[0]; // the first human player
        this.CurrentPlayerIndex = 0;
        this.CurrentPlayer.startYourTurn();
    }

    createPlayers(i_GameEngine, i_Pile, i_Deck, i_PlayersArray) {
        let numOfPlayers = i_PlayersArray.length;
        for (let i = 0; i < numOfPlayers; i++) {
            this.createPlayer(i_Deck, i_PlayersArray[i]);
        }
    }

    createPlayer(deck, playerType) { //todo: playerType == playerName
        let newPlayer = new Player(playerType); //use the new BotLogic class to impl bot turn

        for (let i = 0; i < NUM_OF_STARTING_CARDS; i++) {
            let lastCard = deck.getTopCardFromDeck();
            newPlayer.addCard(lastCard);
        }
        newPlayer.init();
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

        let foundPlayer = false;
        while(!foundPlayer){
            this.CurrentPlayerIndex = (++this.CurrentPlayerIndex) % (this.numOfBot + this.numOfHumans);
            this.CurrentPlayer = this.Players[this.CurrentPlayerIndex];
            if(!this.CurrentPlayer.isAWinner()){
                foundPlayer = true;
            }
        }
    }

    startTurn() {
        this.CurrentPlayer.startYourTurn();//start nextPlayar turn
    }

    getCurrentPlayerIndex() {
        return this.CurrentPlayerIndex;
    }

    getCurrentPlayerId(){
        return this.CurrentPlayer.getId();
    }

    getPlayerById(playerId){
        return this.Players.find(player => player.getId() === playerId);
    }

}

//export {Players};
module.exports = Players;