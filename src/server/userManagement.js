
const express = require('express');
const router = express.Router();
const auth = require('./auth');

const userManagement = express.Router();


userManagement.get('/', auth.userAuthentication, (req, res) => {
	const userName = auth.getUserInfo(req.session.id).name;
	res.json({name:userName});
});

userManagement.get('/allUsers', auth.userAuthentication, (req, res) => {	
	const users = auth.getAllUsers();
	res.json(users);
});

userManagement.post('/addUser', auth.addUserToAuthList, (req, res) => {		
	res.sendStatus(200);	
});

userManagement.get('/logout', [
	(req, res, next) => {	
		const userinfo = auth.getUserInfo(req.session.id);	
		next();
	}, 
	auth.removeUserFromAuthList, 
	(req, res) => {
		res.sendStatus(200);		
	}]
);


module.exports = userManagement;
