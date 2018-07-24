import React from "react";
import ReactDOM from "react-dom";
import { EEXIST } from "constants";


 class GamesAvailable extends React.Component {
    constructor(args) {
        super(args);
        this.joinGameHandle = this.joinGameHandle.bind();
        this.quitGameHandle = this.quitGameHandle.bind();
        this.deleteGameHandle = this.deleteGameHandle.bind();
    }
    
    joinGameHandle(gameName,user){
      
      fetch(`/games/${gameName}/join`, {method: 'POST',body:JSON.stringify(user), credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              alert(`failed to join user ${user.name} `, response);                
          }else{
            alert(`${user.name} joined the game`);
          }
      })
    }


    quitGameHandle(gameName,user){
      fetch(`/games/${gameName}/logout`, {method: 'POST',body:JSON.stringify(user), credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              console.log(`failed to logout user ${user.name} `);                
          }
          //this.setState(()=>({currentUser: {name:''}, showLogin: true}));
          alert("user name quit the game");
      })
    }

    deleteGameHandle(gameName,user){
      fetch(`/games/${gameName}/delete`, {method: 'POST',body:user.name, credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              alert(`failed to delete`);                
          }else{
            alert(`${user.name} delete game: ${gameName}`);
          }
      })
    }


    render() {
      const games=this.props.games; 
        return (
          <fieldset>
            <legend>Games Available:</legend>
            <ul>
              {games ? games.map(game => (
                <li key={game.name}>
                <div id="gameName">{`Game name: ${game.name}`}</div>
                <div>{`Creator: ${game.user.name}`}</div>
                <div>{`Required players: ${game.numberOfPlayers}`}</div>
                <div>{`Connected players: ${game.players.length}`}</div>
                <div>{game.numberOfPlayers-game.players.length!=0 ? `Status: not started` : `Status: started`}</div>
                <button onClick={()=>this.joinGameHandle(game.name,this.props.user)}>join game</button>
                <button onClick={()=>this.quitGameHandle(game.name,this.props.user)}>quit game</button>
                <button onClick={()=>this.deleteGameHandle(game.name,this.props.user)}>delete game</button>
                </li>
              )):""}{' '} 
            </ul>
          </fieldset>
        );
      }

}

export{GamesAvailable};
