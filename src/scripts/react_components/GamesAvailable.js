import React from "react";
import ReactDOM from "react-dom";


 class GamesAvailable extends React.Component {
    constructor(args) {
        super(...args);
    }

    render() {
        return (
          <fieldset>
            <legend>Games Available:</legend>
            <ul>
              {this.props.games.map(game => (
                <li key={game}>
                <div>{`Game name: ${game.name}`}</div>
                <div>{`Creator: ${game.user.name}`}</div>
                <div>{`Required players: ${game.numberOfPlayers}`}</div>
                <div>{`Connected players: ${game.players.length}`}</div>
                <div>{game.numberOfPlayers-game.players.length!=0 ? `Status: not started` : `Status: started`}</div>
                <button>join game</button>
                <button>quit game</button>
                </li>
              ))}{' '}
            </ul>
          </fieldset>
        );
      }

}

export{GamesAvailable};
