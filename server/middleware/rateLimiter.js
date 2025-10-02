const rateLimit = require('express-rate-limit')

const downloadLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // default 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX) || 5, // max requests per window per IP
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = downloadLimiter
