
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
        this.handleRestart = this.handleRestart.bind(this);
        this.handleQuitClick = this.handleQuitClick.bind(this);
        this.renderTwoPlayersScreen = this.renderTwoPlayersScreen.bind(this);
        this.renderThreePlayersScreen = this.renderThreePlayersScreen.bind(this);
        this.renderFourPlayersScreen = this.renderFourPlayersScreen.bind(this);
        this.updateBoard = this.updateBoard.bind(this);
        this.getCurrentGameStatFromServer = this.getCurrentGameStatFromServer.bind(this);

        this.state = {
            numOfPlayers: this.props.numberOfPlayers,
            gameId: this.props.gameId,
            playerId: this.props.playerId,
            numOfPlayerTwoCards: 8,    //other players except me 
            numOfPlayerThreeCards: 8,  //
            numOfPlayerFourCards: 8,   //
            isWinner: false,
            //---- 
            playerTurn:"",
            playerCards: [],//my cards
            deck: [],
            pile: [],
            showError: false,
            showColorPicker: false,
            endGame: false,

            stats: {//current player 
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },

            playerOneStats: {//the old player 
                name: "P1: amit",
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            playerTwoStats: {//the old bot 
                name: "P2: oz",
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
            winLose: {
                timer: 0,
                winnerIndex: null,
                botStats: null,
            },
        }
    }

    handleQuitClick(e) {
        engine.onQuitClick();
    }

    handleRestart(e) {
        this.setState({ endGame: false });
        initGameEngine();
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
        //const stat = this.getCurrentGameStatFromServer();
        this.getCurrentGameStatFromServer().then((stat) => {
            switch (stat) {
                case 0:
                    updateByRef(false, false, false, false); //noraml
                    break;
                case 1:
                    updateByRef(true, false, false, false);// show error pop-up
                    break;
                case 2:
                    // clearInterval(boardInterval);
                    updateByRef(false, true, false, false);// show color picker
                    break;
                case 3:
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
        if (this.state.playerIndex == 0)
            return <Stats id={"playerStats"} stat={this.state.stats} />
        else if (this.state.playerIndex == 1) {
            return <Stats id={"botStats"} stat={this.state.stats} />;
        }
        else if (this.state.playerIndex == 2) {
            return <Stats id={"playerThreeStats"} stat={this.state.stats} />;
        } else return <Stats id={"playerFourStats"} stat={this.state.stats} />;
    }

    renderTwoPlayersScreen() {
        if (!this.state.endGame) {
            return (
                <div id="gameWrapper">
                    <Player id="bot" numOfCards={this.state.numOfPlayerTwoCards} />
                    <div>current player turn: {this.state.playerTurn}</div>
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
                        boardFunc = {this.updateBoard} />
                    <Player id="player"
                        cards={this.state.playerCards}
                        gameName={this.state.gameId}
                        playerName={this.state.playerId} />
                    <div>name:{this.props.namesList[0]}
                        </div>
                </div>
            );
        }
        else {
            return (
                <div id="winLose">
                    <div id="youLostOrWon">{this.state.isWinner ? "You won!!!" : "You lost!!!"}</div>
                    <div id="timer">The game was {this.state.winLose.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.stats} />
                    <Stats id="botStats" stat={this.state.playerTwoStats} />
                    <div id="prevNextButtons">
                        <button id="restart" onClick={this.handleRestart}>Restart</button>
                    </div>
                </div>
            );
        }
    }

    renderThreePlayersScreen() {
        if (!this.state.endGame) {
            return (
                <div id="gameWrapper">
                    <Player id="playerThree" numOfCards={this.state.numOfPlayerTwoCards} />
                    <Player id="playerFour" numOfCards={this.state.numOfPlayerThreeCards} />
                    <DeckRC cards={this.state.deck} />
                    <PileRC cards={this.state.pile} toShowError={this.state.showError}
                        toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler} />
                    <Player id="player" cards={this.state.playerCards} />
                    <Stats id={this.state.playerIndex ? "botStats" : "playerStats"} stat={this.state.stats} />
                </div>
            );
            /*return (
                <div id="gameWrapper">
                    <Player id="bot" cards={this.state.botCards}/>
                    <DeckRC cards={this.state.deck}/>
                    <PileRC cards={this.state.pile} toShowError={this.state.showError}
                            toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler}/>
                    <Player id="player" cards={this.state.playerCards}/>
                    <Stats id={this.state.playerIndex ? "botStats" :"playerStats"} stat={this.state.stats}/>
                </div>
            );*/
        }
        else {
            return (
                <div id="winLose">
                    <div id="youLostOrWon">{this.state.winLose.winnerIndex == 0 ? "You won!!!" : "You lost!!!"}</div>
                    <div id="timer">The game was {this.state.winLose.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.stats} />
                    <Stats id="botStats" stat={this.state.winLose.botStats} />
                    <div id="prevNextButtons">
                        <button id="restart" onClick={this.handleRestart}>Restart</button>
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
                    <DeckRC cards={this.state.deck} />
                    <PileRC cards={this.state.pile} toShowError={this.state.showError}
                        toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler} />
                    <Player id="player" cards={this.state.playerCards} />
                    <Stats id={this.state.playerIndex ? "botStats" : "playerStats"} stat={this.state.stats} />
                </div>
            );
        }
        else {
            return (
                <div id="winLose">
                    <div id="youLostOrWon">{this.state.winLose.winnerIndex == 0 ? "You won!!!" : "You lost!!!"}</div>
                    <div id="timer">The game was {this.state.winLose.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.stats} />
                    <Stats id="botStats" stat={this.state.winLose.botStats} />
                    <div id="prevNextButtons">
                        <button id="restart" onClick={this.handleRestart}>Restart</button>
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

/*      <Player id="bot" cards={this.state.botCards}/>
                    <div>name:{"oznasi1"}</div>
                    <DeckRC cards={this.state.deck}/>
                    <PileRC cards={this.state.pile} toShowError={this.state.showError}
                            toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler}/>
                    <Player id="player" cards={this.state.playerCards}/>
                    <div>name:{"lior2"}</div>
                    {this.renderStats()} */