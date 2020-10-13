const mongoose = require('mongoose');
const { ObjectId }=mongoose.Schema


const productSchema=new mongoose.Schema({
    name:{
        type: String,
            trim: true,
            required: true,
            maxlength: 255,
            minlength: 2
    },
    description:{
        type: String,
        required: true,
        maxlength: 2000

    },
    price:{
        type: Number,
        trim: true,
        required: true,
        maxlength: 32
    },
    category:{
        type:ObjectId,
        ref:"Category",
        required:true
    },
    quantity:{
        type:Number,
        default: 0
    },
    sold:{
        type:Number,
        default: 0
    },
    photo:{
        data:Buffer,
        contentType:String,

    },
    shaipping:{
        type:Boolean,
        default:false
    }
},{timestamps:true})



const Product=mongoose.model("Product",productSchema)



module.exports=Product