const express = require('express');
const router  = express.Router();
/** Login**/const passport = require("passport");
/** Loging Private Pages **/const ensureLogin = require("connect-ensure-login");
/** User model **/const User = require("../models/user");
/******************SIGNUP********************/
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password"
  });
  return;
}

User.findOne({ username })
.then(user => {
  if (user !== null) {
    res.render("auth/signup", { message: "The username already exists" });
    return;
  }

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass
  });

  newUser.save((err) => {
    if (err) {
      res.render("auth/signup", { message: "Something went wrong" });
    } else {
      res.render("auth/login", { errorMessage: "Usuario dado de alta correctamente" });
    }
  });
})
.catch(error => {
next(error)
})
});
/******************SIGNUP********************/

/******************LOGGIN********************/
router.get("/", (req, res, next) => {
  res.render("auth/login",{ "message": req.flash("error") });
});

router.post("/", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));
/******************LOGGIN********************/

/********LOGGIN PRIVATE ROUTES **************/

router.get("/home", ensureLogin.ensureLoggedIn('/'), (req, res) => {
  res.render("home", { user: req.user });
});

/********LOGGIN PRIVATE ROUTES **************/

/********LOGOUT *****************************/

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
/********LOGOUT ******************************/

module.exports = router;
