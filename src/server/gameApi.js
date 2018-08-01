
const express = require('express');
const router = express.Router();
const auth = require('./auth');
const gameApi  = express.Router();


let activeGames = [];

gameApi.get('/', (req, res) => {
  res.json(activeGames);
});

gameApi.post('/', auth.userAuthentication, (req, res) => {
	  if (
		activeGames.length > 0 &&
		activeGames.some(game => game.name === req.body.name)
	  ) {
		//error = 'game name already exists';
		res.status(401).send();
		}else if(req.body.name==""){
			res.status(401).send();
		}else {
		activeGames.push(
		  Object.assign({}, req.body, {
			players: [],
		  })
		);
	}


	res.send();
	//error==''? res.send({error: error }) :res.status(401).send({error: error });
	});
	
	gameApi.post('/:gameName/logout', (req, res) => {
		const user = JSON.parse(req.body);	
		var playerIndex=-1;
		var gameIndex;
		for (let i = 0; i < activeGames.length; i++) {
			if(activeGames[i].name==req.params.gameName){
				gameIndex= i;
		}}

		for (let i = 0; i < activeGames[gameIndex].players.length; i++) {
			if( activeGames[gameIndex].players[i].name==user.name){
					playerIndex = i;
			}
	}
		if (playerIndex >= 0) {
			activeGames[gameIndex].players.splice(playerIndex, 1);
			res.send(200);
		}
		else{
			res.send(user.name)
		};
	});


	gameApi.post('/:gameName/join', (req, res) => {
		const user = JSON.parse(req.body);	
		var error="";
		var gameIndex;
		for (let i = 0; i < activeGames.length; i++) {
			if(activeGames[i].name==req.params.gameName){
				gameIndex= i;
		}}

    var playerIndex=-1;
		for (let i = 0; i <  activeGames[gameIndex].players.length; i++) {
				if( activeGames[gameIndex].players[i].name==user.name){
						playerIndex = i;
				}
		}

		if (playerIndex == -1&&activeGames[gameIndex].players.length < activeGames[gameIndex].numberOfPlayers) { //player is not in the game
			activeGames[gameIndex].players.push(JSON.parse(req.body));
			//res.sendStatus(200);
			res.sendStatus(200).send(activeGames[gameIndex].players.length);
			if (activeGames[gameIndex].players.length === activeGames[gameIndex].numberOfPlayers) {
				//startGame(activeGames[gameIndex]);
			}
		} else { // the player already in 
			error="you are already in this game";
		}
		res.status(401).send({ gameName: req.params.gameName, error:error });
	});


	gameApi.post('/:gameName/delete', (req, res) => {

		var gameIndex;
		for (let i = 0; i < activeGames.length; i++) {
			if(activeGames[i].name==req.params.gameName){
				gameIndex= i;
		}}
		if((activeGames[gameIndex].user.name==(req.body))&&(activeGames[gameIndex].players.length==0)){
			//delete only if the user is the creator and the game is empty 
			activeGames.splice(gameIndex, 1);
			res.send(200);//succes
		}
		res.status(401).send(`faild to delete the game`);
	});



module.exports = gameApi;
