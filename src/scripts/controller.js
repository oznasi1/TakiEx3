
var playerName;
var gameName;
var listener;
var engine;


function updateByRef(newShowError, newShowColorPicker, newEndGame, newIsWinner) {

        fetchCurrentPlayerIndex();
        fetchDeckFromServer();
        fetchPileFromServer();
        fetchPlayerFromServer();
        fetchPlayerStatsFromServer();
        fetchOpponentFromServer();
        fetchTimerFromServer();

        if (newEndGame) {
            fetchAllPlayerStats();
        }

        listener.setState({
            showError: newShowError,
            showColorPicker: newShowColorPicker,
            endGame: newEndGame,
            isWinner: newIsWinner,
        })
}

function fetchAllPlayerStats(){
    return fetch(`/engine/render/stats/${gameName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((listStat) => {
            if (listStat[0] !== null) listener.setState({ playerOneStats: listStat[0]});
            if (listStat[1] !== null) listener.setState({ playerTwoStats: listStat[1]});
            if (listStat[2] !== null) listener.setState({ playerThreeStats: listStat[2]});
            if (listStat[3] !== null) listener.setState({ playerFourStats: listStat[3]});
        });
}

function fetchPlayerStatsFromServer() {
    return fetch(`/engine/render/stats/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((playerStats) => {
            listener.setState({ stats: playerStats });
        });
}

function fetchCurrentPlayerIndex() {
    return fetch(`/engine/render/currentPlayer/${gameName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((currPlayerTurnName) => {
            listener.setState({ playerTurn: currPlayerTurnName });
        });
}

function fetchDeckFromServer() {

    return fetch(`/engine/render/deck/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((cards) => {
            listener.setState({ deck: cards });
        });
}

function fetchPileFromServer() {

    return fetch(`/engine/render/pile/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((cards) => {
            listener.setState({ pile: cards });
        });
}

function fetchPlayerFromServer() {
    return fetch(`/engine/render/player/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((cards) => {
            listener.setState({ playerCards: cards });
        });
}

function fetchOpponentFromServer() {
    return fetch(`/engine/render/opponent/${gameName}/${playerName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((opponentList) => {
            listener.setState({
                numOfPlayerTwoCards: opponentList[0] ? opponentList[0].numOfCards : 0,    //other players except me 
                numOfPlayerThreeCards: opponentList[1] ? opponentList[1].numOfCards : 0,  //
                numOfPlayerFourCards: opponentList[2] ? opponentList[2].numOfCards : 0
            });
        });
}

function fetchTimerFromServer() {
    return fetch(`/engine/timer/${gameName}`, { method: 'GET', credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        }).then((newTimer) => {
            listener.setState({ timer: newTimer })
        });
}



function initGameEngine(gameId, playerId) {
    gameName = gameId;
    playerName = playerId;
    updateByRef(false, false, false);
}

function init(gameRef) {
    listener = gameRef;

}

export { init, initGameEngine, updateByRef, engine };