"use strict"

const { startDateEndDateHelper } = require("../helper/dateHelper")
const { listAllAccountBalance } = require("./accountBalanceService")
const { getAllItemVoucher } = require("./itemVoucherServices")
const { voucherTotalCalculationService } = require("./voucherTotalCalculationService")

exports.calculateTotalIncome = async (datas) => {
    const data = {}
    const totalIncome = 0
    const balance = await listAllAccountBalance(datas)
    const queryDate = startDateEndDateHelper({exact: datas.exact, value: "substract"})  
    datas.startDate = queryDate.startDate
    datas.endDate = queryDate.endDate
    const openingVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    //startDate endDate of filter day
    const querytodayVoucherDate = startDateEndDateHelper({exact: datas.exact, value: "add"}) 
    datas.startDate = querytodayVoucherDate.startDate
    datas.endDate = querytodayVoucherDate.endDate
    const todayVoucherBalanceCalculation = await voucherTotalCalculationService(datas)
    const openingBalance =openingVoucherBalanceCalculation.data.total != 0 ? openingVoucherBalanceCalculation.data.total : balance.data[0]?.amount ?  balance.data[0].amount : 0
    data.openingBalance = openingBalance
    data.todayVoucherIncome = todayVoucherBalanceCalculation.data.total
    data.otherIncome = 0
    data.expense = 0
    data.closingBalance = (data.openingBalance + data.todayVoucherIncome + data.otherIncome) - data.otherExpense
    return {
        data: data
    }
}