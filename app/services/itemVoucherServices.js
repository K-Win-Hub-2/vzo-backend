"use strict"

const { substractCurrentQuantityOfItem, substractCurrentQuantityOfItemPackageArray } = require("../helper/checkItems")
const { generateVoucherCode } = require("../helper/voucherCodeGeneratorHelper")
const itemVoucher = require("../models/itemVoucher")
const { createDebt } = require("./debtService")

exports.getAllItemVoucher = async (datas) => {
       let query = { isDeleted: false }
       let result = await itemVoucher.find(query)
        return result;    
}

exports.createItemVoucher = async (datas) => {
       const additionalData = await generateVoucherCode()
       datas.code = additionalData.code
       datas.seq = additionalData.seq
       await substractCurrentQuantityOfItem(datas.relatedItem)
       await substractCurrentQuantityOfItemPackageArray(datas.relatedPackage)
       let result = await itemVoucher.create(datas)
       //creating debt if balance exist
       await createDebt({
          relatedItemVoucher: result._id,
          date: datas.createdAt,
          balance: balance,
          isPaid:false})
       return result; 
}

exports.getItemVoucherById = async (id) => {
       let result = await itemVoucher.findById(id).populate("relatedSuperCategory relatedItemTitle")
       return result
}

exports.updateItemVoucher = async (id, datas) => {
       let result = await itemVoucher.findByIdAndUpdate(id, datas, { new: true })
       return result
}

exports.deleteItemVoucher = async (id) => {
       let result = await itemVoucher.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result
}

