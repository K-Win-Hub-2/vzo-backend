const IncomeModel = require("../models/income");
const ExpenseModel = require("../models/expense");
const TransferModel = require("../models/transfer");
const AccountBalanceModel = require("../models/accountBalance");
const ItemVoucherModel = require("../models/itemVoucher");
const PurchaseModel = require("../models/purchase");
const {
  calculateSellingFun,
  calculatePurchasePriceFun,
  calculateProfitFun,
} = require("./profitTotal");
const {
  calculateVoucherDiscountFun,
  calculateRelatedItemDiscount,
  calculateDiscountTotal,
} = require("./calculateDiscountTotal");

// all sum total
const AllSumTotalServices = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate); // eg: 2025-01-01T00:00:00.000Z
    const end = new Date(new Date(endDate).setHours(23, 59, 59)); // eg: 2025-01-14T23:59:59.000Z

    // expense
    const expenseTotal = await calculateExpenseTotalFun(start, end);

    // other income
    const incomeTotal = await calculateIncomeTotalFun(start, end);
    // console.log("IncomeTotal", incomeTotal);

    // transfer balance
    const transferTotal = await calculateTransferTotalFun(start, end);

    // opening balance
    const openingBalanceTotal = await calculateOpeningBalanceFun(start, end);

    // today item voucher
    const itemVoucherTotal = await calculateTodayVoucherTotalFun(start, end);

    // purchase total
    const purchaseTotal = await calculatePurchaseTotalFun(start, end);

    // closing balance
    const closingBalanceTotal = await calculateClosingBalanceFun(start, end);

    // gross profit
    const sellingPrice = await calculateSellingFun(start, end);
    const purchasePrice = await calculatePurchasePriceFun(start, end);
    const profitTotal = await calculateProfitFun(start, end);
    // console.log(profitTotal);

    // related item & voucher discount for net profit
    await calculateVoucherDiscountFun(start, end);
    await calculateRelatedItemDiscount(start, end);
    const netProfitTotal = await calculateNetProfitFun(start, end);

    return res.status(200).json({
      success: true,
      message: "Here's Income Total",
      data: [
        {
          expense: expenseTotal,
          otherIncome: incomeTotal,
          transferBalance: transferTotal,
          openingBalance: openingBalanceTotal,
          todayVoucherIncome: itemVoucherTotal,
          totalItemSellingPrice: sellingPrice ? sellingPrice : 0,
          totalItemPurchasePrice: purchasePrice ? purchasePrice : 0,
          purchaseTotal: purchaseTotal,
          profit: profitTotal ? profitTotal : 0,
          netProfit: netProfitTotal ? netProfitTotal : 0,
          closingBalance: closingBalanceTotal,
        },
      ],
    });
  } catch (error) {
    console.error("Error On Retrieving Income", error);
    return res.status(500).json({
      success: false,
      message: "Error On Retrieving Income",
      data: error,
    });
  }
};

let totalExpense = 0;
let totalOtherIncome = 0;
let totalTransferBalance = 0;
let totalOpeningBalance = 0;
let todayItemVoucherAmount = 0;
let totalPurchase = 0;
let totalClosingBalanceAmount = 0;

// total expense
const calculateExpenseTotalFun = async (start, end) => {
  const expenseModelQuery = {
    isDeleted: false,
  };

  expenseModelQuery.date = { $gte: start, $lte: end };
  const expenseDocs = await ExpenseModel.find(expenseModelQuery);

  totalExpense = expenseDocs.reduce((acc, cur) => acc + cur.finalAmount, 0);

  return totalExpense;
};

// total other income
const calculateIncomeTotalFun = async (start, end) => {
  const incomeModelQuery = {
    isDeleted: false,
  };

  incomeModelQuery.createdAt = { $gte: start, $lte: end };
  const incomeDocs = await IncomeModel.find(incomeModelQuery);

  //   console.log("Income", incomeDocs);

  totalOtherIncome = incomeDocs.reduce((acc, curr) => acc + curr.amount, 0);

  //   console.log(totalOtherIncome);

  return totalOtherIncome;
};

// total transfer
const calculateTransferTotalFun = async (start, end) => {
  const transferModelQuery = {
    isDeleted: false,
  };

  transferModelQuery.date = { $gte: start, $lte: end };
  const transferDocs = await TransferModel.find(transferModelQuery);

  totalTransferBalance = transferDocs.reduce((acc, cur) => acc + cur.amount, 0);

  return totalTransferBalance;
};

// total opening balance
const calculateOpeningBalanceFun = async (start, end) => {
  const openingVoucherDocs = await AccountBalanceModel.find({
    isDeleted: false,
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  totalOpeningBalance = openingVoucherDocs.reduce(
    (acc, cur) => acc + cur.openingAmount,
    0
  );

  return totalOpeningBalance;
};

// total today voucher income
const calculateTodayVoucherTotalFun = async (start, end) => {
  const todayVoucherQuery = {
    isDeleted: false,
  };

  todayVoucherQuery.createdAt = { $gte: start, $lte: end };
  const todayVoucherDocs = await ItemVoucherModel.find(todayVoucherQuery);

  todayItemVoucherAmount = todayVoucherDocs.reduce(
    (acc, cur) => acc + cur.totalPaidAmount,
    0
  );

  return todayItemVoucherAmount;
};

// total purchase
const calculatePurchaseTotalFun = async (start, end) => {
  const purchaseDocs = await PurchaseModel.find({
    isDeleted: false,
    purchaseDate: {
      $gte: start,
      $lte: end,
    },
  });

  totalPurchase = purchaseDocs.reduce((acc, cur) => acc + cur.totalPrice, 0);

  return totalPurchase;
};

// total closing balance
const calculateClosingBalanceFun = async (start, end) => {
  const closingBalanceDocs = await AccountBalanceModel.find({
    isDeleted: false,
    createdAt: {
      $gte: start,
      $lte: end,
    },
  });

  totalClosingBalanceAmount = closingBalanceDocs.reduce(
    (acc, cur) => acc + cur.closingAmount,
    0
  );

  return totalClosingBalanceAmount;
};

// total net profit
const calculateNetProfitFun = async (start, end) => {
  const totalProfit = await calculateProfitFun(start, end);
  const discountTotal = calculateDiscountTotal();

  const otherAndProfit = totalOtherIncome + totalProfit;

  const expenseTransferPurchase =
    totalExpense + totalTransferBalance + totalPurchase + discountTotal;

  const netProfit = otherAndProfit - expenseTransferPurchase;
  // console.log("netProfit", netProfit);

  return netProfit;
};

module.exports = {
  AllSumTotalServices,
  calculateExpenseTotalFun,
  calculateIncomeTotalFun,
  calculateTransferTotalFun,
  calculateOpeningBalanceFun,
  calculateTodayVoucherTotalFun,
  calculatePurchaseTotalFun,
  calculateClosingBalanceFun,
  calculateNetProfitFun,
};
