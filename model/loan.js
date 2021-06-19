let mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const date = require('../midlewares/date')
var d = new Date(date.fullDate.toString());
console.log(d.setMonth(d.getMonth() + 1))
const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    interest_rate:{type:Number,default:7.08},
    outstanding_principal:{type:Number,required:true},
    outstanding_interest:{type:Number,default:0.0},
    original_principal:{type:Number,required:true},
    origination_date:{type:String,default:date.fullDate},
    time:{type:String,default:date.time},
    monthly_payment:{type:Number,default:null},
    year:{type:Number,default:null},
    month:{type:Number,default:null},
    approve_by:{type:Number,default:null},
    approve_at:{type:String,default:null},
    disbursed_by:{type:Number,default:null},
    disbursed_at:{type:String,default:null},
    closed_by:{type:Number,default:null},
    closed_at:{type:String,default:null},
    total_paid:{type:Number,default:null},
    total_remain:{type:Number,default:null},
    total_topay:{type:Number,default:null},
    loan_status:{type:String,default:"pending"},
    payment:{type:Number,default:0},
    repayment_plan_begin_date:{type:String},
    user_id:{type:String}

})
let requestLoan = mongoose.model('request_loan', user_schema);
module.exports = requestLoan;
