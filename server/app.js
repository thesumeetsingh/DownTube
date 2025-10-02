const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const dotenv = require('dotenv')
const connectDB = require('./config/database')
const authRoutes = require('./routes/auth')
const downloadRoutes = require('./routes/download')
const userRoutes = require('./routes/user')
const errorHandler = require('./middleware/errorHandler')
const rateLimiter = require('./middleware/rateLimiter')
const cron = require('node-cron')
const { cleanupTempFiles } = require('./utils/fileCleanup')

dotenv.config()

// Connect to MongoDB before anything else
connectDB()

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:3000',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Apply rate limiter globally or per route
app.use(rateLimiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/download', downloadRoutes)
app.use('/api/user', userRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Cleanup temp files every hour
cron.schedule('0 * * * *', cleanupTempFiles)

// Error handler (must be last)
app.use(errorHandler)

module.exports = app
