const router  = require('express').Router()
const sessionCheck = (req, res, next) => {
  if(req.user){
    res.redirect('/profile/home')
  }else{
    next()
  }
}

// Index Page
router.get('/', sessionCheck, (req, res) => {
  res.render('index')
})

module.exports = router
