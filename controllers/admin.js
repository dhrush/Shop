const Product = require("../models/product");

function getAddProduct(req, res, next) {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
}

function postAddProduct(req, res, next) {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const newProduct = new Product(title, imageUrl, price, description);

  newProduct.save();
  res.redirect("/");
}

function getProducts(req, res, next) {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  });
}

module.exports = { getAddProduct, postAddProduct, getProducts };
