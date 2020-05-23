/* jshint esversion: 2015 */
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    trackName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    tutorial: [{
        topic: {
            type: String,
            required: true
        },
        topicDescription: {
            type: String
        },
        content: {
            type: String,
            required: true
        },
        relatedChallenge: [{
            _id: false,
            _challengeId: {
                type: mongoose.Types.ObjectId,
                required: true
            },
            challengeName: {
                type: String,
                required: true
            },
            difficult: {
                type: String,
                enum: ['Easy', 'Medium', 'Hard']
            }
        }]
    }],
    createdBy: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        default: Date.now()
    },
    lastModified: {
        type: Number,
        default: Date.now()
    }
});

const Track = mongoose.model('Track', trackSchema);

module.exports = { Track };