// Handling country data collection and storage on database
// /api/getallcountrydata -> call country api and update database
// /api/allcountries -> return json of all countries on database
//
// GenerateCountryDataTable -> clean and restructure api country data
// update_data_on_database -> per country, call sql stored procedure to update database

module.exports = function (app, DBconnection) {

    //get current game state
    app.get('/api/CurrentGameState', function (req, res) {
        

    });
}