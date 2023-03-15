
module.exports = function(app, connection) {

    app.get('/api/joinOnlineGame', (req, res) => {
        // Checking to see if client is logged in
        if (req.loggedIn == "false") {
            res.status(401).send({ "status": "Client not logged in" });
        } else {
            // Searching for a lobby with space
            let promise = new Promise(function(resolve) {
                let query = `call get_sessions_not_full()`;
                
                connection.query(query, [], (err, result) => {
                    if (err) {
                        console.log("ERROR WHEN FINDING SESSIONS THAT ARE NOT EMPTY");
                        resolve(null);
                    } else {
                        resolve(result);
                    }
                })
            });

            promise.then(
                function(result) {
                    if (result == null) {
                        // error occurred on the server (SQL error)
                        res.status(200).send({ "status": "error occurred on the server" });
                    } else {
                        // evaluating whether there is an avaiable lobby in the results returned
                        if (result.length[0] == 0) {
                            // no avaiable sessions for client to join
                            res.status(200).send({ "status": "no avaiable sessions" });
                        } else {
                            // taking the first available session and returning the sessionID of that session to the client
                            console.log(result);
                            res.status(200).send({ "status": "sessionID found", "sessionID": result[0][0].session_id })
                        }
                    }
                }
            );
        }
    });
}