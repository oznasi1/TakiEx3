import React from "react";
import ReactDOM from "react-dom";

import {engine} from "../controller.js";
import {CardRC} from "./CardRC.js";

class DeckRC extends React.Component {
    constructor(args) {
        super(args);
        this.handleDeckClick = this.handleDeckClick.bind(this);
        this.fetchDeckClick= this.fetchDeckClick.bind(this);
    }

    handleDeckClick(gameName,playerName) {
        this.fetchDeckClick(gameName,playerName);
    }

    fetchDeckClick(gameName,playerName){
        return fetch(`/engine/events/DeckClick/${gameName}/${playerName}`, { method: 'POST', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
        });
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
            <div id="deck" onClick={()=>this.handleDeckClick(this.props.gameName,this.props.playerName)}>
                {cardsElems}
            </div>
        );
    }
}

export {DeckRC};

