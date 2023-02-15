// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204
module.exports = function (app) {
    app.get('/kevin', function(req, res) {
        res.json(200, {'test': 'it works!'})
    })
}