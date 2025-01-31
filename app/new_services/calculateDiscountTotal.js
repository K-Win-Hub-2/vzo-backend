const itemVoucher = require("../models/itemVoucher");
const ItemVoucherModel = require("../models/itemVoucher");

let totalItemVoucherDiscount = 0;
let totalRelatedItemDiscount = 0;

// total item voucher discount
const calculateVoucherDiscountFun = async (start, end) => {
  const ItemVoucherDocs = await ItemVoucherModel.find({
    isDeleted: false,
    refund: false,
    totalDiscount: { $exists: true },
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  // console.log("ItemVoucherDocs", ItemVoucherDocs);

  if (ItemVoucherDocs.length !== 0) {
    totalItemVoucherDiscount = ItemVoucherDocs.reduce(
      (acc, cur) => acc + Math.floor(cur.totalDiscount),
      0
    );
  }

  return totalItemVoucherDiscount;
};

// total related item discount
const calculateRelatedItemDiscount = async (start, end) => {
  const relatedItemDiscountDocs = await ItemVoucherModel.find({
    isDeleted: false,
    refund: false,
    "relatedItem.item_id": { $exists: true },
    createdAt: {
      $gte: start,
      $lte: end,
    },
    "relatedItem.item_id": { $exists: true },
  }).populate("relatedItem.item_id");

  if (relatedItemDiscountDocs.length !== 0) {
    relatedItemDiscountDocs.forEach((doc) => {
      totalRelatedItemDiscount = doc.relatedItem.reduce((acc, cur) => {
        return acc + Math.floor(cur.discount);
      }, 0);
    });
  }
  return totalRelatedItemDiscount;
};

// total discount
const calculateDiscountTotal = () => {
  const totalDiscount = totalItemVoucherDiscount - totalRelatedItemDiscount;
  // console.log("totalDiscount", totalDiscount);
  return totalDiscount;
};

module.exports = {
  calculateVoucherDiscountFun,
  calculateRelatedItemDiscount,
  calculateDiscountTotal,
};
