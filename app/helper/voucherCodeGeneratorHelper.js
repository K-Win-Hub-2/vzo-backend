const itemVoucher = require("../models/itemVoucher")
const moment = require("moment-timezone")
const todayDate = moment.tz("Asia/Yangon").format("yyyy-MM-DD").split("-").join("")
exports.generateVoucherCode = async () => {
   let voucherData = await itemVoucher.find().sort({seq: -1}).limit(1)
   if(voucherData.length === 0 ) return  { seq: 1, code: "VC-"+ todayDate + "-" + 1}
   const seq = voucherData[0].seq + 1
   return { seq: seq, code: "VC-"+ todayDate + "-" + seq}
}