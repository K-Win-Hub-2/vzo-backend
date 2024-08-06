"use strict"

const income = require("../models/income")
const moment = require("moment-timezone")

exports.listAllIncome = async (datas) => {
    const { exact, startDate, endDate, account, branch  } = datas
    const query = { isDeleted: false }
    if(account) query.relatedAccounting = account
    if(branch) query.relatedBranch = branch
    if (startDate && endDate){
        query.createdAt = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    } 
    if(exact) {
        query.createdAt = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lt: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    } 
    const result = await income.find(query).populate('account branch').exec()
    return { data: result }
}

exports.createIncome = async (datas) => {
    try{
       let result = await income.create(datas)
       return result; 
    }
    catch(err){
        console.log("Error is", err.message)
    }
}

exports.getIncomeById = async (id) => {
    try{
       let result = await income.findById(id).populate('account branch').exec()
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.updateIncome = async (id, datas) => {
    try{
       let result = await income.findByIdAndUpdate(id, datas, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

exports.deleteIncome = async (id) => {
    try{
       let result = await income.findByIdAndUpdate(id, {isDeleted: true}, { new: true }).populate('account branch').exec()
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}



