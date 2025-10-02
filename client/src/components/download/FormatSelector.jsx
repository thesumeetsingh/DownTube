import React, { useState } from 'react'

const groupAndSortFormats = (formatsArr, typeKey = 'video') => {
  // Group: { ext: [{...}], ... }
  const groups = {}
  formatsArr.forEach(fmt => {
    if (!groups[fmt.ext]) groups[fmt.ext] = []
    groups[fmt.ext].push(fmt)
  })

  Object.keys(groups).forEach(ext => {
    groups[ext].sort((a, b) => {
      // For video, sort by height descending; for audio by abr descending
      if (typeKey === 'video') return (b.height || 0) - (a.height || 0)
      return (b.abr || 0) - (a.abr || 0)
    })
  })

  return groups
}

const FormatSelector = ({ formats, selected, onSelect }) => {
  const [selectedType, setSelectedType] = useState('video')

  if (!formats) return null

  const { video = [], audio = [] } = formats
  const currentArr = selectedType === 'video' ? video : audio
  const grouped = groupAndSortFormats(currentArr, selectedType)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedType === 'video'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          onClick={() => setSelectedType('video')}
        >
          Video
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            selectedType === 'audio'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
          onClick={() => setSelectedType('audio')}
        >
          Audio Only
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No formats available</div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([ext, group]) => (
            <div key={ext}>
              <h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-400">{ext.toUpperCase()}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {group.map(fmt => {
                  const isSelected = selected && selected.format_id === fmt.format_id
                  return (
                    <div
                      key={fmt.format_id}
                      className={`cursor-pointer rounded-lg p-3 border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-100 dark:bg-blue-900'
                          : 'border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => onSelect(fmt)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">{fmt.quality}</span>
                        {selectedType === 'video' && fmt.height ? (
                          <span className="text-sm text-gray-600 dark:text-gray-400">{fmt.height}p</span>
                        ) : null}
                        {selectedType === 'audio' && fmt.abr ? (
                          <span className="text-sm text-gray-600 dark:text-gray-400">{fmt.abr}kbps</span>
                        ) : null}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {fmt.filesize ? `${(fmt.filesize / 1024 / 1024).toFixed(1)}MB` : ''}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Selected: <strong>{selected.quality}</strong> ({selected.ext?.toUpperCase()})
          </p>
        </div>
      )}
    </div>
  )
}

export default FormatSelector
