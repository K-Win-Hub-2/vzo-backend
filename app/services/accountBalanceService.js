"use strict"

const AccountBalance = require("../models/accountBalance") 
const moment = require("moment-timezone")

exports.listAllAccountBalance = async (datas) => {
    let { exact, startDate, endDate, relatedBranch, relatedAccounting } = datas
    let query = { isDeleted: false, type: "Closing" }
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    if (relatedBranch) query.relatedBranch = relatedBranch
    if (relatedAccounting) query.relatedAccounting = relatedAccounting
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
    const accountBalances = await AccountBalance.find(query).populate('relatedAccounting')
    return {
        data: accountBalances
    }
}