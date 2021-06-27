const bcrypt = require("bcryptjs");

const User = require("../models/user");

function getLogin(req, res, next) {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: message,
  });
}

function getSignup(req, res, next) {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    errorMessage: message,
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
      req.flash("error", "Incorrect email or password.");
      res.redirect("/login");
    }
  } else {
    req.flash("error", "Invalid email or password.");
    return res.redirect("/login");
  }
}

async function postSignup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    req.flash("error", "Email already exists.");
    return res.redirect("/signup");
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
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
}

module.exports = { getLogin, postLogin, postLogout, getSignup, postSignup };
//60d3658c5e1b7e2f1869edf5
