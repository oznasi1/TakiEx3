import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Card, Row, Col, Icon, Collection, CollectionItem, NavItem, Navbar } from 'react-materialize';

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
			})
			.then(game => succesJoinHandler.call(this, game));
	}

	deleteGameHandle(gameName, user) {
		fetch(`/games/${gameName}/delete`, { method: 'POST', body: user.name, credentials: 'include' }).then(
			response => {
				if (!response.ok) {
					alert('You didnt create me!');
					throw response;
				}
				return response;
			}
		);
	}

	render() {
		const games = this.props.games;
		return (
			<div id="games">
				<br />

				{games.length != 0 ? <div>Games Available:</div> : null}
				<Col m={1} s={2}>
					{games
						? games.map(game => (
								<Card
									style={{
										height: '55%',
										width: '40%',
                    maxWidth: '350px',
                    backgroundColor: 'rgb(92, 136, 245)',
                    padding:'10px'
									}}
									title={`Game name: ${game.name}`}
								>
                  
									Creator: {game.user.name}<br/>
									Required Players:{game.numberOfPlayers}<br/>
									<div>
										{game.numberOfPlayers - game.players.length != 0
											? `Status: not started`
											: `Status: started`}
									</div><br/>
                  <div  style={{textAlign:"center"}}>
									<Button
										waves="light"
										style={{ backgroundColor: 'rgb(92, 136, 245)' }}
										onClick={() =>
											this.joinGameHandle(game, this.props.user, this.props.succesJoinHandler)
										}
									>
										join game
									</Button>
									<Button
										waves="light"
										style={{ backgroundColor: 'rgb(92, 136, 245)' }}
										onClick={() => this.deleteGameHandle(game.name, this.props.user)}
									>
										delete game
									</Button>
                  </div>
								</Card>
						  ))
						: ''}{' '}
				</Col>
			</div>
		);
	}
}

export { GamesAvailable };
{
	/* <Col m={1} s={2}>
						<Card
							style={{
								height: '50%',
								width: '30%',
								maxWidth: '100%',
								backgroundColor: 'rgb(92, 136, 245)',
							}}
							textClassName="white-text"
							title={`Game name: ${this.state.currentGame.name}`}
						>
							Creator: {this.state.currentGame.user.name}
							<br />
							Required players: {this.state.currentGame.numberOfPlayers}
							<br />
							Connected players: {this.state.currentGame.players.length}
							<br />
							{this.state.currentGame.numberOfPlayers - this.state.currentGame.players.length != 0
								? `Status: not started`
								: `Status: started`}
							`
						</Card>
					</Col> */
}
