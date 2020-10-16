const express = require('express');
const router=express.Router();
const {verifyAccessToken}=require("../helpers/jwtHelper")
const {userById}=require("../controller/user");
const { isAuth,isAdmin } = require('../controller/auth');
const { read,update } = require('../controller/user');


router.get("/secret/:userId",verifyAccessToken,isAuth,isAdmin,(req,res)=>{
    res.json({user:req.profile})
})
router
    .get("/:userId",verifyAccessToken,isAuth,isAdmin,read)
    .put("/:userId",verifyAccessToken,isAuth,isAdmin,update)




router.param("userId",userById)


module.exports=router
