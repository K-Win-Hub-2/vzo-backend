const userShiftModel = require("../models/userShiftModel");

exports.updateUserShift = async (req, res) => {
  const { id } = req.params;
  try {
    const userShift = await userShiftModel.findById(id);

    if (!userShift) {
      return res.status(404).send({
        isSuccess: false,
        message: "User shift not found",
      });
    }

    await userShiftModel.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).send({
      isSuccess: true,
      message: "User shift updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      isSuccess: false,
      message: "Error on the server",
      error: error.message,
    });
  }
};

exports.getUserShifs = async (req, res) => {
  try {
    const { userId } = req.query;
    const { startDate, endDate, limit = 10, page = 1 } = req.query;

    const query = {};

    if (userId) {
      query.relatedUser = userId;
    }

    if (startDate || endDate) {
      query.shiftLoginTime = {};
      if (startDate) query.shiftLoginTime.$gte = new Date(startDate);
      if (endDate) query.shiftLoginTime.$lte = new Date(endDate);
    }

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const totalShifts = await userShiftModel.countDocuments(query);

    const userShifts = await userShiftModel
      .find(query)
      .sort({ shiftLoginTime: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    return res.status(200).send({
      isSuccess: true,
      message: "User shifts fetched successfully",
      totalShifts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalShifts / pageSize),
      data: userShifts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      isSuccess: false,
      message: "Error on the server",
      error: error.message,
    });
  }
};
