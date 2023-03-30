const mongoose = require('mongoose');
const {
    Schema
} = mongoose;
const bcrypt = require('bcrypt');

class UserService {

    constructor() {
        this.conn = mongoose.createConnection('mongodb://127.0.0.1:27017/soos-dev', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        this.Users = this.conn.model('usermodels', new Schema({
            user: String,
            clientId: String,
            first_name: String,
            last_name: String,
            email: {
                type: String,
                unique: false
            },
            phone: String,
            address: String,
            photo: String,
            password: String,
            permissions: String,
            active: Boolean
        }))
    }

    findUser(username, callback) {
        this.Users.findOne({
            user: username
        }, (err, usr) => {
            if (err) {
                console.log("error", err)
                callback(err, null);
            } else {
                // console.log("result",usr)
                callback(null, usr);
            }
        })
    }

    newUser(user, callback) {
        this.Users.find({ user: user.user }, (err, data) => {
            if (data.length > 0) {
                callback({ err: "userexist" }, null)
            } else {
                this.Users.find({ email: user.email }, (err, data) => {
                    if (data.length > 0) {
                        callback({ err: "emailexist" }, null)
                    } else {
                        this.Users.find({ phone: user.phone }, (err, data) => {
                            if (data.length > 0) {
                                callback({ err: "phoneexist" }, null)
                            } else {
                                const finalUser = new this.Users({
                                    user: user.user,
                                    clientId: user.clientId,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    phone: user.phone,
                                    address: user.address,
                                    photo: user.photo,
                                    password: bcrypt.hashSync(user.password, 10),
                                    permissions: user.permissions,
                                    active: true
                                })
                                finalUser.save((err, result) => {
                                    if (err) {
                                        // console.log(err)
                                        callback(err, null)
                                    } else {
                                        // console.log(result)
                                        callback(null, result);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    updateUser = (user, callback) => {
        this.Users.updateOne({
            'user': user.user
        }, {
            'first_name': user.first_name,
            'last_name': user.last_name,
            'permissions': user.permissions,
            'email': user.email,
            'password': bcrypt.hashSync(user.password, 10),
            'approved': true
        },
            (err, usr) => {
                if (err) {
                    console.log('error', err);
                    callback(err, null)
                } else callback(null, usr);
            }
        );
    }
    getUsers(req, res) {
        this.Users.find({}).then((data, err) => {
            if (data) {
                res.json(data);
            } else {
                res.json(err);
            }
        })
    }

}

module.exports = {
    userService: new UserService()
}