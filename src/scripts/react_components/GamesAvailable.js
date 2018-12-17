import React from "react";
import ReactDOM from "react-dom";
import { Button } from "react-materialize";


class GamesAvailable extends React.Component {
  constructor(args) {
    super(args);
    this.joinGameHandle = this.joinGameHandle.bind();
    this.deleteGameHandle = this.deleteGameHandle.bind();
  }

  joinGameHandle(game, user, succesJoinHandler) {
    fetch(`/games/${game.name}/join`, { method: 'POST', body: JSON.stringify(user), credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          alert(`failed to join  ${user.name} `, response);
        } else {
          return response.json();
        }
      }).then(game => succesJoinHandler.call(this, game));
  }

  deleteGameHandle(gameName, user) {
    fetch(`/games/${gameName}/delete`, { method: 'POST', body: user.name, credentials: 'include' })
      .then(response => {
        if (!response.ok) {
          alert("You didnt create me!");
          throw response;
        }
        return response;
      })
  }

  render() {
    const games = this.props.games;
    return (
      <div id="games">
            <br></br>

        {games.length!=0 ? <div>Games Available:</div> : null}
        <ul>
          {games ? games.map(game => (
            <li key={game.name}>
              <div id="gameName">{`Game name: ${game.name}`}</div>
              <div>{`Creator: ${game.user.name}`}</div>
              <div>{`Required players: ${game.numberOfPlayers}`}</div>
              <div>{`Connected players: ${game.players.length}`}</div>
              <div>{game.numberOfPlayers - game.players.length != 0 ? `Status: not started` : `Status: started`}</div>
              <Button waves='light' style={{ backgroundColor: 'rgb(92, 136, 245)' }} onClick={() => this.joinGameHandle(game, this.props.user, this.props.succesJoinHandler)}>join game</Button>
              <Button waves='light' style={{ backgroundColor: 'rgb(92, 136, 245)' }} onClick={() => this.deleteGameHandle(game.name, this.props.user)}>delete game</Button>
            </li>
          )) : ""}{' '}
        </ul>
      </div>
    );
  }
}

export { GamesAvailable };
