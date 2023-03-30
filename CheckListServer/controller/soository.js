const { SoositoryMongoService } = require('../services/soositoryMongobase')

class SoositoryController {
    constructor() {
        this.soositoryMongoBase = new SoositoryMongoService()
    }
    getExperiments(req, res) {
        this.soositoryMongoBase.getExperiments(req, res);
    }
    getSpecificExperiments(req, res) {
        this.soositoryMongoBase.getSpecificExperiments(req, res);
    }
}
module.exports = {
    soositoryController: new SoositoryController()
}