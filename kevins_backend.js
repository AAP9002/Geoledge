// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204
// promise multiple sql https://medium.com/swlh/dealing-with-multiple-promises-in-javascript-41d6c21f20ff
// promise w3schools

// Host creating a new session:
// host api:
// Create session with empty quiz
// wait for playuers to join
// add host and other participewnts to part tgable
// start api:
// get quiz_id
// Get the country list in a random order
// Create a country set of n countries by inserting n records of-
// country_id, quiz_id

// app.get('/test', function(req, res) {
//     res.json(200, {'test': 'it works!'})
// })
const { query } = require("express");
module.exports = function(app, connection) {
        /*
        // SQL Processes:
        ///////////////////////////////////////////////////////////////
        // Create Lobby (empty quiz and empty session)
        // Inputs: host_user
        // Return: session_id (aka join code)
        let query = `INSERT INTO quiz (title, description, num_of_questions) VALUES ('BLANK', 'BLANK', 0);`
        let query = `SELECT LAST_INSERT_ID();` //quiz id
        let query = `INSERT INTO session (quiz_quiz_id, host_user, created_at) VALUES (${quiz_id}, ${host_user}, NOW());`
        let query = `SELECT LAST_INSERT_ID();` //session id
        *F-END MUST RMBER TO ADD USER TO PARTCPENT TABLE 
        ///////////////////////////
        
        ///////////////////////////////////////////////////////////////
        // Join Lobby
        // Inputs: user_id, session_id
        // Return: -
        let query = `INSERT INTO participents (user_id, session_id, player_score, answered) VALUES (${user_id}, ${session_id}, 0, 0);`
        ///////////////////////////
        
        ///////////////////////////////////////////////////////////////
        // Start Game (create country set, write game config into dbo)
        // Inputs: session_id, num_of_questions, quiz_id (w/o F-End)
        // Inputs: time_limit max_guesses
        // Return: -
        let query =`SELECT quiz_id FROM session WHERE session_id=(${session_id});`
        let query =`SELECT country_id FROM country ORDER BY RAND();`
        let query =`INSERT INTO country_set (country_id, quiz_id) VALUES (${country_id}, ${quiz_id});`
        let query = `UPDATE quiz SET num_of_questions = (${num_of_questions}) WHERE quiz_id=(${quiz_id});`
        ///////////////////////////////////////
        // Insert Game Configs
        let query = `UPDATE participents SET guesses = (${max_guesses}) WHERE session_id=(${session_id});`
        let query = `UPDATE session SET max_guesses = (${max_guesses}), time_limit = (${time_limit}) WHERE session_id=(${session_id});`
        ///////////////////////////

test:
http://localhost:5000/api/createLobby?host_user=20
http://localhost:5000/api/joinLobby?user_id=20&session_id=27
http://localhost:5000/api/startGame?num_of_questions=5&max_guesses=7&time_limit=100&session_id=27
        */
    
    // Create Lobby
    // Create empty quiz and select quiz id
    // Create empty session and select session id
    // Return session_id to front end
    // Remember to add host to the lobby in a separate api
    app.post('/api/createLobby', (req, res) => {
        let host_user = req.query.host_user;
        let myPromise = new Promise(function(myResolve, myReject) {
            let query = `INSERT INTO quiz (title, description, num_of_questions) VALUES ('BLANK', 'BLANK', 0);` 
            connection.query(query, (err) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(); // move onto next promise
                }
            })
        });
        myPromise.then(
            function() {
                let myPromise = new Promise(function (myResolve, myReject) {
                    let query = `SELECT LAST_INSERT_ID() AS quiz_id;`
                    connection.query(query, (err, result) => {
                        if (err) {
                            myReject(err);
                        } else {
                            myResolve(result); //pass quiz_id to next p
                        }
                    });
                });
                myPromise.then(
                    function (result) {
                        let quiz_id = result[0].quiz_id
                        let myPromise = new Promise(function(myResolve, myReject) {
                            let query = `INSERT INTO session (quiz_id, host_user, created_at) VALUES (${quiz_id}, ${host_user}, NOW());`
                            connection.query(query, (err) => {
                                if (err) {
                                    myReject(err);
                                } else {
                                    myResolve();
                                }
                            })
                        });
                        myPromise.then(
                            function() {
                                let myPromise = new Promise(function (myResolve, myReject) {
                                    let query = `SELECT LAST_INSERT_ID() AS session_id;`
                                    connection.query(query, (err, result) => {
                                        if (err) {
                                            myReject(err);
                                        } else {
                                            myResolve(result); // pass session_id
                                        }
                                    });
                                });
                                myPromise.then(
                                    function (result) {
                                        res.status(200).json({'session_id': result[0].session_id});
                                    }
                                    
                                );
                            }, function(error) {console.log(error)}
                        );
                    }, function(error) {console.log(error)}
                );
            }, function(error) {console.log(error)}
        );
    });

    // Join Lobby
    // Create participent record from user_id and session_id
    app.post('/api/joinLobby', (req, res) => {
        let user_id = req.query.user_id;
        let session_id = req.query.session_id;
        let query = `INSERT INTO participents (user_id, session_id, player_score, answered) VALUES (${user_id}, ${session_id}, 0, 0);`
        connection.query(query, (err) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send('participent added.');
            }
        })
    });

    // Start Game
    // Create Country Set:
    // Get quiz_id, get country_id
    // Add c to c_set (q_id, c_id)
    // Update num of questions
    // Update individual guesses
    // Update max_guesses
    app.post('/api/startGame', (req, res) => {
        let session_id = req.query.session_id;
        let num_of_questions = req.query.num_of_questions;
        let countries;
        let quiz_id;
        // Country Set Creation:
        let myPromise = new Promise(function(myResolve, myReject) {
            let query =`SELECT quiz_id FROM session WHERE session_id=(${session_id});`
            connection.query(query, (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(result); // pass quiz_id to next promise
                }
            })
        });
        myPromise.then(
            function(result){
                quiz_id = result[0].quiz_id
                let myPromise = new Promise(function(myResolve, myReject) {
                    let query =`SELECT country_id FROM country ORDER BY RAND();`
                    connection.query(query, (err, result) => {
                        if (err) {
                            res.status(500).send("Failed to select all country ids");
                            myReject(err);
                        } else {
                            myResolve(result); // pass countries to next promise
                        }
                    })
                });
                myPromise.then(
                    function(result){
                        countries = result;
                        let flag = false;
                        for (let i = 0; i < num_of_questions; i++) {
                            let country_id = countries[i].country_id;
                            let query =`INSERT INTO country_set (country_id, quiz_id) VALUES ('${country_id}', ${quiz_id});`
                            connection.query(query, (err) => {
                                if (err) {
                                    res.status(500).send("Failed to create country set");
                                }
                            });
                        }
                    }, function(error){console.log(error)}
                );
            }, function(error){console.log(error)}
        );

        // Game Config:
        let max_guesses = req.query.max_guesses;
        let time_limit = req.query.time_limit;
        let query1 = `UPDATE participents SET guesses = (${max_guesses}) WHERE session_id=(${session_id});`
        connection.query(query1, (err) => {
            if (err) {
                console.log(err);
            }
        });
        let query2 = `UPDATE session SET max_guesses = (${max_guesses}), time_limit = (${time_limit}), round_ended = (0) WHERE session_id=(${session_id});`
        connection.query(query2, (err) => {
            if (err) {
                console.log(err);
            }
        });

        res.status(200).send("It worked");
    });
}