const express = require('express');
const router = express.Router()

const { isAuth, isAdmin } = require("../controller/auth")
const { userById } = require("../controller/user")
const { verifyAccessToken } = require("../helpers/jwtHelper")
const { productById, create, read, remove, update, list, listRelated, listCategories, listBySearch, photo,listSearch } = require('../controller/product');



router.get("/search",listSearch)
router.get("/", list)
router.get("/categories", listCategories)
router.get("/related/:productId", listRelated)
router.get("/:productId", read)
router.get("/photo/:productId", photo)
    
router.post("/by/search", listBySearch)
router.post("/create/:userId", verifyAccessToken, isAuth, isAdmin, create)
router.delete("/:productId/:userId", verifyAccessToken, isAuth, isAdmin, remove)
router.put("/:productId/:userId", verifyAccessToken, isAuth, isAdmin, update)
    

router.param("userId", userById)
router.param("productId", productById)

module.exports = router