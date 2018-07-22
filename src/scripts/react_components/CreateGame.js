
import React from "react";
import ReactDOM from "react-dom";


 class CreateGame extends React.Component {
    constructor(args) {
        super(...args);
        this.state={
            currentSelectedRadio:"twoPlayers"
        }
        this.createGameOnClick= this.createGameOnClick.bind(this);
        this.handleRadioChange=this.handleRadioChange.bind(this);

    }

createGameOnClick(){
    //probably need to send the server the info about the game
    //and from the game menu take it back again
}

handleRadioChange(e){
    this.setState({
        currentSelectedRadio:e.target.value
    });
}

render(){

    return (
            <form className="container" id="createGame" onSubmit={this.createGameOnClick}>
                <lable>Game name:<input name="gameName"/></lable>
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
                <input className="buttons" type="submit" value="Create Game"/>
            </form>
        )
    }
}

export{CreateGame};
