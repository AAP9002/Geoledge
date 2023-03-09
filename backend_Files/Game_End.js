// get-scores: SELECT users.username, participents.player_score FROM geo2002.participents INNER JOIN geo2002.users ON users.user_id = participents.user_id WHERE session_id=(35) ORDER BY player_score DESC;
/*
getScores
Gets username and player score. Done by every player.

updateScores
player score += answered * (1000 - (guesses * 100))
set answered 0, set guesses max_guesses

updateUserStats
+1 to user's games played, W/L etc.
(Drops session and all related parts to prevent multiple user stat updating)

*/
module.exports = function(app, connection) {
    app.get('/api/getScores', (req, res) => {
        let session_id = req.query.session_id;
        let query = "call get_scores(?)"
        connection.query(query, [session_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send(result[0]);
            }
        })
    }); 
    

    app.post('/api/updateUserStats', (req, res) => {
        let session_id = req.query.session_id;
        let myPromise = new Promise(function(myResolve, myReject) {
            let query = `SELECT user_id FROM participents WHERE session_id = ${session_id} ORDER BY player_score DESC;`
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
                            res.status(500).send();
                        }
                    })

                    if (i == 0) { // first index has the highest score
                        let query = `UPDATE users SET wins = (wins + 1), win_rate = wins/losses WHERE user_id = ${user_id};`
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send();
                            }
                        })
                    } else {
                        let query = `UPDATE users SET losses = (losses + 1), win_rate = wins/losses WHERE user_id = ${user_id};`
                        connection.query(query, (err, result) => {
                            if (err) {
                                res.status(500).send();
                            }
                        })
                    }
                }
                res.status(200).send("User Stats Updated.");
            },
            function(error){
                console.log("sql broken: " + error)
                res.status(500).send(error);
            }
        )
    });

    app.post('/api/dropGame', (req, res) => {
        let session_id = req.query.session_id;
        let query = "call drop_game(?)"
        connection.query(query, [session_id], (err) => {
            if (err) {
                console.log("couldn't drop game: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send("game dropped");
            }
        })
    }); 
}