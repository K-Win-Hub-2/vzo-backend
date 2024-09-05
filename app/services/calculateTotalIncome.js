"use strict"

const { startDateEndDateHelper } = require("../helper/dateHelper")
const accountBalance = require("../models/accountBalance")
const { listAllAccountBalance } = require("./accountBalanceService")
const { listAllExpense } = require("./expenseService")
const { listAllIncome } = require("./incomeService")
const { getAllItemVoucher } = require("./itemVoucherServices")
const { listAllTransferList } = require("./transferService")
const { voucherTotalCalculationService } = require("./voucherTotalCalculationService")
const moment = require("moment-timezone")

exports.calculateTotalIncome = async (datas) => {
    const data = { expense: 0, otherIncome: 0, transferBalance: 0 }
    //startDate endDate of filter day
    const querytodayVoucherDate = startDateEndDateHelper({exact: datas.exact, value: "add"})
    datas.startDate = querytodayVoucherDate.startDate
    datas.endDate = querytodayVoucherDate.endDate
    const todayVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    const todayAccountBalance = await accountBalance.findOne({ 
        isDeleted: false, 
        createdAt: {
            $gte: moment.tz(querytodayVoucherDate.startDate, "Asia/Yangon").startOf("day").format(),
            $lt: moment.tz(querytodayVoucherDate.endDate, "Asia/Yangon").startOf("day").format()
    }}).exec()
    const openingBalance = todayAccountBalance.openingAmount || 0
    data.openingBalance = openingBalance
    data.todayVoucherIncome = todayVoucherBalanceCalculation.data.total
    data.transferBalance = todayAccountBalance.transferAmount || 0
    data.purchaseTotal = todayVoucherBalanceCalculation.data.purchaseTotal || 0
    //reset yesterday Expese
    data.expense = 0
    //list all expense data exact date
    let todayExpense = await listAllExpense(datas)
    //if expese exists
    if(todayExpense.data.length > 0) {
        todayExpense.data.map(exp=> {
            data.expense = data.expense + exp.finalAmount
        })
    }
    //reset yester income
    data.otherIncome = 0
    //list all other income with exact date
    let todayIncome = await listAllIncome(datas)
    //if income exists
    if(todayIncome.data.length > 0) {
        todayIncome.data.map(inc=> {
            data.otherIncome = data.otherIncome + inc.amount
        })
    }
    data.profit = ( data.openingBalance + data.todayVoucherIncome ) - data.purchaseTotal
    data.netProfit = (data.openingBalance + data.todayVoucherIncome + data.otherIncome) - ( data.purchaseTotal + data.expense )
    data.closingBalance = (data.openingBalance + data.todayVoucherIncome + data.otherIncome) - ( data.expense + data.transferBalance )
    return {
        data: data
    }
}

exports.totalTopTenList = async (datas) => {
    // const { relatedItem, relatedPackage, startDate, endDate } = datas 
    // const query = {}
    // const data = []
    // if (relatedPackage) query.relatedPackage = relatedPackage
    // if (relatedItem) query.relatedItem = relatedItem
    // if (startDate && endDate) {
    //     query.startDate = startDate
    //     query.endDate = endDate 
    // }
    // // if(relatedItem) query.relatedItem = 
    // const result = await getAllItemVoucher(query)
    // result.data.map((voucher)=>{
    //     if(relatedItem){
    //        voucher.relatedItem.map((item) =>{
                
    //        })
    //     }
    // })
    // return {
    //     data: unSortedObject
    // }
}