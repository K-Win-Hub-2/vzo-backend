'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let DebtSchema = new Schema({
    relatedPatient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patients'
    },
    relatedItemVoucher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemVouchers'
    },
    date: {
        type: Date
    },
    balance: {
        type: Number
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Debts', DebtSchema);

//Author: Kyaw Zaw Lwin
