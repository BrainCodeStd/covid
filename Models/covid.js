const mongoose = require('mongoose');
const covid = mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
    },
    cases: {
        type: Number,
        required: true,
    },
    deaths: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true
});
module.exports = mongoose.model('Covid', covid);
