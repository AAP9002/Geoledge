module.exports = function(app, connection) {
    function updateWins(sessionID, res) {
        let myPromise = new Promise(function(myResolve, myReject) {
            let query = `SELECT user_id FROM participents WHERE session_id = ${sessionID} ORDER BY player_score DESC;`
            connection.query(query, (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(result);
                }
            })
        });

        myPromise.then(
            function(result){
                for (let i = 0; i < result.length; i++) {
                    let user_id = result[i].user_id;
                    let query = `UPDATE users SET games_played = (games_played + 1) WHERE user_id = ${user_id};`
                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log("You do not want this to show bc this error breaks the system.")
                            res.status(500).send("server error");
                        }
                    })

                    if (i == 0) { // first index has the highest score
                        let query = `UPDATE users SET wins = (wins + 1), win_rate = wins/losses WHERE user_id = ${user_id};`
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send("server error");
                            }
                        })
                    } else {
                        let query = `UPDATE users SET losses = (losses + 1), win_rate = wins/losses WHERE user_id = ${user_id};`
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send("server error");
                            }
                        })
                    }
                }
                res.status(200).send("Final Scores - User Stats Updated.");
            },
            function(error){
                console.log("sql broken: " + error)
                res.status(500).send(error);
            }
        )
    }
    
    // API to decide what happens after "revealing answer" -> show current|final scores 
    function changeScoreState(sessionID, res) {
        let myPromise = new Promise(function(myResolve, myReject) {
            let query = `SELECT if(session.current_question = quiz.num_of_questions, 1, 0) AS value FROM session INNER JOIN quiz ON session.quiz_id = quiz.quiz_id where session_id = ${sessionID};`
            connection.query(query, (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(result)
                }
            });
        });

        myPromise.then(
            function(result) {
                let wasfinalQ = (result[0].value);
                let state = wasfinalQ ? "final" : "current"
                let query = `update session set game_state = "showing ${state} scores" where session_id = ${sessionID}`;
                connection.query(query, (err) => {
                    if (err) {
                        res.status(500).send("sql broken");
                    }
                });
                if (state == "final") {
                    updateWins(sessionID, res);
                }
            },
            function(err) {
                console.log(err);
                res.status(500).send("sql broken");
            }
        );
    }
    app.get('/api/scoreState', (req, res) => {
        let sessionID = req.query.sessionID;
        let userID = req.userID;
        let msg = "revealing answer"
        let myPromise = new Promise(function(myResolve, myReject) {
            // checks if the call is made by the host, and sees whether current game state
            // is revealing answer 
            let query = `call host_check_game_state(?,?,?)`;
            connection.query(query, [sessionID, userID, msg], (err, result) => {
                if (err) {
                    myReject(err);
                } else {
                    myResolve(result);
                }
            });         
        });

        myPromise.then(
            function(result) {
                let match = result[0][0].result;
                if (match == 1) {
                    changeScoreState(sessionID, res);
                } else {
                    res.status(401).send("Error: Not host, or game not is in revealing answers state.");
                }
            }
            ,function(error) {
                console.log("Problem getting game state.")
                res.status(500).send(error);
            }
        );
    });
}