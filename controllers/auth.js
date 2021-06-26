const bcrypt = require("bcryptjs");

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

async function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  //two ways to confirm that if user exists
  // 1. indexing on email in our mongo db
  // 2. finding if email exists

  //Implementing second way
  /*User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });*/
  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    return res.redirect("/login");
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });

    return user
      .save()
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function postLogout(req, res, next) {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
}

module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup };
//60d3658c5e1b7e2f1869edf5
