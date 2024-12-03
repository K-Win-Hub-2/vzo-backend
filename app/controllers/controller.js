"use strict";

const registerServiceHelper = require("../helper/registerServiceHelper");
const {
  addItemsVoucherToUserShift,
} = require("../helper/calculateVoucherWithShift");
const itemVoucherModel = require("../models/itemVoucher");

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
    const { relatedShift } = req.query;

    const query = {
      isDeleted: false,
      relatedShift: relatedShift,
    };

    const itemVoucher = await itemVoucherModel.find(query);

    return res.status(200).send({
      isSuccess: true,
      message: "Shift Voucher Fetched Successfully",
      data: itemVoucher,
    });
  } catch (error) {
    return res.status(500).send({
      isSuccess: false,
      message: "Error on the server",
      error: error.message,
    });
  }
};
