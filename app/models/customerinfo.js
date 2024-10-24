"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  customerID: {
    type: String,
  },
  seq: {
    type: Number,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Customers", CustomerSchema);

//Author: Kyaw Zaw Lwin
