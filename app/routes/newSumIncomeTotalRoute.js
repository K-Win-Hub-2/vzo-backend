const { catchError } = require("../lib/errorHandler");
const {
  AllSumTotalServices,
} = require("../new_services/NewIncomeTotalServices");
const { monthlyTotalSale } = require("../new_services/monthlyTotalSale");

module.exports = (app) => {
  // start and end date
  app
    .route("/api/v1/new-total-income-reports")
    .get(catchError(AllSumTotalServices));

  // monthly income
  app.route("/api/v1/monthly-total-sale").get(catchError(monthlyTotalSale));
};
