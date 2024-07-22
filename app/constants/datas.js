const { getAllDamageItems, createDamageItems, updateDamageItem, getDamageItemById, deleteDamageItem } = require("../services/damagePersonalService");
const { getAllItemPackage, createitemsPackage, updateItemPackage, getItemPackageById, deleteItemPackage } = require("../services/itemPackageService");
const { deleteItem, getItemById, updateItem, createItems, getAllItems } = require("../services/itemService");
const { getAllItemTitles, createItemTitle, updateTitleItem, getItemTitleById, deleteTitleItem } = require("../services/itemTitleService");
const { getAllSuperCategories, createSuperCategories, updateCategories, getCategoriesById, deleteSuperCategories } = require("../services/superCategoryService");
const { getAllStockIncludingRepackage } = require("../services/totalItemStockService");

exports.ServiceDatas = {
    "super-category": {
        list: getAllSuperCategories, 
        create: createSuperCategories, 
        update: updateCategories, 
        listById: getCategoriesById,
        delete: deleteSuperCategories,  //add delete functionality here
    },
    "item":{
        list: getAllItems, 
        create: createItems, 
        update: updateItem, 
        listById: getItemById,
        delete: deleteItem
    },
    "item-package": {
        list: getAllItemPackage,
        create: createitemsPackage,
        update: updateItemPackage,
        listById: getItemPackageById,
        delete: deleteItemPackage
    },
    "item-title": {
        list: getAllItemTitles,
        create: createItemTitle,
        update: updateTitleItem,
        listById: getItemTitleById,
        delete: deleteTitleItem
    },
    "stock-and-package": {
        list: getAllStockIncludingRepackage
    },
    "damage-item":{
        list: getAllDamageItems,
        create: createDamageItems,
        update: updateDamageItem,
        listById: getDamageItemById,
        delete: deleteDamageItem
    },
    "personal-use-item":{
        list: getAllDamageItems,
        create: createDamageItems,
        update: updateDamageItem,
        listById: getDamageItemById,
        delete: deleteDamageItem
    },
    "item-voucher":{}
}