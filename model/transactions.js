let mongoose = require('mongoose');
const date = require('../midlewares/date')

const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    loan_id:{type:Number},
    amount:{type:Number,required:true},
    description:{type:String},
    type:{type:String,required:true},
    status:{type:String,default:"pending"},
    date:{type:String,default:date.fullDate},
    time:{type:String,default:date.time},
    year:{type:Number},
    month:{type:Number},
    payment:{type:Number,default:0},
    repayment_plan_begin_date:{type:String,default:d.null},
    user_id:{type:String,}

})
let requestLoan = mongoose.model('request_loan', user_schema);
module.exports = requestLoan;
