const { catchError } = require("../lib/errorHandler");
const verifyToken = require("../lib/verifyToken");
const {
  AllSumTotalServices,
} = require("../new_services/NewIncomeTotalServices");
const { monthlyTotalSale } = require("../new_services/monthlyTotalSale");
const { weeklyTotalSale } = require("../new_services/weeklyTotalSale");

module.exports = (app) => {
  // start and end date
  app
    .route("/api/v1/new-total-income-reports")
    .get(verifyToken, catchError(AllSumTotalServices));

  // monthly income total
  app
    .route("/api/v1/monthly-total-sale")
    .get(verifyToken, catchError(monthlyTotalSale));

  // weekly income total
  app
    .route("/api/v1/weekly-total-sale")
    .get(verifyToken, catchError(weeklyTotalSale));
};
