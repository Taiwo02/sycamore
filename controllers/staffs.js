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
            let request_check = Loan.findOne({$and: [{loan_status: { $ne: "cancled" }},{user_id:req.u_ID}]},(err,loan)=>{
                if(err) throw err;
                return loan
            })
            if(request_check.length >=1){
                res.status(200).send({data:response,message:"Srry you can not request a loan now you have uncompleted loan"})
            }
            else{
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
                        res.status(200).send({data:response,message:"Loan request successfully, someone will attend to your request"})
                    }
                    else{
                        console.log(error)
                        res.status(500).send(error)
    
    
                    }
                })

            }
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
        let loan_find = Loan.findOne({_id},(err,loan)=>{
            if(err) throw err;
            return loan;
        })
         let total_topay = await parseFloat(loan_find.original_principal/100*loan_find.interest_rate+loan_find.original_principal)
        var d = new Date(date.fullDate.toString());
               d.setMonth(d.getMonth() + 1)
               let times = d.toTimeString().substr(0, 5);
               let fullDates = d.toISOString().substr(0, 10)
          var update 
          if(status == 'accept'){
         update = await { $set: {loan_status:"accepted",approve_by:user_id,approve_at:date.fullDate}}; 
          }
         else  if(status == 'close'){
            update = await { $set: {loan_status:"closed",closed_by:user_id,closed_at:date.fullDate}}; 
             }
             else  if(status == 'disburse'){
                update = await { $set: {loan_status:"disbursed",total_topay:total_topay,repayment_plan_begin_date:fullDates,disbursed_by:user_id,disbursed_at:date.fullDate}}; 
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
            var update;
            if(status =="suspend"){
            update = await { $set: {status:"suspended",suspended_by:user_id,suspended_at:date.fullDate}}; 
              
            }
            else{
                update = await { $set: {status:"active",approved_by:user_id,approved_at:date.fullDate}}; 

            }
           
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
   
    verifyAccount:async(req,res,next)=>{
        try {

            let {account,bank_code}=req.body;
            let accounts = {account:account,bank_code:bank_code}
            // res.status(200).send({data:acounts})
            console.log(accounts)
            paystack.verifyAccNo(accounts, (error,body)=>{
                if(error){
                    console.log(error)
                    //handle errors appropriately
                    res.status(500).send({err:error,message:"error occure"})
                }
                response = JSON.parse(body);
                if(response.status == true){
                    req['account'] = response.data.account_number;
                    req['bank_code'] = req.query.bank_code;
                    next();

                }
                else{
                    res.status(400).send({data:response.data,message:response.message,status:response.status})
                   }
                
                
            })
           } catch (error) {
               res.status(500).send(error +"errrr")
           }
    },


    CreateRecipient:async(req,res)=>{
        try {
            let _id = req.params.loan_id
            let {account,bank_code}=req.body;
            const loan_result = await Loan.findOne({_id},(err,response)=>{
                if(err) throw err;
                return response;
            })
            
            if(loan_result){
                const result = await User.findOne({_id:loan_result.user_id},(err,response)=>{
                    if(err) throw err;
                    return response;
                })
                // res.status(200).send({data:req.account,bank_code:req.bank_code})

                const params = await JSON.stringify({
                    "type":"nuban",
                    "name" : result.firstname + ' '+result.lastname,
                    "account_number":account,
                    "bank_code": bank_code,
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

            }
            else{
                res.status(400).send({data:null,message:"Can not find loan"})

            }
           } catch (error) {
               res.status(500).send({message:error+" error"})
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
            if(result  && result.status == 'active'){
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
                            var recip = { $set: {status:"closed"}};

                                Recipient.updateOne({recipient_code:recipient_code},recip,(err,recip)=>{
                                    if(err) throw err;
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

            }
             else{
                res.status(200).send({data:null,message:"Recipient not found or has been used"})

             }
           } catch (error) {
               res.status(500).send(error)
           }
    }


};
module.exports = staffs;