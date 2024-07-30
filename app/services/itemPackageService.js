"use strict"

const { substractItemsifPackageAvailable, substractItemsArrayifPackageAvailable } = require("../helper/checkItems")
const { paginationHelper } = require("../helper/paginationHelper")
const itemsPackage = require("../models/itemPackage")
const items = require("../models/items")

exports.getAllItemPackage = async (datas) => {
       let { i, c, limit, offset, sort} = datas
       let query = { isDeleted: false }
       let sortByAscending = {id: 1}
       i ? query.relatedItem = i : ""
       c ? query.code= c : ""
       if (sort) sortByAscending = { id: -1 }
       let count = await itemsPackage.find(query).count()
       let paginationHelpers = await paginationHelper(count, offset, limit) 
       let result = await itemsPackage.find(query).populate("relatedItem").populate({path: "itemArray", populate:{path: "item_id"}}).limit(paginationHelpers.limit).skip(paginationHelpers.skip).sort(sortByAscending).exec()
        return { data: result, meta_data: paginationHelpers}; 
}

exports.createitemsPackage = async (datas) => {
       let result = await itemsPackage.create(datas)
    //    await substractItemsifPackageAvailable(datas.relatedItem, datas.totalUnit)
       await substractItemsArrayifPackageAvailable(datas.itemArray, datas.currentQuantity)
       return result
}

exports.getItemPackageById = async (id) => {
       let result = await itemsPackage.findById(id).populate("relatedItem").populate({path: "itemArray", populate:{path: "item_id", populate:[{path:"relatedItemTitle"}, {path:"relatedSuperCategory"}]}})
        return result
}

exports.updateItemPackage = async (id, datas) => {
       let itemPackage =  await this.getItemPackageById(id)
       let array = itemPackage.itemArray
       array.map(async(arr) => {
              let data = await items.findOne({_id: arr.item_id});

              // Calculate new values
              data.totalUnit += ( arr.totalQuantity * itemPackage.currentQuantity );
              data.currentQuantity  = Math.ceil(data.totalUnit * data.fromUnit / data.toUnit);
      
              // Save the updated item asynchronously
              await data.save();
       })
       //clear item array
       await itemsPackage.findByIdAndUpdate(id, {$unset: {itemArray: ""}})
       await substractItemsArrayifPackageAvailable(datas.itemArray, datas.currentQuantity)
       let result = await itemsPackage.findByIdAndUpdate(id, datas, {new: true})
       return result
}

exports.deleteItemPackage = async (id) => {
       let result = await itemsPackage.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result
}

