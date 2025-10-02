const express = require('express')
const {
  registerUser,
  authUser,
  verifyToken,
  logoutUser,
} = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', authUser)
router.get('/verify', protect, verifyToken)
router.post('/logout', protect, logoutUser)

module.exports = router
