'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Define Food data structure
let FoodSchema = new Schema({
//    _id: {
//        type: Schema.Types.ObjectId,
//        default: new mongoose.Types.ObjectId
//    },
    image: {
        type: [String],
        required: true
    },
    name:{
        type: String,
        required: true,
        index: true
    },
    descript: {
        type: String,
        required: true
    },
    tags:{
    	type:[String],
    	required: true

    },
    restaurant: {
    	isRes: Boolean,
    	location: String,
    	email: String,
    	phone: String
    }
    
});

module.exports = mongoose.model('Food', FoodSchema);
