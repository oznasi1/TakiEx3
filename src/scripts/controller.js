
// import {GameEngine} from "./gameEngine.js";

const NUM_OF_HUMAN = 1;
const NUM_OF_BOT = 1;



    var listener;
    var engine;


    function updateByRef( newShowError,newShowColorPicker,newEndGame){
        let newDeck = [];
        let newPile = [];
        let newBotCards = [];
        let newPlayerCards = [];
        let newStats={};
        let newBotStats={};
        let newWinLose={};
        let newState={};
        let newIndex;
        let currentPlayerIndex;
        Object.assign(newDeck,engine.Deck.Cards);
        Object.assign(newBotCards,engine.Players.getPlayersList()[1].Cards);
        Object.assign(newPlayerCards,engine.Players.getPlayersList()[0].Cards);
        Object.assign(newPile,engine.Pile.Cards);

        currentPlayerIndex = engine.Players.getCurrentPlayerIndex();

        newStats={
           numOfTurs:engine.Players.getPlayersList()[currentPlayerIndex].Stats.getNumOfTurns(), 
           avgTime:engine.Players.getPlayersList()[currentPlayerIndex].Stats.getAvgPlayTime(),
           lastCardCount:engine.Players.getPlayersList()[currentPlayerIndex].Stats.getNumOfOneCard(),
                } 
        newBotStats={
                numOfTurs:engine.Players.getPlayersList()[1].Stats.getNumOfTurns(), 
                avgTime:engine.Players.getPlayersList()[1].Stats.getAvgPlayTime(),
                lastCardCount:engine.Players.getPlayersList()[1].Stats.getNumOfOneCard(),
                }

        if(newEndGame){ // if we got this flag that found the winner
            newWinLose={
               timer:GameEngine.getTimer(), //s_gameTimer return by static function in GameEngine called getTimer()
               winnerIndex:engine.checkForWinner(),
               botStats:newBotStats,
            }
        }

        newState={
            playerIndex:currentPlayerIndex,
            stateIndex:newIndex,
            deck: newDeck,
            pile: newPile,
            playerTwoStats:newBotStats,
            botCards: newBotCards,
            playerCards:newPlayerCards,
            showError:newShowError,
            showColorPicker:newShowColorPicker,
            endGame:newEndGame,
            stats:newStats,
            winLose:newWinLose,
          }

        listener.setState(newState);

        if(newShowError==true) // shuuting down ther error after 1 sec
            {
                setTimeout(function() { 
                    listener.setState({showError: false}) 
                    }, 1000)
            }
        }
 
        
    function initGameEngine(gameId){
  
        return fetch(`/GetGame/${gameId}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                alert(JSON.stringify(response));
                alert(response.json());
            }
            engine = response.json();
        });
        //engine.initEngine(null,NUM_OF_HUMAN,NUM_OF_BOT);
    }

    function init (gameRef){
        listener = gameRef;
    }


export {init,initGameEngine,updateByRef,engine};