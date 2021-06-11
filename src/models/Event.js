const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    sponsors: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
    },
    registrationenddate: {
        type: Date,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true
    },
    thumbnail_id: {
        type: String,
        required: true
    },
}, {
    toJSON: {
        virtuals: true
    }
});


module.exports = mongoose.model('Event', EventSchema)
