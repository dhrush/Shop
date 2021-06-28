const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: "",
    },
  })
);

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
        return transporter.sendMail({
          to: email,
          from: "labssem51@gmail.com",
          subject: "Signup Successful",
          html: "<h1>You successfully signed up!</h1>",
        });
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

function getReset(req, res, next) {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    docTitle: "Reset Password",
    errorMessage: message,
  });
}

function postReset(req, res, next) {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with the email exists");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        //3600000ms = 1hr
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "labssem51@gmail.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password valid for one hour</p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
}

function getNewPassword(req, res, next) {
  //check if the req contains token or not
  //and if it contains the token then check the expiry
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        docTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
}

function postNewPassword(req, res, next) {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
}

module.exports = {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
//60d3658c5e1b7e2f1869edf5
