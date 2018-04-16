'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransportationSchema = new Schema({
  _id: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId
  },
  name: {
      type: String,
      required:true
  },
  img:[String],
  desc:String
});

module.exports = mongoose.model('Trans', TransportationSchema);
