const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checklistSchema = new Schema({
    experiment_id: Schema.Types.ObjectId,
    actions: [{
        activity: Object,
        comment: String,
        checked: Boolean,
        date_checked: Date,
        checked_by: String
    }
    ]
})

module.exports = checklistSchema;