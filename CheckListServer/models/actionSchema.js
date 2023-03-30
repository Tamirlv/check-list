const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActionSchema = new Schema({
    action: String,
    approver: String
})

module.exports = ActionSchema;