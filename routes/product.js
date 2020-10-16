const express = require('express');
const router = express.Router()

const { isAuth, isAdmin } = require("../controller/auth")
const { userById } = require("../controller/user")
const { verifyAccessToken } = require("../helpers/jwtHelper")
const { productById, create, read, remove, update, list, listRelated, listCategories, listBySearch, photo } = require('../controller/product');




router.get("/", list)
    .get("/categories", listCategories)
    .get("/related/:productId", listRelated)
    .get("/:productId", read)
    .get("/photo/:productId", photo)
    .post("/by/search", listBySearch)
    .post("/create/:userId", verifyAccessToken, isAuth, isAdmin, create)
    .delete("/:productId/:userId", verifyAccessToken, isAuth, isAdmin, remove)
    .put("/:productId/:userId", verifyAccessToken, isAuth, isAdmin, update)
    

router.param("userId", userById)
router.param("productId", productById)

module.exports = router