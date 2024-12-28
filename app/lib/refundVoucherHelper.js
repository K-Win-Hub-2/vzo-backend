const ItemVoucherModel = require("../models/itemVoucher");
const ItemModel = require("../models/items");
const AccountingListsModel = require("../models/accountingList");

const itemRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { relatedItems } = req.body;

    // console.log("related Items", relatedItems);

    const oldItemVoucherDoc = await ItemVoucherModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (oldItemVoucherDoc.refund) {
      return res.status(400).json({
        success: false,
        message: "Refund already processed for this Item Voucher",
      });
    }

    // console.log("old Item Voucher", oldItemVoucherDoc);

    if (!oldItemVoucherDoc) {
      return res
        .status(404)
        .json({ success: false, message: "Item Voucher not found" });
    }

    if (!relatedItems || relatedItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "relatedItems is required" });
    }

    const originalItems = oldItemVoucherDoc.relatedItem.map((item) =>
      item.item_id.toString()
    );

    // console.log("original Items", originalItems);

    const invalidItems = relatedItems.filter(
      (item) => !originalItems.includes(item.item_id)
    );

    // console.log("invalid Items", invalidItems);

    if (invalidItems.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Some items in the refund request are not part of the original ItemVoucher.",
        invalidItems,
      });
    }

    let totalRefundAmount = 0;

    for (const relatedItem of relatedItems) {
      const { item_id, qty, price } = relatedItem;

      if (!item_id || !qty || !price) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid related item data" });
      }

      const item = await ItemModel.findOne({ _id: item_id });

      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${item_id} not found`,
        });
      }

      item.currentQuantity += qty;

      const totalUnit = (item.toUnit * item.currentQuantity) / item.fromUnit;

      // console.log(`Total Unit for item ${item_id}: ${totalUnit}`);

      item.totalUnit = totalUnit;

      await item.save();

      totalRefundAmount += price * qty;
    }

    let accountingList = null;

    if (oldItemVoucherDoc.relatedCash) {
      accountingList = await AccountingListsModel.findOne({
        _id: oldItemVoucherDoc.relatedCash,
      });
    } else if (oldItemVoucherDoc.relatedBank) {
      accountingList = await AccountingListsModel.findOne({
        _id: oldItemVoucherDoc.relatedBank,
      });
    }

    if (!accountingList) {
      return res.status(404).json({
        success: false,
        message:
          "No valid accounting entry found (relatedCash or relatedBank).",
      });
    }

    accountingList.amount += totalRefundAmount;
    await accountingList.save();

    oldItemVoucherDoc.refund = true;
    oldItemVoucherDoc.refundDate = new Date();
    oldItemVoucherDoc.refundAmount = totalRefundAmount;
    await oldItemVoucherDoc.save();

    return res.status(200).json({
      success: true,
      message: "Refund processed successfully",
      data: totalRefundAmount,
    });
  } catch (error) {
    console.error("Error in itemRefund", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { itemRefund };
