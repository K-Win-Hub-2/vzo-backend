"use strict"

const { startDateEndDateHelper } = require("../helper/dateHelper")
const { listAllAccountBalance } = require("./accountBalanceService")
const { listAllExpense } = require("./expenseService")
const { listAllHoIncome } = require("./hoIncomeService")
const { listAllTransferList } = require("./transferService")
const { voucherTotalCalculationService } = require("./voucherTotalCalculationService")

exports.calculateTotalIncome = async (datas) => {
    let yesterdayTransfer = 0
    const data = { expense: 0, otherIncome: 0, transferBalance: 0 }
    const queryDate = startDateEndDateHelper({exact: datas.exact, value: "substract"})  
    datas.startDate = queryDate.startDate
    datas.endDate = queryDate.endDate
    const yesterdayTransferBalance = await listAllTransferList(datas)
    //transfer balance calculation
    if(yesterdayTransferBalance.data.length > 0) {
        yesterdayTransfer = yesterdayTransferBalance.data[yesterdayTransferBalance.data.length - 1].amount  
    }
    const openingVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    //startDate endDate of filter day
    const querytodayVoucherDate = startDateEndDateHelper({exact: datas.exact, value: "add"})
    datas.startDate = querytodayVoucherDate.startDate
    datas.endDate = querytodayVoucherDate.endDate
    const todayVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    const balance = await listAllAccountBalance(datas)
    const todayTransferBalance = await listAllTransferList(datas)
    //transfer balance calculation
    if(todayTransferBalance.data.length > 0) {
      datas.transferBalance = datas.transferBalance + todayTransferBalance.data[todayTransferBalance.data.length - 1].amount  
    }
    const openingBalance =openingVoucherBalanceCalculation.data.total != 0 ? ( openingVoucherBalanceCalculation.data.total - yesterdayTransfer ) : balance.data[0]?.amount ?  balance.data[0].amount : 0
    data.openingBalance = openingBalance
    data.todayVoucherIncome = todayVoucherBalanceCalculation.data.total
    //list all expense data exact date
    let todayExpense = await listAllExpense(datas)
    //if expese exists
    if(todayExpense.data.length > 0) {
        todayExpense.data.map(exp=> {
            data.expense = data.expense + exp.finalAmount
        })
    }
    //list all other income with exact date
    // let todayIncome = await listAllHoIncome(datas)
    // //if income exists
    // if(todayIncome.data.length > 0) {
    //     todayIncome.data.map(exp=> {
    //         data.otherIncome = data.otherIncome + exp.finalAmount
    //     })
    // }
    data.closingBalance = (data.openingBalance + data.todayVoucherIncome + data.otherIncome) - ( data.expense + data.transferBalance )
    return {
        data: data
    }
}