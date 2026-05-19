const express = require('express');
const router = express.Router();
const { register, login, getUserProfile, logout, verifyEmail, resendOTP } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Helper to issue token on social login
const issueSocialToken = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000
  }).redirect(`${process.env.CLIENT_URL}/dashboard?login=success`);
};

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);
router.get("/profile", authMiddleware, getUserProfile);

// Social Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  issueSocialToken
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', 
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  issueSocialToken
);

router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', 
  passport.authenticate('discord', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  issueSocialToken
);

module.exports = router;
