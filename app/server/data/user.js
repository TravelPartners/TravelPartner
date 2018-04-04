'use strict'

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const saltRounds = 10;

let UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId
    },
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

UserSchema.pre('save', async function (next) {
    if (this.isModified('pwd')) {
        let self = this;

        await bcrypt.hash(this.pwd, saltRounds).then((hash) => {
            self.pwd = hash;
            next();
        }, (err) => {
            next(err);
        });
    } else {
        next();
    }
});

//let f = async function(pwd) { return await bcrypt.compare(pwd, this.pwd); };

module.exports = mongoose.model('User', UserSchema);
