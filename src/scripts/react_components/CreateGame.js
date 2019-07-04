
import React from "react";
import ReactDOM from "react-dom";
import { Button } from "react-materialize";


class CreateGame extends React.Component {
    constructor(args) {
        super(...args);
        this.state = {
            currentSelectedRadio: "twoPlayers",
            errorMsg: ""
        }
        this.createGameOnClick = this.createGameOnClick.bind(this);
        this.handleRadioChange = this.handleRadioChange.bind(this);
        this.radioParser = this.radioParser.bind(this);
    }

    radioParser(selectedRadio) {
        if (selectedRadio == "twoPlayers") {
            return 2;
        }
        else if (selectedRadio == "threePlayers") {
            return 3;
        }
        return 4;
    }

    createGameOnClick(e) {
        e.preventDefault();
        const game = {
            numberOfPlayers: this.radioParser(this.state.currentSelectedRadio),
            name: e.target.elements.gameName.value,
            user: this.props.user
        };

        return fetch('/games', {
            method: 'POST',
            body: JSON.stringify(game),
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
        })
            .then(response => {
                if (!response.ok) {
                    this.setState(() => ({ errorMsg: "game name invalid" }));
                } else {
                    this.setState(() => ({ errorMsg: "" }));
                }
            });
    }

    handleRadioChange(e) {
        this.setState({
            currentSelectedRadio: e.target.value
        });
    }

    renderErrorMessage() {
        if (this.state.errorMsg) {
            return (
                <div className="login-error-message">
                    {this.state.errorMsg}
                </div>
            );
        }
        return null;
    }



    render() {
        var radioStyle = {
            position: 'initial',
            opacity: '100',
        }
        return (
            <div>
                <form id="createGame" onSubmit={this.createGameOnClick}>
                    <lable htmlFor="gameName">Create new game - Game name:<input name="gameName" style={{ width: "20%", backgroundColor: 'rgb(229, 229, 229)', height: '10%' }} /></lable>
                    <br />
                    <lable>Number of players:</lable>
                    <div className="radioBtn">
                        <lable>
                            <input type="radio" value="twoPlayers" style={radioStyle} onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio === 'twoPlayers'} />
                            2
                  </lable>
                    </div>
                    <div className="radioBtn">
                        <lable>
                            <input type="radio" value="threePlayers" style={radioStyle} onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio === 'threePlayers'} />
                            3
                  </lable>
                    </div>
                    <div className="radioBtn">
                        <lable>
                            <input type="radio" value="fourPlayers" style={radioStyle} onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio === 'fourPlayers'} />
                            4
                  </lable>
                    </div>
                    {this.renderErrorMessage()}
                    <div style={{ padding: '20px' }}>
                        <Button waves='light' style={{backgroundColor:'rgb(92, 136, 245)'}} onClick={()=>this.createGameOnClick}>Create Game</Button>
                    </div>
                </form>
            </div>
        )
    }
}

export { CreateGame };
