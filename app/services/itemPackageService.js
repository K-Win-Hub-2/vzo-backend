"use strict"

const { substractItemsifPackageAvailable, substractItemsArrayifPackageAvailable } = require("../helper/checkItems")
const itemsPackage = require("../models/itemPackage")

exports.getAllItemPackage = async (datas) => {
    try{
       let { i, c} = datas
       let query = { isDeleted: false }
       i ? query.relatedItem = i : ""
       c ? query.code= c : ""
       let result = await itemsPackage.find(query).populate("relatedItem")
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.createitemsPackage = async (datas) => {
    try{
       let result = await itemsPackage.create(datas)
    //    await substractItemsifPackageAvailable(datas.relatedItem, datas.totalUnit)
       await substractItemsArrayifPackageAvailable(datas.itemArray)
       return result; 
    }
    catch(err){
        console.log("Error is", err.message)
    }
}

exports.getItemPackageById = async (id) => {
    try{
       let result = await itemsPackage.findById(id).populate("relatedItem")
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.updateItemPackage = async (id, datas) => {
    try{
       let result = await itemsPackage.findByIdAndUpdate(id, datas, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

exports.deleteItemPackage = async (id) => {
    try{
       let result = await itemsPackage.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

