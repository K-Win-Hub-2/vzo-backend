"use strict"

const moment = require("moment-timezone")
const transfer = require("../models/transfer")

exports.listAllTransferList = async (datas) => {
    const {  fromAcc, toAcc, exact, startDate, endDate, relatedBranch  } = datas
    const query = { isDeleted: false }
    if(fromAcc) query.fromAcc = fromAcc
    if(toAcc) query.toAcc = toAcc
    if(relatedBranch) query.relatedBranch = relatedBranch
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
    const result = await transfer.find(query).populate({
        path: 'fromAcc',
        model: 'AccountingLists',
        populate: {
          path: 'relatedType',
          model: 'AccountTypes'
        }
      }).populate({
        path: 'toAcc',
        model: 'AccountingLists',
        populate: {
          path: 'relatedType',
          model: 'AccountTypes'
        }
      }).exec()
    return { data: result }
}
