const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const maintenanceSchema = new Schema({
    experiment_id: Schema.Types.ObjectId,
    actions: [{
        country: String,
        client: String,
        incubators: [
            {
                action: String,
                last_check: Date,
                next_check: Date
            }
        ]
    }
    ]
})

module.exports = maintenanceSchema;