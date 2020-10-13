const express = require('express');
const router=express.Router();
const {verifyAccessToken}=require("../helpers/jwtHelper")
const {userById}=require("../controller/user");
const { isAuth,isAdmin } = require('../controller/auth');


router.get("/secret/:userId",verifyAccessToken,isAuth,isAdmin,(req,res)=>{
    res.json({user:req.profile})
})





router.param("userId",userById)


module.exports=router
