import React from 'react'

const DownloadButton = ({ onClick, disabled, loading }) => {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled || loading}
        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
          disabled || loading
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        {loading ? (
          <div className="flex items-center space-x-3">
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Downloading...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download</span>
          </div>
        )}
      </button>
    </div>
  )
}

export default DownloadButton
