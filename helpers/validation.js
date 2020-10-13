


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
    },
    categoryValidation:async function(category){
        const schema=Joi.object({
            name:Joi.string().min(1).max(50).required()
        })
        return await schema.validateAsync(category)
    },
    productValidation:async function(product){
        const schema=Joi.object({
            name:Joi.string().min(2).max(255).required(),
            description:Joi.string().min(2).max(2000).required(),
            price:Joi.number().required().min(1).max(32),
            quantity:Joi.number(),
            category:Joi.required()
            
        })
        return await schema.validateAsync(product)
    }
}