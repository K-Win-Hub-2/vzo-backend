"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

const UserShiftSchema = new Schema(
  {
    isDeleted: {
      type: Boolean,
      default: false,
    },
    relatedShift: {
      type: Schema.Types.ObjectId,
      ref: "Shifts",
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    givenName: {
      type: String,
    },
    role: {
      type: String,
    },
    email: {
      type: String,
    },
    shiftLoginTime: {
      type: Date,
    },
    shiftLogOutTime: {
      type: Date,
    },
    totalEarnedAmount: {
      type: Number,
      default: 0,
    },
    openingAmount: {
      type: Number,
      default: 0,
    },
    closingAmount: {
      type: Number,
      default: 0,
    },
    salesItemVouchers: [
      {
        type: Schema.Types.ObjectId,
        ref: "ItemVouchers",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserShifts", UserShiftSchema);
