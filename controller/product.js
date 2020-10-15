const Product=require("../model/product")
const formidable=require("formidable")
const fs=require("fs")
const _=require("lodash")
const asyncHandler=require("../helpers/asyncHandler")

const createError=require("http-errors")



exports.productById=async (req,res,next,id)=>{
    try {
        const product=await Product.findById(id)
        if(!product){
            return next(createError.NotFound("Product not Found"))
        }
        req.product=product;
        next()
        
    } catch (error) {
        next(createError.BadRequest("invalid Product Id"))
    }
}






exports.create=(req,res,next)=>{
   
   
    let form=new formidable.IncomingForm();
    form.keepExtensions=true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return next(createError.BadRequest("Image could't uploaded"))
        }
        const {name,description,price,category,quantity,shipping}=fields
        if(!name||!description||!price||!category||!quantity||!shipping){
            return next(createError.BadRequest("All Fields Required"))
        }
       
        const product=new Product(fields)
        if(files.photo){
            if(files.photo.size>1000000){
                return next(createError.BadRequest("Image size should be less than 1mb"))
        }
            product.photo.data=fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }
        product.save((err,product)=>{
            if(err){
                return next(createError.BadRequest("Product Create Error"))
            }
            res.json({product})
        })

        
    })
       
   
  
}
exports.read=asyncHandler(async(req,res)=>{
    const product=await req.product
    if(product.photo){
        product.photo=undefined
    }
    res.json({product})
})


exports.remove=asyncHandler(async(req,res)=>{
    let product=await req.product
    product=await product.remove()
    res.json({message:"successfully deleted"})

})
exports.update=(req,res,next)=>{
    let form= new formidable.IncomingForm();
    form.keepExtensions=true
     form.parse(req,(err,fields,files)=>{
        if(err){
            return next(createError.BadRequest("Image Not Be Uploaded"))
        }
        let product=req.product;
       

        const {name,description,price,category,quantity,shipping}=fields
        if(!name||!description||!price||!category||!quantity||!shipping){
            return next(createError.BadRequest("All Fields Required"))
        }



        product= _.extend(product,fields)
        if(files.photo){
            if(files.photo.size>1000000){
                return next(createError.NotFound("image sgould be less than 1mb"))
            }
        }
        
        product.save((err,product)=>{
            if(err){
                console.log(err);
                return next(createError.NotFound("Product not saved"))
            }
            res.json({product})
        })
    })
}

