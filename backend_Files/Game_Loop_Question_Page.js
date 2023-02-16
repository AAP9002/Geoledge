module.exports = function (app, DBconnection) {
    app.get('/express_backend', (req, res) => {
        DBconnection.query("select * from temp", function (error, results) {
            console.log(results);
            res.send({ results });
        })
    });
}