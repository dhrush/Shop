const path = require("path");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");

router.get(
  "/add-product",
  isAuth.authMiddleware,
  adminController.getAddProduct
);

router.get("/products", isAuth.authMiddleware, adminController.getProducts);

router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 3, max: 400 }).trim(),
  ],
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
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 3, max: 400 }).trim(),
  ],
  isAuth.authMiddleware,
  adminController.postEditProducts
);

router.delete(
  "/product/:productId",
  isAuth.authMiddleware,
  adminController.deleteProduct
);

module.exports = router;
