const express = require('express');
const {
    experimentController
} = require('../controller/experiment');
const router = express.Router();

// Here will be the data base requests
router.get('/getExperiments', (req, res) => experimentController.getExperiments(req, res));
router.get('/getExperiment', (req, res) => experimentController.getExperiment(req, res));
router.post('/newExperiment', (req, res) => experimentController.newExperiment(req, res));
router.put('/updateActions', (req, res) => experimentController.updateActions(req, res));
router.get('/getExperimentTests', (req, res) => experimentController.getExperimentTests(req, res));
module.exports = router;