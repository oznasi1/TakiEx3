
const express = require('express');
const router = express.Router();
const WebEngine = require('../scripts/webEngine.js');
const JSON = require('circular-json');



let gamesList = [];

//todo: <games>
router.get('/', (req, res) => {
    res.send("Hello Engine...");
});

// Check if game exist
router.get('/games/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    let game = gamesList.find(game => gameId === game.GetId());
    if (!game) return res.status(400).send("Error - Game Not Found");
    res.send(200);
});

// Get Game By ID
router.get('/GetGame/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    let game = gamesList.find(game => gameId === game.GetId());
    if (!game) return res.status(400).send("Error - Game not exist.");
    res.send(200,game);
});

// Start new game with 2 players
router.get('/games/:gameId/:id1/:id2', (req, res) => {
    const gameId = req.params.gameId;
    let game = gamesList.find(game => gameId === game.GetId());
    if (game) return res.status(400).send("Error - Game already exist.");
    game = new WebEngine(gameId);
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const playerList = [id1, id2];
    game.initEngine(playerList);
    gamesList.push(game);
    res.send(200);

});
// Start new game with 3 players
router.get('/games/:gameId/:id1/:id2/:id3', (req, res) => {
    const gameId = req.params.id;
    let game = gamesList.find(game => gameId === game.GetId());
    if (game) return res.status(400).send("Error - Game already exist.");
    game = new WebEngine(gameId);
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    const playerList = [id1, id2, id3];
    game.initEngine(playerList);
    res.send(200);
});
// Start new game with 4 players
router.get('/games/:gameId/:id1/:id2/:id3/:id4', (req, res) => {
    const gameId = req.params.id;
    let game = gamesList.find(game => gameId === game.GetId());
    if (game) return res.status(400).send("Error - Game already exist.");
    game = new WebEngine(gameId);
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    const id3 = req.params.id3;
    const id4 = req.params.id4;
    const playerList = [id1, id2, id3, id4];
    game.initEngine(playerList);
    res.send(200);
});
// Delete Game by id
router.delete('/games/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const index = gamesList.indexOf(game); //Delete
    gamesList.splice(index, 1);
    res.send(200);// Return the same game
});

//todo: </games>


//todo: <Events>

// Card Click Event
router.post('/events/CardClick/:gameId/:playerId/:cardIndex', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const cardIndex = req.params.cardIndex;
    game.Card_OnClick(playerId, cardIndex);
    res.send(200);
});

// Deck Click Event
router.post('/events/DeckClick/:gameId/:playerId/', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    game.Deck_OnClick(playerId);
    res.send(200);
});

//todo: </Events>


//todo: <stat>
router.get('/stat/:gameId/:playerId', (req, res) => {

    const gameId = req.params.gameId;
    let game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(401).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const resultStat = game.GetStat(playerId);
    res.send(200, resultStat);
});
//todo: </stat>


//todo: <render>

//Hello engine/render
router.get('/render', (req, res) => {
    res.send("Hello Engine/Render...");
});
// get Player
router.get('/render/player/:gameId/:playerId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const player = game.GetPlayerById(playerId);
    if (!player) return res.status(400).send("Error - playerId not found.");
    const playerCards = player.getCards();
    res.send(200, playerCards);
});
// get Deck
router.get('/render/deck/:gameId/:playerId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const deck = game.GetDeckById(playerId);
    if (!deck) return res.status(400).send("Error - playerId not found.");
    const deckCards = deck.getCards();
    res.send(200, deckCards);
});
// get Pile
router.get('/render/pile/:gameId/:playerId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const pile = game.GetPileById(playerId);
    if (!pile) return res.status(400).send("Error - playerId not found.");
    const pileCards = pile.getCards();
    res.send(200, pileCards);
});
// get Status
router.get('/render/stats/:gameId/:playerId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(402).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const stats = game.GetStatsById(playerId);
    if (!stats) return res.status(403).send("Error - playerId not found.");
    res.send(200, stats);
});

// get Status List when game end
router.get('/render/stats/:gameId/', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const statsList = game.GetStatusList();
    if (!statsList) return res.status(400).send("Error - playerId not found.");
    res.send(200, statsList);
});

// get Opponent Names List
router.get('/render/opponent/:gameId/:playerId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const playerId = req.params.playerId;
    const opponentNameList = game.GetOpponentNamesList(playerId);
    if (!opponentNameList) return res.status(400).send("Error - opponentNameList not found.");
    res.send(200, opponentNameList);
});

// get the index of the current Player
router.get('/render/currentPlayer/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const game = gamesList.find(game => game.GetId() === gameId);
    if (!game) return res.status(400).send("Error - gameId not found.");
    const currPlayerName = game.GetCurrentPlayerId();
    if (!currPlayerName) return res.status(400).send("Error - currPlayerIndex not found.");
    res.send(200, JSON.stringify(currPlayerName));
});

//todo: </render>


module.exports = router;