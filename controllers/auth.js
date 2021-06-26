const User = require("../models/user");

function getLogin(req, res, next) {
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: false,
  });
}

function getSignup(req, res, next) {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: false,
  });
}

function postLogin(req, res, next) {
  User.findById("60d36cf74dea0c2c48727032")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
}

function postSignup(req, res, next) {}

function postLogout(req, res, next) {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
}

module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup };
//60d3658c5e1b7e2f1869edf5
