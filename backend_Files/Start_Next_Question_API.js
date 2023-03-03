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


    // ==================  FUNCTIONS ======================
    function nextQuestion(sessionID) {
        // Changing game_state to "displaying question" and incrementing "current_question"
        let query = "call move_to_next_question(sessionID)";

        connection.query(query, [sessionID], (err, result) => {
            if (err) {
                // Error occurred during SQL query (likely server-side issue)
                res.status(500).send("Error occured on the server");
            }
        })
    }
    

    // ====================   API   =======================
    app.get('/api/startNextQuestion', (req, res) => {
        // This API is called to move game_state from "showing current scores" to "starting next question"
        let userID = req.userID;
        let sessionID = req.sessionID;
        
        // Checking if client is the host of the session
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
                // Evaluating result
                if (result == "1") {
                    // client is the host of the session hence starting next question
                    let promise2 = new Promise(function(resolve, reject) {
                        let query2 = `UPDATE session SET game_state = "starting next question" WHERE session_id = ${ sessionID } AND
                            game_state = "displaying current scores`;

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

                    promise2.then(function() {
                        // Game state changed from "waiting" to "starting"
                        // Starting countdown for the game to start
                        setTimeout(nextQuestion(sessionID), 5000);     // 5s timer
                    },
                    function() { 
                        // Error when attempting to change the game state. Informing the client of this error
                        res.status(401).send("Session could not be started");
                    });
                } else {
                    // Client is not the host of the session (or sessionID does not not exist)
                    res.status(401).send("Unauthorised request");
                }

            }, function(reject) {
                // Error occurred in SQL query (likely server-side error). Informing client of this error
                res.status(500).send("Error occured on the server");
            }
        );
    });

}