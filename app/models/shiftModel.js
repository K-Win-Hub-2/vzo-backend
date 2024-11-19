"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

const ShiftSchema = new Schema({
  isDeleted: {
    type: Boolean,
    default: false,
  },
  shiftName: {
    type: String,
  },
  relatedUser: {
    type: Boolean,
    ref: "Users",
  },
  shiftLoginTime: {
    type: Date,
  },
  shiftLogOutTime: {
    type: Date,
  },
});

module.exports = mongoose.model("Shifts", ShiftSchema);
