const jwt = require('jsonwebtoken');
const User = require('../model/user')
module.exports = {
  Verify: (req, res, next) => {
     try{
            let _id =req.u_ID
            User.findOne({_id},(error,response)=>{
                if(!error){
                   if (response.isAdmin == true) {
                       next()
                       
                   } else {
                       res.status(400).send({error: "You are not authorized"})
                       
                   }
                }
            })
        }
       catch (err) {
        res.status(500).send(err)
        // throw new Error(err);
      }

    }
};