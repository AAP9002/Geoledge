// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204
// promise multiple sql https://medium.com/swlh/dealing-with-multiple-promises-in-javascript-41d6c21f20ff
// promise w3schools
module.exports = function (app, connection) {
    /* ==============  API DESCRIPTIONS  ==============
        1. createLobby
            - description:
                - sets up lobby on dbo.
                - host added to participents.
                - returns session_id
        2. joinLobby
            - description:
                - guest user joins via code
        3. getLobbyPlayers
            - description:
                - returns participents where session_id
        4. getSessionID
            - description:
                - returns session_id where user
        5. startGame
            - description:
                - creates country_set
                - writes game configs to dbo 
    */

    // ====================   API   =======================
    app.get('/api/checkLoggedIn', (req, res) => {
        if (req.loggedIn == "true") {
            res.status(200).send("User is logged in.")
        } else {
            res.status(401).send("Error: User is unauthorised/not logged in. Try logging in.")
        }
    });

    app.post('/api/createLobby', (req, res) => {
        let host_id = req.userID;
        let query = "call create_lobby(?)"
        connection.query(query, [host_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                console.log(((Object.entries(result[2][0])[0])[1]))
                res.status(200).send({ 
                    id: ((Object.entries(result[2][0])[0])[1])
                });
            }
        })
    });

    app.get('/api/joinLobby', (req, res) => {
        if (req.userID == null) {
            res.status(401).json({ "status": "Not logged in mate." })
        }
        else {
            let username = req.username;
            let session_id = req.query.session_id;

            // Checking to see if session is full
            let promise = new Promise(function(resolve, reject) {
                let query = "call check_if_session_is_full(?)"

                connection.query(query, [session_id], (err, result) => {
                    if (err) {
                        console.log("ERROR WHEN CHECKING IF SESSION IS FULL: " + err);
                        reject(null);
                    } else {
                        resolve(result);
                    }
                });
            });

            promise.then(
                function(result) {
                    if (result[0].length == 0) {
                        // no such sessionID exists
                        res.status(200).json({ "status": "no such sessionID exists" });
                    } else {
                        if (result[0][0].num_of_participents < result[0][0].max_participents) {
                            // the session is not full. adding client to session
                            let query = "call join_lobby(?,?)"

                            connection.query(query, [username, session_id], (err, result) => {
                                if (err) {
                                    console.log("sql broken: " + err)
                                    res.status(500).json({ "status": "error occurred on the server" });
                                } else {
                                    res.status(200).json({ "status": 'participent added' });
                                }
                            })
                        } else {
                            // the session is full
                            res.status(200).json({ "status": "session is full" });
                        }
                    }
                },

                function(reject) {
                    // SQL error when checking if session is full
                    res.status(200).json({ "status": "error occurred on the server" });
                }
            );
        }
    });

    app.get('/api/getLobbyPlayers', (req, res) => {
        let session_id = req.query.session_id;
        let query = "call get_lobby_players(?)"
        connection.query(query, [session_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                if (result[0][0] == null) {
                    res.status(500).send("lobby players is empty or doesn't exist");
                } else {
                    res.status(200).send(result);
                }
            }
        })
    });

    app.get('/api/getSessionID', (req, res) => {
        let user_id = req.userID;
        if (user_id != undefined) {
            let query = `call get_curren_session_id(?)`
            connection.query(query,[user_id], (err, result) => {
                if (err) {
                    console.log("sql broken: " + err)
                    res.status(500).send(err);
                } else {
                    console.log( result[1][0].session_id)
                    res.status(200).send( result[1][0] );
                }
            })
        } else {
            res.status(500).send("you're not logged in.");
        }
    })

    http://localhost:5000/api/SubmitGameSettings?session_id=&=107&num_of_questions=10&max_guesses=10&time_limit=6
    app.post('/api/SubmitGameSettings', (req, res) => {
        let session_id = req.query.session_id;
        let num_of_questions = req.query.num_of_questions;
        let countries;
        let quiz_id;
        let max_guesses = req.query.max_guesses;
        let time_limit = req.query.time_limit;
        console.log(time_limit)


        // Country Set Creation:
        let myPromise = new Promise(function(myResolve, myReject) {
            let query =`SELECT quiz_id FROM session WHERE session_id=${session_id};`
           // console.log(query);
            connection.query(query, (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    console.log(result);
                    myResolve(result); // pass quiz_id to next promise
                }
            })
        });
        myPromise.then(
            function (result) {
                quiz_id = result[0].quiz_id
                let myPromise = new Promise(function (myResolve, myReject) {
                    let query = `SELECT country_id FROM country ORDER BY RAND();`
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
                    function (result) {
                        countries = result;
                        for (let i = 0; i < num_of_questions; i++) {
                            let country_id = countries[i].country_id;
                            let query = `INSERT INTO country_set (country_id, quiz_id, question_no) VALUES ('${country_id}', ${quiz_id}, ${i + 1});`
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
        let query = "call game_config(?,?,?,?)"
        connection.query(query, [session_id, max_guesses, time_limit, num_of_questions], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            }
        })

        res.status(200).send("Ready to start game");
    });
}