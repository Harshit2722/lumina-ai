const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
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
