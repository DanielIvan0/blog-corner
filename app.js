require('dotenv').config()

const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser')
const express      = require('express')
const favicon      = require('serve-favicon')
const hbs          = require('hbs')
const mongoose     = require('mongoose')
const logger       = require('morgan')
const path         = require('path')
const session = require('cookie-session')
const passport = require('./config/passport')
global.isAuth = true

mongoose
  .connect(process.env.MONGO_SRV, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  })
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const app_name = require('./package.json').name
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`)

const app = express()

// Middleware Setup
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// Session Setup
app.use(session(
  {
    maxAge:24*60*60*1000,
    keys:[process.env.SESSION_SECRET]
  }
))

// Passport Setup
app.use(passport.initialize())

// Passport Session Setup
app.use(passport.session())

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}))
      

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// default value for title local
app.locals.title = 'Blog Corner'

// Routes Setup
const index = require('./routes/index')// General Routes
app.use('/', index)

const authRoutes = require('./routes/authRoutes')// Authentication Routes
app.use('/auth', authRoutes)

const signUpRoutes = require('./routes/signUpRoutes')// Sign up Routes
app.use('/signup', signUpRoutes)

const profileRoutes = require('./routes/profileRoutes')// Profile Routes
app.use('/profile', profileRoutes)

module.exports = app