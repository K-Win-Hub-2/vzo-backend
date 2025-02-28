"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require("validator");

let AccountBalance = new Schema(
  {
    relatedAccounting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AccountingLists",
    },
    openingAmount: {
      type: Number,
    },
    closingAmount: {
      type: Number,
    },
    createdAt: {
      type: Date,
    },
    remark: {
      type: String,
    },
    transferAmount: {
      type: Number,
      default: 0,
    },
    relatedBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccountBalances", AccountBalance);

//Author: Kyaw Zaw Lwin
