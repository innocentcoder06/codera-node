/* jshint esversion: 2015 */
const mongoose = require('mongoose');


const challengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: 'your description goes here'
    },
    difficult: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Easy'
    },
    badge: {
        type: Number,
        enum: [10, 20, 30],
        default: 10
    },
    problemStatement: {
        type: String,
        required: true
    },
    inputFormat: {
        type: String,
        required: true
    },
    outputFormat: {

        type: String,
        required: true
    },
    constraints: {
        type: String,
        required: true
    },
    testCase: [{
        sample: {
            type: Boolean,
            default: false
        },
        explanation: {
            type: String,
            default: 'your explanation'
        },
        stdIn: {
            type: String,
            required: true
        },
        stdOut: {
            type: String,
            required: true
        }
    }],
    tags: [{
        type: String,
        default: null
    }],
    createdBy: {
        type: String,
        required: true
    },
    createdOn: {
        type: Number,
        required: true,
        default: Date.now()
    },
    comments: [{
        comment: {
            type: String,
            required: true
        },
        commentedBy: {
            type: String,
            required: true
        },
        commentedOn: {
            type: Number,
            default: Date.now()
        },
        reply: [{
            replyComment: {
                type: String,
                required: true
            },
            repliedBy: {
                type: String,
                required: true
            },
            repliedOn: {
                type: Number,
                default: Date.now()
            }
        }]
    }]
});

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = { Challenge };