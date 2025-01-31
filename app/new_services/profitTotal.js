const ItemVoucherModel = require("../models/itemVoucher");

let totalPurchasePrice = 0;
let totalSellingPrice = 0;

// find all related item
const relatedItem = async (start, end) => {
  const relatedItemDocs = await ItemVoucherModel.find({
    isDeleted: false,
    refund: false,
    createdAt: {
      $gte: start,
      $lte: end,
    },
    "relatedItem.item_id": { $exists: true },
  }).populate("relatedItem.item_id");

  return relatedItemDocs;
};

// total selling price
const calculateSellingFun = async (start, end) => {
  const relatedSellingDocs = await relatedItem(start, end);

  if (relatedSellingDocs.length === 0) {
    return (relatedSellingDocs.length = 0);
  } else {
    relatedSellingDocs.forEach((doc) => {
      totalSellingPrice = doc.relatedItem.reduce((acc, cur) => {
        if (cur.item_id === null) {
          return (cur.item_id = 0);
        }
        return acc + (cur.item_id.sellingPrice || 0);
      }, 0);
    });
  }
  return Math.floor(totalSellingPrice);
};

// total Purchase price
const calculatePurchasePriceFun = async (start, end) => {
  const relatedPurchaseDocs = await relatedItem(start, end);

  if (relatedPurchaseDocs.length === 0) {
    return (relatedPurchaseDocs.length = 0);
  } else {
    relatedPurchaseDocs.forEach((doc) => {
      totalPurchasePrice = doc.relatedItem.reduce((acc, cur) => {
        if (cur.item_id === null) {
          return (cur.item_id = 0);
        }
        return acc + (cur.item_id.purchasePrice || 0);
      }, 0);
    });
  }
  return Math.floor(totalPurchasePrice);
};

// total gross profit
const calculateProfitFun = async (start, end) => {
  let totalProfit = 0;

  const relatedItemsDocs = await relatedItem(start, end);

  if (relatedItemsDocs.length === 0) {
    return (relatedItemsDocs.length = 0);
  }
  totalProfit = totalSellingPrice - totalPurchasePrice;
  // console.log("totalProfit", Math.floor(totalProfit));
  return Math.floor(totalProfit);
};

module.exports = {
  calculateSellingFun,
  calculatePurchasePriceFun,
  calculateProfitFun,
};
