const express = require('express');
const { isAuth, isAdmin } = require('../controller/auth');
const { verifyAccessToken } = require('../helpers/jwtHelper');
const router = express.Router()
const { create, listOrders,getStatusValues,updateOrderStatus,orderById } = require("../controller/order");
const { userById, addOrderToUserHistory } = require('../controller/user');
const { decreaseQuantity } = require('../controller/product');



router.post("/create/:userId", verifyAccessToken, isAuth, addOrderToUserHistory, decreaseQuantity, create)
router.get("/list/:userId", verifyAccessToken, isAuth, isAdmin, listOrders);
router.get(
    "/status-values/:userId",
    verifyAccessToken,
    isAuth,
    isAdmin,
    getStatusValues
);
router.put(
    "/:orderId/status/:userId",
    verifyAccessToken,
    isAuth,
    isAdmin,
    updateOrderStatus
);


router.param("userId", userById)
router.param("orderId", orderById);
module.exports = router