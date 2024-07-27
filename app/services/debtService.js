const debt = require("../models/debt")

exports.createDebt = async (data) => {
    const result = await debt.create(data)
    return result;
} 