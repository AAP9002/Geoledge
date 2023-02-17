// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204

const { query } = require("express");

// Host creating a new session:
// host api
// Create session with empty quiz
// wait for playuers to join
// add host and other participewnts to part tgable
// start api
// get quiz_id
// Get the country list in a random order
// Create a country set of specified length by inserting a record of-
// country_id, quiz_id
// Create session, add participent

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
