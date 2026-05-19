const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const { ApiResponse } = require('../utils/ApiResponse');
const sendEmail = require('../utils/sendEmail');

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

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpire = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    name,
    email,
    password,
    verifyOTP: otp,
    verifyOTPExpire: otpExpire
  });

  // Send Email
  try {
    await sendEmail({
      email: user.email,
      type: 'VERIFY_EMAIL',
      otp: otp
    });

    res.status(201).json(new ApiResponse(201, { email: user.email }, "Verification OTP sent to your email"));
  } catch (error) {
    user.verifyOTP = undefined;
    user.verifyOTPExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, "Email could not be sent. Please try again later.");
  }
});

// @desc    Verify Email
// @route   POST /api/v1/auth/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Please provide email and OTP");
  }

  const user = await User.findOne({ 
    email, 
    verifyOTP: otp,
    verifyOTPExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  // Update user status
  user.isVerified = true;
  user.verifyOTP = undefined;
  user.verifyOTPExpire = undefined;
  await user.save();

  // Generate token and login after verification
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000
  }).json(new ApiResponse(200, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      credits: user.credits,
      plan: user.plan
    }
  }, "Email verified and logged in successfully"));
});

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.verifyOTP = otp;
  user.verifyOTPExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  await sendEmail({
    email: user.email,
    type: 'RESEND_OTP',
    otp: otp
  });

  res.status(200).json(new ApiResponse(200, {}, "New OTP sent successfully"));
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

  if (!user.isVerified) {
    throw new ApiError(403, "Account not verified. Please verify your email.");
  }

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
  res.status(200).json(new ApiResponse(200,user,"User fetched successfully"))
})

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  }).json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = {getUserProfile,register,login,logout,verifyEmail,resendOTP}
