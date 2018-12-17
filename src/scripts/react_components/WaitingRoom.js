
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";

import { ActiveUsers } from "./ActiveUsers.js";
import { CreateGame } from "./CreateGame.js";
import { GamesAvailable } from "./GamesAvailable.js";
var logo = <img src={takiLogo} className={"taki_logo"} />
import { Button, Card, Row, Col, Icon, Collection, CollectionItem, NavItem, Navbar } from 'react-materialize';

class WaitingRoom extends React.Component {
    constructor(args) {
        super(args);
    }
    // <div className = {Container} >
    //                         <Navbar brand={logo} right>
    //                             <NavItem onClick={() => console.log('test click')}>Welcome</NavItem>
    //                         </Navbar>
    //                         <Login loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError} />
    //                     </div>

    render() {
        return (

            <div id="waitingRoom">
                <Navbar  style={{backgroundColor:'rgb(92, 136, 245)'}} brand={logo} center>
                    <NavItem onClick={()=>console.log("hi")} className="userName">welcome {this.props.currentUser.name}</NavItem>
                    <NavItem onClick={this.props.logoutHandler}>logout</NavItem>
                </Navbar>
                <br></br>
                <ActiveUsers usersList={this.props.users} />
                <br></br>
                <CreateGame user={this.props.currentUser} />
                <GamesAvailable games={this.props.games}
                    user={this.props.currentUser}
                    succesJoinHandler={this.props.succesJoinHandler} />
            </div>
        );
    }
}


export { WaitingRoom };

