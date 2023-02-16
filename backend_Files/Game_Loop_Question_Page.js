module.exports = function (app, DBconnection) {

    app.get('/api/get_suggested_countries', (req, res) => {
        res.send(["UK","US","FRANCE"]);
    });

    app.get('/api/make_a_guess', (req, res) => {
        res.send(["UK","US","FRANCE"]);
    });

    app.get('/api/has_everyone_answered', (req, res) => {
        res.send({status:false});
    });

}