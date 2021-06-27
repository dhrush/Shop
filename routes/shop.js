const path = require("path");
const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth.authMiddleware, shopController.getCart);

router.post("/cart", isAuth.authMiddleware, shopController.postCart);

router.post(
  "/cart-delete-item",
  isAuth.authMiddleware,
  shopController.postCartDeleteProduct
);

router.post("/create-order", isAuth.authMiddleware, shopController.postOrder);

router.get("/orders", isAuth.authMiddleware, shopController.getOrders);

router.get("/checkout", isAuth.authMiddleware, shopController.getCheckout);

module.exports = router;
