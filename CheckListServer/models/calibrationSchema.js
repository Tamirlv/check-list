const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calibrationSchema = new Schema({
    experiment_id: Schema.Types.ObjectId,
    tests: [
        {
            soository_exp: Object,
            report: String,
            chosen: Boolean
        }
    ]
})

module.exports = calibrationSchema;