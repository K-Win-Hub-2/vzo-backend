"use strict"

const { substractItemsifPackageAvailable, substractItemsArrayifPackageAvailable } = require("../helper/checkItems")
const itemsPackage = require("../models/itemPackage")
const items = require("../models/items")

exports.getAllItemPackage = async (datas) => {
       let { i, c} = datas
       let query = { isDeleted: false }
       i ? query.relatedItem = i : ""
       c ? query.code= c : ""
       let result = await itemsPackage.find(query).populate("relatedItem").populate({path: "itemArray", populate:{path: "item_id"}})
        return result
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
              data.totalUnit += arr.totalQuantity;
              data.currentQuantity  = Math.ceil(data.totalUnit * data.fromUnit / data.toUnit);
      
              // Save the updated item asynchronously
              await data.save();
       })
       //clear item array
       let result = await itemsPackage.findByIdAndUpdate(id, {$unset: {itemArray: ""}, $set: {...datas}}, { new: true })
       return result
}

exports.deleteItemPackage = async (id) => {
       let result = await itemsPackage.findByIdAndUpdate(id, {isDeleted: true}, { new: true })
       return result
}

