
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";
import startGameBtn from "../../styles/assets/startGame.png";
import {Game} from "./Game.js";
import {Login} from "./Login.js";
import {WaitingRoom} from "./WaitingRoom.js";
import {ActiveUsers} from "./ActiveUsers.js";
import {GamesAvailable} from "./GamesAvailable.js";


class GameMenu extends React.Component {
    constructor(args) {
        super(args);
        this.state={
            showLogin:true,
            showThirdScreen:false,
            currentGame:[],
            currentUser:{
                name:""
            },
            users:{},
            games:[]
        };
        this.updateCurrentGame= this.updateCurrentGame.bind(this);//after joining update screen 3 game
        this.quitGameHandle = this.quitGameHandle.bind(this);
        this.succesJoinHandler= this.succesJoinHandler.bind(this);
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.pullUsers = this.pullUsers.bind(this);
        this.getGames = this.getGames.bind(this);
        this.pullGames = this.pullGames.bind(this);
        this.pullGames();
        //this.pullUsers(); // doesnt work here, only in succes login handler
        this.getUserName();
    }

    render() {
        if(!this.state.showThirdScreen){

        
            if(this.state.showLogin){
                return(
                <div id="menuWrapper">
                    <img src={takiLogo} className={"taki_logo"}/>
                    <Login loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError}/>
                </div>
               )     
            }
            else{
                return <WaitingRoom currentUser={this.state.currentUser}
                        users={this.state.users['users']}
                        games={this.state.games} pullGames={this.pullGames}
                        logoutHandler={this.logoutHandler}
                        startGameFunc={this.startGame}
                        succesJoinHandler={this.succesJoinHandler}/>
            }
        }
        else{
            return(
                <div id="thirdScreen">
                    <img src={takiLogo} className={"taki_logo"}/>
                    <div>Welcome to game: {this.state.currentGame.name} </div>
                    <div className="userName">welcome {this.state.currentUser.name}</div>
                    <button  id="quitBtn" className="buttons" onClick={this.quitGameHandle}>quit game</button>
                    <div>waiting for other players to connect! please be patient</div>
                    <ActiveUsers usersList={this.state.users['users']}/>

                    <li key={this.state.currentGame.name}>
                    <div>{`Creator: ${this.state.currentGame.user.name}`}</div>
                    <div>{`Required players: ${this.state.currentGame.numberOfPlayers}`}</div>
                    <div>{`Connected players: ${this.state.currentGame.players.length}`}</div>
                    <div>{this.state.currentGame.numberOfPlayers-this.state.currentGame.players.length!=0 ? `Status: not started` : `Status: started`}</div>
                    </li>
                </div>
            )
        }
    }

    succesJoinHandler(game){
        this.setState({showThirdScreen:true, currentGame:game});
    }

    handleSuccessedLogin() {
        this.setState(()=>({showLogin:false}), this.getUserName); 
        this.pullUsers();       
    }

    handleLoginError() {
        this.setState(()=>({showLogin:true}));
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
    
    quitGameHandle(){
        fetch(`/games/${this.state.currentGame.name}/logout`, {method: 'POST',body:JSON.stringify(this.state.currentUser), credentials: 'include'})
        .then(response => {
            if (!response.ok) {
                console.log(`failed to logout user ${this.state.currentUser.name} `);                
            }
            //this.setState(()=>({currentUser: {name:''}, showLogin: true}));
            this.setState({showThirdScreen:false});
        })
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

    pullUsers() {
        this.getUsers().then(users => {
          this.setState({ users }, () => {
            setTimeout(this.pullUsers, 200);
          });
        });
    }

    getUsers(){
        return fetch('/users/allUsers',{method: 'GET', credentials: 'include'})
        .then(response => {            
            if (!response.ok){
                throw response;
            }
            return response.json();
        });
    }

    pullGames() {
        this.getGames().then(games => {
          this.setState({ games }, () => {
            setTimeout(this.pullGames, 200);
          });
        });
    }

    updateCurrentGame(){
        this.state.games.forEach(game => {
            if(game.name==this.state.currentGame.name){
                this.setState({currentGame:game});
            }
        });
    }

    getGames(){
        this.updateCurrentGame();
        return fetch('/games',{method: 'GET', credentials: 'include'})
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