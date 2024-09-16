"use strict";
const customers = require("../models/customerinfo");

exports.listAllCustomers = async (req, res) => {
  try {
    let result = await customers.find({ isDeleted: false });
    let count = await customers.find({ isDeleted: false }).count();
    res.status(200).send({
      success: true,
      count: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: "No Record Found!" });
  }
};

exports.getCustomer = async (req, res) => {
  const result = await customer.find({
    _id: req.params.id,
    isDeleted: false,
  });
  if (!result)
    return res.status(500).json({ error: true, message: "No Record Found" });
  return res.status(200).send({ success: true, data: result });
};

exports.createCustomer = async (req, res, next) => {
  try {
    const newcustomer = new customer(req.body);
    const result = await newcustomer.save();
    res.status(200).send({
      message: "Customer create success",
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const result = await customer.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const result = await customer.deleteOne({ _id: req.params.id });
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    return res.status(500).send({ error: true, message: error.message });
  }
};
