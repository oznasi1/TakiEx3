import React from "react";
import ReactDOM from "react-dom";

class PicColor extends React.Component {
    constructor(args) {
        super(args);
        this.handleColorPickOnClick = this.handleColorPickOnClick.bind(this);
    }

    handleColorPickOnClick(e) {
        this.props.handleColorPicker; //hide the color picker
        engine.Card_OnClick(e);
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
                <button id="red" className={"btn-group button red"} onClick={this.handleColorPickOnClick}></button>
                <button id="blue" className={"btn-group button blue"} onClick={this.handleColorPickOnClick}></button>
                <button id="green" className={"btn-group button green"} onClick={this.handleColorPickOnClick}></button>
                <button id="yellow" className={"btn-group button yellow"}
                        onClick={this.handleColorPickOnClick}></button>
            </div>
        );
    }
}

export {PicColor};
