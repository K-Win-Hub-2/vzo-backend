'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;


let IncomeSchema = new Schema({
    createdAt: {
        type: Date,
    },
    name: {
        type: String,
        required: true
    },
    account: {
        type: mongoose.Types.ObjectId,
        ref: "AccountingLists"
    },
    branch: {
        type: mongoose.Types.ObjectId,
        ref: "Branches"
    },
    amount: {
        type: Number
    },
    reason: {
        type: String
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
});

module.exports = mongoose.model('Incomes', IncomeSchema);

//Author: Kyaw Zaw Lwin
