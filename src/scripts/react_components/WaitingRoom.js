
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";

import {ActiveUsers} from "./ActiveUsers.js";
import {CreateGame} from "./CreateGame.js";

class WaitingRoom extends React.Component {
    constructor(args) {
        super(args);
    }

    render() {

        return(
            <div  id="waitingRoom">
                 <img src={takiLogo} className={"taki_logo"}/>
                 <div className="userName">welcome {this.props.currentUserName}</div>
                 <button  id="logoutBtn" className="buttons" onClick={this.props.logoutHandler}>logout</button>
                 <ActiveUsers usersList={this.props.users}/>
                 <br></br><br></br>
                 <CreateGame/>
             </div>
        );
    }
}

//<GamesAvailable/>
export {WaitingRoom};

