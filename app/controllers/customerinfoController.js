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
  let data = req.body;
  try {
    //prepare CUS-ID
    const latestDocument = await customers
      .find({}, { seq: 1 })
      .sort({ _id: -1 })
      .limit(1)
      .exec();
    console.log(latestDocument);
    const initials = getInitialsInUpperCase(data.name);
    if (latestDocument.length === 0) {
      data = { ...data, seq: "1", customerID: "CUS-" + initials + "-1" };
    } // if seq is undefined set initial patientID and seq
    console.log(data);
    if (latestDocument.length) {
      const increment = latestDocument[0].seq + 1;
      data = {
        ...data,
        customerID: "CUS-" + initials + "-" + increment,
        seq: increment,
      };
    }
    const newcustomer = new customers(data);
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
