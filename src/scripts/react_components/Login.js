import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-materialize';

class Login extends React.Component {
	constructor(args) {
		super(args);
		this.state = {
			errorMsg: '',
		};

		this.signUpOnClick = this.signUpOnClick.bind(this);
	}

	render() {
		var userStyle = {
			fontSize: '140%',
			color: 'black',
		};

		return (
			<div style={{textAlign:'center'}}>
				<form id="login"  onSubmit={this.signUpOnClick}>
					<label style={userStyle} htmlFor="userName">
						Username:{' '}
						<input
							name="userName"
							style={{ width: '20%', backgroundColor: 'rgb(229, 229, 229)', height: '10%' }}
						/>
					</label>
					<br />
					<br />
						<Button
							waves="light"
							style={{
								display: 'inline-block',
								backgroundColor: 'rgb(92, 136, 245)',
								alignItems: 'center',
							}}
							onClick={() => this.signUpOnClick}
						>
							Login
						</Button>
				</form>
				{this.renderErrorMessage()}
			</div>
		);
	}

	renderErrorMessage() {
		if (this.state.errorMsg) {
			return <div className="login-error-message">{this.state.errorMsg}</div>;
		}
		return null;
	}

	signUpOnClick(e) {
		e.preventDefault();
		const userName = e.target.elements.userName.value;
		fetch('/users/addUser', { method: 'POST', body: userName, credentials: 'include' }).then(response => {
			if (response.ok) {
				this.setState(() => ({ errorMsg: '' }));
				this.props.loginSuccessHandler();
			} else {
				if (response.status === 403) {
					this.setState(() => ({ errorMsg: 'User name already exist, please try another one' }));
				}
				this.props.loginErrorHandler();
			}
		});
		return false;
	}
}

export { Login };
