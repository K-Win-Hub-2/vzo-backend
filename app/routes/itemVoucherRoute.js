"use strict"

const { listAllData, createData, dataById, updateDataById, deleteDataById } = require("../controllers/controller");
const { checkPackageArrayifStockIsAvailable, checkItemArrayifItemIsAvailable } = require("../helper/checkItems");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');

module.exports = (app) => {

    app.route('/api/v1/item-voucher')
        .get(listAllData)
        .post(checkItemArrayifItemIsAvailable, checkPackageArrayifStockIsAvailable, catchError(createData))

        
    app.route('/api/v1/item-voucher/:id')
        .get(catchError(dataById)) 
        .put(catchError(updateDataById))
        .delete(catchError(deleteDataById))

    app.route('/api/v1/voucher-calculation')
        .get(listAllData)
    
    app.route('/api/v1/total-account-reports')
        .get(listAllData)

    app.route('/api/v1/top-ten')
       .get(listAllData)
    
};
