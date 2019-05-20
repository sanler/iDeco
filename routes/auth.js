const express = require('express');
const router  = express.Router();
/** Login**/const passport = require("passport");
/** Loging Private Pages **/const ensureLogin = require("connect-ensure-login");
/** User model **/const User = require("../models/user");
const Picture = require('../models/picture');
const Category = require('../models/category');

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
   /*const cat1='Retrato';
   const cat2='Paisaje';
   const cat3='Abstracta';

   const newCategory1 = new Category({
    name:cat1
  });
  const newCategory2 = new Category({
    name:cat2
  }); 
  const newCategory3 = new Category({
    name:cat3
  });

  newCategory1.save((err) => {
    if (err) {
      res.render("auth/signup", { message: "Something went wrong" });
    } 
  });
  newCategory2.save((err) => {
    if (err) {
      res.render("auth/signup", { message: "Something went wrong" });
    }
  });
  newCategory3.save((err) => {
    if (err) {
      res.render("auth/signup", { message: "Something went wrong" });
    } 
  });
console.log(newCategory1);*/
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

router.get("/profile", ensureLogin.ensureLoggedIn('/'), (req, res) => {
      
  Picture.find({owner: mongoose.Types.ObjectId(req.user._id) })
  .then( pictures=> {
    

    console.log(pictures);
    console.log(req.user);
        
        res.render('profile',{pictures :pictures,user: req.user })
      })
  .catch(error => {
    next(error)
  })
     
});

router.get("/mypicupload", ensureLogin.ensureLoggedIn('/'), (req, res) => {
      


  Category.find({owner: mongoose.Types.ObjectId(req.user._id) })
  .then( pictures=> {
    

    console.log(pictures);
    console.log(req.user);
        
        res.render('profile',{pictures :pictures,user: req.user })
      })
  .catch(error => {
    next(error)
  })
     
        res.render('subirfoto',{user: req.user });
     
 
     
});


router.post("/picture/:id/act", ensureLogin.ensureLoggedIn('/'), (req, res) => {
  const action = req.body.action;
  const counter = action === 'Like' ? 1 : -1;
  Picture.updateOne({_id: req.params.id}, {$inc: {likes_count: counter}}, {}, (err, numberAffected) => {
      let Pusher = require('pusher');

      let pusher = new Pusher({
          appId: "782170",
          key: "13c943dba30d6e63edb1",
          secret: "98e3c6aebd88da1bceba",
          cluster: 'eu'
      });
console.log( '???????????'+process.env.PUSHER_APP_ID);
      let payload = { action: action, postId: req.params.id };
      pusher.trigger('post-events', 'postAction', payload, req.body.socketId);
      res.send('');
  });

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




/******** LOGGIN PRIVATE ROUTES **************/


const upload = multer({ dest: '../public/uploads/' });

router.post('/upload', upload.single('photo'), (req, res) => {
console.log('LIKESSSSS'+req.body.likes_count);
  const pic = new Picture({
    name: req.body.name,
    path: `/uploads/${req.file.filename}`,
    originalName: req.file.originalname,
    description: req.body.description,
    owner: req.body._id,
    likes_count:req.body.likes_count
  });

  pic.save((err) => {
      res.redirect('/home');
  });
});


module.exports = router;
