const express = require('express');
const router=express.Router()
const { isAuth,isAdmin }=require("../controller/auth")
const {userById}=require("../controller/user")
const {verifyAccessToken}=require("../helpers/jwtHelper")
const { categoryById,create,read,update,remove,list } = require('../controller/category');



router.post("/create/:userId",verifyAccessToken,isAuth,isAdmin,create)
router.get("/:categoryId",read)
router.put("/:categoryId/:userId",verifyAccessToken,isAuth,isAdmin,update)
router.delete("/:categoryId/:userId",verifyAccessToken,isAuth,isAdmin,remove)
router.get("/",list)




router.param("userId",userById)
router.param("categoryId",categoryById)

module.exports=router