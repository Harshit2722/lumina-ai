const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const authMiddleware = asyncHandler(async (req, res, next) => {


  const token = req.cookies.token;

  if(!token){
    throw new ApiError(401,"You are not logged in");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      throw new ApiError(401, 'Invalid Token');
    }

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid Token');
  }
});

module.exports = { authMiddleware };
