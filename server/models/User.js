const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    minlength: 6,
    select: false // Do not return password by default
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyOTP: {
    type: String
  },
  verifyOTPExpire: {
    type: Date
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true
  },
  discordId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  credits: {
    type: Number,
    default: 10
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  stripeCustomerId: {
    type: String
  }
}, {
  timestamps: true 
});


userSchema.pre("save",async function(){
    const user = this;

    if (!user.isModified("password")) return;
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

});


userSchema.methods.matchPassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);
}


module.exports = mongoose.model('User', userSchema);
