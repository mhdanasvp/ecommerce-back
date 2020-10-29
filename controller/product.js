const Product = require("../model/product")
const formidable = require("formidable")
const fs = require("fs")
const _ = require("lodash")
const asyncHandler = require("../helpers/asyncHandler")


const createError = require("http-errors")
const { parseInt } = require("lodash")





exports.productById = async (req, res, next, id) => {
    try {
        const product = await Product.findById(id).populate("category")
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
    let order = req.body.order ? req.body.order : 'desc'
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let limit = req.body.limit ? parseInt(req.body.limit) : 100
    let skip = parseInt(req.body.skip)
    let findArgs = {}



    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {

                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }


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




exports.photo = (req, res, next) => {
    try {
        if (req.product.photo.data) {
            res.set("Content-Type", req.product.photo.data.contentType)
            return res.send(req.product.photo.data)
        }
        next()
    } catch (error) {
        next(error)
    }
}



exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' };
        // query.name=req.query.search
        
        // assigne category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $inc: { quantity: -item.count, sold: +item.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, {}, (error, products) => {
        if (error) {
            return res.status(400).json({
                error: 'Could not update product'
            });
        }
        next();
    });
};