import React from "react";
import ReactDOM from "react-dom";

import {CardRC} from "./CardRC.js";
import {engine} from "../controller.js";

class Player extends React.Component {
    constructor(args) {
        super(args);
        this.handlePlayerClick = this.handlePlayerClick.bind(this);

    }

    handlePlayerClick(e) {
        engine.Card_OnClick(e);
    }

    render() {
        var cardsElems = [];
        var left = 0;
        for (var i = 0; i < this.props.cards.length; i++) {
            left += (80 / this.props.cards.length);
            var cardStyle = {
                marginLeft: `${left}%`,
            };
            let cardAttributes = this.props.cards[i].getAttributes();
            if (this.props.id == "player") {
                cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle}
                                        onClick={this.handlePlayerClick}/>);
            }
            else {
                cardsElems.push(<CardRC id={i} key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
                // cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`}
                //                         style={cardStyle}/>);
            }
        }

        return (
            <div id={this.props.id}>
                {cardsElems}
            </div>
        );
    }
}

export {Player};