/* jshint esversion: 2015 */
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    postBy: {
        type: String,
        required: true
    },
    postedOn: {
        type: Number,
        default: Date.now()
    },
    tags: [{
        type: String,
        default: null
    }],
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

const Post = mongoose.model('Post', postSchema);

module.exports = { Post };