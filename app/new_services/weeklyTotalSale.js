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

const weeklyTotalSale = async (req, res) => {
  try {
    const { weekNum, month, year } = req.query;

    const startOfMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month");
    const endOfMonth = moment()
      .year(year)
      .month(month - 1)
      .endOf("month");

    let weekRanges = [];
    const daysInMonth = endOfMonth.date(); // eg: 31

    let currentStart = startOfMonth.clone();

    for (let i = 1; i <= 4; i++) {
      // Calculate the end of the current week
      const nextEnd = currentStart
        .clone()
        .add(Math.floor(daysInMonth / 4) - 1, "days")
        .endOf("day");

      weekRanges.push({
        week: i,
        start: currentStart.format("YYYY-MM-DD"),
        end:
          i === 4
            ? endOfMonth.format("YYYY-MM-DD")
            : nextEnd.format("YYYY-MM-DD"),
      });

      currentStart = nextEnd.clone().add(1, "day").startOf("day");
    }

    // console.log(weekRanges);

    // Define async operations for each week
    const operations = {
      1: async () =>
        await showAllWeeklyDataFun(weekRanges[0].start, weekRanges[0].end),
      // eg: 2024-07-01 - 2024-07-07
      2: async () =>
        await showAllWeeklyDataFun(weekRanges[1].start, weekRanges[1].end),
      3: async () =>
        await showAllWeeklyDataFun(weekRanges[2].start, weekRanges[2].end),
      4: async () =>
        await showAllWeeklyDataFun(weekRanges[3].start, weekRanges[3].end),
    };

    if (!operations[weekNum]) {  // eg: operations[1]
      return res.status(400).json({
        success: false,
        message: "Invalid week number provided.",
      });
    }

    const result = await operations[weekNum]();

    return res.status(200).json({
      success: true,
      message: "Weekly totals retrieved successfully",
      data: [
        {
          expense: result.totalExpense,
          otherIncome: result.totalIncome,
          transferBalance: result.transferTotal,
          openingBalance: result.openingBalanceTotal,
          todayVoucherIncome: result.itemVoucherTotal,
          totalItemSellingPrice: result.sellingPrice ? result.sellingPrice : 0,
          totalItemPurchasePrice: result.purchasePrice
            ? result.purchasePrice
            : 0,
          purchaseTotal: result.purchaseTotal,
          profit: result.profitTotal ? result.profitTotal : 0,
          netProfit: result.netProfitTotal ? result.netProfitTotal : 0,
          closingBalance: result.closingBalanceTotal,
        },
      ],
    });
  } catch (error) {
    console.error("Error On Retrieving Weekly Income", error);
    return res.status(500).json({
      success: false,
      message: "Error On Retrieving Weekly Income",
      data: error,
    });
  }
};

const showAllWeeklyDataFun = async (start, end) => {
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

  // gross profit
  const sellingPrice = await calculateSellingFun(start, end);
  const purchasePrice = await calculatePurchasePriceFun(start, end);
  const profitTotal = calculateProfitFun();

  // related item & voucher discount for net profit
  await calculateVoucherDiscountFun(start, end);
  await calculateRelatedItemDiscount(start, end);

  const netProfitTotal = calculateNetProfitFun();

  // closing balance
  const closingBalanceTotal = await calculateClosingBalanceFun(start, end);

  return {
    totalExpense: expenseTotal,
    totalIncome: incomeTotal,
    transferTotal,
    openingBalanceTotal,
    itemVoucherTotal,
    purchaseTotal,
    sellingPrice,
    purchasePrice,
    profitTotal,
    netProfitTotal,
    closingBalanceTotal,
  };
};

module.exports = { weeklyTotalSale };
