const braintree = require('braintree');
const asyncHandler = require('../helpers/asyncHandler');

require('dotenv').config();



const gateway=new braintree.BraintreeGateway({
    environment:braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCHANT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:process.env.BRAINTREE_PRIVATE_KEY

});
exports.generateToken=asyncHandler(async(req,res)=>{
    const response=await gateway.clientToken.generate()
    res.send(response)
})

exports.processPayment=asyncHandler(async(req,res)=>{
    let nonceFromTheClient=await req.body.paymentMethodNonce
    let amountFromTheClient=await req.body.amount



    let newTransaction=await gateway.transaction.sale(
        {
            amount:amountFromTheClient,
            paymentMethodNonce:nonceFromTheClient,
            options:{
                submitForSettlement:true
            }
        }
    )
    res.json(newTransaction)
})