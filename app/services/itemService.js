"use strict"

const { paginationHelper } = require("../helper/paginationHelper")
const items = require("../models/items")

exports.getAllItems = async (datas) => {
    try{
       let { s, c, limit, offset, sort } = datas
       let query = { isDeleted: false }
       let sortByAscending = {id: 1}
       s ? query.relatedSuperCategory = s : ""
       c ? query.code= c : ""
       if (sort) sortByAscending = { id: -1 }
       let count = await items.find(query).count()
       let paginationHelpers = await paginationHelper(count, offset, limit) 
       let result = await items.find(query).populate("relatedSuperCategory relatedItemTitle").limit(paginationHelpers.limit).skip(paginationHelpers.skip).sort(sortByAscending).exec()
        return { data: result, meta_data: paginationHelpers}; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.createItems = async (datas) => {
    try{
       let result = await items.create(datas)
       return result; 
    }
    catch(err){
        console.log("Error is", err.message)
    }
}

exports.getItemById = async (id) => {
    try{
       let result = await items.findById(id).populate("relatedSuperCategory relatedItemTitle")
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.updateItem = async (id, datas) => {
    try{
       let result = await items.findByIdAndUpdate(id, datas, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

exports.deleteItem = async (id) => {
    try{
       let result = await items.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

