const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user");
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

app.use((req, res, next) => {
  User.findById("60d36cf74dea0c2c48727032")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(error404.get404Page);

mongoose
  .connect(
    //use %40 if your password contains @
    "mongodb+srv://dhruv:mongoDbkaa123@mern.vhrrq.mongodb.net/ShopDb?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Mux",
          email: "muxOccupancy@120people.com",
          items: [],
        });
        user.save();
      }
    });
    app.listen(3000, () => {
      console.log("server running on 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

//60d3658c5e1b7e2f1869edf5
