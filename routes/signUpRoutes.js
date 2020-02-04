const router = require('express').Router()
const passport = require('../config/passport')
const User = require('../models/User')
const crypto = require('crypto')
const sessionCheck = (req, res, next) => {
  if(req.user){
    res.redirect('/profile/home')
  }else{
    next()
  }
}

// Sign Up page
router.get('/', sessionCheck, (req, res) => {
  res.render('signup')
})

// Sign Up handler
router.post('/', (req, res) => {
  const {name, email, pwd0, pwd1} = req.body
  const err = []

  // Check empty fields
  if(!(name && email && pwd0 && pwd1)) err.push({
    msg:'Please do not leave any empty fields.'
  })

  // Check passwords
  if(pwd1 !== pwd0) err.push({
    msg:'The passwords don\'t match'
  })
  if(pwd0.length < 6) err.push({
    msg:'The password must contain at least 6 characters'
  })

  if(err.length > 0){
    res.render('signup',{
      err,
      name,
      email,
      pwd0,
      pwd1
    })
  }else{
    // Crypt the password
    const cipher = crypto.createCipher(process.env.cryptoAlgorithm, process.env.cryptoKey)
    let encrypted = cipher.update(pwd0, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const newUser = new User(
      {
        email:email,
        displayName:name,
        password:encrypted,
        thumbnail:'images/profile-picture.jpg'
      }
    ).save()
      .then(usr => res.redirect('/auth'))
        .catch(err => console.log(err))
  }
})

// Sign Up with Google
router.get('/google', sessionCheck, (req, res, next) => {
  isAuth = false
  next()
}, passport.authenticate('google', {
  scope:['profile', 'email']
}))

// Sign Up with Facebook
router.get('/facebook', sessionCheck, (req, res, next) => {
  isAuth = false
  next()
}, passport.authenticate('facebook', {
  scope:['public_profile', 'email']
}))

module.exports = router