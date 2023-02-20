require('dotenv').config();
const express = require('express');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');

var connection = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DBNAME
});

// copy .env.TEMPLATE into a new file called .env (this file will not be send to git, so real passwords can be set to the .env).

// get secret value from .env file

console.log("Database is connected:",process.env.DBNAME);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

//point to static react files
app.use(express.static('client/build'))
// point to static backend files
app.use(express.static('backend_Files/static_files'))

///////////// IMPORT MODULES FROM FILES ////////////// 
require('./backend_Files/Country_Data_Collection_API')(app, connection);
require('./backend_Files/Login_Create_Account_APIs')(app, connection);
require('./backend_Files/Game_Loop_Question_Page')(app, connection);
require('./kevins_backend.js')(app, connection);
////////////////////////////////////////////////////// 







////////////// VIEW ACCOUNT API Start //////////////








////////////// VIEW ACCOUNT API End //////////////