const jwt = require('jsonwebtoken')
const User = require('../models/User')

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Please provide all required fields')
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists with this email')
    }

    const user = await User.create({
      name,
      email,
      password,
    })

    if (user) {
      const token = generateToken(user._id)
      res.status(201).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.authUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id)
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message })
  }
}

// @desc    Verify token and fetch user data
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' })
  }
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  })
}

// @desc    Logout user (optional, client can just delete token)
// @route   POST /api/auth/logout
// @access  Private
exports.logoutUser = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' })
}
