const path = require("path");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

router.get(
  "/add-product",
  isAuth.authMiddleware,
  adminController.getAddProduct
);

router.get("/products", isAuth.authMiddleware, adminController.getProducts);

router.post(
  "/add-product",
  isAuth.authMiddleware,
  adminController.postAddProduct
);

router.get(
  "/edit-product/:productId",
  isAuth.authMiddleware,
  adminController.getEditProduct
);

router.post(
  "/edit-product",
  isAuth.authMiddleware,
  adminController.postEditProducts
);

router.post(
  "/delete-product",
  isAuth.authMiddleware,
  adminController.postDeleteProduct
);

module.exports = router;
