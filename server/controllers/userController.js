const User = require('../models/User')

// @desc    Get logged-in user profile
// @route   GET /api/user/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authorized' })
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isPremium: req.user.isPremium,
  })
}

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.name = req.body.name ?? user.name
    user.email = req.body.email ?? user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    await user.save()

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
