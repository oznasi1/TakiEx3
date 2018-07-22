
import React from "react";
import ReactDOM from "react-dom";


const CardRC = (props) => {
    return (
        <img id={props.id} className={`${props.arrributes}`} style={props.style} onClick={props.onClick}/>
    );
};

export {CardRC};