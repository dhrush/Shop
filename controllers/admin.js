const Product = require("../models/product");

function getAddProduct(req, res, next) {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
}

function postAddProduct(req, res, next) {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const newProduct = new Product(null, title, imageUrl, price, description);

  newProduct.save();
  res.redirect("/");
}

function getEditProduct(req, res, next) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  });
}

function postEditProducts(req, res, next) {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  const updatedProduct = new Product(
    id,
    updatedTitle,
    updatedImageUrl,
    updatedPrice,
    updatedDescription
  );

  updatedProduct.save();
  res.redirect("/admin/products");
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

function postDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect("/admin/products");
}

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProducts,
  postDeleteProduct,
};
