"use strict"

const fs = require('node:fs')

//check folder
exports.checkFolder = (folderName) => {
    return fs.existsSync(folderName)
}

//creation for folder
exports.folderCreation = (folderName) => {
    if(!this.checkFolder(folderName)){
        fs.mkdirSync(folderName)
    }
    // Code for file creation goes here
    return ;
}
