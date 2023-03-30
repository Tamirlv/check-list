const { MongoService } = require('../services/mongobase')

class ExperimentController {
    constructor() {
        this.mongoBase = new MongoService()
    }
    getExperiments(req, res) {
        this.mongoBase.getExperiments(req, res);
    }
    getExperiment(req, res) {
        this.mongoBase.getExperiment(req, res);
    }
    newExperiment(req, res) {
        this.mongoBase.newExperiment(req, res);
    }
    updateActions(req, res) {
        this.mongoBase.updateActions(req, res);
    }
    getExperimentTests(req, res) {
        this.mongoBase.getExperimentTests(req, res);
    }
}
module.exports = {
    experimentController: new ExperimentController()
}