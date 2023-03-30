const express = require('express');
const {
    soositoryController
} = require('../controller/soository');
const router = express.Router();

// Here will be the data base requests
router.get('/getExperiments', (req, res) => soositoryController.getExperiments(req, res))
router.get('/getSpecificExperiments', (req, res) => soositoryController.getSpecificExperiments(req, res))
module.exports = router;