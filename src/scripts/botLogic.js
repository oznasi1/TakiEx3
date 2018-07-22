import {Deck} from './deck.js';
import {Pile} from './pile.js';
import {Player} from './player.js';
import {Stats} from './stats.js';
import {Card} from './card.js';
import {ActionManager, eGameState} from "./actionManager";

let g_GameEngine = null;
let g_ActionManager = null
let g_Deck = null;
let g_Pile = null;
let g_TakiState = false;
let g_PlusState = false;


let g_StartTurnImpl = (currBot) => {

    currBot.Playing = true;

    if (!g_TakiState && !g_PlusState) { //if it's the same turn (like after taki or plus cards). we don't need to active the Stats again
        currBot.Stats.startTurnTimer();
    }

    let cardIndex;
    let currGameState = g_ActionManager.getCurrentGameState();

    if (currGameState === eGameState["2plus"]) { //if someone add 2Plus card to the pile we can only check for 2plus or get card from deck
        cardIndex = BotLogic.hasCard(currBot, "2plus");
        if (cardIndex !== -1) {
            g_GameEngine.CardClick(cardIndex);
        }
        else {
            g_GameEngine.DeckClick();
        }
        return;
    }
    if (currGameState === eGameState["taki"]) {
        cardIndex = BotLogic.checkForValidColorCard(currBot);
        if (cardIndex != -1) {
            g_GameEngine.CardClick(cardIndex);
        }
        else {
            g_Deck.DeckClick();
        }
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "2plus");
    if (cardIndex !== -1) {
        g_GameEngine.CardClick(cardIndex);
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "change_colorful");
    if (cardIndex !== -1) {
        g_GameEngine.CardClick(cardIndex);         //add change_color card to pile
        let randColor = BotLogic.randomColor();    //rand new color
        g_GameEngine.CardClick(randColor);         //add new color to pile
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "stop");
    if (cardIndex !== -1) {
        g_GameEngine.CardClick(cardIndex);
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "plus");
    if (cardIndex !== -1) {
        g_PlusState = true;
        g_GameEngine.CardClick(cardIndex);
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "taki_colorful");
    if (cardIndex !== -1) {
        g_TakiState = true;
        g_GameEngine.CardClick(cardIndex);
        return;
    }

    cardIndex = BotLogic.hasCard(currBot, "taki");
    if (cardIndex !== -1) {
        g_TakiState = true;
        g_GameEngine.CardClick(cardIndex);
        return;
    }

    cardIndex = BotLogic.checkForValidColorCard(currBot); //color or id match the pile
    if (cardIndex !== -1) {
        g_GameEngine.CardClick(cardIndex);
        return;
    }
    cardIndex = BotLogic.checkForValidIdCard(currBot); //color or id match the pile
    if (cardIndex !== -1) {
        g_GameEngine.CardClick(cardIndex);
        return;
    }
    // if (!g_TakiState) { //not in taki state --> we have no card and need to get one card from deck
    g_GameEngine.DeckClick();
    //}
};

export class BotLogic {

    constructor(i_GameEngine, i_Deck, i_Pile) {
        g_GameEngine = i_GameEngine;
        g_ActionManager = i_GameEngine.ActionManager;
        g_Deck = i_Deck;
        g_Pile = i_Pile;
    }

    startYourTurnFunc() {
        if (!this.Playing) {
            setTimeout(() => g_StartTurnImpl(this), 600);
        }
    }

    endYourTurnFunc() {

        if (this.Playing) {
            this.Playing = false;
            if (this.Cards.length === 1) {
                this.Stats.incrementNumOfOneCard();
            }
            g_TakiState = false;
            g_PlusState = false;
            this.Stats.endTurnTimer();
        }
    }

    static checkForValidIdCard(i_Bot) {

        let cardIndex = -1;

        for (let i = 0; i < i_Bot.Cards.length; i++) {
            if (i_Bot.Cards[i].getId() === g_Pile.getTopCardId()) {
                cardIndex = i;
                break;
            }
        }

        return cardIndex;
    }

    static checkForValidColorCard(i_Bot) {

        let cardIndex = -1;

        for (let i = 0; i < i_Bot.Cards.length; i++) {
            if (i_Bot.Cards[i].getColor() === g_Pile.getTopCardColor()) {
                cardIndex = i;
                break;
            }
        }
        return cardIndex;
    }

    static hasCard(i_Bot, i_CardType) {

        let botCards = i_Bot.Cards;

        switch (i_CardType) {

            case "2plus":
                for (let i = 0; i < botCards.length; i++) {
                    if (i_CardType === botCards[i].getId()) {
                        if (botCards[i].getColor() === g_Pile.getTopCardColor() ||
                            botCards[i].getId() === g_Pile.getTopCardId()) { //check if color as the pile color
                            return i;
                        }
                    }
                }
                break;

            case "change_colorful":
                for (let i = 0; i < botCards.length; i++) {
                    if ((i_CardType === botCards[i].getId())) { //check for any change_colorful cards
                        return i;
                    }
                }
                break;

            case "stop":
                for (let i = 0; i < botCards.length; i++) {
                    if (i_CardType === botCards[i].getId()) {
                        if (botCards[i].getColor() === g_Pile.getTopCardColor() || //stop has the same id as pile
                            botCards[i].getId() === g_Pile.getTopCardId()) {//stop has the same color as pile)
                            return i;
                        }
                    }
                }
                break;
            case "plus":
                for (let i = 0; i < botCards.length; i++) {
                    if (i_CardType === botCards[i].getId()) {
                        if (botCards[i].getColor() === g_Pile.getTopCardColor() || //plus has the same id as pile
                            botCards[i].getId() === g_Pile.getTopCardId()) {//plus has the same color as pile)
                            return i;
                        }
                    }
                }
                break;

            case "taki_colorful":
                for (let i = 0; i < botCards.length; i++) {
                    if (i_CardType === botCards[i].getId()) {
                        if (g_Pile.getTopCardColor() !== null) { //the pile has any color
                            return i;
                        }
                    }
                }
                break;

            case "taki":
                for (let i = 0; i < botCards.length; i++) {
                    if (i_CardType === botCards[i].getId()) {
                        if (botCards[i].getColor() === g_Pile.getTopCardColor() ||
                        botCards[i].getId() === g_Pile.getTopCardId() ||
                        botCards[i].getId() === "taki" && g_Pile.getTopCardId() === "taki_colorful") {
                            return i;
                        }
                    }
                }
                break;
        }

        return -1;
    }

    static randomColor() {

        let colorIndex = Math.floor(Math.random() * 4);
        let resColor = null;

        switch (colorIndex) {
            case 0:
                resColor = "red";
                break;
            case 1:
                resColor = "blue";
                break;
            case 2:
                resColor = "green";
                break;
            case 3:
                resColor = "yellow";
                break;
        }

        return resColor;
    }

}
