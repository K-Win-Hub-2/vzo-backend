const userShiftController = require("../controllers/userShiftController");

module.exports = (app) => {
  app.route("/api/userShift").post(userShiftController.createUserShift);
};
