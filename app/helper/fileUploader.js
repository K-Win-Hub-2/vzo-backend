"use strict"
const path = require("path")
const { folderCreation } = require('./folderCreation')
const multer = require("multer")
const { folderPath } = require("../../config/folderPath")

exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const pathDir = path.join(__dirname,"../../")
        const upperFolder = path.join(pathDir,"public")
        const desiredFolder = path.join(upperFolder, folderPath[file.fieldname])
        folderCreation(upperFolder)
        folderCreation(desiredFolder)
        cb(null, desiredFolder)         
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "_" + file.originalname)  
    }
})
