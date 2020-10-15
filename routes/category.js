const express = require('express');
const router=express.Router()
const { isAuth,isAdmin }=require("../controller/auth")
const {userById}=require("../controller/user")
const {verifyAccessToken}=require("../helpers/jwtHelper")
const { categoryById,create,read,update,remove,list } = require('../controller/category');


router
    .post("/create/:userId",verifyAccessToken,isAuth,isAdmin,create)
    .get("/:categoryId",read)
    .put("/:categoryId/:userId",verifyAccessToken,isAuth,isAdmin,update)
    .delete("/:categoryId/:userId",verifyAccessToken,isAuth,isAdmin,remove)
    .get("/",list)




router.param("userId",userById)
router.param("categoryId",categoryById)

module.exports=router