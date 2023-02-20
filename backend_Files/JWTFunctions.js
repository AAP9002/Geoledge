module.exports = function () {
    const jwt = require('jsonwebtoken');

    function generateAccessToken(username, clientHash) {
            return jwt.sign({username, clientHash}, process.env.TOKEN_SECRET);
    }
}