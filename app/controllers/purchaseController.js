'use strict';
const Purchase = require('../models/purchase');
const MedicineItems = require('../models/medicineItem');
const ProcedureItems = require('../models/procedureItem');
const AccessoryItems = require('../models/accessoryItem');
const Transaction = require('../models/transaction');
const Accounting = require('../models/accountingList');
const medicineItem = require('../models/medicineItem');
const { ObjectId } = require('mongodb');
const procedureItem = require('../models/procedureItem');
const accessoryItem = require('../models/accessoryItem');
const { addItemsArrayifPurchase } = require('../helper/checkItems');

exports.listAllPurchases = async (req, res) => {
    let { keyword, role, limit, skip, confirmPurchase } = req.query;
    let count = 0;
    let page = 0;
    try {
        limit = +limit <= 100 ? +limit : 10; //limit
        skip = +skip || 0;
        let query = { isDeleted: false, confirmPurchase: false },
            regexKeyword;
        role ? (query['role'] = role.toUpperCase()) : '';
        keyword && /\w/.test(keyword)
            ? (regexKeyword = new RegExp(keyword, 'i'))
            : '';
        regexKeyword ? (query['name'] = regexKeyword) : '';
        confirmPurchase ? query["confirmPurchase"] = confirmPurchase : ""
        let result = await Purchase.find(query).populate("items.item_id").populate('supplierName').populate('medicineItems.item_id').populate('procedureItems.item_id').populate('relatedBranch')
        count = await Purchase.find(query).count();
        const division = count / limit;
        page = Math.ceil(division);

        res.status(200).send({
            success: true,
            count: count,
            _metadata: {
                current_page: skip / limit + 1,
                per_page: limit,
                page_count: page,
                total_count: count,
            },
            list: result,
        });
    } catch (e) {
        return res.status(500).send({ error: true, message: e.message });
    }
};

exports.getPurchase = async (req, res) => {
    const result = await Purchase.find({ _id: req.params.id, isDeleted: false }).populate("items.item_id").populate('supplierName').populate('medicineItems.item_id').populate('procedureItems.item_id').populate('accessoryItems.item_id')
    if (!result)
        return res.status(500).json({ error: true, message: 'No Record Found' });
    return res.status(200).send({ success: true, data: result });
};

exports.createPurchase = async (req, res, next) => {
    let data = req.body
    try {
        const result = await Purchase.create(data)
        addItemsArrayifPurchase(data.items)
        return res.status(200).send({ success: true, message: 'Purchase created successfully',  data: result });
    } catch (error) {
        return res.status(500).send({ "error": true, message: error.message })
    }
};

exports.updateAndEditPurchaseHistory = async (req,res) => {
    try{
        let data = req.body
        let {medicineItemId, procedureItemId, accessoryItemId, purchaseHistoryId, ...changeData} = data
        if(medicineItemId){
            const history = await medicineItem.findOne({ _id: ObjectId(medicineItemId) });
            let updateCurrentQuantity = 0 ;
            const {  purchaseHistory } = history
            purchaseHistory.map(p=>{
                    if(p.equals(purchaseHistoryId)){
                        let { sellingPrice, purchasePrice, purchaseDate, currentQuantity, totalUnit, totalPrice, unit, expireDate} = changeData
                        p.sellingPrice = sellingPrice || p.sellingPrice
                        p.purchasePrice = purchasePrice || p.purchasePrice
                        p.purchaseDate = purchaseDate || p.purchaseDate
                        p.currentQuantity = currentQuantity || p.currentQuantity
                        p.totalUnit = totalUnit || p.totalUnit
                        p.totalPrice = totalPrice || p.totalPrice
                        p.expireDate = expireDate || p.expireDate
                        p.unit = unit || p.unit
                        updateCurrentQuantity += p.currentQuantity
                        return p
                    }
                    updateCurrentQuantity += p.currentQuantity
                    return p
                })
                history.totalUnit = (Number(history.fromUnit) / Number(history.toUnit)) * updateCurrentQuantity
                history.currentQuantity = updateCurrentQuantity
                history.sellingPrice = purchaseHistory[purchaseHistory.length - 1].sellingPrice
                history.purchasePrice = purchaseHistory[purchaseHistory.length - 1].purchasePrice
                await history.save()
        }
        if(procedureItemId){
                const history = await procedureItem.findOne({ _id: ObjectId(procedureItemId)})
                let updateCurrentQuantity = 0 ;
                const {  purchaseHistory } = history
                purchaseHistory.map((p)=>{
                    if(p.equals(purchaseHistoryId)){
                        let { sellingPrice, purchasePrice, purchaseDate, currentQuantity, totalUnit, totalPrice, unit, expireDate} = changeData
                        p.sellingPrice = sellingPrice || p.sellingPrice
                        p.purchasePrice = purchasePrice || p.purchasePrice
                        p.purchaseDate = purchaseDate || p.purchaseDate
                        p.currentQuantity = currentQuantity || p.currentQuantity
                        p.totalUnit = totalUnit || p.totalUnit
                        p.totalPrice = totalPrice || p.totalPrice
                        p.expireDate = expireDate || p.expireDate
                        p.unit = unit || p.unit
                        updateCurrentQuantity += p.currentQuantity
                        return p
                    }
                    updateCurrentQuantity += p.currentQuantity
                    return p
                })
                history.totalUnit = (Number(history.fromUnit) / Number(history.toUnit)) * updateCurrentQuantity
                history.currentQuantity = updateCurrentQuantity
                history.sellingPrice = purchaseHistory[purchaseHistory.length - 1].sellingPrice
                history.purchasePrice = purchaseHistory[purchaseHistory.length - 1].purchasePrice
                await history.save()
        }
        if(accessoryItemId){
            const history = await accessoryItem.findOne({ _id: ObjectId(accessoryItemId)})
            let updateCurrentQuantity = 0 ;
            const {  purchaseHistory } = history
            purchaseHistory.map(p=>{
                    if(p.equals(purchaseHistoryId)){
                        let { sellingPrice, purchasePrice, purchaseDate, currentQuantity, totalUnit, totalPrice, unit, expireDate} = changeData
                        p.sellingPrice = sellingPrice || p.sellingPrice
                        p.purchasePrice = purchasePrice || p.purchasePrice
                        p.purchaseDate = purchaseDate || p.purchaseDate
                        p.currentQuantity = currentQuantity || p.currentQuantity
                        p.totalUnit = totalUnit || p.totalUnit
                        p.totalPrice = totalPrice || p.totalPrice
                        p.expireDate = expireDate || p.expireDate
                        p.unit = unit || p.unit
                        updateCurrentQuantity += p.currentQuantity
                        return p
                    }
                    updateCurrentQuantity += p.currentQuantity
                    return p
                })
                history.totalUnit = (Number(history.fromUnit) / Number(history.toUnit)) * updateCurrentQuantity
                history.currentQuantity = updateCurrentQuantity
                history.sellingPrice = purchaseHistory[purchaseHistory.length - 1].sellingPrice
                history.purchasePrice = purchaseHistory[purchaseHistory.length - 1].purchasePrice
                await history.save()
        } 
        // console.log("update is ",result)
        res.status(200).send({
            success: true,
            message: "Updated Item",
            // data: result
        })
    }catch(er){
        res.status(400).send({
            error: true,
            message: er.message
        })
    }
}

exports.damageItem = async (req,res) => {
    try {
        
    } catch (error) {
        res.status(500).send({
            error: true,
            message: error.messaage
        })
    }
}

exports.updateProcedureHistory = async (req, res, next) => {
    let data = req.body;

    let files = req.files;
    try {
        if (files.before) {
            data = { ...data, before: [] };
            for (const element of files.before) {
                let imgPath = element.path.split('cherry-k')[1];
                const attachData = {
                    fileName: element.originalname,
                    imgUrl: imgPath,
                    image: imgPath.split('\\')[2]
                };
                const attachResult = await Attachment.create(attachData);
                console.log('attach', attachResult._id.toString());
                data.before.push(attachResult._id.toString());
            }
        }
        console.log(data)
        if (files.after) {
            data = { ...data, after: [] };
            for (const element of files.after) {
                let imgPath = element.path.split('cherry-k')[1];
                const attachData = {
                    fileName: element.originalname,
                    imgUrl: imgPath,
                    image: imgPath.split('\\')[2]
                };
                const attachResult = await Attachment.create(attachData);
                console.log('attach', attachResult._id.toString());
                data.after.push(attachResult._id.toString());
            }
        }
        console.log(data, 'heree')
        const result = await procedureHistory.findOneAndUpdate({ _id: req.body._id }, data, { new: true }).populate('medicineItems.item_id customTreatmentPackages.item_id pHistory relatedAppointment relatedTreatmentSelection before after')
        res.status(200).send({
            message: 'ProcedureHistory update success',
            success: true,
            data: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ "error": true, message: error.message });
    }
}

exports.deletePurchase = async (req, res, next) => {
    try {
        const result = await Purchase.findOneAndUpdate(
            { _id: req.params.id },
            { isDeleted: true },
            { new: true },
        );
        return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
    } catch (error) {
        return res.status(500).send({ "error": true, "message": error.message })

    }
}

exports.activatePurchase = async (req, res, next) => {
    try {
        const result = await Purchase.findOneAndUpdate(
            { _id: req.params.id },
            { isDeleted: false },
            { new: true },
        );
        return res.status(200).send({ success: true, data: { isDeleted: result.isDeleted } });
    } catch (error) {
        return res.status(500).send({ "error": true, "message": error.message })
    }
};

exports.activateAndAddItemIfConfirmed = async (req, res, next) => {
    try {
        const result = await Purchase.findOne(
            { _id: req.params.id }
        );
        addItemsArrayifPurchase(result.items)
        result.confirmPurchase = true
        await result.save()
        return res.status(200).send({ success: true, data: result });
    } catch (error) {
        return res.status(500).send({ "error": true, "message": error.message })
    }
};