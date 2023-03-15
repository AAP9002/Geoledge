module.exports = function (app, connection) {
    app.get('/api/findPublicLobby', (req, res) => {
        let myPromise = new Promise(function(myResolve, myReject) {
            let query = `select session_id from session where game_state = "waiting for players"`;
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
                for (let i = 0; i < result.length; i++) {
                    let session_id = (result[i].session_id);
                    let query = `select session_id, count(*) from participents where session_id = ${session_id};`
                    connection.query(query, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(session_id);
                            console.log(result);
                        }
                    });
                  }
            }
            , function(err) {

            }
            );
    
    });
}