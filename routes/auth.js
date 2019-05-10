const express = require('express');
const router  = express.Router();
/** Login**/const passport = require("passport");
/** Loging Private Pages **/const ensureLogin = require("connect-ensure-login");
/** User model **/const User = require("../models/user");
const Picture = require('../models/picture');
const multer  = require('multer');
const mongoose = require('mongoose');
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

/********LOGOUT *****************************/

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
/********LOGOUT ******************************/

/********LOGGIN PRIVATE ROUTES **************/

router.get("/home", ensureLogin.ensureLoggedIn('/'), (req, res) => {

  Picture.find({owner:{$ne: mongoose.Types.ObjectId(req.user._id) }})
  .then( pictures=> {
    

    console.log(pictures);
    console.log(req.user);
        
        res.render('home',{pictures :pictures,user: req.user })
      })
  .catch(error => {
    next(error)
  })
 /* Picture.find((err, pictures) => {

    console.log(pictures);
    console.log(req.user );
        
        res.render('home',{pictures :pictures, user: req.user })
      })*/
  
});

router.get("/picture/:id", ensureLogin.ensureLoggedIn('/'), (req, res) => {

  Picture.findById(mongoose.Types.ObjectId(req.params.id))
  .then( picture=> {

   User.findById(mongoose.Types.ObjectId(picture.owner))
   .then(theuser => {
    
    console.log('THE USER'+theuser);
    console.log(picture);
    console.log(req.user);
        
        res.render('picture',{theuser: theuser, picture: picture, user: req.user })
      })
   .catch(error => {
    console.log(error);
   })




      })
  .catch(error => {
   console.log(error);
  })
 /* Picture.find((err, pictures) => {

    console.log(pictures);
    console.log(req.user );
        
        res.render('home',{pictures :pictures, user: req.user })
      })*/
  
});
/********LOGGIN PRIVATE ROUTES **************/


const upload = multer({ dest: '../public/uploads/' });

router.post('/upload', upload.single('photo'), (req, res) => {
console.log(req._id);
  const pic = new Picture({
    name: req.body.name,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    owner: req.body._id
  });

  pic.save((err) => {
      res.redirect('/home');
  });
});


module.exports = router;
