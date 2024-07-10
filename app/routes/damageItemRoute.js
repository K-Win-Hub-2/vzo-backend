"use strict";

const { createDamageList, listAllDamageItem } = require("../controllers/damageItemController");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {
    app.route('/api/items/damage')
        .post(verifyToken, catchError(createDamageList))
        .get(verifyToken, catchError(listAllDamageItem))

};
