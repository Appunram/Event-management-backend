const mongoose = require('mongoose');


const AttendanceSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
});

module.exports = mongoose.model("Attendance", AttendanceSchema)