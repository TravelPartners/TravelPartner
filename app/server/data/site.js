'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SiteSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    keyword: [String],
    locations: [Schema.Types.ObjectId],
    events: [
        {
            title: String,
            content: String,
            url: String,
            img: String
        }
    ],
    imgs: [
        {
            title: String,
            url: String,
            desc: String
        }
    ]
});

module.exports = mongoose.model('Site', SiteSchema);
