/* jshint esversion: 2015 */
const mongoose = require('mongoose');


const mentorSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    mentorFor: {
        type: String,
        required: true
    },
    activeLearners: [{
        _id: false,
        _learnerId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        learnerUName: {
            type: String,
            required: true
        }
    }],
    learnerRequests: [{
        _id: false,
        _learnerId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
        learnerUName: {
            type: String,
            required: true
        }
    }],
    acceptRequests: {
        type: Boolean,
        default: true
    }
});

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = { Mentor };