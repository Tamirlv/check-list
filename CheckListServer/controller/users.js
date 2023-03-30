const { userService } = require('../services/userService');
class UsersController {
    constructor() { }

    newUser(req, res) {
        userService.newUser(req.body, (err, data) => {
            if (data) console.log("New user created")
            if (err) return res.status(400).json({ mes: err })
            else return res.json(true);
        });
    }

    updateUser(req, res) {
        userService.updateUser(req.body, (err, data) => {
            if (err) res.status(400).json({ reason: 'Error in Data Base' })
            else res.json(data);
        });
    }
    getUsers(req, res) {
        userService.getUsers(req, res);
    }
}

module.exports = {
    usersController: new UsersController()
}