import React from "react";
import ReactDOM from "react-dom";

import {ShowError} from "./ShowError.js";
import {PicColor} from "./PicColor.js";
import {CardRC} from "./CardRC.js";


class PileRC extends React.Component {
    constructor(args) {
        super(args);
    }

    render() {

        var cardsElems = [];
        for (var i = 0; i < this.props.cards.length; i++) {
            let top =  Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            let left = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            let right = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            let bottom = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
            let angle = Math.floor(Math.random() * (360 / i - 0 + 1)) + 0;
            var cardStyle = {
                transform: `rotate(${angle}deg)`,
                margin: `${top}px ${bottom}px ${left}px ${right}px`
            };
            let cardAttributes = this.props.cards[i].cardAtrribute;

            cardsElems.push(<CardRC key={i} arrributes={`card ${cardAttributes} overLapCard`} style={cardStyle}/>);
        }
        return (

            <div id="pile">
                {cardsElems}
                <ShowError enable={this.props.toShowError}/>
                <PicColor enable={this.props.toShowColorPicker} handleColorPicker={this.props.handler}/>
            </div>
        )
            ;
    }
}

export{PileRC};
