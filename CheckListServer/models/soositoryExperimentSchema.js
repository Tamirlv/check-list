const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soositoryExperimentSchema = new Schema({
    type: String,
    name: String,
    shortName: String,
    duration: String,
    goal: String,
    conclusion: String,
    comments: [{
        timestamp: String,
        msg: String,
        user: String
    }],
    exp_dates: {
        start_date: String,
        end_date: String
    },
    staff: {
        expMgr: String,
        techMgr: String,
        incubatorOperator: String,
        scienMgr: String,
        profiler: String
    },
    country: String,
    client: String,
    currentStage: Number,
    rolls: Array,
    incubators: {
        smart: String,
        control: String
    },
    files: Array,
    continuesTestExperiment: String,
    experimentProfile: String
});

module.exports = soositoryExperimentSchema;