import React from 'react';
import ReactDOM from 'react-dom';
import takiLogo from '../../styles/assets/TAKI_logo.png';

import { ActiveUsers } from './ActiveUsers.js';
import { CreateGame } from './CreateGame.js';
import { GamesAvailable } from './GamesAvailable.js';
var logo = <img style={{maxWidth: '120px'}} src={takiLogo} href={'#'} className={'taki_logo'} />;
import { Button, Card, Row, Col, Icon, Collection, CollectionItem, NavItem, Navbar } from 'react-materialize';
import { RSA_PKCS1_PSS_PADDING } from 'constants';

class WaitingRoom extends React.Component {
	constructor(args) {
		super(args);
	}

	render() {
		return (
			<div id="waitingRoom">
				<Navbar style={{ backgroundColor: 'rgb(92, 136, 245)' }} brand={logo}>
					<NavItem onClick={() => console.log()} className="userName">
						welcome {this.props.currentUser.name}
					</NavItem>
					<NavItem onClick={this.props.logoutHandler}>logout</NavItem>
				</Navbar>
				<br />
				<div style={{ padding: '100px' , fontSize:'large'}}>
					<ActiveUsers usersList={this.props.users} />
					<br />
					<CreateGame user={this.props.currentUser} />
					<GamesAvailable
						games={this.props.games}
						user={this.props.currentUser}
						succesJoinHandler={this.props.succesJoinHandler}
					/>
				</div>
				

			</div>
		);
	}
}

export { WaitingRoom };
