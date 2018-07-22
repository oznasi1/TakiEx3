


const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userManagement = require('./server/userManagement.js');
const auth = require('./server/auth.js');
const app = express();

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', cookie: {maxAge:269999999999}}));

//app.get('/',(req,res)=> res.send('hello world'));

app.use(express.static(path.resolve(__dirname, "..", "public")));

app.use('/users', userManagement);


app.listen(3000, console.log('Example app listening on port 3000!'));

