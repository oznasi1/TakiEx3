import React from "react";
import ReactDOM from "react-dom";

import {engine} from "../controller.js";
import {CardRC} from "./CardRC.js";

class DeckRC extends React.Component {
    constructor(args) {
        super(args);
        this.handleDeckClick = this.handleDeckClick.bind(this);
    }

    handleDeckClick(e) {
        engine.Deck_OnClick(e);
    }

    render() {
        var cardsElems = [];
        for (var i = 0; i < this.props.cards.length; i++) {
            let top = i / 3;
            let left = i / 3;
            var cardStyle = {
                margin: `${top}px ${left}px`,
            };
            cardsElems.push(<CardRC key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
        }
        return (
            <div id="deck" onClick={this.handleDeckClick}>
                {cardsElems}
            </div>
        );
    }
}

export {DeckRC};

