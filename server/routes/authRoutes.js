const express = require('express');
const router = express.Router();
const { register, login,getUserProfile, logout } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get("/profile",authMiddleware,getUserProfile)

module.exports = router;
