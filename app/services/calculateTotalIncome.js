"use strict"

const { startDateEndDateHelper } = require("../helper/dateHelper")
const { listAllAccountBalance } = require("./accountBalanceService")
const { listAllExpense } = require("./expenseService")
const { listAllIncome } = require("./incomeService")
const { listAllTransferList } = require("./transferService")
const { voucherTotalCalculationService } = require("./voucherTotalCalculationService")

exports.calculateTotalIncome = async (datas) => {
    let yesterdayTransfer = 0
    const data = { expense: 0, otherIncome: 0, transferBalance: 0 }
    const queryDate = startDateEndDateHelper({exact: datas.exact, value: "substract"})  
    datas.startDate = queryDate.startDate
    datas.endDate = queryDate.endDate
    const yesterdayTransferBalance = await listAllTransferList(datas)
    let yesterdayExpense = await listAllExpense(datas)
    //if expese exists
    if(yesterdayExpense.data.length > 0) {
        yesterdayExpense.data.map(exp=> {
            data.expense = data.expense + exp.finalAmount
        })
    }
    //list all other income with exact date
    let yesterdayIncome = await listAllIncome(datas)
    //if income exists
    if(yesterdayIncome.data.length > 0) {
        yesterdayIncome.data.map(inc=> {
            data.otherIncome = data.otherIncome + inc.amount
        })
    }
    //transfer balance calculation
    if(yesterdayTransferBalance.data.length > 0) {
        yesterdayTransfer = yesterdayTransferBalance.data[yesterdayTransferBalance.data.length - 1].amount  
    }
    const openingVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    const balance = await listAllAccountBalance(datas)
    //end of yesterday
    //startDate endDate of filter day
    const querytodayVoucherDate = startDateEndDateHelper({exact: datas.exact, value: "add"})
    datas.startDate = querytodayVoucherDate.startDate
    datas.endDate = querytodayVoucherDate.endDate
    const todayVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    const todayTransferBalance = await listAllTransferList(datas)
    //transfer balance calculation
    if(todayTransferBalance.data.length > 0) {
      data.transferBalance = data.transferBalance + todayTransferBalance.data[todayTransferBalance.data.length - 1].amount
    }
    const openingBalance = !balance.data[0]?.amount ? ( openingVoucherBalanceCalculation.data.total + data.otherIncome - ( yesterdayTransfer + data.expense) ) : ( balance.data[0]?.amount - balance.data[0].transferAmount)
    data.openingBalance = openingBalance
    data.todayVoucherIncome = todayVoucherBalanceCalculation.data.total
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
    data.closingBalance = (data.openingBalance + data.todayVoucherIncome + data.otherIncome) - ( data.expense + data.transferBalance )
    return {
        data: data
    }
}