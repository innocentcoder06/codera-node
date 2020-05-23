/* jshint esversion: 2015 */
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    submittedBy: {
        type: String,
        required: true
    },
    submittedOn: {
        type: Number,
        default: Date.now()
    },
    submissionStatus: {
        type: String,
        enum: ['Success', 'Failed']
    },
    _challengeId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    }
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = { Submission };