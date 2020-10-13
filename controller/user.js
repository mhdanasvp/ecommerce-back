const User=require("../model/user")
const createError=require("http-errors")


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









