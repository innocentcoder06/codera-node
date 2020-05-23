/* jshint esversion: 2015 */

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Codera', { useNewUrlParser: true, useFindAndModify: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log(`Connected to the MongoDB Database.`);
}).catch((err) => {
    console.log(err);
});

module.exports = { mongoose };