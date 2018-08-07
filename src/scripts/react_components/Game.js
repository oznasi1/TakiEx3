
import React from "react";
import ReactDOM from "react-dom";

import { init, updateByRef } from "../../scripts/controller.js";
import { initGameEngine } from "../../scripts/controller.js";
import { engine } from "../../scripts/controller.js";

import { Player } from "./Player.js";
import { DeckRC } from "./DeckRC.js";
import { PileRC } from "./PileRC.js";
import { Stats } from "./Stats.js";


var boardInterval;

class Game extends React.Component { //contains all - players,deck,pile,stats
    constructor(args) {
        super(args);

        this.colorPickerHandler = this.colorPickerHandler.bind(this)
        //this.handleReturnLobby = this.handleReturnLobby.bind(this);
        this.handleQuitClick = this.handleQuitClick.bind(this);
        this.renderTwoPlayersScreen = this.renderTwoPlayersScreen.bind(this);
        this.renderThreePlayersScreen = this.renderThreePlayersScreen.bind(this);
        this.renderFourPlayersScreen = this.renderFourPlayersScreen.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.getCurrentGameStatFromServer = this.getCurrentGameStatFromServer.bind(this);
        //this.fetchKillGame = this.fetchKillGame.bind(this);

        this.state = {
            numOfPlayers: this.props.numberOfPlayers,
            gameId: this.props.gameId,
            playerId: this.props.playerId,
            numOfPlayerTwoCards: 8,    //other players except me 
            numOfPlayerThreeCards: 8,  //
            numOfPlayerFourCards: 8,   //
            isWinner: false,
            //---- 
            playerTurn: "",
            playerCards: [],//my cards
            deck: [],
            pile: [],
            showError: false,
            showColorPicker: false,
            endGame: false,
            timer: 0,

            stats: {//current player 
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },

            playerOneStats: {//the old player 
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerTwoStats: {//the old bot 
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerThreeStats: {
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerFourStats: {
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },

            winner1: {//the old player 
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerTwoStats: {//the old bot 
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerThreeStats: {
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerFourStats: {
                name: "",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
        }
    }

    handleQuitClick(e) {
        engine.onQuitClick();
    }

    colorPickerHandler(e) {
        e.preventDefault();
        this.setState({ showColorPicker: false });
    }

    componentWillMount() {
        init(this);
        initGameEngine(this.state.gameId, this.state.playerId);
        boardInterval = setInterval(this.updateBoard, 500);
    }

    updateBoard() {
        this.getCurrentGameStatFromServer().then((stat) => {
            switch (stat) {
                case 0:
                    updateByRef(false, false, false, false); //noraml
                    break;
                case 1:
                    updateByRef(true, false, false, false);// show error pop-up
                    break;
                case 2:
                    updateByRef(false, true, false, false);// show color picker
                    break;
                case 3:
                    clearInterval(boardInterval);
                    updateByRef(false, false, true, false);// show end game & status
                    break;
                case 4:
                    updateByRef(false, false, false, true);// show exit button & render all
                    break;
            }
        })
    }

    getCurrentGameStatFromServer() {
        return fetch(`/engine/stat/${this.state.gameId}/${this.state.playerId}`, { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    renderStats() {//render the stats of the player that is playing now 
        if (this.state.stats.name === this.state.playerOneStats.name)

            return <Stats id={"playerStats"} stat={this.state.playerOneStats} />
        else if (this.state.stats.name === this.state.playerTwoStats.name) {
            return <Stats id={"botStats"} stat={this.state.playerTwoStats} />;
        }
        else if (this.state.stats.name === this.state.playerThreeStats.name) {
            return <Stats id={"playerThreeStats"} stat={this.state.playerThreeStats} />;
        } else return <Stats id={"playerFourStats"} stat={this.state.playerFourStats} />;
    }
    //Stats id={"playerStats"} stat={this.state.stats} />   ---->working

    renderTwoPlayersScreen() {
        if (!this.state.endGame) {
            return (
                <div id="gameWrapper">
                    <Player id="bot" numOfCards={this.state.numOfPlayerTwoCards} />
                    <div>current player turn: {this.state.playerTurn}</div>
                    <div>other players:</div>
                    <div>name:{this.props.namesList[1]}</div>
                    <DeckRC cards={this.state.deck}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <PileRC cards={this.state.pile}
                        toShowError={this.state.showError}
                        toShowColorPicker={this.state.showColorPicker}
                        handler={this.props.colorPickerHandler}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId}
                        boardFunc={this.updateBoard} />
                    <Player id="player"
                        cards={this.state.playerCards}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <Stats id={"playerStats"} stat={this.state.stats} />
                    {this.state.isWinner ?
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button> : null}
                </div>
            );
        }
        else {
            //this.fetchKillGame();
            return (
                <div id="winLose">
                    <div id="timer">The game was {this.state.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.playerOneStats} winNumber={"1"} />
                    <Stats id="botStats" stat={this.state.playerTwoStats} winNumber={"2"} />
                    <div id="prevNextButtons">
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button>
                    </div>
                </div>
            );
        }
    }

    // fetchKillGame() {
    //     return fetch(`/engine/games/${this.state.gameId}`, { method: 'DELETE', credentials: 'include' })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw response;
    //             }
    //             return response;
    //         });
    // }

    renderThreePlayersScreen() {
        if (!this.state.endGame) {
            return (
                <div id="gameWrapper">
                    <Player id="playerThree" numOfCards={this.state.numOfPlayerTwoCards} />
                    <Player id="playerFour" numOfCards={this.state.numOfPlayerThreeCards} />
                    <div>current player turn: {this.state.playerTurn}</div>
                    <div>other players:</div>
                    <div>name:{this.props.namesList[1]}</div>
                    <div>name:{this.props.namesList[2]}</div>
                    <DeckRC cards={this.state.deck}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <PileRC cards={this.state.pile}
                        toShowError={this.state.showError}
                        toShowColorPicker={this.state.showColorPicker}
                        handler={this.props.colorPickerHandler}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId}
                        boardFunc={this.updateBoard} />
                    <Player id="player"
                        cards={this.state.playerCards}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <Stats id={"playerStats"} stat={this.state.stats} />
                    {this.state.isWinner ?
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button> : null}
                </div>
            );
        }
        else {
            return (
                <div id="winLose">
                    <div id="timer">The game was {this.state.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.playerOneStats} winNumber={"1"} />
                    <Stats id="botStats" stat={this.state.playerThreeStats} winNumber={"3"}/>
                    <Stats id="playerThreeStats" stat={this.state.playerTwoStats} winNumber={"2"}/>
                    <div id="prevNextButtons">
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button>
                    </div>
                </div>
            );
        }
    }

    renderFourPlayersScreen() {
        if (!this.state.endGame) {
            return (
                <div id="gameWrapper">
                    <Player id="bot" numOfCards={this.state.numOfPlayerTwoCards} />
                    <Player id="playerThree" numOfCards={this.state.numOfPlayerThreeCards} />
                    <Player id="playerFour" numOfCards={this.state.numOfPlayerFourCards} />
                    <div>current player turn: {this.state.playerTurn}</div>
                    <div>other players:</div>
                    <div>name:{this.props.namesList[1]}</div>
                    <div>name:{this.props.namesList[2]}</div>
                    <div>name:{this.props.namesList[3]}</div>
                    <DeckRC cards={this.state.deck}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <PileRC cards={this.state.pile}
                        toShowError={this.state.showError}
                        toShowColorPicker={this.state.showColorPicker}
                        handler={this.props.colorPickerHandler}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId}
                        boardFunc={this.updateBoard} />
                    <Player id="player"
                        cards={this.state.playerCards}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <Stats id={"playerStats"} stat={this.state.stats} />
                    {this.state.isWinner ?
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button> : null}
                </div>
            );
        }
        else {
            return (
                <div id="winLose">
                    <div id="timer">The game was {this.state.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.playerOneStats} winNumber={"1"} />
                    <Stats id="botStats" stat={this.state.playerThreeStats} winNumber={"3"}/>
                    <Stats id="playerThreeStats" stat={this.state.playerTwoStats} winNumber={"2"}/>
                    <Stats id="playerFourStats" stat={this.state.playerFourStats} winNumber={"4"}/>
                    <div id="prevNextButtons">
                        <button className="buttons" id="returnLobby" onClick={() => this.props.lobbyReturn()}>return to lobby</button>
                    </div>
                </div>
            );
        }
    }


    render() {
        if (this.state.numOfPlayers == 2) {
            return this.renderTwoPlayersScreen();
        }
        else if (this.state.numOfPlayers == 3) {
            return this.renderThreePlayersScreen();
        }
        else if (this.state.numOfPlayers == 4) {
            return this.renderFourPlayersScreen();
        };
    }
}

export { Game };
