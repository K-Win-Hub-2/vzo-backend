"use strict";

const mongoose = require("mongoose");
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let CustomerSchema = new Schema({
    name:{
        type: String,
    },
    email:{
        type: String | Number,
    },
    phone:{
        type: Number,
    },
});

module.exports = mongoose.model("Customers", CustomerSchema);

//Author: Kyaw Zaw Lwin
