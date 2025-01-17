const { catchError } = require("../lib/errorHandler");
const {
  AllSumTotalServices,
} = require("../new_services/NewIncomeTotalServices");

module.exports = (app) => {
  app
    .route("/api/v1/new-total-income-reports")
    .get(catchError(AllSumTotalServices));
};
