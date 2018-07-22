
import React from "react";
import ReactDOM from "react-dom";


const Stats = (props) => {
    var attribute;
    if (props.id == "playerStats") {
        attribute = "playerTurn";
    }
    else {
        attribute = "botTurn";
    }
    return (
        <div id="stats">
            <div id={props.id}>
                <img className={attribute}/>
                <div id="numTurns">Number of turns: {props.stat.numOfTurs}</div>
                <div id="avg_time">Average time per turn: {props.stat.avgTime} seconds</div>
                <div id="last_one">Number of last card: {props.stat.lastCardCount}</div>
            </div>
        </div>
    );
};

export {Stats};