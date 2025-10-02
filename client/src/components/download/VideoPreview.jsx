import React from 'react'

const VideoPreview = ({ videoInfo }) => {
  console.log('VideoPreview received:', videoInfo) // Debug log
  
  if (!videoInfo) {
    console.log('VideoPreview: No video info provided')
    return null
  }

  const { title, thumbnail, duration, description } = videoInfo

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full sm:w-48 h-auto rounded-lg object-cover"
            loading="lazy"
            onError={(e) => {
              console.error('Thumbnail failed to load:', e.target.src)
              e.target.style.display = 'none'
            }}
          />
        </div>
        
        {/* Video Info */}
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {title || 'Video Title'}
          </h2>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>Duration: {formatDuration(duration)}</span>
          </div>
          
          {description && (
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
              {description.substring(0, 200)}
              {description.length > 200 ? '...' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPreview
