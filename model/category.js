const mongoose = require('mongoose');



const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        unique:true,
        maxlength:50,
        minlength:1

    }

},{timestamps:true})



const Category=mongoose.model("Category",categorySchema)


module.exports=Category