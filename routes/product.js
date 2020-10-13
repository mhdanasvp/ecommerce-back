const express = require('express');
const router=express.Router()

const { isAuth,isAdmin }=require("../controller/auth")
const {userById}=require("../controller/user")
const {verifyAccessToken}=require("../helpers/jwtHelper")
const { create } = require('../controller/product');




router.post("/create/:userId",verifyAccessToken,isAdmin,isAuth,create)








router.param("userId",userById)


module.exports=router