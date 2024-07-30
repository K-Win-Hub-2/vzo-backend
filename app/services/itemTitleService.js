"use strict"

const { paginationHelper } = require("../helper/paginationHelper")
const itemTitle = require("../models/itemTitle")

exports.getAllItemTitles = async (datas) => {
    try{
       let { s, b, sc, bc, limit, offset, sort } = datas
       let query = { isDeleted: false }
       let sortByAscending = {id: 1}
       s ? query.relatedCategory = s : ""
       b ? query.relatedBrand= b : ""
       sc ? query.relatedSubCategory = sc : ""
       bc? query.relatedBranch = bc : ""
       if (sort) sortByAscending = { id: -1 }
       let count = await itemTitle.find(query).count()
       let paginationHelpers = await paginationHelper(count, offset, limit) 
       let result = await itemTitle.find(query).populate("relatedCategory relatedBrand relatedSubCategory relatedBranch").limit(paginationHelpers.limit).skip(paginationHelpers.skip).sort(sortByAscending).exec()
       return { data: result, meta_data: paginationHelpers}; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.createItemTitle = async (datas) => {
    try{
       let result = await itemTitle.create(datas)
       return result; 
    }
    catch(err){
        console.log("Error is", err.message)
    }
}

exports.getItemTitleById = async (id) => {
    try{
       let result = await itemTitle.findById(id).populate("relatedCategory relatedBrand relatedSubCategory relatedBranch")
        return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.updateTitleItem = async (id, datas) => {
    try{
       let result = await itemTitle.findByIdAndUpdate(id, datas, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

exports.deleteTitleItem = async (id) => {
    try{
       let result = await itemTitle.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result; 
    }catch(err){
        console.log("Error is", err.message)
    }
}

