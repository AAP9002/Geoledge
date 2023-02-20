const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('./JWTFunctions')();

module.exports = function (app, connection) {

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
            
            if (!(ASCIICode >= 33 && ASCIICode <= 126)) {
                return false;
            }
        }
    
        return true;
    }
    
    function checkUsernameTaken(username) {
        // checking if username is taken
        let query = `SELECT EXISTS (SELECT 1 FROM geo2002.users WHERE username = "${username}") AS "result"`  // result column stores 1 username is taken
    
        let promise = new Promise(function(resolve) {
            connection.query(query, (err, result) => {
                if (err) {
                // Error occurred when performing SQL query
                console.log("ERROR CHECKING IF USERNAME TAKEN: " + err);
                resolve(null);
                }
                // Evaluating result
                resolve(result[0].result);
            });
        });
    
        return promise;
    }
    
    
    // PASSWORD VALIDATION METHOD
    function validatePassword(password) {
        console.log("validating password");
        // checking if password is of valid length (PASSWORD CANNOT BE LONGER SHORTER THAN 8 AND LONGER THAN 64 CHARACTERS)
        if(password.length < 8 || password.length > 64) {
            // password length of invalid size
            return false;
        }
    
        // checking if password only contains valid characters (alphanumeric and special characters)
        for(let i=0; i<password.length; i++) {
            let ASCIICode = password.charCodeAt(i);
            
            if (!(ASCIICode >= 33 && ASCIICode <= 126)) {
                console.log("char not valid: " + ASCIICode);
                return false;
            }
        }
    
        return true;  // password valid
    }
    
    
    // EMAIL VALIDATION METHOD
    function validateEmail(email) {
        // Checking if email matches regular expression
        return (email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ));
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

    // TESTING TO SEE IF MIDDLEWARE METHOD WORKS
    app.get('/api/loggedin', (req, res, next) => {
        
    });
    
    
    // CREATE ACCOUNT API HANDLER
    app.get('/api/createAccount', (req, res) => {
        // Getting account credentials
        let username = req.query.username;
        let password = req.query.password;
        let email = req.query.email;
        let privacy_policy = req.query.privacy_policy;
        let terms_conditions = req.query.terms_conditions;
    
        // Validating username
        if(!validateUsername(username)) {
            // Credentials did not pass validation checks
            res.json({"message":"Credentials were invalid"})  // informing client account not created
            return;
        }
    
        //Checking if username is taken
        let usernameValidPromise = (checkUsernameTaken(username));
        let usernameValid = false;
    
        usernameValidPromise.then((response) => {
            if (response == "0") {
                // username is not taken
                usernameValid = true;
            } else if (response == "1") {
                // username taken
                res.json({"message":"Username is taken"})  // informing client username is taken
                return;
            } else {
                res.json({"message":"There was an error creating your account"})  // informing client account not created
                return;
            }
        
            // Validating inputs
            if(usernameValid && validatePassword(password) && validateEmail(email) && 
                (privacy_policy == 0 || privacy_policy == 1) && (terms_conditions == 0 || terms_conditions == 1)) {
                    console.log("passed");
                // Generating a salt for the user user
                let salt = generateSalt();
        
                // Salt + Hash password
                let saltAndHashedPassword = saltAndHash(password, salt);
        
                let query =  `INSERT INTO geo2002.users(username, password, salt, email, 
                created_at, privacy_policy, terms_conditions) VALUES ('${username}', '${saltAndHashedPassword}',
                '${salt}', '${email}', CURDATE(), '${privacy_policy}', '${terms_conditions}');`
        
                // Creating the account in mySQL database
                let createAccountPromise = new Promise(function(resolve) {
                    connection.query(query, (err, rows, fields) => {
                        // checking if account was successfully created
                        if (err) {
                            // account creation NOT successful
                            console.log("ERROR WHEN CREATING ACCOUNT: " + err);   // printing error message to console
                            resolve(null);
                        } else {
                            // account creation successful
                            console.log('Account created');
                            resolve(true);
                        }
                    });
                });
        
                // Evaluating results of SQL query
                createAccountPromise.then((response) => {
                    if (response === true) {
                        res.json({"message":"Account successfully created"});  // informing client account was created
                    } else {
                        res.json({"message":"There was an error when creating the account"})  // informing client account not created
                    }
                });
            } else {
                // Credentials did not pass validation checks
                res.json({"message":"Credentials were invalid"})  // informing client account not created
            }
        });
    });
    // http://localhost:5000/api/createAccount?username=alexto123&password=alexto12345&email=alexnseve@gmail.com&privacy_policy=1&terms_conditions=1
    
    
    
    // LOGIN API HANDLER
    // test http://localhost:5000/api/login?username=kev123&password=pass&clientHash=AB153
    app.get('/api/login', (req, res) => {
        // Getting login credentials
        let username = req.query.username;
        let password = req.query.password;
        let clientHash = req.query.clientHash;
    
        // Checking whether credentials were valid
        if (validateUsername(username) && validatePassword(password)) {
            // Checking if a user exists with the given username
            let usernameSearchSQL = `SELECT username, password, salt FROM geo2002.users WHERE username = '${username}';` // SQL that returns the username, password, and salt fields when usernames are equal
            
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
                        let token = generateAccessToken(username, clientHash);
                        res.json({"message":"Successfully logged in", "JWT":token});   /// message and JWT JSON to client
                        res.cookie("JWT", token, {signed: true});
                    } else {
                        // Passwords did not match
                        res.json({"message":"Username or password were invalid"})  // informing client that login failed
                    }
                }
            });
        
        } else {
            // Credentials did not pass validation checks so must be invalid
            res.json({"message":"Username or password were invalid"})
        }
    });
    ////////////// LOGIN/SIGNUP API End //////////////
}