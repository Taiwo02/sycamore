let mongoose = require('mongoose');
const date = require('../midlewares/date')

const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    loan_id:{type:Number},
    amount:{type:Number,required:true},
    description:{type:String},
    type:{type:String},
    status:{type:String,default:"pending"},
    date:{type:String},
    time:{type:String},
    amount_before:{type:Number},
    amount_after:{type:Number},
    atempt:{type:Number},
    reference:{type:String},
    user_id:{type:String},
    status:{type:String},
    currency:{type:String}

})
let transaction = mongoose.model('transactions', user_schema);
module.exports = transaction;
