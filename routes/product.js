const express = require('express');
const router=express.Router()

const { isAuth,isAdmin }=require("../controller/auth")
const {userById}=require("../controller/user")
const {verifyAccessToken}=require("../helpers/jwtHelper")
const { productById,create,read,remove,update} = require('../controller/product');






router
    .post("/create/:userId",verifyAccessToken,isAuth,isAdmin,create)
    .get("/:productId",read)
    .delete("/:productId/:userId",verifyAccessToken,isAuth,isAdmin,remove)
    .put("/:productId/:userId",verifyAccessToken,isAuth,isAdmin,update)
    







router.param("userId",userById)
router.param("productId",productById)

module.exports=router