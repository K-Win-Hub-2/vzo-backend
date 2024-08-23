"use strict"

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let ItemVoucherSchema = new Schema({
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    secondAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountingLists'
    },
    secondAmount: {
        type: Number,
        default: 0
    },
    isDouble: {
        type: Boolean
    },
    createdAt: {
        type: Date,
    },
    permissionDate: {
        type: Date,
        default: Date.now
    },
    refund : {
        type: Boolean,
        default: false
    },
    refundType : {
        type: String,
        enum:["CashBack","Item"],
    },
    refundDate : {
        type:Date,
        // default:Date.now
    },
    refundReason : {
        type: String,
    },
    refundAccount : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "AccountingLists"
    },
    cashBackAmount : {
        type :Number,
        default:0
    },
    newTreatmentVoucherCode : {
        type:String,   
    },
    newTreatmentVoucherId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TreatmentVouchers"
    },
    refundAmount : {
        type: Number,
        default:0
     },
    paymentMethod: {
        type: String,
        enum: ['Amount', 'Percent', 'FOC']
    },
    relatedCustomer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients'
    },
    relatedItem: [{
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Items'
        },
        price: Number,
        quantity: Number,
        discount: Number
      }],
    relatedPackage: [{
        item_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ItemPackages'
        },
        price: Number,
        quantity: Number,
        discount: Number
      }],
    code: {
        type: String
    },
    relatedBank: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountingLists'
    },
    relatedCash: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AccountingLists'
    },
    paymentType: {
        type: String,
        enum: ['Bank', 'Cash']
    },
    secondPaymentType: {
        type: String,
        enum: ['Bank', 'Cash']
    },
    seq: {
        type: Number
    },
    remark: {
        type: String
    },
    relatedBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branches'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    totalDiscount: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    balance: {
        type: Number,
        default: 0
    },
    totalPaidAmount: {
        type: Number,
        default: 0
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachments'
    },
    relatedDiscount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discounts'
    },
    discountAmount: {
        type: Number
    },
    discountType: {
        type: Number
    },
    tsType: {
        type: String,
        enum: ["Standalone", "Package", "Combine"]
    },
    repay: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Repaies'  
    }],
    relatedTransaction: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Transactions'
    }
});

module.exports = mongoose.model('ItemVouchers', ItemVoucherSchema);

//Author: Oakar Kyaw
