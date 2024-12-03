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
  shiftLoginTime: {
    type: Date,
    default: () => {
      const now = new Date();
      return new Date(now.setHours(9, 0, 0, 0));
    },
  },
  shiftLogOutTime: {
    type: Date,
  },
});

module.exports = mongoose.model("Shifts", ShiftSchema);
