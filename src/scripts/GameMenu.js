
import React from "react";
import ReactDOM from "react-dom";


import takiLogo from "../styles/assets/TAKI_logo.png";
import startGameBtn from "../styles/assets/startGame.png";

const GameMenu = (props) => {
    return (
        <div id="menuWrapper">
            <img src={takiLogo} className={"taki_logo"}/>
            <img id="startGame" src={startGameBtn} onClick={initGame}/>
        </div>
    );
};

function initGame() {
    ReactDOM.render(<Game/>, document.getElementById("root"));
};

export{GameMenu};