import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useDownload } from '../../hooks/useDownload'
import { toast } from 'react-toastify'
import { FiSearch, FiAlertCircle } from 'react-icons/fi'

const URLInput = ({ onVideoInfo }) => {
  const [url, setUrl] = useState('')
  const { getVideoInfo, validateYouTubeURL, loading } = useDownload()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL')
      return
    }

    if (!validateYouTubeURL(url)) {
      toast.error('Please enter a valid YouTube URL')
      return
    }

    try {
      console.log('Fetching video info for:', url) // Debug log
      const videoInfo = await getVideoInfo(url.trim())
      console.log('Received video info:', videoInfo) // Debug log
      onVideoInfo(videoInfo, url.trim())
      toast.success('Video info loaded successfully!')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast.error(error.message || 'Failed to fetch video information')
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUrl(value)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Legal Warning */}
      <motion.div 
        className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Legal Notice
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Only download content you own, have permission for, or that is in the public domain.
            </p>
          </div>
        </div>
      </motion.div>

      {/* URL Input Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="relative">
          <div className="flex rounded-xl shadow-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={handleInputChange}
                placeholder="Paste YouTube URL here... (e.g., https://www.youtube.com/watch?v=...)"
                className="w-full px-6 py-4 text-lg border-none focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={loading}
              />
              
              {/* Loading Indicator */}
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            
            <motion.button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-2">
                <FiSearch className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {loading ? 'Getting Info...' : 'Get Video'}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  )
}

export default URLInput
