"use strict" 
const {substractCurrentQuantityOfItem, substractCurrentQuantityOfItemPackageArray} = require("../helper/checkItems")
const { paginationHelper } = require("../helper/paginationHelper")
const {generateVoucherCode} = require("../helper/voucherCodeGeneratorHelper")
const itemVoucher = require("../models/itemVoucher")
const {createDebt} = require("./debtService")

exports.getAllItemVoucher = async (datas) => {
    let {
        secondAccount,
        isDouble,
        secondAmount,
        startDate,
        endDate,
        refund,
        refundType,
        refundDate,
        refundAccount,
        paymentMethod,
        code,
        relatedBank,
        relatedCash,
        paymentType,
        secondPaymentType,
        relatedBranch,
        createdBy,
        balance,
        tsType,
        limit,
        offset,
        sort
    } = datas
    let sortByAscending = {id: 1}
    let query = {
        isDeleted: false
    }
    if (startDate && endDate) 
        query.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        }
    
    if (refund) 
        query.refund = refund
    
    if (refundType) 
        query.refundType = refundType
    
    if (refundDate) 
        query.refundDate = {
            $gte: new Date(refundDate)
        }
    
    if (refundAccount) 
        query.refundAccount = refundAccount
    
    if (paymentMethod) 
        query.paymentMethod = paymentMethod
    
    if (code) 
        query.code = code
    
    if (relatedBank) 
        query.relatedBank = relatedBank
    
    if (relatedCash) 
        query.relatedCash = relatedCash
    
    if (paymentType) 
        query.paymentType = paymentType
    
    if (secondPaymentType) 
        query.secondPaymentType = secondPaymentType
    
    if (relatedBranch) 
        query.relatedBranch = relatedBranch
    
    if (createdBy) 
        query.createdBy = createdBy
    
    if (balance) 
        query.balance = {
            $exists: true
        }
    
    if (tsType) 
        query.tsType = tsType
    
    if (isDouble) 
        query.isDouble = isDouble
    
    if (secondAccount) 
        query.secondAccount = secondAccount
    
    if (secondAmount) 
        query.secondAmount = {
            $gte: secondAmount
        }
    if (sort) sortByAscending = { id: -1 }
    let count = await itemVoucher.find(query).count()
    let paginationHelpers = await paginationHelper(count, offset, limit) 
    let result = await itemVoucher.find(query).limit(paginationHelpers.limit).skip(paginationHelpers.skip).sort(sortByAscending).populate("relatedBank relatedCash relatedItem.item_id relatedPackage.item_id").populate({path: "secondAccount",populate:{ path: "relatedHeader"}}).exec()
    return { data: result, meta_data: paginationHelpers};
}

exports.createItemVoucher = async (datas) => {
    const additionalData = await generateVoucherCode()
    datas.code = additionalData.code
    datas.seq = additionalData.seq
    await substractCurrentQuantityOfItem(datas.relatedItem)
    await substractCurrentQuantityOfItemPackageArray(datas.relatedPackage)
    let result = await itemVoucher.create(datas)
    // creating debt if balance exist
    if (datas.balance) 
        await createDebt({relatedItemVoucher: result._id, date: datas.createdAt, balance: datas.balance, isPaid: false})
    
    return result;
}

exports.getItemVoucherById = async (id) => {
    let result = await itemVoucher.findById(id).populate("relatedSuperCategory relatedItemTitle")
    return result
}

exports.updateItemVoucher = async (id, datas) => {
    let result = await itemVoucher.findByIdAndUpdate(id, datas, {new: true})
    return result
}

exports.deleteItemVoucher = async (id) => {
    let result = await itemVoucher.findByIdAndUpdate(id, {
        isDeleted: true
    }, {new: true})
    return result
}
