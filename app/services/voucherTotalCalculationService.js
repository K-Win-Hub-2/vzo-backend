"use strict"

const { getAllItemVoucher } = require("./itemVoucherServices")

exports.voucherTotalCalculationService = async (data) => {
        const treatmentVoucher = await getAllItemVoucher(data)
        let bankObject = {}
        let cashObject = {}
        let bankTotal = 0
        let cashTotal = 0
        let purchase = 0
        let total = 0
        const datas = treatmentVoucher.data
        //loop to calculate purchase price
        datas.map(({ relatedItem, relatedPackage})=>{
            if(relatedItem.length > 0){
                relatedItem.map(items=>{
                    purchase += items.item_id.purchasePrice * items.quantity
                })
            }
            if(relatedPackage.length > 0){
                relatedPackage.map(packages=>{
                    purchase += packages.item_id.purchasePrice * packages.quantity
                })
            }
        })
        let bankList = datas.filter(dat => dat.relatedBank)
        let cashList = datas.filter(dat => dat.relatedCash)
        let secondAccount = datas.filter(dat => dat.secondAccount)
        bankList.map(bank =>{
            bankObject[bank.relatedBank.name] = (bankObject[bank.relatedBank.name] || 0) + ( bank.totalPaidAmount || 0 )
        })
        cashList.map(cash =>{
            cashObject[cash.relatedCash.name] = (cashObject[cash.relatedCash.name] || 0) + ( cash.totalPaidAmount || 0 )
        })
        secondAccount.map(second => {
            if(second.secondAccount.relatedHeader && second.secondAccount.relatedHeader.name.split(" ").join("").toLowerCase() === "cashatbank"){
                bankObject[second.secondAccount.name] = (bankObject[second.secondAccount.name] || 0) + ( second.secondAmount || 0 )
            }
            else {
                cashObject[second.secondAccount.name] = (cashObject[second.secondAccount.name] || 0) + ( second.secondAmount || 0 )
            }
        })
       Object.entries(bankObject).map(([k, v]) => { 
        total += v
        bankTotal += v
       })
       Object.entries(cashObject).map(([k, v]) => { 
        total += v
        cashTotal += v
       })
       let result = { bank: bankObject,cash: cashObject, bankTotal: bankTotal, cashTotal: cashTotal, total: total, purchaseTotal: purchase }
       return { data: result }
}