"use strict";

const customer = require("../controllers/customerinfoController");
const { catchError } = require("../lib/errorHandler");
//const  verifyToken= require('../lib/verifyToken');

module.exports = (app) => {
  app.route("/api/customer").post(catchError(customer.createCustomer));
  // .put( verifyToken, catchError(shareholder.updateShareholder))

  app
    .route("/api/customer/:id")
    .get(catchError(customer.getCustomer))
    .delete(catchError(customer.deleteCustomer))
    .put(catchError(customer.updateCustomer));
  // .post(verifyToken, catchError(category.activateCategory))

  app.route("/api/customer").get(catchError(customer.listAllCustomers));
};
