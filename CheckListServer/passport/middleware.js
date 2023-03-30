let jwt = require('jsonwebtoken');
const config = require('./config.js');
const { userService } = require('../services/userService');

let checkToken = (req, res, next) => {
    console.log(req.headers['x-access-token'])
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
    if (token) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.status(403).json({ 'error': 'Token is not valid' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({ 'error': 'Auth token is not supplied' });
    }
};

let isAdmin = (req, res, next) => {
    userService.findUser(req.decoded.username, (err, result) => {
        if (err) {
            return res.status(400).json({ 'error': 'database error' });
        }
        if (!result) {
            return res.status(400).json({ 'error': 'No User' });
        }
        if (req.decoded.permissions !== 'admin' || result.permissions !== 'admin') {
            return res.status(403).json({ 'error': 'No Permission' });
        }
        next();
    });
}

module.exports = {
    checkToken: checkToken,
    isAdmin: isAdmin
};