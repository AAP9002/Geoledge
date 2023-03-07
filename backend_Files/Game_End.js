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
    // Next: API for moving from revleaing answers to current scores/final scores (let know game ended)    
    app.post('/api/updateStats', (req, res) => {
        let session_id = req.query.session_id;
        // let user_id = req.userID;
        let query = "call update_stats(?)"
        connection.query(query, [session_id], (err, result) => {
            if (err) {
                console.log("sql broken: " + err)
                res.status(500).send(err);
            } else {
                res.status(200).send("user stats updated");
            }
        })
    });
}