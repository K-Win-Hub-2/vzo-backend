"use strict"

const moment = require("moment-timezone")

exports.startDateEndDateHelper = (date) => {
    let startDate, endDate
    if(date.value == "substract"){
        console.log('substract', date.exact)
        endDate = new Date(date.exact).toISOString()
        startDate = moment.tz(endDate, "Asia/Yangon").subtract(1, "day").startOf("day").format()
    }
    else if(date.value == "add"){
        console.log("add", date.exact)
        startDate = new Date(date.exact).toISOString()
        endDate = moment.tz(endDate, "Asia/Yangon").add(1, "day").startOf("day").format()
    }
    else{
        startDate = moment.tz(date.startDate, "Asia/Yangon").startOf("day").format(),
        endDate = moment.tz(date.endDate, "Asia/Yangon").startOf("day").format()
    }
    return { startDate: startDate, endDate: endDate}
}