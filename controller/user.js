const User=require("../model/user")
const createError=require("http-errors")
const asyncHandler=require("../helpers/asyncHandler")
const { userRegistrationValidation } = require("../helpers/validation")
const Category = require("../model/category")
const _= require("lodash")
const { result } = require("lodash")


exports.userById=async(req,res,next,id)=>{
   try {
    const user=await User.findById(id)
    if(!user){
        return next(createError.NotFound("User not found"))
    }
    req.profile=user
    next()
       
   } catch (error) {
       next(createError.NotFound("invalid user id"))
    
   }
}



exports.read=asyncHandler(async(req,res)=>{
    const user=await req.profile
    user.password=undefined
    
    res.json({user})
})
exports.update=asyncHandler(async(req,res)=>{
    let user=await req.profile
    
    const result=await userRegistrationValidation(req.body)
    const isEmailExist=await Category.findOne({_id: { $ne: user._id},email:result.email})
    if(isEmailExist){
        throw createError.Conflict("User already exist")
    }
    user=_.extend(user,result)
    
    user=await user.save()
    res.json({ user })
    

})









