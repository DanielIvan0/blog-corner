const passport = require('passport')
const User = require('../models/User')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook')
const crypto = require('crypto')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

passport.use(
  new LocalStrategy({
    usernameField:'email',
    passwordField:'passwd'
  }, (email, password, done) => {
    const cipher = crypto.createCipher(process.env.cryptoAlgorithm, process.env.cryptoKey)
    let encrypted = cipher.update(password, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    User.findOne({
      email:email,
      password:encrypted
    }).then(user => {
      if(user)
        return done(null, user, {message:'Login successful'})
      else
        return done(null, false, {message:'Email or password incorrect!'})
      }).catch(err => console.log(err))
  })
)

// Google Strategy
passport.use(
  new GoogleStrategy({
    callbackURL:'https://blogcorner.herokuapp.com/auth/google/redirect',
    clientID:process.env.G_CLIENT_ID,
    clientSecret:process.env.G_CLIENT_SECRET,
    profileFields:['id', 'name', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    const currentUser = [
      await User.findOne(
        {
          googleId:profile.id
        }
      ),await User.findOne(
        {
          email:profile._json.email
        }
      )
    ]
    if(currentUser[0]){
      isAuth ? done(null, currentUser[0], {message:'Login successful!'})
      : done(null, currentUser[0], {message:'The user already exists!'})
    }
    if(currentUser[1]){
      isAuth ? done(null, currentUser[1], {message:'Login successful!'})
      : done(null, currentUser[1], {message:'The email is already stored!'})
    }else if(!isAuth){
      try{
        const newUser = await new User(
          {
            email:profile._json.email,
            googleId:profile.id,
            displayName:profile._json.given_name,
            thumbnail:profile.photos ? profile.photos[0].value : 'images/profile-picture.jpg'
          }
        ).save()
        done(null, newUser)
      }catch(e){
        done(null, false, {message:e})
      }
    }else{
      done(null, false, {message:'This account doesn\'t exists!'})
    }
  })
)

passport.use(
  new FacebookStrategy(
    {
      callbackURL:`https://blogcorner.herokuapp.com/auth/facebook/redirect`,
      clientID:process.env.FB_CLIENT_ID,
      clientSecret:process.env.FB_CLIENT_SECRET,
      profileFields:['id', 'displayName', 'name', 'email', 'photos']
    }, async (accessToken, refreshToken, profile, done) => {
      const currentUser = [
        await User.findOne(
          {
            facebookId:profile.id
          }
        ), await User.findOne(
          {
            email:profile._json.email
          }
        )
      ]
      if(currentUser[0]){
        isAuth ? done(null, currentUser[0], {message:'Login successful!'})
        : done(null, currentUser[0], {message:'The user already exists!'})
      }else if(currentUser[1]){
        isAuth ? done(null, currentUser[1], {message:'Login successful!'})
        : done(null, currentUser[1], {message:'The email is already stored!'})
      }else if(!isAuth){
        const newUser = await new User(
          {
            email:profile._json.email,
            facebookId:profile.id,
            displayName:profile._json.name,
            thumbnail:profile.photos ? profile.photos[0].value : 'images/profile-picture.jpg'
          }
        ).save()
        done(null, newUser)
      }else{
        done(null, false, {message:'This account doesn\'t exists!'})
      }
    }
  )
)

module.exports = passport