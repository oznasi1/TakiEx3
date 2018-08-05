import React from "react";
import ReactDOM from "react-dom";

import {CardRC} from "./CardRC.js";
import {engine} from "../controller.js";

class Player extends React.Component {
    constructor(args) {
        super(args);
        this.handlePlayerClick = this.handlePlayerClick.bind(this);
        this.fetchPlayerClick = this.fetchPlayerClick.bind(this);
    }

    handlePlayerClick(gameName,playerName,cardIndex) {
        //engine.Card_OnClick(e);
        this.fetchPlayerClick(gameName,playerName, cardIndex);
    }

    fetchPlayerClick(gameName,playerName, cardIndex){
        fetch(`/engine/events/CardClick/${gameName}/${playerName}/${cardIndex}`, { method: 'POST', credentials: 'include' })
        .then(response => {
            // if (!response.ok) {
            //     throw response;
            // }
            return response;
        });
    }

    render() {
        var cardsElems = [];
        var margin = 0;
        let cardAttributes=null;
        let size=this.props.cards ? this.props.cards.length: this.props.numOfCards;
        for (let i = 0; i < size; i++) {
            margin += (80 / size);
            var cardStyle = {
                marginLeft: `${margin}%`,
            };
            if(this.props.cards){
                // let cardAttributes = this.props.cards[i] ? this.props.cards[i].cardAtrribute : null;
                cardAttributes = this.props.cards[i].cardAtrribute;
            }
            if (this.props.id == "player") {
                cardsElems.push(<CardRC id={i} key={i} arrributes={`card ${cardAttributes} overLapCard`} style={cardStyle}
                                        onClick={()=>this.handlePlayerClick(this.props.gameName
                                            ,this.props.playerName
                                            ,i)}/>);
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