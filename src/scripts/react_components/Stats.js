
import React from "react";
import ReactDOM from "react-dom";


const Stats = (props) => {


    var attribute = getTheRellevantAttribute(props.id);
   
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

    function getTheRellevantAttribute(id){
        let attribute;
        if (id == "playerStats") {
            attribute = "playerTurn";
        }
        else if (id=="botStats"){
            attribute = "botTurn";
        }else if(id=="playerThreeStats"){
            attribute = "playerThreeTurn";
        }else if(id=="playerFourStats"){
            attribute = "playerFourTurn";
        }else attribute ="myStats";
        return attribute;
    }
};

export {Stats};