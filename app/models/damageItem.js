'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;
const validator = require('validator');
let DamageItem = new Schema({
  name:{
    type:String,
  },
  damageDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  damageTotalUnit: {
    type: Number
  },
  damageCurrentQty: {
    type: Number
  },
  remark: {
    type: String
  },
  relatedAccessoryItem: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "AccessoryItems"
  },
  relatedMedicineItem: {
     type: mongoose.Schema.Types.ObjectId,
     ref: "MedicineItems"
  },
  relatedProcedureItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProcedureItems"
 }
});

module.exports = mongoose.model('DamageItems', DamageItem);

//Author: Kyaw Zaw Lwin
