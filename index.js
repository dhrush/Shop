const express = require("express");
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

app.listen(3000, () => {
  console.log("server running on 3000");
});
