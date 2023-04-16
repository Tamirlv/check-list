const mongoose = require('mongoose');
const actionSchema = require('../models/actionSchema');
const calibrationSchema = require('../models/calibrationSchema');
const checklistSchema = require('../models/checklistScehma');
const experimentSchema = require('../models/experimentSchema');

class MongoService {
    constructor() {
        this.conn = mongoose.createConnection('mongodb://localhost:27017/soos-exp-management', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        this.soositoryConn = mongoose.createConnection('mongodb://localhost:27017/soos-dev', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        this.actions = this.conn.model('actionmodels', actionSchema);
        this.checklist = this.conn.model('checklistmodels', checklistSchema);
        this.experiments = this.conn.model('experimentmodels', experimentSchema);
        this.calibration = this.conn.model('calibrationmodels', calibrationSchema)
    }

    async getExperiments(req, res) {
        try {
            const experiments = await this.experiments.find({})
            res.json(experiments)
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
    async getExperiment(req, res) {
        try {
            const experiment = await this.experiments.findOne({ _id: req.query.id });
            res.json(experiment);
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
    async getActionsForExperiment(req, res) {
        if (req.query.id) {
            try {
                const experimentActions = await this.checklist.find({ experiment_id: req.query.id });
                res.json(experimentActions);
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        } else {
            try {
                const allActions = await this.actions.find({});
                res.json(allActions);
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        }

    }

    async addOrEditAction(req, res) {
        const data = req.body.params.updates[0].value
        const checkAction = await this.actions.find({ action: data.action });
        if (checkAction.length == 0) {
            const newAction = new this.actions({
                action: data.action,
                approver: data.approver
            })
            try {
                if (data.id) {
                    const update = await this.actions.findOneAndUpdate({ _id: data.id }, {
                        $set: {
                            action: data.action,
                            approver: data.approver
                        }
                    })
                    res.json(update);
                } else {
                    const ans = await newAction.save()
                    res.json(ans);

                }
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        } else {
            res.json({ code: 500, error: "Action already exist" });
        }
    }

    async deleteAction(req, res) {
        const id = req.query.id;
        try {
            const ans = await this.actions.deleteOne({ _id: id })
            res.json(ans);
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
    async newExperiment(req, res) {
        const exp = req.body.exp;
        const expName = exp.experiment_name;
        const checkName = await this.experiments.find({ experiment_name: expName });
        if (checkName.length === 0) {
            exp['created_date'] = new Date();
            const newExperiment = new this.experiments({
                experiment_name: exp.experiment_name,
                experiment_start_date: exp.experiment_predicted_date,
                created_date: new Date(),
                equipment_type: exp.equipment_type,
                eggs: exp.eggs,
                country: exp.country,
                client: exp.client,
                incubator: exp.incubator
            })
            try {
                const ans = await newExperiment.save();
                const experiment = await this.experiments.find({ experiment_name: exp.experiment_name })
                const id = experiment[0]._id;
                await this.createExperimentActions(id);
                const newCalibration = new this.calibration({
                    experiment_id: mongoose.Types.ObjectId(id),
                    tests: []
                });
                const ans1 = await newCalibration.save();
                res.json(id);
            } catch (err) {
                res.json({ code: 500, error: err });
            }
        } else {
            res.json({ code: 500, error: "This name already used" })
        }
    }
    async createExperimentActions(id) {
        const allAction = await this.actions.find({});
        let arr = [];
        allAction.forEach(element => {
            let obj = {
                activity: element,
                comment: "",
                checked: false,
                date_checked: new Date(),
                checked_by: ""
            }
            arr.push(obj);
        });
        const newExperimentActions = await new this.checklist({
            experiment_id: mongoose.Types.ObjectId(id),
            actions: arr
        })
        try {
            const ans = await newExperimentActions.save();
            return id;
        } catch (err) {
            return err;
        }
    }
    async updateActions(req, res) {
        const id = req.body.experiment_id;
        console.log(req.body.actions)
        try {
            const experiment = await this.checklist.findOneAndUpdate({ experiment_id: mongoose.Types.ObjectId(id) }, { $set: { actions: req.body.actions } });
            res.json(experiment);
            // res.json('tamir');
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
    async getExperimentTests(req, res) {
        try {
            const id = req.query.id;
            const tests = await this.calibration.findOne({ experiment_id: mongoose.Types.ObjectId(id) });
            res.json(tests.tests);
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }
    async updateCalibration(req, res) {
        const id = req.body.experiment_id;
        const tests = req.body.calibrations;
        try {
            const ans = await this.calibration.findOneAndUpdate({ experiment_id: mongoose.Types.ObjectId(id) }, { $set: { tests } })
            res.json(ans);
        } catch (err) {
            res.json({ code: 500, error: err });
        }
    }

}
module.exports = {
    MongoService: MongoService
}