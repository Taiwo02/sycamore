const User = require('../model/user');
const Loan = require('../model/loan')
const Wallet = require('../model/wallet')
const Transaction = require('../model/transactions')
const Recipient = require('../model/recipient')
const jwt = require('jsonwebtoken');
const date = require('../midlewares/date')
const _ = require('lodash');
const path = require('path');

const  paystack = require('../config/paystack')
// data = [{
//     firstname:"admin",
//     lastname:"admin",
//     email: 'user1@gmail.com',
//     password: '123456',
//     address:"Admin address",
//     isAdmin: true
// }];

// beforeEach(async () => {
//     await User.create(data)
//   })
let staffs = {
    home:async(req,res)=>{
     try {
         res.status(200).send('Welcome to the home page');
        } catch (error) {
          res.status(500).send(error);
         }
        },
    create: async (req, res)=> {
           try {
            const {firstname,lastname,email,address,password} = req.body; 
            const result=await new User({firstname,lastname,email,address,password});
            result.save(function(error,response){
                if(response && !error){ 
                  const walletDetails = new Wallet({user_id:response._id,balance:0,currency:"NGN",});
                  walletDetails.save();
                    res.status(200).send(response)
                }
                else{
                console.log(error)

                    res.status(500).send(error)


                }
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },
    login: async (req,res)=>{
        try {
            const {email,password}=req.body;
            User.findOne({email,password},(err,user)=>{
            if(!err && user){
            const payload = { user: user._id};
            const secret ='hello';
            const token = jwt.sign(payload, secret);
            
            User.findOne({ $or: [{ _id:user._id,status:"active" },{isAdmin: true }, { age: 2 }]}).then(result =>
                res.status(200).send({token: token })
            )
            }
            else{ res.status(404).send('invalid email or password');}
            });
          }
          catch (error) { res.status(500).send(error)}
    },
    getall:async(req,res)=>{
        result = await User.find({},(err,users)=>{
        if(err) throw err;
        res.status(200).send(users)
    })
    },

    requestLoan:async(req,res)=>{
        try {
            const {original_principal,monthly_payment} = req.body;
            let mt = original_principal / monthly_payment;
            let value = mt * 0.083388698630137
            var totalDays = value * 365;
            var years = Math.floor(totalDays/365);
            var months = Math.floor((totalDays-(years *365))/30);
            const result=await new Loan({
                original_principal,
                outstanding_principal:original_principal,
                year:years,
                month:months,
                monthly_payment:monthly_payment,
                user_id:req.u_ID
            });
            result.save(function(error,response){
                if(response && !error){ 
                    res.status(200).send({data:response,message:"user created successfuly"})
                }
                else{
                    console.log(error)
                    res.status(500).send(error)


                }
            })
           } catch (error) {
               console.log(error)
               res.status(500).send(error)
           }
    },
    getTransactions:async(req,res)=>{
        try {
            result = await Transaction.find({},(err,users)=>{
                if(err) {
                    console.log(error)
                }else{
                    // var d = new Date(date.fullDate.toString());
                    //  console.log(d.setMonth(d.getMonth() + 1))
                    res.status(200).send(users)

                }
            })
          
           } catch (error) {
               res.status(500).send(error)
           }
    },

    getLoan:async(req,res)=>{
        try {
            result = await Loan.find({},(err,users)=>{
                if(err) {
                    console.log(error)
                }else{
                    // var d = new Date(date.fullDate.toString());
                    //  console.log(d.setMonth(d.getMonth() + 1))
                    res.status(200).send(users)

                }
            })
          
           } catch (error) {
               res.status(500).send(error)
           }
    },

    updateLoan:async (req,res)=>{
        let{status}=req.body;
        let _id = req.params.loan_id
        let user_id = req.u_ID;
          var update 
          if(status == 'accepted'){
         update = await { $set: {loan_status:status,approve_by:user_id,approve_at:date.fullDate}}; 
          }
         else  if(status == 'closed'){
            update = await { $set: {loan_status:status,closed_by:user_id,closed_at:date.fullDate}}; 
             }
             else{
                update = await { $set: {loan_status:status}};
             }
          Loan.updateOne({_id},update,(err,resultses)=>{
            if (resultses && !err){ 
            res.status(200).send({data:resultses,message:"successfuly updated"})
            // socket.emit('new login',{result})
            }
            else{ 
                console.log(err)
            res.status(200).send({data:err,message:"error updated"})
            }
        })
      },

    getAloan:async(req,res)=>{
        try {
            let _id = req.params.loan_id
            result = await Loan.findOne({_id},(err,users)=>{
                if(err) throw err;

                res.status(200).send(users)
            })
          
           } catch (error) {
               res.status(500).send(error)
           }
    },
       userStatus:async(req,res)=>{
        try {
            const {status} = req.body; 
            let _id = req.params.user_id;
            let user_id = u_ID;
            // const result=await new User.findOne({_id},(err,user)=>{
            //     if(err) throw err;
            //     return user;
            // });
            var update;
            if(status =="suspend"){
            update = await { $set: {status:"suspended",suspended_by:user_id,suspended_at:date.fullDate}}; 
              
            }
            else{
                update = await { $set: {status:"active",approved_by:user_id,approved_at:date.fullDate}}; 

            }
            // var d = new Date(date.fullDate.toString());
            // setMonth(d.getMonth() + 1)
            await   User.updateOne({_id},update,(err,resultses)=>{
                if (resultses){ 
                console.log(resultses)
                res.status(200).send({message:status="suspend"?"suspended successfuly":"Activated successfuly"})
                // socket.emit('new login',{result})
                }
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },


    payment:async(req,res)=>{
        var d = new Date(date.fullDate.toString());
        d.setMonth(d.getMonth() + 1)
        let times = d.toTimeString().substr(0, 5);
          let fullDates = d.toISOString().substr(0, 10)
          let loan = req.params.loan_id;
        // console.log(fullDates)
        try {
            let _id = req.u_ID
            let {amount} = req.body;
            let result = await User.findOne({_id},(err,user)=>{
                    if(err) throw err; 
                    return user;
                })

                // let loan = await Loan.findOne({user_id:result.user_id,status:'disbursed'},(err,responses)=>{
                //     if(err) throw err;
                //     return responses
                // })

                let form = await {
                    amount:amount * 100,
                    first_name : result.firstname,
                    last_name : result.lastname,
                    email : result.email,
                    ref: 'Vm'+Math.floor((Math.random() * 1000000000) + 1)
                }

                paystack.initializePayment(form, (error, body)=>{
                    if(error){
                        //handle errors
                        console.log(error);
                        return;
                   }
                   response = JSON.parse(body);
                    response.reference
                    const transaction = new Transaction({
                        loan_id:loan,
                        reference:response.data.reference,
                        amount:0,
                        user_id:result._id,
                    });
                    transaction.save()
                    res.status(200).send({url:response.data.authorization_url,message:"Payment initiated"})
                });
           
           } catch (error) {
               console.log(error)
               res.status(500).send(error)
           }
    },



    verifyPayments:async(req,res)=>{
        try {
            const ref = req.query.reference;
            paystack.verifyPayment(ref, (error,body)=>{
                if(error){
                    console.log(error)
                    //handle errors appropriately
                    res.status(500).send(error)
                }
                response = JSON.parse(body);
                const data = _.at(response.data, [
                    'reference', 'amount','customer.email', 
                'customer.first_name','customer.last_name', 
                'status','currency','channel','paid_at'
            ]);
           let  {
                    reference, amount,email, first_name,last_name,status,
                      currency,channel,paid_at
                   } = data;
                if(status == 'success'){
                const getWallet = Wallet.findOne({system:true},(err,wallet)=>{
                    if(err) throw err; 
                    return wallet;
                })
            let date_ob = new Date(paid_at);
            let time = date_ob.toTimeString().substr(0, 5);
            let fullDate = date_ob.toISOString().substr(0, 10)
            var newTransaction = { $set: {
              amount:amount,
              description:response.message,
              type:'income',
              status:status,
              date:fullDate,
              time:time,
              amount_before:parseFloat(getWallet.balance),
              amount_after: parseFloat((getWallet.balance + amount)),
              atempt:response.data.log.attempts,
              currency:currency
            }};
            var newWallet = { $set: {balance:parseFloat((getWallet.balance + amount))}};
                     Transaction.updateOne({reference:reference},newTransaction,(err,results)=>{
                        if (results){ 
                        console.log(results)
                        // socket.emit('new login',{result})
                        }
                    })
                    Wallet.updateOne({_id:getWallet._id},newWallet,(err,resultses)=>{
                        if (resultses){ 
                        console.log(resultses)
                        // socket.emit('new login',{result})
                        }
                    })
                }
                
                
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },

    getBank:async(req,res)=>{
        try {
            // let {account,bank_code}=req.body;
            // let acounts = {account:Number(account),bank_code:bank_code}
            // res.status(200).send({data:acounts})

            paystack.getBanks((error,body)=>{
                if(error){
                    console.log(error)
                    //handle errors appropriately
                    res.status(500).send({err:error,message:"error occure"})
                }
                response = JSON.parse(body);
                if(response.status == true){
                    req['account'] = response.data.account_number;
                    req['bank_code'] = req.query.bank_code;
                    res.status(200).send({data:response.data,message:response.message,status:response.status})
                }
                else{
                    res.status(200).send({data:"not found"})

                   }
                
                
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },
   
    verifyAccount:async(req,res)=>{
        try {

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





            let {account,bank_code}=req.body;
            let acounts = {account:Number(account),bank_code:bank_code}
            // res.status(200).send({data:acounts})
            console.log(accounts)
            paystack.verifyAccNo(acounts, (error,body)=>{
                if(error){
                    console.log(error)
                    //handle errors appropriately
                    res.status(500).send({err:error,message:"error occure"})
                }
                response = JSON.parse(body);
                if(response.status == true){
                    req['account'] = response.data.account_number;
                    req['bank_code'] = req.query.bank_code;
                    res.status(200).send({data:response.data,message:response.message,status:response.status})

                }
                else{
                    res.status(200).send({data:response.data,message:response.message,status:response.status})
                   }
                
                
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },


    CreateRecipient:async(req,res)=>{
        try {
            let _id = req.params.loan_id
            const loan_result = await Loan.findOne({_id},(err,response)=>{
                if(err) throw err;
                return response;
            })
            const result = await User.findOne({_id:loan_result.user_id},(err,response)=>{
                if(err) throw err;
                return response;
            })
            const params = JSON.stringify({
                "type":"nuban",
                "name" : retult.firstname + ' '+result.lastname,
                "account_number": req.account,
                "bank_code": req.bank_code,
                "currency": "NGN"
              })
            paystack.createRecipt(params, (error,body)=>{
                if(error){
                    console.log(error)
                    //handle errors appropriately
                    res.status(500).send(error)
                }
                response = JSON.parse(body);
                if(response.status == true){
                    let date_ob = new Date(response.data.createdAt);
                    let time_time = date_ob.toTimeString().substr(0, 5);
                    let fullDate_date = date_ob.toISOString().substr(0, 10)
                    const recipient= new Recipient({
                        loan_id:loan_result._id,
                        account_number:response.data.details.account_number,
                        account_name:response.data.details.account_name,
                        bank_code:response.data.details.bank_code,
                        bank_name:response.data.details.bank_name,
                        currency:response.data.currency,
                        type:response.data.type,
                        name:response.data.name,
                        recipient_code:response.data.recipient_code,
                        date:fullDate_date,
                        time:time_time,
                        user_id:req.u_ID,
                    });
                    recipient.save();
                    res.status(200).send({data:response.data,message:response.message,status:response.status})
                }
                res.status(500).send({data:null,message:response.message,status:response.status})
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },
    initiateTransfer:async(req,res)=>{
        try {
            let recipient_code = req.params.recipient_code
            let {amount}= req.body;
            const result = await Recipient.findOne({recipient_code:recipient_code},(err,response)=>{
                if(err) throw err;
                return response;
            })
            let balance = Wallet.findOne({user_id:req.u_ID},(err,wallet)=>{
                if(err) throw err;
                return wallet;
            })
            if(amount >balance.balance){
                res.status(200).send({data:null,message:"Insuficient found"})
            }
            else{
                const params = JSON.stringify({
                    "source": "balance",
                    "amount": amount,
                    "recipient": recipient_code,
                    "reason": "Holiday Flexing",
                  })
                paystack.InitiateTransfer(params, (error,body)=>{
                    if(error){
                        console.log(error)
                        //handle errors appropriately
                        res.status(500).send(error)
                    }
                    response = JSON.parse(body);
                    if(response.status == true){
                        let date_ob = new Date(response.data.createdAt);
                        let time_time = date_ob.toTimeString().substr(0, 5);
                        let fullDate_date = date_ob.toISOString().substr(0, 10)
                        const transaction= new Transaction({
                            reference:response.data.reference,
                            amount:response.data.amount,
                            currency:response.data.currency,
                            description:response.data.reason,
                            type:'payout',
                            status:response.data.status,
                            transfer_code:response.data.transfer_code,
                            date:fullDate_date,
                            time:time_time,
                            amount_before:parseFloat(balance.balance),
                            amount_after: parseFloat((balance.balance + amount)),
                            user_id:req.u_ID
                        });
                        transaction.save();
                        var newWallet = { $set: {balance:parseFloat((balance.balance - amount))}};
                            Wallet.updateOne({_id:balance._id},newWallet,(err,resultses)=>{
                                if (resultses){ 
                                console.log(resultses)
                                // socket.emit('new login',{result})
                                }
                            })
                            let userWallet = Wallet.findOne({user_id:result.user_id},(err,response)=>{
                                if(err) throw err;
                                return response;
                            });
                          let newuserWallet = { $set: {balance:parseFloat((balance.balance + amount))}};
                          Wallet.updateOne({user_id:userWallet.user_id},newuserWallet,(err,resultses)=>{
                            if (resultses){ 
                            console.log(resultses)
                            // socket.emit('new login',{result})
                            }
                        })
                        res.status(200).send({data:response.data,message:response.message,status:response.status})
    
    
                    }
                    
                    
                })

            }

           } catch (error) {
               res.status(500).send(error)
           }
    }


};
module.exports = staffs;