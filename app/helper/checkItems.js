const items = require("../models/items")

exports.checkItemsifPacakgeAvailable = async (req,res, next) => {
    const itemData = await items.findById(req.body.relatedItem).exec()
    const Values = itemData.totalUnit - req.body.totalUnit
    if(Values < 0) return res.status(200).send({success:false, message: "You don't have enough items to create packages", data: null})
    next()
}

exports.checkItemsArrayifPackageAvailable = async (req,res,next) => {
    // const parseJson = JSON.parse(req.body.itemArray)
    // console.log("itemArr", parseJson)
    if(req.body.itemArray && req.body.itemArray.length !=0){
        for(let i=0; i<req.body.itemArray.length; i++){
            const itemData = await items.findById(req.body.itemArray[i].item_id).exec()
            const Values = itemData.totalUnit - req.body.itemArray[i].totalQuantity
            console.log("item is ", i, Values)
            if(Values < 0) return res.status(200).send({success:false, message: "You don't have enough items to create packages", data: null})
        }
        next()
    }
    else return res.status(200).send({success:false, message: "Package Item Array is required", data: null})
}

exports.substractItemsifPackageAvailable = async (id, total) => {
    try{
        items.findOne({_id:id}).then(function(item){
            item.totalUnit = item.totalUnit - total
            item.currentQuantity = Math.ceil(item.totalUnit * item.fromUnit/ item.toUnit)
            item.save()
        })
    }catch(e){
        console.log("Error is ", e.message)
    }
}

exports.substractItemsArrayifPackageAvailable = async (itemArray) => {
    try{
        for(let i=0; i<itemArray.length; i++){
            items.findOne({_id:itemArray[i].item_id}).then(function(item){
                item.totalUnit = item.totalUnit - itemArray[i].totalQuantity
                item.currentQuantity = Math.ceil(item.totalUnit * item.fromUnit/ item.toUnit)
                item.save()
            })
        }
    }catch(e){
        console.log("Error is ", e.message)
    }
}