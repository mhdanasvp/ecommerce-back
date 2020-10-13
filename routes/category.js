const express = require('express');
const router=express.Router()
const { isAuth,isAdmin }=require("../controller/auth")
const {userById}=require("../controller/user")
const {verifyAccessToken}=require("../helpers/jwtHelper")
const { create } = require('../controller/category');


router.post("/create/:userId",verifyAccessToken,isAuth,isAdmin,create)



router.param("userId",userById)

module.exports=router