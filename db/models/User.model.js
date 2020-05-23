/* jshint esversion: 2015 */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }],
    badges:[{
        _id: false,
        language: {
            type: String
        },
        badge: {
            type: Number,
            default: 0
        }
    }],
    currentLearnTrackId: {
        type: String,
        default: null
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };