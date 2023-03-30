const express = require('express');
const router = express.Router();
const { usersController } = require('../controller/users')
const middleware = require('../passport/middleware');
const passport = require('../passport/passport');

router.post('/newuser', (req, res) => usersController.newUser(req, res));
router.get('/getusers', (req, res) => usersController.getUsers(req, res));
router.post('/updateuser', middleware.checkToken, middleware.isAdmin, (req, res) => usersController.updateUser(req, res));
router.post('/logIn', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      console.log(err, user, info)
      if (err) res.status(401).send(err);
      if (!user) res.status(401).send(info);
      else res.json(user);
    })(req, res, next);
  });
  
module.exports = router;