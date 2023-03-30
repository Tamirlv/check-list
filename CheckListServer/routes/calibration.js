const express = require('express');
const {
    calibrationController
} = require('../controller/calibration');
const router = express.Router();

// Here will be the data base requests
router.put('/updateCalibration', (req, res) => { calibrationController.updateCalibration(req, res) })
module.exports = router;