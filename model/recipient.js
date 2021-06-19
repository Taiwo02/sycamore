let mongoose = require('mongoose');
const date = require('../midlewares/date')

const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    loan_id:{type:String,default:null},
    account_number:{type:String},
    account_name:{type:Number,required:true},
    bank_code:{type:String,default:null},
    bank_name:{type:String,default:null},
    status:{type:String,default:"active"},
    currency:{type:String,default:null},
    type:{type:String,default:null},
    recipient_code:{type:Number,default:null},
    name:{type:Number,default:null},
    date:{type:String,default:null},
    time:{type:String,default:null},
    created_by:{type:String},
    updated_by:{type:String}


})
let recipient = mongoose.model('recipient', user_schema);
module.exports = recipient;
