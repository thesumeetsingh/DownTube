import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useDownload = () => {
  const [loading, setLoading] = useState(false)
  const [videoInfo, setVideoInfo] = useState(null)
  const [progress, setProgress] = useState(0)
  const [downloadHistory, setDownloadHistory] = useState([])

  const validateYouTubeURL = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    return youtubeRegex.test(url)
  }

  const getVideoInfo = useCallback(async (url) => {
    if (!validateYouTubeURL(url)) {
      throw new Error('Please enter a valid YouTube URL')
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/download/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch video information')
      }

      const info = await response.json()
      setVideoInfo(info)
      return info
    } catch (error) {
      console.error('Error fetching video info:', error)
      const message = error.message || 'Failed to fetch video information'
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const downloadVideo = useCallback(async (url, formatId, quality) => {
    setLoading(true)
    setProgress(0)

    try {
      const token = localStorage.getItem('downtube-token')
      const response = await fetch(`${API_BASE_URL}/download/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ url, formatId, quality }),
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      // Create blob and download
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
      const extension = getFileExtension(formatId, quality)
      const filename = `${videoInfo?.title || 'video'}_${quality}_${timestamp}.${extension}`
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      // Add to download history
      const downloadRecord = {
        id: Date.now(),
        title: videoInfo?.title || 'Unknown Video',
        quality,
        url,
        downloadDate: new Date().toISOString(),
        filename,
      }
      
      setDownloadHistory(prev => [downloadRecord, ...prev])
      
      toast.success('Download completed successfully!')
      return { success: true, filename }
    } catch (error) {
      console.error('Download error:', error)
      const message = error.message || 'Download failed'
      toast.error(message)
      throw new Error(message)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [videoInfo])

  const getFileExtension = (formatId, quality) => {
    if (quality.includes('audio') || quality.includes('kbps')) {
      return 'mp3'
    }
    return 'mp4'
  }

  const clearVideoInfo = useCallback(() => {
    setVideoInfo(null)
    setProgress(0)
  }, [])

  return {
    loading,
    videoInfo,
    progress,
    downloadHistory,
    getVideoInfo,
    downloadVideo,
    clearVideoInfo,
    validateYouTubeURL,
  }
}
