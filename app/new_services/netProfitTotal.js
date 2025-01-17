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

  totalItemVoucherDiscount = ItemVoucherDocs.reduce(
    (acc, cur) => acc + cur.totalDiscount,
    0
  );

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

  relatedItemDiscountDocs.forEach((doc) => {
    totalRelatedItemDiscount = doc.relatedItem.reduce((acc, cur) => {
      return acc + cur.discount;
    }, 0);
  });
  return totalRelatedItemDiscount;
};

// total discount
const calculateTotalDiscount = () => {
  const totalDiscount = totalItemVoucherDiscount - totalRelatedItemDiscount;
  // console.log("totalDiscount", totalDiscount);
  return totalDiscount;
};

module.exports = {
  calculateVoucherDiscountFun,
  calculateRelatedItemDiscount,
  calculateTotalDiscount,
};
