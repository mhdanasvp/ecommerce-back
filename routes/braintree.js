const express=require('express')
const { isAuth } = require('../controller/auth')
const { userById } = require('../controller/user')
const { verifyAccessToken } = require('../helpers/jwtHelper')
const { generateToken,processPayment }=require("../controller/braintree")
const router=express.Router()

router.get('/getToken/:userId',verifyAccessToken,isAuth,generateToken)
router.post('/payment/:userId',verifyAccessToken,isAuth,processPayment)


router.param('userId',userById)

module.exports=router
