
import React from "react";
import ReactDOM from "react-dom";

import {init} from "../../scripts/controller.js";
import {initGameEngine} from "../../scripts/controller.js";
import {engine} from "../../scripts/controller.js";
import {prevWasClicked} from "../../scripts/controller.js";
import {nextWasClicked} from "../../scripts/controller.js";
import {cleanStateArray} from "../../scripts/controller.js";

import {Player} from "./Player.js";
import {DeckRC} from "./DeckRC.js";
import {PileRC} from "./PileRC.js";
import {Stats} from "./Stats.js";



class Game extends React.Component { //contains all - players,deck,pile,stats
    constructor(args) {
        super(args);

        this.colorPickerHandler = this.colorPickerHandler.bind(this)
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleReplay = this.handleReplay.bind(this);
        this.handleRestart = this.handleRestart.bind(this);
        this.handleQuitClick = this.handleQuitClick.bind(this);
    

        this.state = {
            playerIndex:0,
            stateIndex: -1,
            botCards: [],
            deck: [],
            pile: [],
            playerCards: [],
            showError: false,
            showColorPicker: false,
            endGame: false,
            stats: {
                numOfTurs: 0,
                avgTime: 0,
                lastCardCount: 0,
            },
            winLose: {
                timer: 0,
                winnerIndex: null,
                botStats: null,
            },
            isReplay: false
        }
    }

    handleQuitClick(e){
        engine.onQuitClick(); 
    }

    handleRestart(e) {
        this.setState({isReplay: false, endGame: false});
        cleanStateArray();
        initGameEngine();
    }

    handleReplay(e) {
        this.setState({isReplay: true});
        nextWasClicked(this.state.stateIndex);
    }

    handlePrevClick(e) {
        this.setState({isReplay: true});
        prevWasClicked(this.state.stateIndex);
    }

    handleNextClick(e) {
        this.setState({isReplay: true});
        nextWasClicked(this.state.stateIndex);
    }

    colorPickerHandler(e) {
        e.preventDefault();
        this.setState({showColorPicker: false});
    }

    componentWillMount() {
        init(this);
        initGameEngine();
    }

    render() {
        if (!this.state.endGame) {
            if (this.state.isReplay) {
                return (
                    <div id="gameWrapper">
                        <div id="prevNextButtons">
                            <button id="prev" onClick={this.handlePrevClick}>Previous move</button>
                            <button id="next" onClick={this.handleNextClick}>Next move</button>
                            <button id="restart" onClick={this.handleRestart}>Restart</button>
                        </div>
                        <Player id="bot" cards={this.state.botCards}/>
                        <DeckRC cards={this.state.deck}/>
                        <PileRC cards={this.state.pile} toShowError={this.state.showError}
                                toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler}/>
                        <Player id="player" cards={this.state.playerCards}/>
                        <Stats id={this.state.playerIndex ? "botStats" :"playerStats"} stat={this.state.stats}/>
                    </div>
                );
            } else {
                return (
                    <div id="gameWrapper">
                        <button id="quit" onClick={this.handleQuitClick}>Quit</button>
                        <Player id="bot" cards={this.state.botCards}/>
                        <DeckRC cards={this.state.deck}/>
                        <PileRC cards={this.state.pile} toShowError={this.state.showError}
                                toShowColorPicker={this.state.showColorPicker} handler={this.props.colorPickerHandler}/>
                        <Player id="player" cards={this.state.playerCards}/>
                        <Stats id={this.state.playerIndex ? "botStats" :"playerStats"} stat={this.state.stats}/>
                    </div>
                );
            }
        }
        else {
            var whoWon;
            if (this.state.winLose.winnerIndex == 0) {
                whoWon = "You won!!!";
            }
            else {
                whoWon = "You lost!!!";
            }
            return (
                <div id="winLose">
                    <div id="youLostOrWon">{whoWon}</div>
                    <div id="timer">The game was {this.state.winLose.timer} seconds</div>
                    <Stats id="playerStats" stat={this.state.stats}/>
                    <Stats id="botStats" stat={this.state.winLose.botStats}/>
                    <div id="prevNextButtons">
                        <button id="replay" onClick={this.handleReplay}>Replay</button>
                        <button id="restart" onClick={this.handleRestart}>Restart</button>
                    </div>
                </div>
            );
        }
    }
}

export{Game};