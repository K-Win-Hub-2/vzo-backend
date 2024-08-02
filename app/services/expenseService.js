"use strict"

const expense = require("../models/expense")
const moment = require("moment-timezone")

exports.listAllExpense = async (datas) => {
    const {  relatedAccounting, exact, startDate, endDate, relatedCredit, relatedBankAccount, relatedCashAccount, relatedBranch, createdBy  } = datas
    const query = { isDeleted: false }
    if(relatedAccounting) query.relatedAccounting = relatedAccounting
    if(relatedCredit) query.relatedCredit = relatedCredit
    if(relatedBankAccount) query.relatedBankAccount = relatedBankAccount
    if(relatedCashAccount) query.relatedCashAccount = relatedCashAccount
    if(relatedBranch) query.relatedBranch = relatedBranch
    if(createdBy) query.createdBy = createdBy
    if (startDate && endDate){
        query.date = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    } 
    if(exact) {
        query.date = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lt: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    } 
    const result = await expense.find(query).populate('relatedAccounting').populate('relatedBankAccount').populate('relatedCashAccount').exec()
    return { data: result }
}
