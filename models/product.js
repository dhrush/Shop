const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);

/*const fs = require("fs");
const path = require("path");
const { json } = require("body-parser");
const Cart = require("./cart");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json"
);

const getProducsFromFile = (callB) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return callB([]);
    } else {      
      callB(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProducsFromFile((products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(
          (prod) => prod.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;

        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
    // fs.readFile(p, (err, fileContent) => {});
  }

  static deleteById(id) {
    getProducsFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((p) => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          //also need to remove the product from the customer's cart
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll(callB) {
    getProducsFromFile(callB);
  }

  static findById(id, callB) {
    getProducsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      callB(product);
    });
  }
};
*/
