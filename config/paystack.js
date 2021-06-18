
const paystack = async(request) => {
    const MySecretKey = 'Bearer sk_test_674af420e266597b60d2843367db5a6709d6395d';
    // sk_test_xxxx to be replaced by your own secret key
   const initializePayment = async(form, mycallback) =>{
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

   }




   const verifyPayment = async(ref,mycallback) => {
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

   return {initializePayment, verifyPayment};
}
module.exports = paystack;