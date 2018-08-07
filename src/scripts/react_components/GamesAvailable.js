import React from "react";
import ReactDOM from "react-dom";


 class GamesAvailable extends React.Component {
    constructor(args) {
        super(args);
        this.joinGameHandle = this.joinGameHandle.bind();
        //this.quitGameHandle = this.quitGameHandle.bind();
        this.deleteGameHandle = this.deleteGameHandle.bind();
    }
    
    joinGameHandle(game,user,succesJoinHandler){
      fetch(`/games/${game.name}/join`, {method: 'POST',body:JSON.stringify(user), credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              alert(`failed to join  ${user.name} `, response);                
          }else{
            // alert(response.json().numberOfPlayers);
            // succesJoinHandler.call(this,response.json());
            return response.json();
          }
      }).then(game=>succesJoinHandler.call(this,game));
    }

    deleteGameHandle(gameName,user){
      fetch(`/games/${gameName}/delete`, {method: 'POST',body:user.name, credentials: 'include'})
      .then(response => {
          if (!response.ok) {
              alert("You didnt create me!");
              throw response;               
          }
          return response;
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
                <button className="buttons" onClick={()=>this.joinGameHandle(game,this.props.user,this.props.succesJoinHandler)}>join game</button>
                <button className="buttons" onClick={()=>this.deleteGameHandle(game.name,this.props.user)}>delete game</button>
                </li>
              )):""}{' '} 
            </ul>
          </fieldset>
        );
      }
}

// <button className="buttons" onClick={()=>this.quitGameHandle(game.name,this.props.user)}>quit game</button>


export{GamesAvailable};
