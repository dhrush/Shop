const Product = require("../models/product");
const Cart = require("../models/cart");

function getProducts(req, res, next) {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "All Products",
      path: "/products",
    });
  });
}

function getProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      docTitle: product.title,
      path: "/products",
    });
  });
}

function getIndex(req, res, next) {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "My Shop",
      path: "/",
    });
  });
}

function getCart(req, res, next) {
  res.render("shop/cart", {
    path: "/cart",
    docTitle: "Your Cart",
  });
}

function postCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect("/cart");
}

function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
  });
}

function getOrders(req, res, next) {
  res.render("shop/orders", {
    path: "/orders",
    docTitle: "My Orders",
  });
}

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getCheckout,
  getOrders,
};
