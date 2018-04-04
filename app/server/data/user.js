'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    pwd: {    //bcrypt
        type: String,
        required: true
    },
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    desc: String,    // Description
    avatar: String,
    tags: [String],
    locations: [String],
    guides: [Schema.Types.ObjectId],
    status: {
        type: Number,
        default: 255
    },
    group: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    token : {
        s: {
            type: String,
            default: () => {
                return Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15);
            }
        },
        c: {
            type: Number,
            default: 1000
        }
    }
});

module.exports.userSchema = UserSchema;
