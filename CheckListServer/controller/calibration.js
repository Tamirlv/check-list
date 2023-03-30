const { MongoService } = require('../services/mongobase')

class CalibrationController {
    constructor() {
        this.mongoBase = new MongoService()
    }
    updateCalibration(req, res) {
        this.mongoBase.updateCalibration(req, res);
    }
}
module.exports = {
    calibrationController: new CalibrationController()
}