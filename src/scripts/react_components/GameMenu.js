
import React from "react";
import ReactDOM from "react-dom";
import takiLogo from "../../styles/assets/TAKI_logo.png";
import startGameBtn from "../../styles/assets/startGame.png";
import { Game } from "./Game.js";
import { Login } from "./Login.js";
import { WaitingRoom } from "./WaitingRoom.js";
import { ActiveUsers } from "./ActiveUsers.js";
import { updateByRef } from "../controller.js";
//import { clearInterval } from "timers";

var gameInterval;
var allGameIntreval;
var allUserInterval;

class GameMenu extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            showGame: false,
            showLogin: true,
            showThirdScreen: false,
            currentGame: [],
            currentUser: {
                name: ""
            },
            users: {},
            games: []
        };
        this.updateCurrentGame = this.updateCurrentGame.bind(this);//after joining update screen 3 game
        this.quitGameHandle = this.quitGameHandle.bind(this);
        this.succesJoinHandler = this.succesJoinHandler.bind(this);
        this.handleSuccessedLogin = this.handleSuccessedLogin.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);
        this.fetchUserInfo = this.fetchUserInfo.bind(this);
        this.logoutHandler = this.logoutHandler.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.pullUsers = this.pullUsers.bind(this);
        this.getGames = this.getGames.bind(this);
        this.pullGames = this.pullGames.bind(this);
        this.fetchIsGameExist = this.fetchIsGameExist.bind(this);
        this.createNewEngine = this.createNewEngine.bind(this);
        this.pullGameStatus = this.pullGameStatus.bind(this);
        this.renderThirdScreen = this.renderThirdScreen.bind(this);
        this.sortPlayersName = this.sortPlayersName.bind(this);
        //this.pullGames();
        //this.pullUsers(); // doesnt work here, only in succes login handler
        //this.getUserName();
    }

    render() {
        if (!this.state.showGame) {
            if (!this.state.showThirdScreen) {
                if (this.state.showLogin) {
                    return (
                        <div id="menuWrapper">
                            <img src={takiLogo} className={"taki_logo"} />
                            <Login loginSuccessHandler={this.handleSuccessedLogin} loginErrorHandler={this.handleLoginError} />
                        </div>
                    )
                }
                else {
                    return <WaitingRoom currentUser={this.state.currentUser}
                        users={this.state.users['users']}
                        games={this.state.games} pullGames={this.pullGames}
                        logoutHandler={this.logoutHandler}
                        startGameFunc={this.startGame}
                        succesJoinHandler={this.succesJoinHandler} />
                }
            }
            else {
                return this.renderThirdScreen();
            }
        } else {
            return <Game numberOfPlayers={this.state.currentGame.numberOfPlayers}
                gameId={this.state.currentGame.name}
                playerId={this.state.currentUser.name}
                namesList={this.sortPlayersName()}
            />
        }
    }

    sortPlayersName() {
        const playesList = this.state.currentGame.players;
        let namesList = [];
        playesList.forEach((player) => namesList.push(player.name));
        const userName = this.state.currentUser.name;
        const userIndex = namesList.indexOf(userName);
        namesList.splice(userIndex, 1);
        namesList.unshift(userName);
        return namesList;
    }

    renderThirdScreen() {
        return (
            <div id="thirdScreen">
                <img src={takiLogo} className={"taki_logo"} />
                <div>Welcome to game: {this.state.currentGame.name} </div>
                <div className="userName">welcome {this.state.currentUser.name}</div>
                <button id="quitBtn" className="buttons" onClick={this.quitGameHandle}>quit game</button>
                <div>waiting for other players to connect! please be patient</div>
                <ActiveUsers usersList={this.state.users['users']} />

                <li key={this.state.currentGame.name}>
                    <div>{`Creator: ${this.state.currentGame.user.name}`}</div>
                    <div>{`Required players: ${this.state.currentGame.numberOfPlayers}`}</div>
                    <div>{`Connected players: ${this.state.currentGame.players.length}`}</div>
                    <div>{this.state.currentGame.numberOfPlayers - this.state.currentGame.players.length != 0 ? `Status: not started` : `Status: started`}</div>
                </li>
            </div>
        )
    }


    createNewEngine(game) {
        let url = "";

        switch (game.numberOfPlayers) {
            case 2:
                url = `/engine/games/${game.name}/${game.players[0].name}/${game.players[1].name}`;
                break;
            case 3:
                url = `/engine/games/${game.name}/${game.players[0].name}/${game.players[1].name}/${game.players[2].name}`;
                break;
            case 4:
                url = `/engine/games/${game.name}/${game.players[0].name}/${game.players[1].name}/${game.players[2].name}/${game.players[3].name}`;
                break;
        }
        return fetch(url, { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    alert(`failed to create engine ${game.name} `);
                    throw response;
                }
                return response;
            })
    }

    succesJoinHandler(game) {
        if (game.players.length === game.numberOfPlayers) {
            // clearTimeout(this.pullUsers);
            this.createNewEngine(game);

            // this.createNewEngine(game).then((engine) => {
            //     this.setState({ showGame: true });
            //     }
            // );
        }
        this.setState({ showThirdScreen: true, currentGame: game });
    }

    handleSuccessedLogin() {
        this.setState(() => ({ showLogin: false }), this.getUserName);
        this.getUserName();
        this.pullUsers();
        this.pullGames();
        this.pullGameStatus();
    }


    handleLoginError() {
        this.setState(() => ({ showLogin: true }));
    }

    getUserName() {
        this.fetchUserInfo()
            .then(userInfo => {
                this.setState(() => ({ currentUser: userInfo, showLogin: false }));
            })
            .catch(err => {
                if (err.status === 401) { // incase we're getting 'unautorithed' as response
                    this.setState(() => ({ showLogin: true }));
                } else {
                    throw err; // in case we're getting an error
                }
            });
    }

    quitGameHandle() {
        fetch(`/games/${this.state.currentGame.name}/logout`, { method: 'POST', body: JSON.stringify(this.state.currentUser), credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.currentUser.name} `);
                }
                //this.setState(()=>({currentUser: {name:''}, showLogin: true}));
                this.setState({ showThirdScreen: false });
            })
    }

    fetchUserInfo() {
        return fetch('/users', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    pullGameStatus() {
        gameInterval = setInterval(this.updateCurrentGame, 500);
    }


    // pullUsers() {
    //     this.getUsers().then(users => {
    //         this.setState({ users }, () => {
    //             allUserTimeOut = setTimeout(this.pullUsers, 500);
    //         });
    //     });
    // }



    pullUsers() {
        allUserInterval = setInterval(() => {
            this.getUsers().then(users => {
                this.setState({ users });
            });
        }, 500);
    }

    getUsers() {
        return fetch('/users/allUsers', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }


    pullGames() {
        allGameIntreval = setInterval(() => {
            this.getGames().then(games => {
                this.setState({ games });
            });
        }, 500);
    }

    getGames() {
        return fetch('/games', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            });
    }

    fetchIsGameExist() {
        fetch(`/engine/games/${this.state.currentGame.name}`, { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    return false;
                }
                return true;
            });
    }

    updateCurrentGame() {
        this.state.games.forEach(game => {
            if (game.name == this.state.currentGame.name) {
                if (this.state.currentGame.players.length === this.state.currentGame.numberOfPlayers) {
                    clearInterval(allUserInterval);
                    clearInterval(gameInterval);
                    clearInterval(allGameIntreval);
                    this.setState({ showGame: true });
                }else{
                this.setState({ currentGame: game });
                }

            }
        });
    }

    /*
    updateCurrentGame() {
        this.state.games.forEach(game => {
            if (game.name == this.state.currentGame.name) {
                const isGameExist = this.fetchIsGameExist();
                alert(isGameExist);
                if (isGameExist) { //if game started switch to the Game Component
                    alert("We Started the game");
                    ReactDOM.render(<Game 
                        numberOfPlayers={this.state.currentGame.numberOfPlayers}
                        gameId={this.state.currentGame.name}
                        playerId={this.state.currentUser.name} />, document.getElementById("root"));
                }
                else {
                    this.setState({ currentGame: game }); 
                }
            }
        });
    }
*/

    logoutHandler() {
        fetch('/users/logout', { method: 'GET', credentials: 'include' })
            .then(response => {
                if (!response.ok) {
                    console.log(`failed to logout user ${this.state.currentUser.name} `, response);
                }
                this.setState(() => ({ currentUser: { name: '' }, showLogin: true }));
            })
    }
}

function initGame() {
    ReactDOM.render(<Game />, document.getElementById("root"));
};

//<img id="startGame" src={startGameBtn} onClick={initGame}/>

export { GameMenu };