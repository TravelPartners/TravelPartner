'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
  _id: {
      type: Schema.Types.ObjectId,
      default: new mongoose.Types.ObjectId
  },
  userName: {
      type: String
      index: true
      unique: true
      required: true
  },
  votes: {
      type: Number
      required: true
      default: 0
  },
  views: {
      type:Number
      required: true
      default:0
 },
 commentBody:{
      type:String
      required:true
 },
 created_at: {
     type: Date
     required:true
     default: Date.now
 },
 keyword:{
     type:String

 },

});

module.exports = mongoose.model('Comment', CommentSchema);
