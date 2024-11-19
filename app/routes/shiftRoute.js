const shiftController = require("../controllers/shiftController");

module.exports = (app) => {
  app.route("/api/shift").post(shiftController.createShift);
  app.route("/api/shifts").get(shiftController.getShifts);
  app.route("/api/shift/:id").get(shiftController.getShift);
  app.route("/api/shift/:id").put(shiftController.updateShift);
  app.route("/api/shift/:id").delete(shiftController.deleteShift);
};
