const express = require('express')
const {
  getVideoInfo,
  downloadVideo,
} = require('../controllers/downloadController')

const router = express.Router()

router.post('/info', getVideoInfo)
router.post('/start', downloadVideo)

module.exports = router
