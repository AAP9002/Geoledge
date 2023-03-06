// Handling country data collection and storage on database
// /api/getallcountrydata -> call country api and update database
// /api/allcountries -> return json of all countries on database
//
// GenerateCountryDataTable -> clean and restructure api country data
// update_data_on_database -> per country, call sql stored procedure to update database

module.exports = function (app, DBconnection) {

    //get current game state
    app.get('/api/CurrentGameState', function (req, res) {
        let user = req.userID;
        let user_verified = user != undefined;

        if (!user_verified) {
            //console.log(user);
            res.status(401).send({
                auth_status: user_verified
            });
        }
        else{
            DBconnection.query("call get_Current_Game_State(?)",
            [user], function (error, results) {
                console.log(results);
                if (error) {
                    console.log(error);
                    res.status(500).status("Database Error")
                }
                else {
                    try {
                        //console.log(results);
                        res.status(200).send({
                            auth_status: user_verified,
                            status: results[1][0].game_state
                        }
                            );
                    }
                    catch {
                        res.status(500).send("Error when processing data, may be not in game or not in question state")
                    }
                }
            })
        }
    });
}