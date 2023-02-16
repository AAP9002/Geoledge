// split backend into multiple files to allow simultaneously synchroniz-
// ed streamlined work: 
// https://stackoverflow.com/questions/33946972/how-to-split-node-js-files-in-several-files/33947204#33947204
module.exports = function (app) {
    app.post('/api/createAccount', (req, res) => {
        // Getting account credentials
        let username = req.body.username;
        let password = req.body.password;
        let email = req.body.email;
        let privacy_policy = req.body.privacy_policy;
        let terms_conditions = req.body.terms_conditions;
    connection.query(`SELECT country_id FROM country ORDER BY RAND();`, (err, rows, fields) => {

        })
    //   // checking if account was successfully created
    //   if (err) {
    //     // account creation NOT successful
    //     console.log("ACCOUNT CREATED ERROR: " + err);   // printing error message to console
    //     res.json({"message":"There was an error creating the account"})  // informing client account not created
    //   } else {
    //     // account creation successful
    //     console.log('Account created');
    //     res.json({"message":"Sccount successfully created"});  // informing client account was created
    //   }
  }