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
        var margin = 0;
        let size=this.props.numOfCards ? this.props.numOfCards :this.props.cards.length;
        for (var i = 0; i < size; i++) {
            margin += (80 / size);
            var cardStyle = {
                marginLeft: `${margin}%`,
            };
            let cardAttributes = this.props.cards[i] ? this.props.cards[i].getAttributes() : null;
            if (this.props.id == "player") {
                cardsElems.push(<CardRC id={i} key={i} arrributes={`${cardAttributes} overLapCard`} style={cardStyle}
                                        onClick={this.handlePlayerClick}/>);
            }
            else if(this.props.id == "bot"){
                cardsElems.push(<CardRC id={i} key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
            }
            else if(this.props.id == "playerThree"){
                cardStyle = {
                    marginTop: `${margin/1.5}%`,
                    transform:"rotate(90deg)",
                };
                cardsElems.push(<CardRC id={i} key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
            }
            else{ //player Four
                cardStyle = {
                    marginTop: `${margin*6}%`,
                    transform:"rotate(90deg)",
                    width:"110px",
                    height:"150px"
                };
                cardsElems.push(<CardRC id={i} key={i} arrributes={`card card_back overLapCard`} style={cardStyle}/>);
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