
import React from "react";
import ReactDOM from "react-dom";


const ShowError = (props) => {
    var errorStyle;
    if (props.enable) {
        errorStyle = {
            display: `block`,
        };
    }
    else {
        errorStyle = {
            display: `none`,
        };
    }

    return (
        <img id={`error_screen`} className={`notValidAction`} style={errorStyle}/>
    );
};

export {ShowError};