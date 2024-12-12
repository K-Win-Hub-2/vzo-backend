"use strict";

const registerServiceHelper = require("../helper/registerServiceHelper");
const {
  addItemsVoucherToUserShift,
} = require("../helper/calculateVoucherWithShift");
const itemVoucherModel = require("../models/itemVoucher");
const UserShiftModel = require("../models/userShiftModel");

exports.listAllData = async (req, res) => {
  const paths = req.path.split("/v1/")[1];
  console.log("req", paths, registerServiceHelper.getMethods(paths));
  let datas = await registerServiceHelper
    .getMethods(paths)[0]
    [paths].list(req.query);
  res.status(200).send({
    success: true,
    message: "Get All Datas",
    data: datas.data,
    meta_data: datas.meta_data,
  });
};

exports.getAllItemVouchers = async (req, res) => {
  try {
    const itemVouchers = await itemVoucherModel
      .find({ isDeleted: false })
      .sort({ createdAt: -1 });

    return res.status(200).send({
      isSuccess: true,
      message: "Get all item vouchers",
      data: itemVouchers,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: "Error on the server",
      error: error.message,
    });
  }
};

exports.createData = async (req, res) => {
  const paths = req.path.split("/v1/")[1];
  let datas = await registerServiceHelper
    .getMethods(paths)[0]
    [paths].create(req.body);

  const { createdBy } = req.body;

  if (createdBy) {
    addItemsVoucherToUserShift(createdBy);
  }

  console.log(datas, "datas");
  res.status(200).send({ success: true, message: "Create Data", data: datas });
};

exports.dataById = async (req, res) => {
  const paths = req.path.split("/")[3];
  let datas = await registerServiceHelper
    .getMethods(paths)[0]
    [paths].listById(req.params.id);
  res
    .status(200)
    .send({ success: true, message: "Get Data By Id", data: datas });
};

exports.updateDataById = async (req, res) => {
  const paths = req.path.split("/")[3];
  let datas = await registerServiceHelper
    .getMethods(paths)[0]
    [paths].update(req.params.id, req.body);
  res
    .status(200)
    .send({ success: true, message: "Update Data By Id", data: datas });
};

exports.deleteDataById = async (req, res) => {
  const paths = req.path.split("/")[3];
  let datas = await registerServiceHelper
    .getMethods(paths)[0]
    [paths].delete(req.params.id);
  res
    .status(200)
    .send({ success: true, message: "delete Data By Id", data: datas });
};

exports.getShiftVoucher = async (req, res) => {
  try {
    const latestUserShift = await UserShiftModel.findOne({
      isDeleted: false,
    })
      .populate("salesItemVouchers relatedShift relatedUser")
      .sort({ shiftLoginTime: -1 });

    if (!latestUserShift) {
      return res.status(404).send({
        isSuccess: false,
        message: "No shift found",
      });
    }

    return res.status(200).send({
      isSuccess: true,
      message: "Get shift voucher",
      data: latestUserShift,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: "Error on the server",
      error: error.message,
    });
  }
};
