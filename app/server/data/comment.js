'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
    
});

module.exports = mongoose.model('Comment', CommentSchema);
