const fs = require("fs");
const path = require("path");
const { json } = require("body-parser");

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
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProducsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
    fs.readFile(p, (err, fileContent) => {});
  }

  static fetchAll(callB) {
    getProducsFromFile(callB);
  }
};
