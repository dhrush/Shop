const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const error404 = require("./controllers/error");

const app = express();

//use view engine --> pug
app.set("view engine", "ejs");

//find views file in --> views folder
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(error404.get404Page);

mongoose
  .connect(
    //use %40 if your password contains @
    "mongodb+srv://dhruv:mongoDbkaa123@mern.vhrrq.mongodb.net/ShopDb?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000, () => {
      console.log("server running on 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
