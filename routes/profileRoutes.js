const router = require('express').Router()
const sessionCheck = (req, res, next) => {
  if(req.user){
    next()
  }else{
    res.redirect('/auth')
  }
}

// Profile page
router.get('/', sessionCheck, (req, res, next) => {
  res.render('profile', {user:req.user})
})

// Home Page
router.get('/home', sessionCheck, (req, res, next) => {
  res.render('home', {user:req.user})
})

// Logout redirect to index
router.get('/logout', sessionCheck, (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router