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
    monthly_payment:{type:Number,required:true},
    year:{type:Number,default:null},
    month:{type:Number,default:null},
    approve_by:{type:Number,default:null},
    approve_at:{type:String,default:null},
    disbursed_by:{type:Number,default:null},
    disbursed_at:{type:String,default:null},
    closed_by:{type:Number,default:null},
    closed_at:{type:String,default:null},
    total_paid:{type:Number,default:0},
    total_remain:{type:Number,default:null},
    total_topay:{type:Number,default:null},
    loan_status:{type:String,default:"pending"},
    payment:{type:Number,default:0},
    repayment_plan_begin_date:{type:String},
    user_id:{type:String}

})
let requestLoan = mongoose.model('request_loan', user_schema);
module.exports = requestLoan;




// {
//     "data": [
//         {
//             "name": "Abbey Mortgage Bank",
//             "slug": "abbey-mortgage-bank",
//             "code": "801",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 174,
//             "createdAt": "2020-12-07T16:19:09.000Z",
//             "updatedAt": "2020-12-07T16:19:19.000Z"
//         },
//         {
//             "name": "Access Bank",
//             "slug": "access-bank",
//             "code": "044",
//             "longcode": "044150149",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 1,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T08:06:44.000Z"
//         },
//         {
//             "name": "Access Bank (Diamond)",
//             "slug": "access-bank-diamond",
//             "code": "063",
//             "longcode": "063150162",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 3,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T08:06:48.000Z"
//         },
//         {
//             "name": "ALAT by WEMA",
//             "slug": "alat-by-wema",
//             "code": "035A",
//             "longcode": "035150103",
//             "gateway": "emandate",
//             "pay_with_bank": true,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 27,
//             "createdAt": "2017-11-15T12:21:31.000Z",
//             "updatedAt": "2021-02-18T14:55:34.000Z"
//         },
//         {
//             "name": "ASO Savings and Loans",
//             "slug": "asosavings",
//             "code": "401",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 63,
//             "createdAt": "2018-09-23T05:52:38.000Z",
//             "updatedAt": "2019-01-30T09:38:57.000Z"
//         },
//         {
//             "name": "Bowen Microfinance Bank",
//             "slug": "bowen-microfinance-bank",
//             "code": "50931",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 108,
//             "createdAt": "2020-02-11T15:38:57.000Z",
//             "updatedAt": "2020-02-11T15:38:57.000Z"
//         },
//         {
//             "name": "CEMCS Microfinance Bank",
//             "slug": "cemcs-microfinance-bank",
//             "code": "50823",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 74,
//             "createdAt": "2020-03-23T15:06:13.000Z",
//             "updatedAt": "2020-03-23T15:06:28.000Z"
//         },
//         {
//             "name": "Citibank Nigeria",
//             "slug": "citibank-nigeria",
//             "code": "023",
//             "longcode": "023150005",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 2,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:24:02.000Z"
//         },
//         {
//             "name": "Coronation Merchant Bank",
//             "slug": "coronation-merchant-bank",
//             "code": "559",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 173,
//             "createdAt": "2020-11-24T10:25:07.000Z",
//             "updatedAt": "2020-11-24T10:25:07.000Z"
//         },
//         {
//             "name": "Ecobank Nigeria",
//             "slug": "ecobank-nigeria",
//             "code": "050",
//             "longcode": "050150010",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 4,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:23:53.000Z"
//         },
//         {
//             "name": "Ekondo Microfinance Bank",
//             "slug": "ekondo-microfinance-bank",
//             "code": "562",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 64,
//             "createdAt": "2018-09-23T05:55:06.000Z",
//             "updatedAt": "2018-09-23T05:55:06.000Z"
//         },
//         {
//             "name": "Eyowo",
//             "slug": "eyowo",
//             "code": "50126",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 167,
//             "createdAt": "2020-09-07T13:52:22.000Z",
//             "updatedAt": "2020-11-24T10:03:21.000Z"
//         },
//         {
//             "name": "Fidelity Bank",
//             "slug": "fidelity-bank",
//             "code": "070",
//             "longcode": "070150003",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 6,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T07:25:19.000Z"
//         },
//         {
//             "name": "Firmus MFB",
//             "slug": "firmus-mfb",
//             "code": "51314",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 177,
//             "createdAt": "2021-06-01T15:33:26.000Z",
//             "updatedAt": "2021-06-01T15:33:26.000Z"
//         },
//         {
//             "name": "First Bank of Nigeria",
//             "slug": "first-bank-of-nigeria",
//             "code": "011",
//             "longcode": "011151003",
//             "gateway": "ibank",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 7,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-03-25T14:22:52.000Z"
//         },
//         {
//             "name": "First City Monument Bank",
//             "slug": "first-city-monument-bank",
//             "code": "214",
//             "longcode": "214150018",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 8,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T08:06:46.000Z"
//         },
//         {
//             "name": "FSDH Merchant Bank Limited",
//             "slug": "fsdh-merchant-bank-limited",
//             "code": "501",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 112,
//             "createdAt": "2020-08-20T09:37:04.000Z",
//             "updatedAt": "2020-11-24T10:03:22.000Z"
//         },
//         {
//             "name": "Globus Bank",
//             "slug": "globus-bank",
//             "code": "00103",
//             "longcode": "103015001",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 70,
//             "createdAt": "2020-02-11T15:38:57.000Z",
//             "updatedAt": "2020-02-11T15:38:57.000Z"
//         },
//         {
//             "name": "Guaranty Trust Bank",
//             "slug": "guaranty-trust-bank",
//             "code": "058",
//             "longcode": "058152036",
//             "gateway": "ibank",
//             "pay_with_bank": true,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 9,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-01-01T11:22:11.000Z"
//         },
//         {
//             "name": "Hackman Microfinance Bank",
//             "slug": "hackman-microfinance-bank",
//             "code": "51251",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 111,
//             "createdAt": "2020-08-20T09:32:48.000Z",
//             "updatedAt": "2020-11-24T10:03:24.000Z"
//         },
//         {
//             "name": "Hasal Microfinance Bank",
//             "slug": "hasal-microfinance-bank",
//             "code": "50383",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 81,
//             "createdAt": "2020-02-11T15:38:57.000Z",
//             "updatedAt": "2020-02-11T15:38:57.000Z"
//         },
//         {
//             "name": "Heritage Bank",
//             "slug": "heritage-bank",
//             "code": "030",
//             "longcode": "030159992",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 10,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:24:23.000Z"
//         },
//         {
//             "name": "Ibile Microfinance Bank",
//             "slug": "ibile-mfb",
//             "code": "51244",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 168,
//             "createdAt": "2020-10-21T10:54:20.000Z",
//             "updatedAt": "2020-10-21T10:54:33.000Z"
//         },
//         {
//             "name": "Infinity MFB",
//             "slug": "infinity-mfb",
//             "code": "50457",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 172,
//             "createdAt": "2020-11-24T10:23:37.000Z",
//             "updatedAt": "2020-11-24T10:23:37.000Z"
//         },
//         {
//             "name": "Jaiz Bank",
//             "slug": "jaiz-bank",
//             "code": "301",
//             "longcode": "301080020",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 22,
//             "createdAt": "2016-10-10T17:26:29.000Z",
//             "updatedAt": "2016-10-10T17:26:29.000Z"
//         },
//         {
//             "name": "Keystone Bank",
//             "slug": "keystone-bank",
//             "code": "082",
//             "longcode": "082150017",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 11,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:23:45.000Z"
//         },
//         {
//             "name": "Kuda Bank",
//             "slug": "kuda-bank",
//             "code": "50211",
//             "longcode": "",
//             "gateway": "digitalbankmandate",
//             "pay_with_bank": true,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 67,
//             "createdAt": "2019-11-15T17:06:54.000Z",
//             "updatedAt": "2020-07-01T15:05:18.000Z"
//         },
//         {
//             "name": "Lagos Building Investment Company Plc.",
//             "slug": "lbic-plc",
//             "code": "90052",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 109,
//             "createdAt": "2020-08-10T15:07:44.000Z",
//             "updatedAt": "2020-08-10T15:07:44.000Z"
//         },
//         {
//             "name": "Mayfair MFB",
//             "slug": "mayfair-mfb",
//             "code": "50563",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 175,
//             "createdAt": "2021-02-02T08:28:38.000Z",
//             "updatedAt": "2021-02-02T08:28:38.000Z"
//         },
//         {
//             "name": "Mint MFB",
//             "slug": "mint-mfb",
//             "code": "50304",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 178,
//             "createdAt": "2021-06-01T16:07:29.000Z",
//             "updatedAt": "2021-06-01T16:07:29.000Z"
//         },
//         {
//             "name": "One Finance",
//             "slug": "one-finance",
//             "code": "565",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 82,
//             "createdAt": "2020-06-16T08:15:31.000Z",
//             "updatedAt": "2020-06-16T08:15:31.000Z"
//         },
//         {
//             "name": "PalmPay",
//             "slug": "palmpay",
//             "code": "999991",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 169,
//             "createdAt": "2020-11-24T09:58:37.000Z",
//             "updatedAt": "2020-11-24T10:03:19.000Z"
//         },
//         {
//             "name": "Parallex Bank",
//             "slug": "parallex-bank",
//             "code": "526",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 26,
//             "createdAt": "2017-03-31T13:54:29.000Z",
//             "updatedAt": "2019-01-30T09:43:56.000Z"
//         },
//         {
//             "name": "Parkway - ReadyCash",
//             "slug": "parkway-ready-cash",
//             "code": "311",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 110,
//             "createdAt": "2020-08-10T15:07:44.000Z",
//             "updatedAt": "2020-08-10T15:07:44.000Z"
//         },
//         {
//             "name": "Paycom",
//             "slug": "paycom",
//             "code": "999992",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 171,
//             "createdAt": "2020-11-24T10:20:45.000Z",
//             "updatedAt": "2020-11-24T10:20:54.000Z"
//         },
//         {
//             "name": "Petra Mircofinance Bank Plc",
//             "slug": "petra-microfinance-bank-plc",
//             "code": "50746",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 170,
//             "createdAt": "2020-11-24T10:03:06.000Z",
//             "updatedAt": "2020-11-24T10:03:06.000Z"
//         },
//         {
//             "name": "Polaris Bank",
//             "slug": "polaris-bank",
//             "code": "076",
//             "longcode": "076151006",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 13,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2016-07-14T10:04:29.000Z"
//         },
//         {
//             "name": "Providus Bank",
//             "slug": "providus-bank",
//             "code": "101",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 25,
//             "createdAt": "2017-03-27T16:09:29.000Z",
//             "updatedAt": "2021-02-09T17:50:06.000Z"
//         },
//         {
//             "name": "Rand Merchant Bank",
//             "slug": "rand-merchant-bank",
//             "code": "502",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 176,
//             "createdAt": "2021-02-11T17:33:20.000Z",
//             "updatedAt": "2021-02-11T17:33:20.000Z"
//         },
//         {
//             "name": "Rubies MFB",
//             "slug": "rubies-mfb",
//             "code": "125",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 69,
//             "createdAt": "2020-01-25T09:49:59.000Z",
//             "updatedAt": "2020-01-25T09:49:59.000Z"
//         },
//         {
//             "name": "Sparkle Microfinance Bank",
//             "slug": "sparkle-microfinance-bank",
//             "code": "51310",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 72,
//             "createdAt": "2020-02-11T18:43:14.000Z",
//             "updatedAt": "2020-02-11T18:43:14.000Z"
//         },
//         {
//             "name": "Stanbic IBTC Bank",
//             "slug": "stanbic-ibtc-bank",
//             "code": "221",
//             "longcode": "221159522",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 14,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:24:17.000Z"
//         },
//         {
//             "name": "Standard Chartered Bank",
//             "slug": "standard-chartered-bank",
//             "code": "068",
//             "longcode": "068150015",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 15,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:23:40.000Z"
//         },
//         {
//             "name": "Sterling Bank",
//             "slug": "sterling-bank",
//             "code": "232",
//             "longcode": "232150016",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 16,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-04-28T09:58:56.000Z"
//         },
//         {
//             "name": "Suntrust Bank",
//             "slug": "suntrust-bank",
//             "code": "100",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 23,
//             "createdAt": "2016-10-10T17:26:29.000Z",
//             "updatedAt": "2016-10-10T17:26:29.000Z"
//         },
//         {
//             "name": "TAJ Bank",
//             "slug": "taj-bank",
//             "code": "302",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 68,
//             "createdAt": "2020-01-20T11:20:32.000Z",
//             "updatedAt": "2020-01-20T11:20:32.000Z"
//         },
//         {
//             "name": "TCF MFB",
//             "slug": "tcf-mfb",
//             "code": "51211",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 75,
//             "createdAt": "2020-04-03T09:34:35.000Z",
//             "updatedAt": "2020-04-03T09:34:35.000Z"
//         },
//         {
//             "name": "Titan Bank",
//             "slug": "titan-bank",
//             "code": "102",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 73,
//             "createdAt": "2020-03-10T11:41:36.000Z",
//             "updatedAt": "2020-03-23T15:06:29.000Z"
//         },
//         {
//             "name": "Union Bank of Nigeria",
//             "slug": "union-bank-of-nigeria",
//             "code": "032",
//             "longcode": "032080474",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 17,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2020-02-18T20:22:54.000Z"
//         },
//         {
//             "name": "United Bank For Africa",
//             "slug": "united-bank-for-africa",
//             "code": "033",
//             "longcode": "033153513",
//             "gateway": "emandate",
//             "pay_with_bank": true,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 18,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-06-19T09:49:44.000Z"
//         },
//         {
//             "name": "Unity Bank",
//             "slug": "unity-bank",
//             "code": "215",
//             "longcode": "215154097",
//             "gateway": "emandate",
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 19,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2019-07-22T12:44:02.000Z"
//         },
//         {
//             "name": "VFD Microfinance Bank Limited",
//             "slug": "vfd",
//             "code": "566",
//             "longcode": "",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": false,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 71,
//             "createdAt": "2020-02-11T15:44:11.000Z",
//             "updatedAt": "2020-10-28T09:42:08.000Z"
//         },
//         {
//             "name": "Wema Bank",
//             "slug": "wema-bank",
//             "code": "035",
//             "longcode": "035150103",
//             "gateway": null,
//             "pay_with_bank": false,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 20,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-02-09T17:49:59.000Z"
//         },
//         {
//             "name": "Zenith Bank",
//             "slug": "zenith-bank",
//             "code": "057",
//             "longcode": "057150013",
//             "gateway": "emandate",
//             "pay_with_bank": true,
//             "active": true,
//             "is_deleted": null,
//             "country": "Nigeria",
//             "currency": "NGN",
//             "type": "nuban",
//             "id": 21,
//             "createdAt": "2016-07-14T10:04:29.000Z",
//             "updatedAt": "2021-06-01T11:01:30.000Z"
//         }
//     ],
//     "message": "Banks retrieved",
//     "status": true
// }