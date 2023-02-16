require("dotenv").config();
const express = require('express');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;
const crypto = require('crypto');

const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DBNAME
});

// copy .env.TEMPLATE into a new file called .env (this file will not be send to git, so real passwords can be set to the .env)

// get secret value from .env file
console.log(process.env.SECRET_CODE_EXAMPLE);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

//point to static react files
app.use(express.static('client/build'))

///////////// IMPORT MODULES FROM FILES ////////////// 
require('./backend_Files/Country_Data_Collection_API')(app, connection);
require('./kevins_backend.js')(app);
////////////////////////////////////////////////////// 


////////////// JWT SET-UP CODE Start //////////////
process.env.TOKEN_SECRET;   // access config var

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
////////////// JWT SET-UP CODE End //////////////




////////////// LOGIN/SIGNUP API Start //////////////
// USERNAME VALIDATION METHOD
function validateUsername(username) {
  // checking if username is of a valid length (USERNAME CANNOT BE SHORTER THAN 5 AND LONGER THAN 32 CHARACTERS LONG)
  if(username.length < 5 || username.length > 32) {
    return false;
  }

  // checking if username only contains valid characters (alphanumeric and special characters)
  for(let i=0; i<username.length; i++) {
    let ASCIICode = username.charCodeAt(i);
    
    if (!(ASCIICode >= 33 || ASCIICode <= 126)) {
      return false;
    }
  }

  // checking if username is taken
  let query = `SELECT EXISTS (SELECT 1 FROM geo2002.users WHERE username = ${username}) AS "result";`  // result column stores 1 username is taken

  connection.query(query, (err, result, fields) => {
    if (err) {
      console.log("ERROR CHECKING IF USERNAME TAKEN: " + err);
      return false;
    }

    // Evaluating result
    let resultFound = result[0].result;

    if (resultFound == "1") {
      // username is not taken
      return true;
    } else {
      // username is taken
      return false;
    }
  })
}


// PASSWORD VALIDATION METHOD
function validatePassword(password) {
  // checking if password is of valid length (PASSWORD CANNOT BE LONGER SHORTER THAN 8 AND LONGER THAN 64 CHARACTERS)
  if(password.length < 8 || password.length > 64) {
    return false;
  }

  // checking if password only contains valid characters (alphanumeric and special characters)
  for(let i=0; i<password.length; i++) {
    let ASCIICode = password.charCodeAt(i);
    
    if (!(ASCIICode >= 33 || ASCIICode <= 126)) {
      return false;
    }
  }

  return true;  // password valid
}


// EMAIL VALIDATION METHOD
function validateEmail(email) {
  // Checking if email matches regular expression
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}


// GENERATE SALT METHOD
function generateSalt() {
  // Generating a four byte-long salt in hexadecimal form
  return crypto.randomBytes(16).toString('hex');
}


// SALT AND HASH METHOD
function saltAndHash(password, salt) {
  // Adding the salt to the end of the password and returning the hash of the result
  let passwordWithSalt = password + salt;
  return (crypto.createHash("sha256")).update(passwordWithSalt).digest("hex");
}


// MIDDLEWARE METHOD FOR TOKEN AUTHENTICATION
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}


// CREATE ACCOUNT API HANDLER
app.post('/api/createAccount', (req, res) => {
  // Getting account credentials
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let privacy_policy = req.body.privacy_policy;
  let terms_conditions = req.body.terms_conditions;

  // Validating inputs
  if(validateUsername(username) && validatePassword(password) && validateEmail(email) && 
      (privacy_policy == 0 || privacy_policy == 1) && (terms_conditions == 0 || terms_conditions == 1)) {
    // Generating a salt for the user user
    let salt = generateSalt();

    // Salt + Hash password
    let saltAndHashedPassword = saltAndHash(password, salt);

    // Creating the account in mySQL database
    connection.query(`INSERT INTO users(username, password, salt, email, 
        created_at, privacy_policy, terms_conditions) VALUES (${username}, ${saltAndHashedPassword},
        ${salt}, ${email}, CURDATE(), ${privacy_policy}, ${terms_conditions});`, (err, rows, fields) => {
        

      // checking if account was successfully created
      if (err) {
        // account creation NOT successful
        console.log("ACCOUNT CREATED ERROR: " + err);   // printing error message to console
        res.json({"message":"There was an error creating the account"})  // informing client account not created
      } else {
        // account creation successful
        console.log('Account created');
        res.json({"message":"Sccount successfully created"});  // informing client account was created
      }
    })

  } else {
    // Sending message to client that account details were invalid
    res.json({"message":"Account credentials are invalid"});
  }
});


// LOGIN API HANDLER
app.post('/api/login', (req, res) => {
  // Getting login credentials
  let username = req.body.username;
  let password = req.body.password;

  // Checking whether credentials were valid
  if (validateUsername(username) && validatePassword(password)) {
    // Checking if a user exists with the given username
    let usernameSearchSQL = `SELECT username, password, salt FROM geo2002.users WHERE username = ${username};` // SQL that returns the username, password, and salt fields when usernames are equal

    connection.query(usernameSearchSQL, (err, result, fields) => {
      if (err) {
        console.log("ERROR IN LOGIN API" + err);
        return;
      }

      // Evaluating result
      if(result.length == 0) {
        //No username match found
        res.json({"message":"Username or password were invalid"})  // informing client that login failed

      } else {
        // Username match found. Checking if salt and hashed passwords match
        let saltAndHashedPassword = saltAndHash(password, result[0].salt);
        
        if (saltAndHashedPassword == result[0].password) {
          // Account match has been found. Generating JWT token and sending it to the client.
          const token = generateAccessToken(username);
          res.json({"message":"Successfully logged in", "JWT":token});   /// message and JWT JSON to client

        } else {
          // Passwords did not match
          res.json({"message":"Username or password were invalid"})  // informing client that login failed
        }
      }
    })

  } else {
    // Credentials did not pass validation checks so must be invalid
    res.json({"message":"Username or password were invalid"})
  }
});
////////////// LOGIN/SIGNUP API End //////////////