
// import {GameEngine} from "./gameEngine.js";

const NUM_OF_HUMAN = 1;
const NUM_OF_BOT = 1;

var playerName;
var gameName;

var newDeck = [];
var newPile = [];
var newBotCards = [];
var newPlayerCards = [];
var newStats = {};
var newBotStats = {};
var newWinLose = {};
var newState = {};
var newIndex;
var currentPlayerIndex;
var listener;
var engine;


function updateByRef(newShowError, newShowColorPicker, newEndGame, newIsWinner) {
    
    // newState = {
    //     playerIndex: currentPlayerIndex,
    //     deck: newDeck,
    //     pile: newPile,
    //     playerTwoStats: newBotStats,
    //     botCards: newBotCards,
    //     playerCards: newPlayerCards,
    //     showError: newShowError,
    //     showColorPicker: newShowColorPicker,
    //     endGame: newEndGame,
    //     stats: newStats,
    //     winLose: newWinLose,
    // }

  
    fetchCurrentPlayerIndex();
    fetchDeckFromServer();
    fetchPileFromServer();
    fetchPlayerFromServer();
    //fetchPlayerStatsFromServer();
    fetchOpponentFromServer();
    
    listener.setState({
        showError: newShowError,
        showColorPicker: newShowColorPicker,
        endGame: newEndGame,
        isWinner:newIsWinner
    })
    // fetchDeckFromServer().then((deckCards)=>{
    //     newDeck = deckCards;
    //     alert(deckCards.length);
    //     listener.setState({deck:newDeck});
    // });
    /*
    Object.assign(newDeck, engine.Deck.Cards);
    Object.assign(newBotCards, engine.Players.getPlayersList()[1].Cards);
    Object.assign(newPlayerCards, engine.Players.getPlayersList()[0].Cards);
    Object.assign(newPile, engine.Pile.Cards);

    currentPlayerIndex = engine.Players.getCurrentPlayerIndex();

    newStats = {
        numOfTurs: engine.Players.getPlayersList()[currentPlayerIndex].Stats.getNumOfTurns(),
        avgTime: engine.Players.getPlayersList()[currentPlayerIndex].Stats.getAvgPlayTime(),
        lastCardCount: engine.Players.getPlayersList()[currentPlayerIndex].Stats.getNumOfOneCard(),
    }
    newBotStats = {
        numOfTurs: engine.Players.getPlayersList()[1].Stats.getNumOfTurns(),
        avgTime: engine.Players.getPlayersList()[1].Stats.getAvgPlayTime(),
        lastCardCount: engine.Players.getPlayersList()[1].Stats.getNumOfOneCard(),
    }

    if (newEndGame) { // if we got this flag that found the winner
        newWinLose = {
            timer: GameEngine.getTimer(), //s_gameTimer return by static function in GameEngine called getTimer()
            winnerIndex: engine.checkForWinner(),
            botStats: newBotStats,
        }
    }

    newState = {
        playerIndex: currentPlayerIndex,
        stateIndex: newIndex,
        deck: newDeck,
        pile: newPile,
        playerTwoStats: newBotStats,
        botCards: newBotCards,
        playerCards: newPlayerCards,
        showError: newShowError,
        showColorPicker: newShowColorPicker,
        endGame: newEndGame,
        stats: newStats,
        winLose: newWinLose,
    }

    listener.setState(newState);

    if (newShowError == true) // shuuting down ther error after 1 sec
    {
        setTimeout(function () {
            listener.setState({ showError: false })
        }, 1000)
    }
    */
}

function fetchPlayerStatsFromServer(){
    return fetch(`/engine/render/stats/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
      .then(response => {
          if (!response.ok) {
              throw response;
          }
          return response;
      }).then((playerStats)=>{
          listener.setState({stats:playerStats});
      });
}

function fetchCurrentPlayerIndex(){
    return fetch(`/engine/render/currentPlayer/${gameName}`, { method: 'GET', credentials: 'include' })
    .then(response => {
        if (!response.ok) {
            throw response;
        }
        return response.json();
    }).then((currPlayerTurnName)=>{
        listener.setState({playerTurn:currPlayerTurnName});
    });
}

function fetchDeckFromServer(){

      return fetch(`/engine/render/deck/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((cards)=>{
            listener.setState({deck:cards});
        });
}

function fetchPileFromServer(){

    return fetch(`/engine/render/pile/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
      .then(response => {
          if (!response.ok) {
              throw response;
          }
          return response.json();
      }).then((cards)=>{
          listener.setState({pile:cards});
      });
}

function fetchPlayerFromServer(){
//'/render/player/:gameId/:playerId'
    return fetch(`/engine/render/player/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
      .then(response => {
          if (!response.ok) {
              throw response;
          }
          return response.json();
      }).then((cards)=>{
          listener.setState({playerCards:cards});
      });
}

function fetchOpponentFromServer(){
        return fetch(`/engine/render/opponent/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
          .then(response => {
              if (!response.ok) {
                  throw response;
              }
              return response.json();
          }).then((opponentList)=>{
              listener.setState({
                numOfPlayerTwoCards: opponentList[0] ? opponentList[0].numOfCards: 0 ,    //other players except me 
                numOfPlayerThreeCards:  opponentList[1] ? opponentList[1].numOfCards: 0 ,  //
                numOfPlayerFourCards:  opponentList[2] ? opponentList[2].numOfCards: 0 });
          });
    }


function initGameEngine(gameId,playerId) {
    //router.get('/render/deck/:gameId/:playerId', (req, res) => {

    // return fetch(`/engine/GetGame/${gameId}`, { method: 'GET', credentials: 'include' })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw response;
    //         }
    //         return response;
    //     }).then((newEngine) => {
    //         engine = newEngine;
    //         engine.initEngine(null, NUM_OF_HUMAN, NUM_OF_BOT);
    //     });

    gameName= gameId;
    playerName = playerId;
    updateByRef(false,false,false);
}

function init(gameRef) {
    listener = gameRef;

}


export { init, initGameEngine, updateByRef, engine };