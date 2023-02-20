
module.exports = function (app, connection) {
    ////////////// VIEW ACCOUNT API Start //////////////
    app.get('/api/viewAccount', (req, res) => {
        // Checking to see if the user is logged in
        let username = req.username;

        if (username == null) {
            // Client is not logged in
            res.json({ "message":"User not logged in" });
        } else {
            // Fetching account details from SQL
            let promise = new Promise(function(res))
        }
    });







    ////////////// VIEW ACCOUNT API End //////////////
}