module.exports = function (app, connection) {

    // ======================= FUNCTIONS ==========================
    function checkSessionID(sessionID) {
        let promise = new Promise(function(resolve, reject) {
            let query = "call check_session_id_exists(?)"

            connection.query(query, [sessionID], (err, result) => {
                if (err) {
                    console.log("Error when checking if sessionID exists: " + err);
                    reject(null);
                } else {
                    resolve(result);
                }
            })
        });

        return promise;
    }

    function checkClientIsParticipent(userID, sessionID) {
        let promise = new Promise(function(resolve, reject) {
            let query = "call check_participent_of_session_exists(?,?)"

            connection.query(query, [userID, sessionID], (err, result) => {
                if (err) {
                    console.log("Error when checking if client is a participent of a session: " + sessionID);
                    reject(null);
                } else {
                    resolve(result);
                }
            })
        });

        return promise;
    }

    function leaveGame(userID, sessionID) {
        let promise = new Promise(function(resolve, reject) {
            let query = "call remove_a_participent(?,?)"

            connection.query(query, [userID, sessionID], (err, result) => {
                if (err) {
                    console.log("Error when checking if client is a participent of a session: " + sessionID);
                    reject(null);
                } else {
                    resolve(null);
                }
            })
        });

        return promise;
    }



    app.get('/api/leaveSession', function (req, res) {
        if (req.loggedIn == "false") {
            // Client not logged in. This API shall not work :)
            res.status(401).send({ "status": "not logged in" });
        } else {
            // Checking that such a sessionID exists
            let sessionID = req.query.sessionID;
            let userID = req.userID;

            let promise = checkSessionID(sessionID);

            promise.then(function(result) {
                if (result[0][0].result == "1") {
                    // sessionID exists. Checking to see if client is a participent of the session
                    let promise2 = checkClientIsParticipent(userID, sessionID);

                    promise2.then(function(result) {
                        if (result[0][0].result == "1") {
                            // client is a participent of specified sessionID. Removing client from session
                            let promise3 = leaveGame(userID, sessionID)

                            promise3.then(function(result) {
                                // SUCCESSFULLY REMOVED PARTICIPENT FROM DATABASE
                                res.status(401).send({ "status": "successfully left the game" });
                            }, 
                            function(reject) {
                                // SQL error
                                res.status(401).send({ "status": "failed to leave" })
                            });

                        } else {
                            // client not a participent
                            res.status(401).send({ "status": "failed to leave" })
                        }
                    }, 
                    function(reject) {
                        // SQL error
                        res.status(401).send({ "status": "failed to leave" })
                    })

                } else {
                    // sessionID doesn't exist
                    res.status(401).send({ "status": "failed to leave" })
                }
            },
            function(reject) {
                // SQL error
                res.status(401).send({ "status": "failed to leave" })
            });
        }
    });
}