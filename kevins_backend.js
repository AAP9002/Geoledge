// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204

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

// connection.query(`INSERT INTO quiz (title, description, num_of_questions) VALUES ("TBC", "TBC", ${num_of_questions});`, (err) => {
//     if (err) {
//         console.log("ERROR IN QUIZ INSERT " + err);
//         return;
//     } else {
//         connection.query(`SELECT LAST_INSERT_ID();`, () => {
//             quiz_id = rows[0].quiz_id;
//         })

//  Create lobby
exports.host = function(app) {
    app.post('/kevin', (req, res) => {
        let quiz_id = ""
        let session_id = ""
        let host_user = req.body.host_user
        connection.query(`INSERT INTO quiz (title, description, num_of_questions) VALUES ("TBC", "TBC", 0);`, (err) => {
            if (err) {
                console.log("Error inserting into quiz");
                return;
            } else {
                connection.query(`SELECT LAST_INSERT_ID();`, (rows) => {
                    quiz_id = rows[0].quiz_id;
                })

                connection.query(`INSERT INTO session (quiz_quiz_id, host_user) VALUES (${quiz_id}, ${host_user});`, (err) => {
                    if (err) {
                        console.log("Error inserting into quiz");
                        return;
                    } else {
                        connection.query(`SELECT LAST_INSERT_ID();`, (rows) => {
                            session_id = rows[0].session_id;
                        })
                    }
                })
            }
        })

        res.send({session_id: session_id})
    })
};

// Create country set
exports.start = function (app) {
    app.post('/kevin', (req, res) => {
        let num_of_questions = req.body.num_of_questions;
        let quiz_id = req.body.quiz_id;
        connection.query(`SELECT country_id FROM country ORDER BY RAND();`, (rows) => {
            let country_id = ""
            for (let i = 0; i < num_of_questions; i++) {
                country_id = rows[i].country_id;
                connection.query(`INSERT INTO country_set (${country_id}, ${quiz_id}) VALUES (${country_id}, ${quiz_id});`, (err) => {
                    if (err) {
                        console.log("ERROR IN country_set INSERT " + err);
                        return;
                    }
                })
            }
        })

        res.send({session_id: session_id})
    })
};
