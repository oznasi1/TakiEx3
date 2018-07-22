import {Deck} from './deck.js';
import {Pile} from './pile.js';
import {Players} from './players.js';
import {ActionManager, eGameState} from './actionManager';
import {updateByRef} from "../scripts/controller.js";
// var eGameState = { "normal": 0, "change_colorful": 1, "taki": 2, "stop": 3 };

//timer function
let g_timeCounter = 0;
let g_timeInterval = null;
let timer = () => {
    g_timeCounter++;
};

class GameEngine {

    constructor() {
        this.Running = false;
        this.UI = null;
        this.Deck = new Deck();
        this.Players = new Players();
        this.Pile = new Pile();
        this.ActionManager = new ActionManager(this.Pile);
    }

    initEngine(i_UI, i_NumberOfHuman, i_NumberOfBots) {
        g_timeCounter = 0;
        g_timeInterval = setInterval(timer, 1000);
        this.Running = true; // will enable/disable click events
        // this.UI = i_UI; //will help us print to screen
        this.Deck.init();
        this.Pile.init(this.Deck);
        this.Players.init(this, this.Pile, this.Deck, i_NumberOfHuman, i_NumberOfBots); // 1 bot, 1 human
        this.ActionManager.init();
        // this.UI.Render(this.Deck, this.Pile, this.Players); //new
        let showError = false;
        let showColorPicker = false;
        let endGame = false;
        updateByRef(showError, showColorPicker, endGame);
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
    };

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

    Deck_OnClick(event) {

        if (this.Running) {
            let isNoMoreOptionsToPlay = !this.hasMoreOptions(this.Players.getCurrentPlayer());
            if (isNoMoreOptionsToPlay) {
                this.DeckClick();
                //
                // let isDeckEmpty = (this.Deck.Cards.length <= 1);
                // if (isDeckEmpty) {
                //     let pileCards = this.Pile.getCards();
                //     this.Pile.Cards = [];
                //     this.Pile.addCard(this.Deck.createDeckFromPile(pileCards));
                // }
            }
            else {
                updateByRef(true, false, false); //show error pop-up cuz there is still possible moves to play
            }
        }
    };

    DeckClick() {

        let currPlayer = this.Players.getCurrentPlayer();
        // let numOfCardToDrawFromDeck = this.Deck.getNumberOfCardToDraw()
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
        // for (let i = 0; i < numOfCardToDrawFromDeck; i++) {
        //     let cardFromDeck = this.Deck.getTopCardFromDeck();
        //     currPlayer.addCard(cardFromDeck);
        // }
        //
        // let isDeckEmpty = (this.Deck.Cards.length <= 1);
        // if (isDeckEmpty) {
        //     let pileCards = this.Pile.getCards();
        //     this.Pile.Cards = [];
        //     this.Pile.addCard(this.Deck.createDeckFromPile(pileCards));
        // }

        this.ActionManager.setDefaultState();
        this.Players.nextPlayerTurn();
        //this.UI.Render(this.Deck, this.Pile, this.Players);
        let showError = false;
        let showColorPicker = false;
        let endGame = false;
        updateByRef(showError, showColorPicker, endGame);
        this.Players.startTurn();
    };

    static getTimer() {
        return g_timeCounter;
    }

    //info:
    //-1 = falid
    // 0 = added card
    // 1 = change color
    // 2 = taki
    // // 3 = stop
    Card_OnClick(event) {

        if (this.Running) {
            let cardIndex = event.target.id;
            this.CardClick(cardIndex);
        }
    };

    CardClick(i_CardIndex) {
        this.startTurn(i_CardIndex);
        this.endTurn();
        this.update(); //deck cards = 1 =>> shffle + check winner losser
        if (this.Running) {
            this.Players.startTurn();
        }
    };

    update() {
        let winnerIndex = this.checkForWinner();
        if (winnerIndex != null) {//somebody won
            clearInterval(g_timeInterval);
            this.Running = false;
            let showError = false;
            let showColorPicker = false;
            let endGame = true;
            updateByRef(showError, showColorPicker, endGame);
            //this.UI.RenderWinnerScreen(this.Players.getPlayersList(), winnerIndex, s_gameTimer);
        }
    };

    onQuitClick(){
        let winnerIndex = 1; //bot
        let showError = false;
            let showColorPicker = false;
            let endGame = true;
            updateByRef(showError, showColorPicker, endGame);
    }

    checkForWinner() {

        let winnerIndex = null;
        let playersList = this.Players.getPlayersList();

        for (var i = 0; i < playersList.length; i++) {

            if (playersList[i].getCards().length === 0) {
                winnerIndex = i;
                break;
            }
        }

        return winnerIndex;
    }

    startTurn(i_CardIndex) {

        var gameState = this.ActionManager.getCurrentGameState();

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
    };

    endTurn() {
        //render end
        var turnResult = this.ActionManager.getTurnResult();
        var showError = false;
        var showColorPicker = false;
        var endGame = false;
        switch (turnResult) {
            case -1:        //failed to add card to pile
                            //this.UI.ShowError();
                showError = true;
                updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["normal"]: //render after player play and then change to next player
                this.Players.nextPlayerTurn();
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["change_colorful"]:  //user or bot need to pick color
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                showColorPicker = true;
                updateByRef(showError, showColorPicker, endGame);
                //this.UI.ShowColorPicker();
                break;

            case eGameState["taki"]:
                // if (!this.hasMoreCards(this.Players.getCurrentPlayer())) // run out of Cards in the same color
                // {
                //     // this.ActionManager.setDefaultState();
                //     let isCurrPlayerGetExtraTurn = this.ActionManager.isExtraTurnCard(this.Pile.getTopCard());
                //     this.ActionManager.changeStateByCard(this.Pile.getTopCard());        //change state according to the top pile card
                //     if (isCurrPlayerGetExtraTurn) { //the game state is determine by the last card.
                //         this.Players.getCurrentPlayer().setPlayingToFalse(); //extra turn
                //     }
                //     else {
                //         this.Players.nextPlayerTurn();
                //     }
                //     //this.UI.Render(this.Deck, this.Pile, this.Players);
                //     updateByRef(showError, showColorPicker, endGame);
                // }
                // else {
                //     this.Players.getCurrentPlayer().setPlayingToFalse();
                //     //this.UI.Render(this.Deck, this.Pile, this.Players);
                //     updateByRef(showError, showColorPicker, endGame);
                // }
                if (this.hasMoreCards(this.Players.getCurrentPlayer())) {
                    this.Players.getCurrentPlayer().setPlayingToFalse();
                    //this.UI.Render(this.Deck, this.Pile, this.Players);
                    // updateByRef(showError, showColorPicker, endGame);
                    if (this.hasOnlyOneMoreCardForTaki(this.Players.getCurrentPlayer())) {
                        this.ActionManager.setDefaultState();
                    }
                }
                else {   //has no more card to add to the pile
                    this.ActionManager.setDefaultState();
                    this.Players.nextPlayerTurn();
                }
                updateByRef(showError, showColorPicker, endGame);
                break;

            case eGameState["stop"]:
                this.Players.nextPlayerTurn();
                //this.UI.Render(this.Deck, this.Pile, this.Players);
                // updateByRef(showError, showColorPicker, endGame);
                this.Players.nextPlayerTurn();
                this.ActionManager.setDefaultState();
                updateByRef(showError, showColorPicker, endGame);
                break;
            case eGameState["plus"]:
                this.Players.getCurrentPlayer().setPlayingToFalse();
                updateByRef(showError, showColorPicker, endGame);
                break;
            case eGameState["2plus"]:
                this.Deck.setNumberOfCardToDraw(); //add 2 card to draw
                this.Players.nextPlayerTurn();
                updateByRef(showError, showColorPicker, endGame);
                break;
        }

    }
}

export {GameEngine};