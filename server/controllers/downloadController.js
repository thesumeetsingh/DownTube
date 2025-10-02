const path = require('path')
const fs = require('fs').promises
const Download = require('../models/Download')
const YTDLPDownloader = require('../utils/ytdlp')

const downloader = new YTDLPDownloader()

// @desc    Get video info for URL
// @route   POST /api/download/info
// @access  Public
exports.getVideoInfo = async (req, res) => {
  try {
    const { url } = req.body
    if (!url) {
      return res.status(400).json({ message: 'URL is required' })
    }

    const info = await downloader.getVideoInfo(url)
    res.json(info)
  } catch (error) {
    console.error('getVideoInfo error:', error)
    res.status(500).json({ message: error.message })
  }
}

// @desc    Download video with specified format
// @route   POST /api/download/start
// @access  Public (no login required)
exports.downloadVideo = async (req, res) => {
  try {
    const { url, formatId, quality } = req.body
    
    // User is optional - can be logged in or guest
    const userId = req.user ? req.user._id : null

    if (!url || !formatId) {
      return res.status(400).json({ message: 'URL and formatId are required' })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `video_${timestamp}`
    const outputDir = path.join(__dirname, '../temp')
    
    // Ensure temp folder exists
    await fs.mkdir(outputDir, { recursive: true })

    const outputPath = path.join(outputDir, filename)

    console.log('Starting download:', { url, formatId, outputPath })

    // Download video to temp directory
    await downloader.downloadVideo(url, formatId, outputPath)

    // Find actual file downloaded since yt-dlp appends extension
    const files = await fs.readdir(outputDir)
    const downloadedFile = files.find(f => f.startsWith(`video_${timestamp}`))

    if (!downloadedFile) {
      console.error('Downloaded file not found in:', outputDir)
      return res.status(500).json({ message: 'Failed to locate downloaded file' })
    }

    const filePath = path.join(outputDir, downloadedFile)
    console.log('Download successful, file located at:', filePath)

    // Save download record if user is logged in
    if (userId) {
      try {
        await Download.create({
          userId,
          url,
          quality,
          formatId,
          filename: downloadedFile,
          downloadDate: new Date(),
        })
      } catch (dbError) {
        console.error('Database save error (non-critical):', dbError)
      }
    }

    // Stream file to client
    res.download(filePath, downloadedFile, (err) => {
      if (err) {
        console.error('Download stream error:', err)
      }
      // Cleanup after download completes
      fs.unlink(filePath).catch(console.error)
    })
  } catch (error) {
    console.error('downloadVideo error:', error)
    res.status(500).json({ message: error.message || 'Download failed' })
  }
}
