const asyncHandler = require("../helpers/asyncHandler")
const createError=require("http-errors")
const User=require("../model/user")
const {userRegistrationValidation,userLoginValidation}=require("../helpers/validation")
const { signAccessToken,verifyAccessToken } = require("../helpers/jwtHelper")


// signup
exports.signup=asyncHandler(async(req,res)=>{


    const result=await userRegistrationValidation(req.body)
    const doesExist=await User.findOne({email:result.email})
    if(doesExist){
        throw createError.Conflict(`${result.email} is already exist`)
    }
    const user=new User(result) 
    const savedUser=await user.save()
    user.password=undefined
    res.json({user:savedUser})

    
})

// signin
exports.signin=asyncHandler(async(req,res)=>{
    
    const result=await userLoginValidation(req.body)
    const user=await User.findOne({email:result.email})
    if(!user){throw createError.NotFound("invalid user")}
    const isMatch=await user.isValidPassword(result.password)
    if(!isMatch){throw createError.Unauthorized("email/password does't valid")}
    const accessToken= await signAccessToken(user.id)
    res.cookie("t",accessToken,{expire:new Date()+9999})
    const {_id,name,email,role}=user
    res.json({accessToken,user:{_id,name,email,role}})


})

// logout
exports.signout=(asyncHandler(async(req,res)=>{
    res.clearCookie('t')
    .json({message:"signout success fully"})
    
}))



// authorization 
exports.isAuth=(req,res,next)=>{

    
    let user=req.profile && req.payload && req.profile._id==req.payload.aud
    if(!user){
        return next (createError.Forbidden("Access Denied")) 
    }
    next()
}
exports.isAdmin=(req,res,next)=>{
    if(req.profile.role==="0"){
        return next(createError.Forbidden("admin resourse !,access denied"))
    }
    next()
}
