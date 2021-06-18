const User = require('../model/user');
const Loan = require('../model/loan')
const jwt = require('jsonwebtoken');
const date = require('../midlewares/date')
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
            // var days = Math.floor(totalDays - (years*365) - (months * 30));
            // var result = years + " years, " + months + " months,";
            const result=await new Loan({
                original_principal,
                outstanding_principal:original_principal,
                year:years,
                month:months,
                monthly_payment:monthly_payment

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
            const {outstanding_principal} = req.body; 
            const result=await new Loan({outstanding_principal,outstanding_principal:outstanding_principal});
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
    }
};
module.exports = staffs;