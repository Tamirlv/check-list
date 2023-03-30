const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const experimentSchema = new Schema({
    experiment_name: String,
    created_date: Date,
    experiment_start_date: Date,
    equipment_type: String,
    country: String,
    client: String,
    incubator: String,
    eggs: Number
})

module.exports = experimentSchema;