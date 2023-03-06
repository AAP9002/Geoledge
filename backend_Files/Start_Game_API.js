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


    // =================   FUNCTIONS   ====================
    function startGame(sessionID) {
        // Function that starts the game for the given session
        let promise = new Promise(function (resolve) {
            let query = `UPDATE session SET game_state = "displaying question" WHERE session_id = ${ sessionID }`;
            
            connection.query(query, (err, result) => {
                if (err) {
                    console.log("ERROR: Error when changing game_state from 'starting' to 'displaying question'");
                    res.status(500).send("Error occured on the server");
                }

                resolve();
            })
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
                    setTimeout(roundEnd(),timeLimit);
                }
            );
        });
    }

    function roundEnd() {
         // Switching game state from "displaying question" to "revealing answer"
         let query = `UPDATE session SET game_state = "revealing answer" WHERE session_id = ${ sessionID }`;

         connection.query(query, (err, result) => {
             if (err) {
                 console.log("ERROR: Error when changing game_state from starting to displaying question");
                 res.status(500).send("Error occured on the server");
             }

             resolve();
         })
    }


    // ====================   API   =======================
    app.get('/api/startGame', (req, res) => {
        console.log("creating account");
        // Getting userID of host
        let userID = req.userID
        let sessionID = req.query.sessionID;
        
        // 1. SQL query to check if client is the host of the session
        // 2. If yes, update game_state, and then start countdown


        // Checking if client is the host of the lobby
        let query = "call validate_host_in_session(?,?)"
        let promise = new Promise(function(resolve, reject) {
            connection.query(query, [userID, sessionID], (err, result) => {
                if (err) {
                    // Error occurred when performing SQL query
                    console.log("ERROR: Error occured when trying to match userId and sessionID using SQL query");
                    reject("SQL error");
                } else {
                    // Evaluating result
                    resolve(result[0].result);
                }
            });
        });

        promise.then(
            function(result) {
                // Evaluating result found

                if(result == 1) {
                    // Client is found to be the host of the session
                    // Changing the game_state

                    let promise2 = new Promise(function(resolve, reject) {
                        let query2 = `UPDATE session SET game_state = "starting game" WHERE session_id = ${ sessionID }`;

                        connection.query(query2, (err, result) => {
                            if (err) {
                                // Error occurred when performing SQL query
                                console.log("ERROR: Error when changing game_state from waiting to starting");
                                reject("SQL error");
                            } else {
                                // SQL query successful
                                resolve();
                            }
                        });
                    });

                    promise2.then(function() {
                        // Game state changed from "waiting" to "starting"
                        // Starting countdown for the game to start
                        setTimeout(startGame(sessionID), 5000);     // 5s timer
                    },
                    function() { 
                        // Error when attempting to change the game state. Informing the client of this error
                        res.status(401).send("Session could not be started");
                    });


                } else {
                    // Client is not the host of the session (or sessionID does not not exist)
                    res.status(401).send("Unauthorised request");
                }

            },
            function(error) {
                // Error occurred in SQL query (likely server-side error). Informing client of this error
                res.status(500).send("Error occured on the server");
            }
        )



    });

}