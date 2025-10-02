const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs').promises

class YTDLPDownloader {
  constructor() {
    this.tempDir = path.join(__dirname, '../temp')
  }

  async getVideoInfo(url) {
    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', ['--dump-json', url])
      let output = ''
      let error = ''

      ytdlp.stdout.on('data', (data) => {
        output += data.toString()
      })

      ytdlp.stderr.on('data', (data) => {
        error += data.toString()
      })

      ytdlp.on('close', (code) => {
        if (code === 0) {
          try {
            const info = JSON.parse(output)
            const videoFormats = info.formats.filter(f => f.vcodec !== 'none' && f.height).map(f => ({
              format_id: f.format_id,
              ext: f.ext,
              height: f.height,
              filesize: f.filesize,
              quality: `${f.height}p`,
            }))
            const audioFormats = info.formats.filter(f => f.acodec !== 'none' && f.vcodec === 'none').map(f => ({
              format_id: f.format_id,
              ext: f.ext,
              abr: f.abr,
              quality: f.abr ? `${f.abr}kbps` : 'audio',
            }))

            resolve({
              title: info.title,
              duration: info.duration,
              thumbnail: info.thumbnail,
              formats: {
                video: videoFormats,
                audio: audioFormats,
              },
              description: info.description ? info.description.substring(0, 500) : '',
            })
          } catch (err) {
            reject(new Error('Failed to parse video info'))
          }
        } else {
          reject(new Error(`yt-dlp exited with code ${code}: ${error}`))
        }
      })
    })
  }

  async downloadVideo(url, formatId, outputPath) {
    return new Promise((resolve, reject) => {
      const args = [
        '-f', formatId,
        '-o', outputPath,
        '--no-playlist',
        url,
      ]

      const ytdlp = spawn('yt-dlp', args)
      let stdErrOutput = ''

      ytdlp.stderr.on('data', (chunk) => {
        const text = chunk.toString()
        stdErrOutput += text
        // Optionally parse progress from stderr here if needed
      })

      ytdlp.on('close', (code) => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error(`Download failed with code ${code}. ${stdErrOutput}`))
        }
      })
    })
  }
}

module.exports = YTDLPDownloader
