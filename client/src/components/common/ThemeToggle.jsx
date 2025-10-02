import React from 'react'
import { useTheme } from '@/context/ThemeContext'

import { motion } from 'framer-motion'

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun Icon */}
        <motion.svg
          className="absolute inset-0 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          initial={false}
          animate={{
            rotate: isDark ? 180 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </motion.svg>

        {/* Moon Icon */}
        <motion.svg
          className="absolute inset-0 w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          initial={false}
          animate={{
            rotate: isDark ? 0 : -180,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </motion.svg>
      </div>
    </motion.button>
  )
}

export default ThemeToggle
