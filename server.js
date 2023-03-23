require('dotenv').config();
const express = require('express');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const crypto = require('crypto');


var connection = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DBNAME
});

// copy .env.TEMPLATE into a new file called .env (this file will not be send to git, so real passwords can be set to the .env).

// get secret value from .env

console.log("Database is connected:", process.env.DBNAME);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

//point to static react files
app.use(express.static('client/build'))
// point to static backend files
app.use(express.static('backend_Files/static_files'))

// using cookie parser middleware
app.use(cookieParser());

///////////// PERMANENT MIDDLEWARE FUNCTIONS /////////////

// JWT Functions
function generateAccessToken(username, userID) {
  let clientHash =  crypto.randomBytes(64).toString('hex');   // creating random 64 byte-long hash
  return jwt.sign({username, userID, clientHash}, process.env.TOKEN_SECRET, { expiresIn: '30m' });
}

// MIDDLEWARE METHOD FOR TOKEN AUTHENTICATION
const authenticateToken = function(req, res, next) {
  // Getting JWT token from cookies
  try {  
    const token = req.cookies['JWT'];
    
    // Checking if token is empty
    if (token == null) {
        req.loggedIn = "false";
        req.username = null;
        req.userID = null;
        req.clientHash = null;
        console.log("JWT verification failed: token empty");
    } else {
    //Verifying token
        jwt.verify(token, process.env.TOKEN_SECRET, (err, userData) => {
            // Checking if error occurred when authenticating JWT
            if (err) {
                // errored occured when verifying token
                console.log("ERROR WHEN AUTHENTICATING JWT: " + err);
                req.loggedIn = "false";
                req.username = null;
                req.userID = null;
                req.clientHash = null;
            } else {
                // user is logged in
                req.loggedIn = "true";
                req.username = userData.username;
                req.userID = userData.userID;
                req.clientHash = userData.clientHash;
                //console.log("JWT verified");

                // console.log(Math.floor(Date.now() / 1000));
                // console.log(userData.iat);

                // Checking if JWT needs to be renewed (renewed 2 mins after JWT issue)
                if (Math.floor(Date.now() / 1000) > (userData.iat + 120)) {
                  // renewing JWT
                  console.log(Date.now() / 1000, userData.iat + 120)
                  console.log("JWT renewed")
                  let token = generateAccessToken(userData.username, userData.userID);
                  res.cookie("JWT", token);
                }
            }
        })
    }

    next();
  } catch (e) {
    // Error occurred when reading JWT token implying tat the user is not logged in
    req.loggedIn = "false";
    req.username = null;
    req.userID = userData.userID;
    req.clientHash = null;
    console.log("JWT verification failed");
    next();
  }
}

app.use(authenticateToken);
/////////////////////////////////////////////////////////

///////////// IMPORT MODULES FROM FILES ////////////// 
require('./backend_Files/Country_Data_Collection_API')(app, connection);
require('./backend_Files/Login_Create_Account_APIs')(app, connection);
require('./backend_Files/Game_Loop_Question_Page')(app, connection);
require('./backend_Files/Lobby_API.js')(app, connection);
require('./backend_Files/View_Account_API')(app, connection);
require('./backend_Files/Leaderboards_API')(app, connection);
require('./backend_Files/Start_Game_API')(app, connection);
require('./backend_Files/Next_Question_API')(app, connection);
require('./backend_Files/Game_State')(app, connection);
require('./backend_Files/Join_Online_Game_API')(app, connection);
require('./backend_Files/Leave_Game_API')(app, connection);
require('./backend_Files/Update_Wins_API')(app, connection);
//////////////////////////////////////////////////////