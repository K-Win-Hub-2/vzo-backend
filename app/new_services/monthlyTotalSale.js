const moment = require("moment");

const {
  calculateExpenseTotalFun,
  calculateIncomeTotalFun,
  calculateTransferTotalFun,
  calculateOpeningBalanceFun,
  calculateTodayVoucherTotalFun,
  calculatePurchaseTotalFun,
  calculateClosingBalanceFun,
  calculateNetProfitFun,
} = require("./NewIncomeTotalServices");

const {
  calculateSellingFun,
  calculatePurchasePriceFun,
  calculateProfitFun,
} = require("./profitTotal");
const {
  calculateVoucherDiscountFun,
  calculateRelatedItemDiscount,
} = require("./netProfitTotal");

// total monthly sale income
const monthlyTotalSale = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(404).json({
        success: false,
        message: "Need Month and Year to Retrieve Total Income",
      });
    }

    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "Invalid month. Month should be between 1 and 12.",
      });
    }

    const startOfMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month")
      .format('YYYY-MM-DD');

    const endOfMonth = moment()
      .year(year)
      .month(month - 1)
      .endOf("month")
      .format('YYYY-MM-DD');

    // console.log("Start of month:", startOfMonth);
    // console.log("End of month:", endOfMonth);

    // expense
    const expenseTotal = await calculateExpenseTotalFun(
      startOfMonth,
      endOfMonth
    );

    // other income
    const incomeTotal = await calculateIncomeTotalFun(startOfMonth, endOfMonth);
    // console.log("IncomeTotal", incomeTotal);

    // transfer balance
    const transferTotal = await calculateTransferTotalFun(
      startOfMonth,
      endOfMonth
    );

    // opening balance
    const openingBalanceTotal = await calculateOpeningBalanceFun(
      startOfMonth,
      endOfMonth
    );

    // today item voucher
    const itemVoucherTotal = await calculateTodayVoucherTotalFun(
      startOfMonth,
      endOfMonth
    );

    // purchase total
    const purchaseTotal = await calculatePurchaseTotalFun(
      startOfMonth,
      endOfMonth
    );

    // gross profit
    const sellingPrice = await calculateSellingFun(startOfMonth, endOfMonth);
    const purchasePrice = await calculatePurchasePriceFun(
      startOfMonth,
      endOfMonth
    );
    const profitTotal = calculateProfitFun();

    // related item & voucher discount for net profit
    await calculateVoucherDiscountFun(startOfMonth, endOfMonth);
    await calculateRelatedItemDiscount(startOfMonth, endOfMonth);

    const netProfitTotal = calculateNetProfitFun();

    // closing balance
    const closingBalanceTotal = await calculateClosingBalanceFun(
      startOfMonth,
      endOfMonth
    );

    return res.status(200).json({
      success: true,
      message: "Here's Data for Monthly Income",
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
    console.error("Error On Retrieving Monthly Income", error);
    return res.status(500).json({
      success: false,
      message: "Error On Retrieving Monthly Income",
      data: error,
    });
  }
};

// // total net profit
// const calculateNetProfitFun = () => {
//   const totalProfit = calculateProfitFun();
//   const discountTotal = calculateTotalDiscount();

//   const expenseTransferPurchase =
//     totalExpense + totalTransferBalance + totalPurchase + discountTotal;

//   const otherAndProfit = totalOtherIncome + totalProfit;

//   const netProfit = otherAndProfit - expenseTransferPurchase;
//   return netProfit;
// };

module.exports = { monthlyTotalSale };
