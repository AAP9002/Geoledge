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
// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});


console.log(process.env.DBNAME)

// Connecting to SQL database
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,  // DELETE BEFORE PUSHING!!!
  database: process.env.DBNAME
})

connection.connect();

// Adding a new user to the database
connection.query('INSERT INTO users VALUES (3, "Horrid", "Henry", "horrid_henry@gmail.com", "veryHorrid", null, CURRENT_DATE, 0, 0)', (err, rows, fields) => {
  if (err) throw err

  console.log('New user created.');
})

connection.end()