let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const date = require('../midlewares/date')
var d = new Date(date.fullDate.toString());
const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    interest_rate:{type:Number,default:7.08},
    outstanding_principal:{type:Number,required:true},
    outstanding_interest:{type:Number,default:0.0},
    original_principal:{type:Number,required:true},
    origination_date:{type:String,default:date.fullDate},
    time:{type:String,default:date.time},
    monthly_payment:{type:Number},
    year:{type:Number},
    month:{type:Number},
    loan_status:{type:String,default:"pending"},
    payment:{type:Number,default:0},
    repayment_plan_begin_date:{type:String,default:d.setMonth(d.getMonth() + 1)},
    user_id:{type:String,}

})
let requestLoan = mongoose.model('request_loan', user_schema);
module.exports = requestLoan;
