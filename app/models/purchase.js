"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let PurchaseSchema = new Schema(
  {
    confirmPurchase: {
      type: Boolean,
      default: false,
    },
    purchaseDate: {
      type: Date,
    },
    supplierName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suppliers",
    },
    remark: {
      type: String,
    },
    items: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Items",
        },
        qty: Number,
        price: Number,
        subTotal: Number,
      },
    ],
    medicineItems: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MedicineItems",
        },
        qty: Number,
        price: Number,
        subTotal: Number,
      },
    ],
    procedureItems: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProcedureItems",
        },
        qty: Number,
        price: Number,
        subTotal: Number,
      },
    ],
    accessoryItems: [
      {
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AccessoryItems",
        },
        qty: Number,
        price: Number,
        subTotal: Number,
      },
    ],
    totalQTY: {
      type: Number,
    },
    totalPrice: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    purchaseType: {
      type: String,
      enum: ["Cash Down", "Credit"],
    },
    creditAmount: {
      type: Number,
    },
    relatedBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branches",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchases", PurchaseSchema);

//Author: Kyaw Zaw Lwin
