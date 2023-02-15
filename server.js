require("dotenv").config();
const express = require('express');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;
const axios = require('axios'); // use to get country api data from web
const crypto = require('crypto');

const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DBNAME
});
// jbkjhbkvhvljvjhvhjvkcd
// copy .env.TEMPLATE into a new file called .env (this file will not be send to git, so real passwords can be set to the .env)

// get secret value from .env file
console.log(process.env.SECRET_CODE_EXAMPLE);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

//point to ststic react files
app.use(express.static('client/build'))

// test if can get a record from mysql database and return json
app.get('/express_backend', (req, res) => {
  connection.query("select * from temp", function(error, results){
    console.log(results);
    res.send({  results  });
  })
});

app.get('/express_backend_insert', (req, res) => {
  connection.query("INSERT INTO `temp` (`id`, `name`) VALUES ('14', 'Alex') ", function(error, results){
    console.log(results);
    res.send({  results  });
  })
});

////////////// JWT SET-UP CODE Start //////////////
process.env.TOKEN_SECRET;   // access config var

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
////////////// JWT SET-UP CODE End //////////////




////////////// LOGIN/SIGNUP API Start //////////////
// USERNAME VALIDATION METHOD
function validateUsername(username) {
  // checking if username is of a valid length
  if(username.length == 0 || username.length > 32) {
    return false;
  }

  // checking if username only contains valid characters (alphanumeric and special characters)
  for(let i=0; i<username.length; i++) {
    ASCIICode = username.charCodeAt(i);
    
    if (!(ASCIICode >= 33 || ASCIICode <= 126)) {
      return false;
    }
  }

  return true;  // username valid
}

// PASSWORD VALIDATION METHOD
function validatePassword(password) {
  // checking if password is of valid length
  if(password.length == 0 || password.length > 64) {
    return false;
  }

  // checking if password only contains valid characters (alphanumeric and special characters)
  for(let i=0; i<password.length; i++) {
    ASCIICode = password.charCodeAt(i);
    
    if (!(ASCIICode >= 33 || ASCIICode <= 126)) {
      return false;
    }
  }

  return true;  // password valid
}

// VALIDATE EMAIL METHOD
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
  passwordWithSalt = password + salt;
  return (crypto.createHash("sha256")).update(passwordWithSalt).digest("hex");
}


// CREATE ACCOUNT API HANDLER
app.get('/api/createNewUser', (req, res) => {
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
    connection.query(`INSERT INTO users(username, password, email, 
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


////////////// COUNTRY API Start //////////////
//get cleaned country data
app.get('/api/getallcountrydata', function(req, res) {
  axios.get('https://restcountries.com/v3.1/all')
  .then(response => {
    res.setHeader('Content-Type', 'application/json');
    
    res.json(GenerateCountryDataTable(response.data));
  });

});

// clean country data from API ans return json b=object with formatted data
function GenerateCountryDataTable(response){
  var countries = response;
  var formattedCountries = [];

  for(let i =0; i<countries.length;i++){
    // NOTE some countries don't have capitals
    var capitalName = "No Capital"
    if(countries[i].capital == undefined){
      //console.log(countries[i].name.common)
    }
    else{
      capitalName = countries[i].capital[0]
    }

    //LANGUAGE
    //seems to be only Antarctica
    var langName = "No Official Language"
    if(countries[i].languages == undefined){
      console.log(countries[i].name.common)
    }
    else{
      langName = Object.entries(countries[i].languages)[0][1]
    }

    //Currency
    //Antarctica, Bouvet Island and Heard Island and McDonald Islands don't have an official currency
    var currencySymbol = "Unknown Currency"
    if(countries[i].currencies == undefined){
      console.log(countries[i].name.common)
    }
    else{
      currencySymbol = Object.entries(countries[i].currencies)[0][1].symbol
    }

    //clean and make country object
    var individualCountry = {
      name: countries[i].name.common,
      independent: countries[i].independent,
      unMember: countries[i].unMember,
      region: countries[i].region,
      lat: countries[i].latlng[0],
      lng: countries[i].latlng[1],
      surface_area: countries[i].area,
      population: countries[i].population,
      timezone:Object.entries(countries[i].timezones)[0][1],
      driving_side: countries[i].car.side,
      capital: capitalName,
      flag:countries[i].flags.svg,
      language: langName,
      map: "https://maps.google.com/maps?q="+countries[i].name.common+"+country&amp;t=&amp;ie=UTF8&amp;iwloc=&amp;output=embed",
      currency: currencySymbol
    }

    formattedCountries.push(individualCountry) // add country to countries object
  }

  return formattedCountries;

}

//////////// Country API End ////////////////
