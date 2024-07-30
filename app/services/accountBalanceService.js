"use strict"

exports.listAllAccountBalance = async (datas) => {
    let { exact, startDate, endDate, relatedBranch, relatedAccounting } = datas
    let query = { isDeleted: false, type: "Closing" }
    if (startDate && endDate) query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    if (relatedBranch) query.relatedBranch = relatedBranch
    if (relatedAccounting) query.relatedAccounting = relatedAccounting
    if(exact){
        const startDate = new Date(exact)
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay() + 1, startDate.getHours(), startDate.getMinutes(), startDate.getSeconds())
        query.date = { $gte: new Date(startDate), $lte: new Date(endDate) }
    }
    const accountBalances = await AccountBalance.find(query).populate('relatedBranch relatedAccounting')
    return accountBalances
}