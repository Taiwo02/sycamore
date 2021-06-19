let mongoose = require('mongoose');
const date = require('../midlewares/date')

const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    loan_id:{type:String},
    amount:{type:Number,required:true},
    description:{type:String,default:null},
    type:{type:String,default:null},
    status:{type:String,default:"pending"},
    date:{type:String,default:null},
    time:{type:String,default:null},
    amount_before:{type:Number,default:null},
    amount_after:{type:Number,default:null},
    atempt:{type:Number,default:null},
    reference:{type:String,default:null},
    user_id:{type:String,default:null},
    status:{type:String,default:null},
    currency:{type:String,default:null}
})
let transaction = mongoose.model('transactions', user_schema);
module.exports = transaction;
