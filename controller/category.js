const asyncHandler=require("../helpers/asyncHandler")
const Category=require("../model/category")
const {categoryValidation}=require("../helpers/validation")
const createError = require("http-errors")

exports.create=asyncHandler(async(req,res)=>{
    const result=await categoryValidation(req.body)
    const doesExist=await Category.findOne({name:result.name})
    
    if(doesExist){
        console.log("exist");
        throw createError.Conflict("categoty already exist")
    }
    const category=await new Category(result)
    const savedCategory=await category.save()
    res.json({category:savedCategory})



})