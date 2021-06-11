const mongoose = require('mongoose');


const MarksSchema = new mongoose.Schema({
    marks: {
        type: Number,
        default: 0,
    },
    user:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
});

module.exports = mongoose.model("Marks", MarksSchema)