"use strict"

const { listAllData, createData, dataById, updateDataById, deleteDataById } = require("../controllers/controller");
const { excelImport } = require("../controllers/excelImportController");
const { storage } = require("../helper/fileUploader");
const { catchError } = require("../lib/errorHandler");
const verifyToken = require('../lib/verifyToken');
const { inputDataFromExcel } = require("../services/excelService");
const multer = require("multer");
const upload = multer({storage: storage})

module.exports = (app) => {
    
    app.route('/api/v1/item')
        .get(listAllData)
        .post(catchError(createData))

        
    app.route('/api/v1/item/:id')
        .get(catchError(dataById)) 
        .put(catchError(updateDataById))
        .delete(catchError(deleteDataById))

    app.route("/api/v1/excel/import")
        .get(upload.single
        ("excel"), catchError(excelImport))
};
