
let MySecretKey = 'Bearer sk_test_674af420e266597b60d2843367db5a6709d6395d';
const request = require('request');
  let paystack = {
    
    // sk_test_xxxx to be replaced by your own secret key
 initializePayment : async(form, mycallback) =>{
        const options = {
            url : 'https://api.paystack.co/transaction/initialize',
            headers : {
                authorization: MySecretKey,
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
           form
        }
        const callback = (error, response, body)=>{
            return mycallback(error, body);
        }
        request.post(options,callback);

   },




 verifyPayment : async(ref,mycallback) => {
    const options = {
        url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
        headers : {
            authorization: MySecretKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
       }
    }
    const callback = (error, response, body)=>{
        return mycallback(error, body);
    }
    request(options,callback);

   }

//    return {initializePayment, verifyPayment};
}
module.exports = paystack;