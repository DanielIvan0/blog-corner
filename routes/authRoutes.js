const router = require('express').Router()
const passport = require('../config/passport')
const sessionCheck = (req, res, next) => {
  if(req.user){
    res.redirect('/profile/home')
  }else{
    next()
  }
}

// auth routes
router.get('/', sessionCheck, (req, res) => {
  res.render('auth')
})

// auth with email
router.post('/', passport.authenticate('local', {
    successRedirect:'profile/home',
    failureRedirect:'/'
  }),(req, res) => {
    res.redirect('/profile/home');
  });

// auth with Google
router.get('/google', sessionCheck, (req, res, next) => {
  isAuth = true
  next()
}, passport.authenticate('google', {
  scope:['profile', 'email']
}))

router.get('/google/redirect', passport.authenticate('google', {
  scope: 'email',
  failureRedirect:'/signup'
}), (req, res) => {
  res.redirect('/profile/home')
})

// auth with Facebook
router.get('/facebook', sessionCheck, (req, res, next) => {
  isAuth = true
  next()
}, passport.authenticate('facebook', {
  scope:['public_profile', 'email']
}))

router.get('/facebook/redirect', passport.authenticate('facebook', {
  scope:'email',
  failureRedirect:'/signup'
}), (req, res) => {
  res.redirect('/profile/home')
})

module.exports = router