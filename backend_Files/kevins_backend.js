// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204
// promise multiple sql https://medium.com/swlh/dealing-with-multiple-promises-in-javascript-41d6c21f20ff
// promise w3schools
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
http://localhost:3000/api/login?username=Alan123456&password=alan123456

        */
module.exports = function(app, connection) {
    // Create Lobby
    // Create empty quiz and select quiz id
    // Create empty session and select session id
    // Return session_id to front end (not needed anymore but just leave it in bc why not)
    // Remember to add host to the lobby in a separate api
    app.post('/api/createLobby', (req, res) => {
        let host_id = req.userID;
        let query = "call create_lobby(?)"
        connection.query(query, [host_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send(result[1][0]);
            }
        })
    });

    // Join Lobby
    // Create participent record from user_id and session_id
    // Front-end gets session_id from getCode api
    app.post('/api/joinLobby', (req, res) => {
        let username = req.username;
        let session_id = req.query.session_id;
        let query = "call join_lobby(?,?)"
        connection.query(query, [username, session_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send('participent added.');
            }
        })
    });

    // WHAT DO I NEED TO DO NEXT?
    // Procedurilize start game
    // COUNTDOWN!

    // Get Lobby Players
    // Get user_ids from participents via session_id
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

    // Get Game Code (Session ID)
    // Return session id where user is user.
    app.get('/api/getCode', (req, res) => {
    //     let user_id = req.user_id;
    //     if (user_id) {
    //         let query = `SELECT session_id FROM participents WHERE user_id = ${user_id};`
    //         connection.query(query, (err, result) => {
    //             if (err) {
    //                 console.log("sql broken: " + err)
    //                 res.status(500).send(err);
    //             } else {
    //                 let session_code = result[0].session_id;
    //                 res.status(200).send({session_code});
    //             }
    //         })
    //     } else {
    //         res.status(500).send("you're not logged in.");
    //     }
    })
    // // Start Game
    // // Create Country Set:
    // // Get quiz_id, get country_id
    // // Add c to c_set (q_id, c_id)
    // // Update num of questions
    // // Update individual guesses
    // // Update max_guesses
    app.post('/api/startGame', (req, res) => {
        let session_id = req.query.session_id;
        let num_of_questions = req.query.num_of_questions;
        let countries;
        let quiz_id;
        // Country Set Creation:
        let myPromise = new Promise(function(myResolve, myReject) {
            let query =`SELECT quiz_id FROM session WHERE session_id=${session_id};`
            console.log(query);
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
                        for (let i = 0; i < num_of_questions; i++) {
                            let country_id = countries[i].country_id;
                            let query =`INSERT INTO country_set (country_id, quiz_id, question_no) VALUES ('${country_id}', ${quiz_id}, ${i+1});`
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
        let query = "call game_config(?,?,?)"
        connection.query(query, [session_id, max_guesses, time_limit], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send('game configs set');
            }
        })

        res.status(200).send("It worked");
    });
}