"use strict";
const xlsx = require("xlsx");
const items = require("../models/items");
const ItemTitle = require("../models/itemTitle");
const superCategoryModels = require("../models/superCategory");
const subCategoryModels = require("../models/subCategory");
const Brand = require("../models/brand");
const mongoose = require("mongoose");

exports.excelImport = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(workSheet);

    // console.log("data", data);

    for (const result of data) {
      // console.log(result, "res");
      let trimmedData = {};
      for (let key in result) {
        // Use trim() on the key and assign the value
        trimmedData[key.trim()] = result[key];
      }

      // console.log(trimmedData, "trimmedData");

      const superCategory = trimmedData.superCategory.split(" (VZO)")[0];
      const superID = await superCategoryModels.findOne({
        name: superCategory,
      });
      const itemTitle = trimmedData.title.split(" (VZO)")[0];
      const itemTitleID = await ItemTitle.findOne({
        name: itemTitle,
      });

      const item_name = trimmedData.name.split(" (VZO)")[0];
      const currentQty = trimmedData.currentQuantity;
      const code = trimmedData.code;
      const fromUnit = trimmedData.fromUnit;
      const toUnit = trimmedData.toUnit;
      const purchasePrice = trimmedData.purchasePrice;
      const sellingPrice = trimmedData.sellingPrice;
      const title = trimmedData.title;
      // console.log("purchasePrice", purchasePrice);
      if (!superCategory) {
        console.error(`SuperCategory not found: ${superCategoryName}`);
        continue;
      }

      const existingItem = await items.findOne({
        relatedItemTitle: itemTitleID._id,
        name: item_name,
        relatedSuperCategory: superID._id,
      });

      if (existingItem) {
        console.log(existingItem, "existingItem");
        console.log(trimmedData, "result");
        await items.updateOne(
          { _id: existingItem._id },
          {
            $set: {
              code: code,
              fromUnit: fromUnit,
              toUnit: toUnit,
              totalUnit: (currentQty * toUnit) / fromUnit,
              currentQuantity: currentQty,
              sellingPrice: sellingPrice,
              purchasePrice: purchasePrice,
              relatedSuperCategory: superID._id,
              relatedItemTitle: itemTitleID._id,
              description: result.description,
            },
          }
        );
      } else {
        await items.create({
          name: item_name,
          code: code,
          fromUnit: fromUnit,
          toUnit: toUnit,
          totalUnit: (currentQty * toUnit) / fromUnit,
          currentQuantity: currentQty,
          sellingPrice: sellingPrice,
          purchasePrice: purchasePrice,
          relatedSuperCategory: superID._id,
          relatedItemTitle: itemTitleID._id,
          description: result.description,
        });
        // console.log(`Created new item: ${item_name}`);
      }
    }

    res.status(200).json({ success: true, message: "Import successful" });
  } catch (error) {
    console.error("Error in excelImport", error);
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.TitleExcelImport = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const workSheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(workSheet);

    for (const result of data) {
      const superCategory = result.superCategory.split(" (VZO)")[0];
      const subCategory = result.subCategory.split(" (VZO)")[0];
      const superID = await superCategoryModels.findOne({
        name: superCategory,
      });
      const subID = await subCategoryModels.findOne({ name: subCategory });
      const brand = result.brand.split(" (VZO)")[0];
      const brandID = await Brand.findOne({ name: brand });
      // console.log(`superID:`, superID);
      const code = result.code;
      const title = result.title.split(" (VZO)")[0];
      const description = result.description;

      const existingTitle = await ItemTitle.findOne({
        name: title,
        relatedCategory: superID._id,
        relatedSubCategory: subID._id,
      });

      if (existingTitle) {
        await ItemTitle.updateOne(
          { _id: existingTitle._id },
          {
            $set: {
              code: code,
              description: description,
              relatedBrand: brandID._id,
              relatedCategory: superID._id,
              relatedSubCategory: subID._id,
              name: title,
            },
          }
        );
        console.log(`Updated title: ${title}`);
      } else {
        const resFinal = await ItemTitle.create({
          code: code,
          description: description,
          relatedBrand: brandID._id,
          relatedCategory: superID._id,
          relatedSubCategory: subID._id,
          name: title,
        });
        // console.log(`Created new title:`, resFinal);
      }
    }

    res.status(200).json({ success: true, message: "Import successful" });
  } catch (error) {
    console.error("Error in TitleExcelImport", error);
    return res.status(500).send({ error: true, message: error.message });
  }
};
