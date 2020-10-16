const Product = require("../model/product")
const formidable = require("formidable")
const fs = require("fs")
const _ = require("lodash")
const asyncHandler = require("../helpers/asyncHandler")
const listSearch = require("../helpers/listSearch")

const createError = require("http-errors")
const { parseInt } = require("lodash")





exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            return next(createError.NotFound("Product not Found"))
        }
        req.product = product;
        next()

    } catch (error) {
        console.log(error);
        next(createError.BadRequest("invalid Product Id"))
    }
}






exports.create = (req, res, next) => {


    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(createError.BadRequest("Image could't uploaded"))
        }
        const { name, description, price, category, quantity, shipping } = fields
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return next(createError.BadRequest("All Fields Required"))
        }

        const product = new Product(fields)
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return next(createError.BadRequest("Image size should be less than 1mb"))
            }
            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type
        }
        product.save((err, product) => {
            if (err) {
                return next(createError.BadRequest("Product Create Error"))
            }
            res.json({ product })
        })


    })



}




exports.read = asyncHandler(async (req, res) => {
    const product = await req.product
    if (product.photo) {
        product.photo = undefined
    }
    res.json({ product })
})




exports.remove = asyncHandler(async (req, res) => {
    let product = await req.product
    product = await product.remove()
    res.json({ message: "successfully deleted" })

})




exports.update = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(createError.BadRequest("Image Not Be Uploaded"))
        }
        let product = req.product;


        const { name, description, price, category, quantity, shipping } = fields
        if (!name || !description || !price || !category || !quantity || !shipping) {
            return next(createError.BadRequest("All Fields Required"))
        }



        product = _.extend(product, fields)
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return next(createError.NotFound("image sgould be less than 1mb"))
            }
        }

        product.save((err, product) => {
            if (err) {
                console.log(err);
                return next(createError.NotFound("Product not saved"))
            }
            res.json({ product })
        })
    })
}




exports.list = asyncHandler(async (req, res) => {
    let order = req.query.order ? req.query.order : "asc"
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? parseInt(req.query.limit) : 6


    const product = await Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)

    if (!product) {
        throw next(createError.NotFound("Product not found"))
    }
    res.json({ product })


})



exports.listRelated = asyncHandler(async (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6


    const product = await Product
        .find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate('category', '_id name')

    if (!product) {
        throw next(createError.NotFound("Product not found"))
    }

    res.json({ product })
})



exports.listCategories = asyncHandler(async (req, res) => {
    const categories = await Product.distinct('category')

    res.json({ categories })

})





exports.listBySearch = asyncHandler(async (req, res) => {
    let order = req.query.order ? req.query.order : 'desc'
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"
    let limit = req.query.limit ? parseInt(req.query.limit) : 100
    let skip = parseInt(req.query.skip)
    let findArgs = {}


    findArgs = await listSearch(req.body.filters, findArgs)



    const product = await Product
        .find(findArgs)

        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)


    if (!product) {
        throw next(createError.NotFound("Product Not Found"))
    }

    res.json({
        size: product.length,
        product
    })

})




exports.photo=(req,res,next)=>{
    try {
        if(req.product.photo.data){
            res.set("Content-Type",req.product.photo.data.contentType)
            return res.send(req.product.photo.data)
        }
        next()
    } catch (error) {
        next(error)
    }
}



