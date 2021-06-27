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

async function postLogin(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email });
  if (user) {
    const doMatch = await bcrypt.compare(password, user.password);
    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    } else {
      res.redirect("/login");
    }
  } else {
    return res.redirect("/login");
  }
}

async function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
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
