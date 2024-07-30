"use strict"

"use strict"

const itemPackage = require("../models/itemPackage")
const items = require("../models/items")


exports.getAllStockIncludingRepackage = async (datas) => {
    try{
       let { s } = datas
       let query = { isDeleted: false }
       s ? query.relatedSuperCategory = s : ""
       let queryItems = await items.find(query).populate("relatedSuperCategory relatedItemTitle")
       let queryRepackage = await itemPackage.find({isDeleted: false}).populate({path: "itemArray",populate: {path: "item_id"}})
       let result = {}
       queryItems.map(item => {
        result[item._id] = {}
        result[item._id]["total"] = {
            name: item.name,
            code: item.code,
            fromUnit: item.fromUnit,
            toUnit: item.toUnit,
            sellingPrice: item.sellingPrice,
            purchasePrice: item.purchasePrice,
            deliveryPrice: item.deliveryPrice,
            totalPurchase: item.totalPurchase,
        }
        result[item._id]["item"] = item
        result[item._id]["total"]["totalUnit"] = item.totalUnit
        result[item._id]["total"].currentQuantity = Math.ceil((result[item._id]["total"].totalUnit * result[item._id]["total"].fromUnit) / result[item._id]["total"].toUnit) 
        result[item._id]["package"] = []
        queryRepackage.map(pk=>{           
            pk.itemArray.map(pkItem=>{
                if(pkItem.item_id._id.toString()===item._id.toString()){
                    result[item._id]["total"].totalUnit += ( pkItem.totalQuantity * pk.currentQuantity )
                    result[item._id]["total"].currentQuantity = Math.ceil((result[item._id]["total"].totalUnit * result[item._id]["total"].fromUnit) / result[item._id]["total"].toUnit) 
                    result[item._id]["package"].push(pk)
                }
            })
        })
       })
       const data = Object.values(result)
       return { data: data }
    }catch(err){
        console.log("Error is", err.message)
    }
    
}

exports.getSaleItemsAndPackage = async (datas) => {
    let query =  { isDeleted: false }
    let { s } = datas
    let data = []
    s ? query.relatedSuperCategory = s : ""
    let queryItems = await items.find(query).populate("relatedSuperCategory relatedItemTitle").exec()
    let queryRepackage = await itemPackage.find({isDeleted: false}).populate({path: "itemArray",populate: {path: "item_id"}}).exec()

    queryItems.map(items => {
        //push item to data
        data.push({
            _id: items._id,
            name: items.name,
            code: items.code,
            sellingPrice: items.sellingPrice,
            purchasePrice: items.purchasePrice,
            deliveryPrice: items.deliveryPrice,
            currentQuantity: items.currentQuantity,
            type: "item"
        })
        queryRepackage.map(pk=>{
            const arr = pk.itemArray
            arr.map(item=> item.item_id.equals(items._id) ? data.push({
                _id: pk._id,
                name: pk.name,
                code: pk.code,
                sellingPrice: pk.sellingPrice,
                purchasePrice: pk.purchasePrice,
                deliveryPrice: pk.deliveryPrice,
                currentQuantity: pk.currentQuantity,
                type: "package"
            }): "")
        })
    })
    
    return { data: data }
}     