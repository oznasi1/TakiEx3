
import {GameEngine} from "./gameEngine.js";

const NUM_OF_HUMAN = 1;
const NUM_OF_BOT = 1;



    var listener;
    var engine;
    var stateArr=[];
    var currentIndex=-1;

    function cleanStateArray(){
        stateArr=[];
        currentIndex=-1;
    }

    function prevWasClicked(index){
        let newState={};
        if(index==0){
            currentIndex=stateArr.length-1
        }
        else{
            currentIndex--;
        }
        Object.assign(newState,stateArr[currentIndex]);

        listener.setState(newState);
    }

    function nextWasClicked(index){
        let newState={};
        currentIndex=(++index)%(stateArr.length);
        Object.assign(newState,stateArr[currentIndex]);
        listener.setState(newState);
    }

    function saveStateInArry(currState){
        stateArr.push(newState);
    }

    function updateByRef(newShowError,newShowColorPicker,newEndGame){
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
        if(newEndGame){ // if we got this flag that found the winner
            newBotStats={
                    numOfTurs:engine.Players.getPlayersList()[1].Stats.getNumOfTurns(), 
                    avgTime:engine.Players.getPlayersList()[1].Stats.getAvgPlayTime(),
                    lastCardCount:engine.Players.getPlayersList()[1].Stats.getNumOfOneCard(),
                    } 
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
            botCards: newBotCards,
            playerCards:newPlayerCards,
            showError:newShowError,
            showColorPicker:newShowColorPicker,
            endGame:newEndGame,
            stats:newStats,
            winLose:newWinLose,
            isRepaly:false}

        if((!newShowColorPicker&&!newShowError) ||newEndGame){// saving all moves exept error and the picking color action   
            currentIndex++;
            newIndex=currentIndex;
            newState.stateIndex = newIndex;
            stateArr.push(newState);
        }  

        listener.setState(newState);

        if(newShowError==true) // shuuting down ther error after 1 sec
            {
                setTimeout(function() { 
                    listener.setState({showError: false}) 
                    }, 1000)
            }
        }
 
        
    function initGameEngine(){
        engine = new GameEngine();
        engine.initEngine(null,NUM_OF_HUMAN,NUM_OF_BOT);
    }

    function init (gameRef){
        listener = gameRef;
    }


export {init,initGameEngine,updateByRef,engine,prevWasClicked,nextWasClicked,cleanStateArray};