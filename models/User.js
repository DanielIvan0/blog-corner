const {Schema, model} = require('mongoose')
const userSchema = new Schema(
  {
    email:{
      type:String,
      unique:true,
      required:true
    },
    password:{
      type:String
    },
    googleId:{
      type:String,
      unique:true,
      sparse:true
    },
    facebookId:{
      type:String,
      unique:true,
      sparse:true
    },
    displayName:String,
    thumbnail:{
      type:String,
      default:'images/profile-picture.jpg'
    },
    articles:{
      type:[Number],
      default:[]
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model('User', userSchema)