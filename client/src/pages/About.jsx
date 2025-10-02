import React from 'react'

const About = () => {
  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">About DownTube</h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        DownTube is a modern YouTube video downloader designed to offer users the ability to download videos in multiple formats and qualities. 
        Our mission is to provide a reliable tool for educational and personal use while respecting copyright and legal restrictions.
      </p>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
        Built with the MERN stack and powered by yt-dlp, DownTube delivers a fast and user-friendly experience with themes, authentication, and download history.
      </p>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
        Please use this application responsibly.
      </p>
    </div>
  )
}

export default About
