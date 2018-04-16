'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GuideSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId
    },
    title: {
        type:String,
        index: true,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    tags: [String],
    content: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model('Guide', GuideSchema);
