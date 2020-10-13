

const Joi=require("joi")

module.exports={
    userRegistrationValidation:async function(user){
        const schema=Joi.object({
            
                name:Joi.string().min(4).max(255).required(),
                email:Joi.string().min(3).max(255).required().email(),
                password:Joi.string().min(4).max(255).required()
         
            
        })
        return await schema.validateAsync(user)
    },
    userLoginValidation:async function(user){
        const schema=Joi.object({
            email:Joi.string().min(3).max(255).required().email(),
            password:Joi.string().min(4).max(255).required()
        })
        return await schema.validateAsync(user)
    }
}