// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204

const { query } = require("express");

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

//  Create lobby
module.exports = function(app, connection) {
    app.get('/kevin', function(req, res) {
        res.json(200, {'test': 'it works!'})
    })

    app.post('/kevin/:host_user', (req, res) => {
        let quiz_id = ""
        let session_id = ""
        // let host_user = req.body.host_user
        const { host_user } = req.params;
        console.log("name jeff");

        // SQL Processes:
        ///////////////////////////////////////////////////////////////
        // Create Lobby (empty quiz and empty session)
        // Inputs: host_id
        // Return: session_id (aka join code)
        let query = `INSERT INTO quiz (title, description, num_of_questions) VALUES ('BLANK', 'BLANK', 0);`
        let query = `SELECT LAST_INSERT_ID();` //quiz id
        let query = `INSERT INTO session (quiz_quiz_id, host_user, created_at) VALUES (${quiz_id}, ${host_user}, NOW());`
        let query = `SELECT LAST_INSERT_ID();` //session id
        ///////////////////////////
        let query = `INSERT INTO participents (user_id, session_id, player_score, answered) VALUES (${host_user}, ${session_id}, 0, 0);`
        // either keep this in, or call the joinAPI(host_user, session_id)
        ///////////////////////////////////////////////////////////////
        // Join Lobby
        // Inputs: user_id, session_id
        let query = `INSERT INTO participents (user_id, session_id, player_score, answered) VALUES (${user_id}, ${session_id}, 0, 0);`
        ///////////////////////////////////////////////////////////////
        // Start Game (create country set, write game config into dbo)
        // Inputs: session_id, num_of_questions, quiz_id (w/o F-End)
        // Return: -
        let query =`SELECT country_id FROM country ORDER BY RAND();`
        // result.country_id[i] for loop range(num_of_questions)
        let query =`INSERT INTO country_set (country_id, quiz_id) VALUES (${country_id}, ${quiz_id});`
        //
        let query = `UPDATE quiz SET num_of_questions = (${num_of_questions}) WHERE quiz_id=(${quiz_id});`
        ///////////////////////////
        // Insert Game Configs
        // Inputs: session_id, max_guesses
        // Return: -
        let query = `UPDATE participents SET guesses = (${max_guesses}) WHERE session_id=(${session_id});`
        let query = `UPDATE session SET max_guesses = (${max_guesses}), time_limit = (${time_limit}) WHERE session_id=(${session_id});`
        //////////////////////////////////////////////////////







        
        let query = `INSERT INTO quiz (title, description, num_of_questions) VALUES ('VSCODE', 'TBC', 0);`
        connection.query(query, (err) => {
            if (err) {
                console.log("Error inserting into quiz " + err);
                return;
            } else { //last insert doesn't work?!
                let query = `SELECT LAST_INSERT_ID();`
                connection.query(query, (err, rows) => {
                    if (err) {
                        console.log(err);
                    } else {
                        quiz_id = rows[0].quiz_id;
                        console.log("quiz_id: " + quiz_id);
                        let query = `INSERT INTO session (quiz_quiz_id, host_user) VALUES (${quiz_id}, ${host_user});`
                        connection.query(query, (err) => {
                            if (err) {
                                console.log("Error inserting into session");
                                return;
                            } else {
                                let query = `SELECT LAST_INSERT_ID();`
                                connection.query(query, (err, rows) => {
                                    session_id = rows[0].session_id;
                                })
                            }
                        })
                    }
                })
            }
        })
        console.log("session id: " + session_id);
        res.send({session_id: session_id});
        res.status(200);
    })

    app.post('/kevin', (req, res) => {
        let num_of_questions = req.body.num_of_questions;
        let quiz_id = req.body.quiz_id;
        let query =`SELECT country_id FROM country ORDER BY RAND();`
        connection.query(query, (rows) => {
            let country_id = ""
            for (let i = 0; i < num_of_questions; i++) {
                country_id = rows[i].country_id;
                let query =`INSERT INTO country_set (country_id, quiz_id) VALUES (${country_id}, ${quiz_id});`
                connection.query(query, (err) => {
                    if (err) {
                        console.log("ERROR IN country_set INSERT " + err);
                        return;
                    }
                })
            }
        })

        res.send({session_id: "branch2"})
    })
};
 ///////pastye
// // Create country set
// exports.start = function (app) {
//     app.post('/kevin', (req, res) => {
//         let num_of_questions = req.body.num_of_questions;
//         let quiz_id = req.body.quiz_id;
//         connection.query(`SELECT country_id FROM country ORDER BY RAND();`, (rows) => {
//             let country_id = ""
//             for (let i = 0; i < num_of_questions; i++) {
//                 country_id = rows[i].country_id;
//                 connection.query(`INSERT INTO country_set (${country_id}, ${quiz_id}) VALUES (${country_id}, ${quiz_id});`, (err) => {
//                     if (err) {
//                         console.log("ERROR IN country_set INSERT " + err);
//                         return;
//                     }
//                 })
//             }
//         })

//         res.send({session_id: session_id})
//     })
// };
