
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";

import {ActiveUsers} from "./ActiveUsers.js";
import {CreateGame} from "./CreateGame.js";
import {GamesAvailable} from "./GamesAvailable.js";

class WaitingRoom extends React.Component {
    constructor(args) {
        super(args);
    }


    render() {
        return(
            <div  id="waitingRoom">
                 <img src={takiLogo} className={"taki_logo"}/>
                 <div className="userName">welcome {this.props.currentUser.name}</div>
                 <button  id="logoutBtn" className="buttons" onClick={this.props.logoutHandler}>logout</button>
                 <ActiveUsers usersList={this.props.users}/>
                 <br></br><br></br>
                 <CreateGame user={this.props.currentUser}/>
                 <GamesAvailable games={this.props.games}
                                 user={this.props.currentUser}
                                 succesJoinHandler={this.props.succesJoinHandler}/>
             </div>
        );
    }
}


export {WaitingRoom};

