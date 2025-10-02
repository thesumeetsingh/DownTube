import React, { useState } from 'react'
import URLInput from '../components/download/URLInput'
import VideoPreview from '../components/download/VideoPreview'
import FormatSelector from '../components/download/FormatSelector'
import DownloadButton from '../components/download/DownloadButton'
import { useDownload } from '../hooks/useDownload'

const Home = () => {
  const { loading, downloadVideo } = useDownload()
  const [videoInfo, setVideoInfo] = useState(null)
  const [selectedFormat, setSelectedFormat] = useState(null)
  const [inputUrl, setInputUrl] = useState('')

  const handleVideoInfo = (info, url) => {
    console.log('Home.jsx - handleVideoInfo called with:', info, url) // Debug log
    setInputUrl(url)
    setVideoInfo(info)
    setSelectedFormat(null)
    console.log('Home.jsx - State updated, videoInfo:', info) // Debug log
  }

  const handleSelectFormat = (format) => {
    console.log('Home.jsx - Format selected:', format) // Debug log
    setSelectedFormat(format)
  }

  const handleDownload = async () => {
    if (!selectedFormat || !inputUrl) {
      console.error('Missing selectedFormat or inputUrl:', { selectedFormat, inputUrl })
      return
    }

    console.log('Home.jsx - Starting download:', { inputUrl, selectedFormat }) // Debug log
    try {
      await downloadVideo(inputUrl, selectedFormat.format_id, selectedFormat.quality)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  console.log('Home.jsx - Current state:', { videoInfo: !!videoInfo, selectedFormat: !!selectedFormat }) // Debug log

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="py-16 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto flex flex-col space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            DownTube
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Paste any YouTube video URL below and select your preferred format to download videos and audio effortlessly.
          </p>
        </div>

        <URLInput onVideoInfo={handleVideoInfo} />

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && videoInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Debug:</strong> Video info received - {videoInfo.title}
            </p>
          </div>
        )}

        {videoInfo && (
          <>
            <VideoPreview videoInfo={videoInfo} />
            <FormatSelector
              formats={videoInfo.formats}
              selected={selectedFormat}
              onSelect={handleSelectFormat}
            />
            {selectedFormat && (
              <DownloadButton
                onClick={handleDownload}
                disabled={!selectedFormat}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
