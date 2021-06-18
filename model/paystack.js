let PayStack = require('paystack-node')
let APIKEY = 'sk_test_674af420e266597b60d2843367db5a6709d6395d'
const environment = process.env.NODE_ENV

const paystack = new PayStack(APIKEY, environment)
const feesCalculator = new PayStack.Fees();
const feeCharge = feesCalculator.calculateFor(250000) // 2,500 Naira



const promise_0 = paystack.getSettlements({
    from:new Date("2017-02-09"), 
    to:new Date()
  })
  
  promise_0.then(function(response){
    var data = response.body.data;
  }).catch(function (error){
    // deal with error
  })
  
  // listBanks
  
  try {
    let { body: { status, message, data } } =  await paystack.listBanks({
      currency: 'NGN'
    });
  
    if(status === false){
      throw new Error(message);
    }
  }catch(ex){
    console.error(ex.message);
  }
  
