const Product = require("../models/product");
const Order = require("../models/order");

function getProducts(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        docTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getIndex(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        docTitle: "My Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCart(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function postCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
}

function postCartDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
}

function postOrder(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: { email: req.user.email, userId: req.user },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
}

function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    path: "/checkout",
    docTitle: "Checkout",
    //isAuthenticated: req.session.isLoggedIn,
  });
}

function getOrders(req, res, next) {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "My Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  postCartDeleteProduct,
  postOrder,
  getCheckout,
  getOrders,
};
