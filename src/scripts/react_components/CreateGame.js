
import React from "react";
import ReactDOM from "react-dom";


 class CreateGame extends React.Component {
    constructor(args) {
        super(...args);
        this.state={
            currentSelectedRadio:"twoPlayers",
            errorMsg:""
        }
        this.createGameOnClick= this.createGameOnClick.bind(this);
        this.handleRadioChange=this.handleRadioChange.bind(this);
        this.radioParser=this.radioParser.bind(this);

    }

    radioParser(selectedRadio){
        if(selectedRadio=="twoPlayers"){
            return 2;
        }
        else if(selectedRadio=="threePlayers"){
            return 3;
        }
        return 4;
    }

    createGameOnClick(e){
        e.preventDefault();
        const game = {
            numberOfPlayers: this.radioParser(this.state.currentSelectedRadio),
            name:e.target.elements.gameName.value,
            user:this.props.user
        };

        return fetch('/games',{method: 'POST',
        body:JSON.stringify(game),
        credentials: 'include',
        headers: {"Content-Type": "application/json"},
        })
        .then(response => {            
        if (!response.ok){
            this.setState(()=> ({errorMsg: "game name already exist"}));
            this.props.errorHandler();//do nothing write now
        }else{
            this.setState(()=> ({errorMsg: ""}));
            this.props.successHandler();
        }
    });
}

handleRadioChange(e){
    this.setState({
        currentSelectedRadio:e.target.value
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

render(){

    return (
        <div>
            <form className="container" id="createGame" onSubmit={this.createGameOnClick}>
                <lable htmlFor="gameName">Game name:<input name="gameName"/></lable>
                <br/>
                <lable>Number of players:</lable>
                <div className="radioBtn">
                  <lable>
                    <input type="radio" value="twoPlayers" onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio==='twoPlayers'} />
                    2
                  </lable>
                </div>
                <div className="radioBtn">
                  <lable>
                    <input type="radio" value="threePlayers" onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio==='threePlayers'} />
                    3
                  </lable>
                </div>
                <div className="radioBtn">
                  <lable>
                    <input type="radio" value="fourPlayers" onChange={this.handleRadioChange} checked={this.state.currentSelectedRadio==='fourPlayers'} />
                    4
                  </lable>
                </div>
                {this.renderErrorMessage()}
                <input className="buttons" type="submit"  value="Create Game"/>
            </form>
        </div>
        )
    }
}

export{CreateGame};
