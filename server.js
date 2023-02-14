require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// copy .env.TEMPLATE into a new file called .env (this file will not be send to git, so real passwords can be set to the .env)

// get secret value from .env file
console.log(process.env.SECRET_CODE_EXAMPLE);

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static('client/build'))



console.log(process.env.DBNAME)

// create a GET route
app.get('/express_backend', (req, res) => {
  const mysql = require('mysql')
  const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DBNAME
  });
  connection.connect();
  connection.query("select * from temp", function(error, results){
    console.log(results);
    res.send({  results  });
  })

  connection.end()
});

// Adding a new user to the database