const ItemVoucherModel = require("../models/itemVoucher");

let totalSellingPrice = 0;
let totalPurchasePrice = 0;

// total selling price
const calculateSellingFun = async (start, end) => {
  const relatedSellingDocs = await ItemVoucherModel.find({
    isDeleted: false,
    refund: false,
    createdAt: {
      $gte: start,
      $lte: end,
    },
    "relatedItem.item_id": { $exists: true },
  }).populate("relatedItem.item_id");

  relatedSellingDocs.forEach((doc) => {
    totalSellingPrice = doc.relatedItem.reduce((acc, cur) => {
      // console.log(cur.item_id.sellingPrice);
      return acc + (cur.item_id.sellingPrice || 0);
    }, 0);
  });
  return totalSellingPrice;
};

// total Purchase price
const calculatePurchasePriceFun = async (start, end) => {
  const relatedPurchaseDocs = await ItemVoucherModel.find({
    isDeleted: false,
    refund: false,
    createdAt: {
      $gte: start,
      $lte: end,
    },
    "relatedItem.item_id": { $exists: true },
  }).populate("relatedItem.item_id");

  relatedPurchaseDocs.forEach((doc) => {
    totalPurchasePrice = doc.relatedItem.reduce((acc, cur) => {
      return acc + (cur.item_id.purchasePrice || 0);
    }, 0);
  });
  return totalPurchasePrice;
};

// total gross profit
const calculateProfitFun = () => {
  const totalProfit = totalSellingPrice - totalPurchasePrice;
  return totalProfit;
};

module.exports = {
  calculateSellingFun,
  calculatePurchasePriceFun,
  calculateProfitFun,
};
