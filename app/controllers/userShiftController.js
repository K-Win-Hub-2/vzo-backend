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
