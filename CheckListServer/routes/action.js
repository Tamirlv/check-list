const express = require('express');
const {
    actionController
} = require('../controller/action');
const router = express.Router();

// Here will be the data base requests
router.get('/', (req, res) => { actionController.getActionsForExperiment(req, res) })
router.put('/addOrEdit', (req, res) => { actionController.addOrEditAction(req, res) })
router.delete('/delete', (req, res) => { actionController.deleteAction(req, res) })
module.exports = router;