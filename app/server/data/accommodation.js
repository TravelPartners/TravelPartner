'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let AccommodationSchema = new Schema({
  _id: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId
  },
  name: {
      type: String,
      index: true,
      required: true
  },
  email: {
      type: String,
  },
  phone: {
      type: String,
  },
  votes: {
       type: [String],
       required: true
   }
  img:[String],
  numbers: [Number],    //price
  tags: [String],
  locations: [String]
});

module.exports = mongoose.model('Acco', AccommodationSchema);
