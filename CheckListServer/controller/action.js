const { MongoService } = require('../services/mongobase')

class ActionController {
    constructor() {
        this.mongoBase = new MongoService()
    }
    getActionsForExperiment(req, res) {
        this.mongoBase.getActionsForExperiment(req, res);
    }
    addOrEditAction(req, res) {
        this.mongoBase.addOrEditAction(req, res);
    }
    deleteAction(req,res) {
        this.mongoBase.deleteAction(req,res);
    }
}
module.exports = {
    actionController: new ActionController()
}