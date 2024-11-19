const shiftModel = require("../models/shiftModel");

exports.createShift = async (req, res) => {
  try {
    const shift = await shiftModel.create(req.body);

    return res.status(200).json({
      isSuccess: true,
      message: "Shift Created Successfully",
      data: shift,
    });
  } catch (error) {
    console.log("Error on Creating Shift", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error on Creating Shift",
      error: error,
    });
  }
};

exports.getShifts = async (req, res) => {
  try {
    const shifts = await shiftModel.find({ isDeleted: false });

    return res.status(200).json({
      isSuccess: true,
      message: "Shifts Fetched Successfully",
      data: shifts,
    });
  } catch (error) {
    console.log("Error on Fetching Shifts", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error on Fetching Shifts",
      error: error,
    });
  }
};

exports.getShift = async (req, res) => {
  const { id } = req.params;
  try {
    const shift = await shiftModel.findById(id);

    return res.status(200).json({
      isSuccess: true,
      message: "Shift Fetched Successfully",
      data: shift,
    });
  } catch (error) {
    console.error("Error on Fetching Shift", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error on Fetching Shift",
      error: error,
    });
  }
};

exports.updateShift = async (req, res) => {
  const { id } = req.params;
  try {
    const oldShift = await shiftModel.findById(id);

    if (!oldShift) {
      return res.status(404).json({
        isSuccess: false,
        message: "Shift Not Found",
      });
    }

    const updatedShift = await shiftModel.findByIdAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Shift Updated Successfully",
      data: updatedShift,
    });
  } catch (error) {
    console.error("Error on Updating Shift", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error on Updating Shift",
      error: error,
    });
  }
};

exports.deleteShift = async (req, res) => {
  const { id } = req.params;
  try {
    const oldShift = await shiftModel.findById(id);

    if (!oldShift) {
      return res.status(404).json({
        isSuccess: false,
        message: "Shift Not Found",
      });
    }

    await shiftModel.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true }
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Shift Deleted Successfully",
    });
  } catch (error) {
    console.error("Error on Deleting Shift", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Error on Deleting Shift",
      error: error,
    });
  }
};
