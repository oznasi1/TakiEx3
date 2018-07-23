
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
	  } else {
		activeGames.push(
		  Object.assign({}, req.body, {
			players: [req.body.user],
		  })
		);
	  }

	res.send();
	//error==''? res.send({error: error }) :res.status(401).send({error: error });
  });

module.exports = gameApi;
