"use strict"
const xlsx = require("xlsx");
const superCategory = require("../models/superCategory");
const itemTitle = require("../models/itemTitle");
const items = require("../models/items");

exports.excelImport = async (req,res) => {
    const workbook = xlsx.readFile(req.file.path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(workSheet)
    console.log("workSheet",workSheet, "xlsx", xlsx, "data", data)
    data.forEach(async (result) => {
        const splitTitle = result.title.split(" (VZO)")[0]
        const splitCategory = result.superCategory.split(" (VZO)")[0]
        const foodTitle = await itemTitle.findOne({name: splitTitle})
        const foodCategory = await superCategory.findOne({name: splitCategory})
        console.log("this is data of relatedid", foodCategory, foodTitle)
        await items.create({
            name: result.name, 
            code: result.code, 
            fromUnit: Number(result.fromUnit),
            toUnit: Number(result.toUnit), 
            totalUnit: Number(result.totalUnit),
            currentQuantity: Number(result.currentQuantity),
            sellingPrice: Number(result.sellingPrice),
            purchasePrice: Number(result.purchasePrice),
            deliveryPrice: Number(result.deliveryPrice),
            reOrderQuantity: Number(result.reOrderQuantity),
            relatedItemTitle: foodTitle._id,
            relatedSuperCategory: foodCategory._id
            })
    })
    res.status(200).json({success: true, message: "Import successful"})
}