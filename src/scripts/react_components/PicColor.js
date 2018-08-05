import React from "react";
import ReactDOM from "react-dom";
import { updateByRef } from "../controller.js";

class PicColor extends React.Component {
    constructor(args) {
        super(args);
        this.handleColorPickOnClick = this.handleColorPickOnClick.bind(this);
        this.fetchPicColorFromServer = this.fetchPicColorFromServer.bind(this);
    }

    handleColorPickOnClick(gameName,playerName,cardColor,startIntervel) {
        //this.props.handleColorPicker; //hide the color picker
        //engine.Card_OnClick(e); // need to fetch from serverPic
        this.fetchPicColorFromServer(gameName,playerName,cardColor,startIntervel).then(()=>{
            updateByRef(false, false, false, false); //noraml
        });
    }
    fetchPicColorFromServer(gameName,playerName,cardColor,startIntervel) {
         return fetch(`/engine/events/CardClick/${gameName}/${playerName}/${cardColor}`, { method: 'POST', credentials: 'include' })
            .then(response => {
                // if (!response.ok) {
                //     throw response;
                // }
                return response;
            });
    }

    render() {
        var colorPickerStyle;
        if (this.props.enable) {
            colorPickerStyle = {
                display: `block`,
            };
        }
        else {
            colorPickerStyle = {
                display: `none`,
            };
        }
        return (
            <div id="colorPicker" className={"btn-group screen_center"} style={colorPickerStyle}>
                <button id="red" className={"btn-group button red"} onClick={() => this.handleColorPickOnClick(this.props.gameName,
                    this.props.playerName,
                    "red",this.props.boardFunc)}></button>
                <button id="blue" className={"btn-group button blue"} onClick={() => this.handleColorPickOnClick(this.props.gameName,
                    this.props.playerName,
                    "blue",this.props.boardFunc)}></button>
                <button id="green" className={"btn-group button green"} onClick={() => this.handleColorPickOnClick(this.props.gameName,
                    this.props.playerName,
                    "green",this.props.boardFunc)}></button>
                <button id="yellow" className={"btn-group button yellow"} onClick={() => this.handleColorPickOnClick(this.props.gameName,
                    this.props.playerName,
                    "yellow",this.props.boardFunc)}></button>
            </div>
        );
    }
}

export { PicColor };
