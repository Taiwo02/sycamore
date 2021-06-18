const User = require('../model/user');
const Loan = require('../model/loan')
const Wallet = require('../model/wallet')
const Transaction = require('../model/transactions')
const jwt = require('jsonwebtoken');
const date = require('../midlewares/date')
const _ = require('lodash');
const path = require('path');
const request = require('request');
const {initializePayment, verifyPayment} = require('../config/paystack')(request);
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
            result.save(async function(error,response){
                if(response && !error){ 
                //   const walletDetails = await new Wallet({user_id:response.id,balance:0,currency:"NGN",});
                //   walletDetails.save();
                console.log(response)
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
            User.findOne({ _id: user._id }).then(result =>
                // console.log(result)
                res.status(200).send({data: result, token: token})
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

    getLoan:async(req,res)=>{
        try {
            result = await Loan.find({},(err,users)=>{
                if(err) throw err;

                res.status(200).send(users)
            })
          
           } catch (error) {
               res.status(500).send(error)
           }
    },
    getAloan:async(req,res)=>{
        try {
            let _id = req.params.loan_id
            console.log(_id)
            result = await Loan.findOne({_id},(err,users)=>{
                if(err) throw err;

                res.status(200).send(users)
            })
          
           } catch (error) {
               res.status(500).send(error)
           }
    },
    loanStatus:async(req,res)=>{
        try {
            const {status} = req.body; 
            const result=await new Loan({outstanding_principal,outstanding_principal:outstanding_principal});
            var d = new Date(date.fullDate.toString());
            setMonth(d.getMonth() + 1)
            result.save(function(error,response){
                if(response && !error){ 
                    res.status(200).send("user created successfuly")
                }
                else{
                    res.status(500).send(error)


                }
            })
           } catch (error) {
               res.status(500).send(error)
           }
    },


    payment:async(req,res)=>{
        try {
            let _id = req.u_ID
            let {amount} = req.body;
            result = await User.findOne({_id},(err,user)=>{
                    if(err) throw err; 
                    return user;
                })
                let loan = await Loan.findOne({user_id:result.user_id,status:'disbursed'},(err,responses)=>{
                    if(err) throw err;
                    return responses
                })
                let form = await {
                    amount:amount * 100,
                    first_name : result.firstname,
                    last_name : result.lastname,
                    email : result.email,
                    ref: 'Vm'+Math.floor((Math.random() * 1000000000) + 1)
                }

                initializePayment(form, (error, body)=>{
                    if(error){
                        //handle errors
                        console.log(error);
                        return;
                   }
                   response = JSON.parse(body);
                    response.reference
                    const result = new Transaction({
                        loan_id:loan.id,
                        reference:response.data.reference,
                        amount:0,
                        user_id:result.id,
                    });
                    result.save(function(error,response){
                        if(response && !error){ 
                            res.status(200).send({url:response.data.authorization_url,message:"Payment initiated"})
                        }
                        else{
                            res.status(500).send(error)
                        }
                    })
                });
           
           } catch (error) {
               res.status(500).send(error)
           }
    },



    verifyPayments:async(req,res)=>{
        try {
            const ref = req.query.reference;
            verifyPayment(ref, (error,body)=>{
                if(error){
                    //handle errors appropriately
                    console.log(error)
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
                    Wallet.updateOne({id:getWallet.id},newWallet,(err,resultses)=>{
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
    }


   



};
module.exports = staffs;