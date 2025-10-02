const fs = require('fs').promises
const path = require('path')

const TEMP_DIR = path.join(__dirname, '../temp')
const MAX_FILE_AGE_HOURS = parseInt(process.env.CLEANUP_INTERVAL_HOURS) || 1

const cleanupTempFiles = async () => {
  try {
    const files = await fs.readdir(TEMP_DIR)
    const now = Date.now()
    const maxAgeMs = MAX_FILE_AGE_HOURS * 60 * 60 * 1000

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file)
      const stat = await fs.stat(filePath)
      const age = now - stat.mtime.getTime()

      if (age > maxAgeMs) {
        await fs.unlink(filePath)
        console.log(`[Cleanup] Deleted old temp file: ${file}`)
      }
    }
  } catch (error) {
    console.error(`[Cleanup] Error cleaning up temp files: ${error.message}`)
  }
}

module.exports = { cleanupTempFiles }
