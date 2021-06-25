const Product = require("../models/product");

function getAddProduct(req, res, next) {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    isAuthenticated: false,
  });
}

function postAddProduct(req, res, next) {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const newProduct = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });

  newProduct
    .save()
    .then((result) => {
      console.log("Product Created");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
}

function getEditProduct(req, res, next) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        isAuthenticated: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function postEditProducts(req, res, next) {
  const id = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDescription = req.body.description;

  Product.findById(id)
    .then((product) => {
      product.title = updatedTitle;
      product.imageUrl = updatedImageUrl;
      product.price = updatedPrice;
      product.description = updatedDescription;

      return product.save();
    })
    .then((result) => {
      console.log("PRODUCT UDPATED");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
}

function getProducts(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
        isAuthenticated: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function postDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then((product) => {
      console.log("PRODUCT REMOVED");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProducts,
  postDeleteProduct,
};
