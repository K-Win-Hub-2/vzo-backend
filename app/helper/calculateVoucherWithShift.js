const itemsVoucher = require("../models/itemVoucher");
const userShiftsModel = require("../models/userShiftModel");

const calculateVoucherWithShift = async (createdBy, loginTime, logoutTime) => {
  try {
    const items = await itemsVoucher.find({
      createdBy: createdBy,
      createdAt: { $gte: loginTime, $lte: logoutTime },
    });

    let userTotalEarnAmount = 0;

    items.forEach(async (item) => {
      if (item.totalPaidAmount > 0) {
        userTotalEarnAmount += item.totalPaidAmount;
      }
    });

    return userTotalEarnAmount;
  } catch (error) {
    console.error(error);
  }
};

const userShiftCalculate = async (relatedUser) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayShifts = await userShiftsModel.find({
      relatedUser: relatedUser,
      shiftLoginTime: { $gte: startOfDay, $lte: endOfDay },
    });

    if (todayShifts.length === 0) {
      console.log("No shift found for today");
      return 0;
    }

    let totalEarningsForToday = 0;

    for (const shifts of todayShifts) {
      const { shiftLoginTime, shiftLogOutTime } = shifts;

      if (!shiftLogOutTime) {
        console.error("Incomplete shift data for shift ID:", shifts._id);
        continue;
      }

      const shiftEarnings = await calculateVoucherWithShift(
        shifts.relatedUser,
        shiftLoginTime,
        shiftLogOutTime
      );

      totalEarningsForToday += shiftEarnings;

      shifts.totalEarnedAmount = shiftEarnings;
      await shifts.save();

      console.log(
        `Total earnings for user ${relatedUser} for today: ${totalEarningsForToday}`
      );
    }

    return totalEarningsForToday;
  } catch (error) {
    console.error(error);
  }
};

const addItemsVoucherToUserShift = async (createdBy) => {
  try {
    const activeShift = await userShiftsModel
      .findOne({
        relatedUser: createdBy,
        shiftLogOutTime: { $exists: false },
      })
      .sort({ shiftLoginTime: -1 });

    if (!activeShift) {
      console.log("No active shift found for user", createdBy);
      return;
    }

    const vouchers = await itemsVoucher.find({
      createdBy: createdBy,
      createdAt: {
        $gte: activeShift.shiftLoginTime,
        $lte: shiftLoginTime || new Date(),
      },
    });

    if (!vouchers || vouchers.length === 0) {
      console.log("No vouchers found for user", createdBy);
      return;
    }

    for (const voucher of vouchers) {
      voucher.relatedShift = activeShift._id;
      await voucher.save();
    }

    activeShift.salesItemVouchers = vouchers.map((v) => v._id);
    await activeShift.save();
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  calculateVoucherWithShift,
  userShiftCalculate,
  addItemsVoucherToUserShift,
};
