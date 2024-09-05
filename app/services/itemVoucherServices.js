"use strict" 
const {substractCurrentQuantityOfItem, substractCurrentQuantityOfItemPackageArray, addItemsArrayifPurchase, addCurrentQuantityPackageArray} = require("../helper/checkItems")
const { paginationHelper } = require("../helper/paginationHelper")
const {generateVoucherCode} = require("../helper/voucherCodeGeneratorHelper")
const itemVoucher = require("../models/itemVoucher")
const {createDebt} = require("./debtService")
const moment = require("moment-timezone")

exports.getAllItemVoucher = async (datas) => {
    let {
        bank,
        cash,
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
        relatedPackage,
        relatedItem,
        paymentType,
        secondPaymentType,
        relatedBranch,
        createdBy,
        balance,
        tsType,
        exact,
        limit,
        offset,
        sort
    } = datas
    let sortByAscending = {id: 1}
    let query = {
        isDeleted: false
    }
    if (startDate && endDate){
        query.createdAt = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lte: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    } 
    if(exact) {
        query.createdAt = {
            $gte: moment.tz(startDate, "Asia/Yangon").startOf("day").format(),
            $lt: moment.tz(endDate, "Asia/Yangon").startOf("day").format()
        }
    }  
    if (refund) 
        query.refund = refund

    if(!refundType)
        query.refund = false    

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
    
    if (bank)
        query.relatedBank = { $exists: true}

    if (cash)
        query.relatedCash = { $exists: true }

    if (relatedPackage) query.relatedPackage = { $exists: true, $not: {$size: 0} }
    if (relatedItem) query.relatedItem = { $exists:true, $not: {$size: 0} }
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
    let itemVoucher = await this.getItemVoucherById(id)
    const relatedPackage = itemVoucher.relatedPackage
    const relatedItem = itemVoucher.relatedItem
    if (datas.relatedItem.length > 0) {
        await substractCurrentQuantityOfItem(relatedItem)
        await addItemsArrayifPurchase(datas.relatedItem)
        await itemVoucher.findByIdAndUpdate(id, { $unset: {relatedItem: ""}})
    }
    if (datas.relatedPackage.length > 0) {
        await substractCurrentQuantityOfItemPackageArray(relatedPackage)
        await addCurrentQuantityPackageArray(datas.relatedPackage)
        await itemVoucher.findByIdAndUpdate(id, { $unset: {relatedPackage: ""}})
    }

    let result = await itemVoucher.findByIdAndUpdate(id, datas, {new: true})
    return result
}

exports.deleteItemVoucher = async (id) => {
    let result = await itemVoucher.findByIdAndUpdate(id, {
        isDeleted: true
    }, {new: true})
    return result
}
