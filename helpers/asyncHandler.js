

const Joi = require('joi');


module.exports=function (handler){
    return async(req,res,next)=>{
        try {
            await handler(req,res)
        } catch (error) {
            console.log(error);
           if(error.isJoi===true) error.status=422
           next(error)
        }
    }
}