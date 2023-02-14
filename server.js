require("dotenv").config();
const express = require('express');
const mysql = require('mysql')
const app = express();
const port = process.env.PORT || 5000;
const axios = require('axios');

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

// JWT SET-UP CODE AND METHODS
process.env.TOKEN_SECRET;   // access config var

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


app.get('/api/getallcountrydata', function(req, res) {
  axios.get('https://restcountries.com/v3.1/all')
  .then(response => {
    res.setHeader('Content-Type', 'application/json');
    
    res.json(GenerateCountryDataTable(response.data));
  });

});

function GenerateCountryDataTable(response){
  var countries = response;
  var formattedCountries = [];

  for(let i =0; i<countries.length;i++){

    var capitalName = "No Capital"
    if(countries[i].capital == undefined){
      console.log(countries[i].name.common)
    }
    else{
      capitalName = countries[i].capital[0]
    }
    var individualCountry = {
      name: countries[i].name.common,
      independent: countries[i].independent,
      unMember: countries[i].unMember,
      region: countries[i].region,
      lat: countries[i].latlng[0],
      lng: countries[i].latlng[1],
      surface_area: countries[i].area,
      population: countries[i].population,
      driving_side: countries[i].car.side,
      capital: capitalName,
      flag:countries[i].flags.svg

    }

    formattedCountries.push(individualCountry)
  }

  return formattedCountries;

}
