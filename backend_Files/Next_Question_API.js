module.exports = function (app, connection) {
    /* ==============  INFORMATION ON GAME_STATE  ==============
       Game states held by game_state:
            1. "waiting for players"
            2. "starting game"
            3. "displaying question"
            4. "revealing answer"
            5. "showing current scores"
            6. "starting next question"
            7. "Showing final scores"
    */

    /*
        APIS to be created:
            1. game_state transition from "revealing answer" to "showing current scores" initiated by host - 
            2. API for client to check the current value of game_state - Alan completed
            3. API for client to get current question - N/A
            4. API for client to get the answer to the question - Alan completed
            5. API for client to get the current scores (or final scores if game has finished). 
                    initiated by user via button click - N/A 
    */

    // ==================  FUNCTIONS ======================
    function nextQuestion(res, sessionID) {
        // Changing game_state to "displaying question" and incrementing "current_question"
        let promise = new Promise(function (resolve) {
            let query = "call move_to_next_question(?)";

            connection.query(query, [sessionID], (err, result) => {
                if (err) {
                    // Error occurred during SQL query (likely server-side issue)
                    console.log("error occured when changing game state");
                    res.status(500).send("Error occured on the server");
                }

                resolve();
            });
        });

        promise.then(function (result) {
            // Waiting for question to end
            let promise2 = new Promise(function (resolve) {
                let query = `SELECT time_limit FROM geo2002.session WHERE session_id = "${ sessionID }"`;

                connection.query(query, (err, result) => {
                    if (err) {
                        console.log("ERROR: Error when getting time limit for session");
                        res.status(500).send("Error occured on the server");
                        resolve(100);
                    }
                    else {
                        resolve(result[0].time_limit);
                    }
                })
            });
    
            promise2.then( 
                function (timeLimit) {
                    setTimeout(function() { roundEnd(res, sessionID) }, timeLimit);
                }
            );
        });
    }

    function roundEnd(res, sessionID) {
        // Switching game state from "displaying question" to "revealing answer"
        let query = `UPDATE session SET game_state = "revealing answer" WHERE session_id = "${ sessionID }"`;

        connection.query(query, (err, result) => {
            if (err) {
                console.log("ERROR: Error when changing game_state from starting to displaying question");
                res.status(500).send("Error occured on the server");
            }
        })
    }
    
    // ====================   API   =======================
    app.get('/api/nextQuestion', (req, res) => {
        // This API is called to move game_state from "showing current scores" to "starting next question"
        let userID = req.userID;
        let sessionID = req.query.sessionID;
        
        // Checking if client is the host of the session
        let promise = new Promise(function(resolve, reject) {
            let query = "call validate_host_in_session(?,?)";

            connection.query(query, [userID, sessionID], (err, result) => {
                if (err) {
                    // Error occurred when performing SQL query
                    console.log("ERROR: Error occured when trying to match userId and sessionID using SQL query");
                    reject("SQL error");
                } else {
                    // Evaluating result
                    resolve(result[0][0].result);
                }
            });
        });

        promise.then(
            function(result) {
                // Evaluating result
                if (result == "1") {
                    // client is the host of the session. Now checking if the game_state is in "displaying answer"
                    let promise2 = new Promise((resolve, reject) => {
                        let query = `SELECT game_state FROM session WHERE session_id = "${ sessionID }"`;

                        connection.query(query, (err, result) => {
                            if(err) {
                                reject("Error");
                            } else {
                                resolve(result[0].game_state);  // returns the game_state of the sessionID
                            }
                        });
                    });

                    promise2.then(function(result) {
                        if (result == "showing current scores") {
                            let promise3 = new Promise(function(resolve, reject) {
                                let query2 = `UPDATE session SET game_state = "starting next question" WHERE session_id = "${ sessionID }" AND
                                    game_state = "displaying current scores"`;

                                connection.query(query2, (err, result) => {
                                    if (err) {
                                        // Error occurred when performing SQL query
                                        console.log("ERROR: Error when changing game_state from displaying current scores to starting next question");
                                        reject("SQL error");
                                    } else {
                                        // SQL query successful
                                        resolve();
                                    }
                                });
                            });
                        

                            promise3.then(function() {
                                // Game state changed from "waiting" to "starting"
                                // Starting countdown for the game to start
                                res.status(200).send("Successful");  // informing host that their API call is being handled accordingly
                                setTimeout(function() { nextQuestion(res, sessionID) }, 5000);     // 5s timer
                            },
                            function() { 
                                // Error when attempting to change the game state. Informing the client of this error
                                res.status(401).send("Session could not be started");
                            });
                        } else {
                            // game_state is not in the valid state for this API
                            res.status(401).send("Game state not in valid state");
                        }


                    }, function(reject) {
                        res.send(401).send("Server-side error");
                    });

                } else {
                    // Client is not the host of the session (or sessionID does not not exist)
                    res.status(401).send("Unauthorised request");
                }

            }, function(reject) {
                // Error occurred in SQL query (likely server-side error). Informing client of this error
                console.log("rejected");
                res.status(500).send("Error occured on the server");
            }
        );
    });

}