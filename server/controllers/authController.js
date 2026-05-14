const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide all fields");
  }

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "Email already exists");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Generate token
  const token = generateToken(user._id);

  res.cookie("token", token, {
  httpOnly: true,  // Javascript cannot access this!
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
}).json(new ApiResponse(200,
  { user: {
    id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    credits: createdUser.credits,
    plan: createdUser.plan
  }}, 
  "Login successful"));

});

// @desc    Login a user
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate token
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000
  }).json(
    new ApiResponse(200, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        plan: user.plan
      }
    }, "User logged in successfully")
  );
});


const getUserProfile = asyncHandler(async (req,res)=>{
  const user = await User.findById(req.user._id);

  res.status(200).json(
    new ApiResponse(200,user,"User fetched successfully")
  )
})

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  }).json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = {getUserProfile,register,login,logout}
