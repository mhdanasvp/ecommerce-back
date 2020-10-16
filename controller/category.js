const asyncHandler = require("../helpers/asyncHandler")
const Category = require("../model/category")
const { categoryValidation } = require("../helpers/validation")
const createError = require("http-errors")
const Product = require("../model/product")
const _=require("lodash")

exports.categoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id)
        if (!category) {
            return next(createError.NotFound("category not found"))
        }
        req.category = category
        next()

    } catch (error) {
        next(createError.BadRequest("Invalid Category Id"))
    }
}








exports.create = asyncHandler(async (req, res) => {
    const result = await categoryValidation(req.body)
    const doesExist = await Category.findOne({ name: result.name })

    if (doesExist) {
        console.log("exist");
        throw createError.Conflict("category already exist")
    }
    const category = await new Category(result)
    const savedCategory = await category.save()
    res.json({ category: savedCategory })



})

exports.read=asyncHandler(async(req,res)=>{
    const category=req.category
    res.json({category})
})




exports.update=asyncHandler(async(req,res)=>{
    let category= await req.category
    
    const result=await categoryValidation(req.body)
    const isNameExist=await Category.findOne({ _id: { $ne: category._id},name:result.name})
    if(isNameExist){
        throw createError.Conflict("category alresdy exist")
    }
    category= _.extend(category,result)
    category=await category.save()
    res.json({category})

})





exports.remove=asyncHandler(async(req,res)=>{
    const category=req.category
    const isExist=await Product.find({category})
    if(isExist.length>=1){
        throw createError.Conflict(`sorry you can't delete ${category} category,it has ${isExist.length}`)
    }else{
        await category.remove()
        res.json({message:"Category deleted"})
    }



})
exports.list=asyncHandler(async(req,res)=>{
    const category=await Category.find()
    res.json({category})
})