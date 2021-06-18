let mongoose = require('mongoose');
const date = require('../midlewares/date')

const saltingRounds=10
const Schema = mongoose.Schema
let user_schema = new Schema({
    user_id:{type:String},
    balance:{type:Number},
    currency:{type:String},
    status:{type:String,default:"active"},
    date:{type:String,default:date.fullDate},
    time:{type:String,default:date.time},
    system:{type:Boolean,default:false}
})
let wallet = mongoose.model('wallet', user_schema);
module.exports = wallet;
