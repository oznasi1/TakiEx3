
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";
import startGameBtn from "../../styles/assets/startGame.png";
import {Game} from "./Game.js";
import {Login} from "./Login.js";
import {WaitingRoom} from "./WaitingRoom.js";



class GameMenu extends React.Component {
    constructor(args) {
        super(args);
        this.state={
            showLogin:true,
            currentUser:{
                name:""
            }
        };
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler= this.logoutHandler.bind(this);
        this.getUserName();
    }

    handleSuccessedLogin() {
        this.setState(()=>({showLogin:false}), this.getUserName);        
    }

    handleLoginError() {
        this.setState(()=>({showLogin:true}));
    }


    render() {

        if(this.state.showLogin){
            return(
            <div id="menuWrapper">
                <img src={takiLogo} className={"taki_logo"}/>
                <Login loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>
            </div>
           )     
        }
        else{
            return <WaitingRoom currentUserName={this.state.currentUser.name} logoutHandler={this.logoutHandler}/>
        }
    }


    getUserName() {
        this.fetchUserInfo()
        .then(userInfo => {
            this.setState(()=>({currentUser:userInfo, showLogin: false}));
        })
        .catch(err=>{            
            if (err.status === 401) { // incase we're getting 'unautorithed' as response
                this.setState(()=>({showLogin: true}));
            } else {
                throw err; // in case we're getting an error
            }
        });
    }

    fetchUserInfo() {        
        return fetch('/users',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    
    logoutHandler() {
        fetch('/users/logout', {method: 'GET', credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `, response);                
            }
            this.setState(()=>({currentUser: {name:''}, showLogin: true}));
        })
    }
}

function initGame() {
    ReactDOM.render(<Game/>, document.getElementById("root"));
};

//<img id="startGame" src={startGameBtn} onClick={initGame}/>

export{GameMenu};