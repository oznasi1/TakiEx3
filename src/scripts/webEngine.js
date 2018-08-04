//import {Deck} from './deck.js';
//import {Pile} from './pile.js';
//import {Players} from './players.js';
//import {ActionManager, eGameState} from './actionManager';

const Deck = require('./deck.js');
const Pile = require('./pile');
const Players = require('./players.js');
const ActionManager = require('./actionManager.js');
const eGameState = require('./eGameState.js');

// var eGameState = { "normal": 0, "change_colorful": 1, "taki": 2, "stop": 3 };

//timer function
let g_timeCounter = 0;
let g_timeInterval = null;
let timer = () => {
    g_timeCounter++;
};

let eStat = {
    "normal": 0,
    "showError": 1,
    "showColorPicker": 2,
    "showEndGame": 3,
    "winner": 4
};

class WebEngine {

    constructor(id) {
        this.Running = false;
        this.Deck = new Deck();
        this.Players = new Players();
        this.Pile = new Pile();
        this.ActionManager = new ActionManager(this.Pile);

        //todo: Id == game id / session id
        this.Id = id;
        this.stat = eStat["normal"];
        this.winnersCounter = 0;
    }

    initEngine(i_PlayersArray) {
        g_timeCounter = 0;
        g_timeInterval = setInterval(timer, 1000);
        this.Running = true; // will enable/disable click events
        this.Deck.init();
        this.Pile.init(this.Deck);
        this.Players.init(this, this.Pile, this.Deck, i_PlayersArray);
        this.ActionManager.init();
        this.stat = eStat["normal"];
        this.winnersCounter = 0;

        //todo: flag "normal"
        this.stat = eStat["normal"];
        //let showError = false;
        //let showColorPicker = false;
        //let endGame = false;
        //updateByRef(showError, showColorPicker, endGame);
    }

    //if the current player ask for stat return game current stat else return normal
    GetStat(playerId) {
        let resultStat = eStat["normal"];

        if (playerId === this.Players.getCurrentPlayerId()) {
            resultStat = this.stat;
            this.stat = eStat["normal"];
        }
        else{
            const player = this.Players.getPlayerById(playerId);
            if(player && player.isAWinner()){
                resultStat = eStat['winner'];
            }
        }
        return resultStat;
    }

    GetId() {
        return this.Id;
    }

    GetCurrentPlayerId(){
        const currPlayer = this.Players.getCurrentPlayer();
        return currPlayer.getId(); //return the current player Name (id) 
    }

    GetOpponentNamesList(playerId){
        const playerList = this.Players.getPlayersList();
        const opponentList = [];
        playerList.forEach(player =>{
            if(player.getId() != playerId){
                let  opponent = {
                    name: player.getId(),
                    numOfCards: player.getCards().length
                };
                opponentList.push(opponent);
            }
        });
        return opponentList;
    }

    GetPlayerById(playerId) {
        let playersList = this.Players.getPlayersList();
        return playersList.find(player => player.getId() === playerId);
    }

    GetDeckById(playerId) {
        let playersList = this.Players.getPlayersList();
        const player = playersList.find(player => player.getId() === playerId);
        if (!player) return null;
        return this.Deck;
    }

    GetPileById(playerId) {
        let playersList = this.Players.getPlayersList();
        const player = playersList.find(player => player.getId() === playerId);
        if (!player) return null;
        return this.Pile;
    }

    GetStatsById(playerId) {
        let playersList = this.Players.getPlayersList();
        const player = playersList.find(player => player.getId() === playerId);
        if (!player) return null;
        return player.getStats();
    }

    GetStatusList() {

        let playersList = this.Players.getPlayersList();
        let statsList = [];
        playersList.forEach((player) =>{ 

            let statsObj = {
                name: player.getId(),
                stats: player.getStatus()
            }

            statsList.push(statsObj);
        });
        statsList.sort((s1, s2) => { //sort function
            const winIndexP1 = s1.getWinnerIndex();
            const winIndexP2 = s2.getStats().getWinnerIndex();
            if (winIndexP1 < winIndexP2)
                return -1;
            if (winIndexP1 > winIndexP2)
                return 1;
            return 0;
        });

        return statsList;
    }

    hasMoreCards(i_CurrPlayer) {

        let result = false;
        let cards = i_CurrPlayer.getCards();
        let pileColor = this.Pile.getTopCardColor();

        for (let i = 0; i < cards.length; i++) {

            if (cards[i].getColor() === pileColor) {
                result = true;
                break;
            }
        }

        return result;
    }
    ;

    hasMoreOptions(i_CurrPlayer) {
        let result = false;
        let playerCards = i_CurrPlayer.getCards();
        let pileColor = this.Pile.getTopCardColor();
        let pileId = this.Pile.getTopCardId();

        if (this.ActionManager.getCurrentGameState() === eGameState["2plus"]) {
            for (let i = 0; i < playerCards.length; i++) {
                if (playerCards[i].getId() === "2plus") {
                    result = true;
                    break;
                }
            }
        }
        else {
            for (let i = 0; i < playerCards.length; i++) {
                if (playerCards[i].getId() === pileId ||
                    playerCards[i].getColor() === pileColor ||
                    playerCards[i].getId() === "change_colorful" ||
                    (playerCards[i].getId() === "taki_colorful" && pileColor !== null) ||
                    (playerCards[i].getId() === "taki" && pileId === "taki_colorful")) {
                    result = true;
                    break;
                }
            }
        }

        return result;
    }

    hasOnlyOneMoreCardForTaki(i_CurrPlayer) {
        let validCardsCounter = 0;
        let playerCards = i_CurrPlayer.getCards();
        let pileColor = this.Pile.getTopCardColor();
        // let pileId = this.Pile.getTopCardId();

        for (let i = 0; i < playerCards.length; i++) {
            if (playerCards[i].getColor() === pileColor) {// ||
                //playerCards[i].getId() === pileId) ||
                // playerCards[i].getId() === "change_colorful" ||
                //(playerCards[i].getId() === "taki_colorful" && pileColor !== null)) {
                validCardsCounter++;
            }
        }

        return validCardsCounter === 1;
    }

    Deck_OnClick(playerId) {

        if (playerId === this.Players.getCurrentPlayerId()) { //todo: if the current player click the deck else do nothing.
            if (this.Running) {
                let isNoMoreOptionsToPlay = !this.hasMoreOptions(this.Players.getCurrentPlayer());
                if (isNoMoreOptionsToPlay) {
                    this.DeckClick();
                }
                else {
                    //todo: flag "show error"
                    this.stat = eStat["showError"];
                    //updateByRef(true, false, false); //show error pop-up cuz there is still possible moves to play
                }
            }
        }
    }
    ;

    DeckClick() {

        let currPlayer = this.Players.getCurrentPlayer();

        do { //get Cards from deck according to deck num of card to draw
            if (this.Deck.Cards.length === 0) { //if deck is empty
                let pileCards = this.Pile.getCards();
                this.Pile.Cards = [];
                this.Pile.addCard(this.Deck.createDeckFromPile(pileCards));
            }
            if (this.Deck.Cards.length > 0) {
                let cardFromDeck = this.Deck.getTopCardFromDeck();
                currPlayer.addCard(cardFromDeck);
            }
        }
        while (this.Deck.getNumberOfCardToDraw() > 1);

        this.ActionManager.setDefaultState();
        this.Players.nextPlayerTurn();

        //todo: flag "normal"
        this.stat = eStat["normal"];
        //let showError = false;
        //let showColorPicker = false;
        //let endGame = false;
        //updateByRef(showError, showColorPicker, endGame);
        this.Players.startTurn();
    }
    ;

    static getTimer() {
        return g_timeCounter;
    }

//info:
//-1 = falid
// 0 = added card
// 1 = change color
// 2 = taki
// // 3 = stop
    Card_OnClick(playerId, cardIndex) { //todo: if it's a changeColor click ==> cardIndex == 'color'

        if (playerId === this.Players.getCurrentPlayerId()) {
            if (this.Running) {
                this.CardClick(cardIndex);
            }
        }
    }


    CardClick(i_CardIndex) {
        this.startTurn(i_CardIndex);
        this.endTurn();
        this.update(); //deck cards = 1 =>> shffle + check winner losser
        if (this.Running) {
            this.Players.startTurn();
        }
    }


    update() {
        let winnerIndex = this.checkForWinner(); //return the current winner or null
        if (winnerIndex != null) {//somebody won
            this.winnersCounter++;
            const playersList = this.Players.getPlayersList();
            const winnerPlayer = playersList[winnerIndex];  //get the winner from player array
            winnerPlayer.setToWinner(this.winnersCounter); //set the player winner index
            if (this.winnersCounter === playersList - 1) { //only the loser didn't win
                playersList.forEach(player => {
                    if (player.getStats().getWinnerIndex() === -1) { //is the losser
                        player.getStats().setWinnerIndex(playersList.length); //set his winner index to last player
                    }
                });
                clearInterval(g_timeInterval);
                this.Running = false;
                this.stat = eStat["showEndGame"];
            }
            //todo: flag "endGame"
            // let showError = false;
            // let showColorPicker = false;
            // let endGame = true;
            // updateByRef(showError, showColorPicker, endGame);
        }
    }


    onQuitClick() {
        //let winnerIndex = 1; //bot

        //todo: flag "endGame"
        this.stat = eStat["showEndGame"];
        //let showError = false;
        //let showColorPicker = false;
        //let endGame = true;
        //updateByRef(showError, showColorPicker, endGame);
    }

    checkForWinner() {

        let winnerIndex = null;
        let playersList = this.Players.getPlayersList();

        for (let i = 0; i < playersList.length; i++) {

            if (playersList[i].getCards().length === 0) {
                winnerIndex = i;
                break;
            }
        }

        return winnerIndex;
    }

    startTurn(i_CardIndex) {

        let gameState = this.ActionManager.getCurrentGameState();

        switch (gameState) {
            case eGameState["normal"]: //try to add card to pile
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPile(currPlayer, card);
                break;

            case eGameState["change_colorful"]: //change the pile color
                var newPileColor = i_CardIndex; /////////in this call i_CardIndex == new color
                this.Pile.setTopCardColor(newPileColor);
                var topPileCard = this.Pile.getTopCardFromPile();
                topPileCard.setAttributes("card_change_" + i_CardIndex);
                topPileCard.setColor(i_CardIndex);
                this.ActionManager.setDefaultState();  //return to normal state & isValidCard = true
                break;

            case eGameState["taki"]:
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPileWhenTaki(currPlayer, card); //try to add card to pile
                break;

            case eGameState["stop"]: //switch to next player but don't start his turn if he is a bo

                break;
            case eGameState["plus"]:
                this.ActionManager.setDefaultState();
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPile(currPlayer, card);
                break;
            case eGameState["2plus"]:
                var currPlayer = this.Players.getCurrentPlayer();
                var card = currPlayer.getCards()[i_CardIndex];
                this.ActionManager.AddCardToPileWhen2Plus(currPlayer, card);
                break;
        }
    }

    endTurn() {
        //render end
        let turnResult = this.ActionManager.getTurnResult();

        //todo: flag "normal"
        this.stat = eStat["normal"];
        // var showError = false;
        // var showColorPicker = false;
        // var endGame = false;

        switch (turnResult) {
            case -1:        //failed to add card to pile
                //todo: flag "showError"
                this.stat = eStat["showError"];
                // showError = true;
                // updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["normal"]: //render after player play and then change to next player
                this.Players.nextPlayerTurn();
                //todo: flag "normal
                this.stat = eStat["normal"];
                //updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["change_colorful"]:  //user or bot need to pick color
                //todo: flag "showColorPicker"
                this.stat = eStat["showColorPicker"];
                // showColorPicker = true;
                // updateByRef(showError, showColorPicker, endGame);

                break;

            case eGameState["taki"]:

                if (this.hasMoreCards(this.Players.getCurrentPlayer())) {
                    this.Players.getCurrentPlayer().setPlayingToFalse();
                    if (this.hasOnlyOneMoreCardForTaki(this.Players.getCurrentPlayer())) {
                        this.ActionManager.setDefaultState();
                    }
                }
                else {   //has no more card to add to the pile
                    this.ActionManager.setDefaultState();
                    this.Players.nextPlayerTurn();
                }
                //todo: flag "normal"
                this.stat = eStat["normal"];
                //updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["stop"]:
                this.Players.nextPlayerTurn();
                this.Players.nextPlayerTurn();
                this.ActionManager.setDefaultState();
                //todo: flag "normal"
                this.stat = eStat["normal"];
                //updateByRef(showError, showColorPicker, endGame);
                break;
            case eGameState["plus"]:
                this.Players.getCurrentPlayer().setPlayingToFalse();
                //todo: flag "normal"
                this.stat = eStat["normal"];
                //updateByRef(showError, showColorPicker, endGame);
                break;
            case eGameState["2plus"]:
                this.Deck.setNumberOfCardToDraw(); //add 2 card to draw
                this.Players.nextPlayerTurn();
                //todo: flag "normal"
                this.stat = eStat["normal"];
                //updateByRef(showError, showColorPicker, endGame);
                break;
        }

    }
}

module.exports = WebEngine;