const mongoose = require('mongoose');
const soositoryExperimentSchema = require('../models/soositoryExperimentSchema');

class SoositoryMongoService {
    constructor() {
        this.soositoryConn = mongoose.createConnection('mongodb://localhost:27017/soos-dev', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        this.soositoryExperiments = this.soositoryConn.model('newexperimentmodels', soositoryExperimentSchema);
    }
    async getExperiments(req, res) {
        const country = req.query.country;
        const client = req.query.client;
        let date = new Date();
        date = date.setDate(date.getDate() - 200).valueOf();
        try {
            const experiments = await this.soositoryExperiments.find({ country: country, client: client });
            // const data = experiments.filter((exp) => {
            //     const expDate = new Date(exp.exp_dates.start_date).valueOf()
            //     return date < expDate;
            // })
            res.json({ code: 200, data: experiments })
        } catch (err) {
            res.json({ code: 500, error: err })
        }
    }
    async getSpecificExperiments(req, res) {
        try {
            const data = await this.soositoryExperiments.find({ name: { $regex: req.query.data }, country: req.query.country, client: req.query.client })
            res.json({ code: 200, data: data })
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
}
module.exports = {
    SoositoryMongoService: SoositoryMongoService
}